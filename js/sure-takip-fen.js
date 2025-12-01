// ====================================================================
// js/sure-takip-fen.js
// Merkezi Koleksiyon: "lgs_ders_takip" hedeflenmiştir.
// ====================================================================

const DERS_ADI = "fen";
// KRİTİK EŞİK: Günlük 15 dakika = 900 saniye
const MIN_SURE_SERI_SAYACI = 15 * 60; 
// 🔥 UYARLAMA: Merkezi koleksiyon adı
const ANA_TAKIP_COLLECTION = 'lgs_ders_takip'; 

// DOM Elementleri
const sureSayacElementi = document.getElementById('sure-sayac');
const userEmailDisplay = document.getElementById('user-email-display');
const streakContainer = document.getElementById('streak-container'); 
const dailyProgressContainer = document.getElementById('daily-progress'); 

// Genel durum değişkenleri
let toplamSureSaniye = 0;
let bugunCalisilanSure = 0; 
let timerInterval = null;
let mevcutSeri = 0; 
let lastStudyDate = '';
let isStreakCompletedToday = false; 


// 1. Tarih ve Zaman İşlevleri
function getTodayDateString() {
    // YYYY-MM-DD formatında tarih döner.
    return new Date().toISOString().slice(0, 10); 
}

function formatTime(saniye) {
    const saat = Math.floor(saniye / 3600);
    const dakika = Math.floor((saniye % 3600) / 60);
    const saniyeKalan = saniye % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(saat)}:${pad(dakika)}:${pad(saniyeKalan)}`;
}

function updateDailyProgressUI() {
    if (!dailyProgressContainer) return;
    
    let progressPercent = Math.min(100, (bugunCalisilanSure / MIN_SURE_SERI_SAYACI) * 100);
    
    let timeDisplayColor = 'text-red-600';
    if (bugunCalisilanSure >= MIN_SURE_SERI_SAYACI) {
        timeDisplayColor = 'text-green-600';
    } else if (bugunCalisilanSure > 0) {
        timeDisplayColor = 'text-yellow-600';
    }

    // Yalnızca Dakika:Saniye gösterimi
    dailyProgressContainer.innerHTML = `
        <span class="text-xs font-medium text-gray-600">Bugünkü Hedef:</span>
        <div class="text-lg font-semibold ${timeDisplayColor}">
            ${formatTime(bugunCalisilanSure).substring(3)} / ${formatTime(MIN_SURE_SERI_SAYACI).substring(3)}
        </div>
        <div class="h-1.5 bg-gray-200 rounded-full w-24 overflow-hidden ml-4" title="Hedefe Kalan: ${100 - progressPercent}%">
            <div class="h-full bg-green-500 transition-all duration-500" style="width: ${progressPercent}%;"></div>
        </div>
    `;
    
    if (isStreakCompletedToday && bugunCalisilanSure >= MIN_SURE_SERI_SAYACI) {
         const div = dailyProgressContainer.querySelector(`.${timeDisplayColor}`);
         if (div && !div.textContent.includes('✅')) {
             div.textContent += ' ✅';
         }
    }
}

// 2. Seri (Streak) Kontrolü
function checkStreak(data) {
    const today = getTodayDateString();
    const YESTERDAY_MS = 24 * 60 * 60 * 1000;

    // Firebase'den verileri çek
    mevcutSeri = data[`${DERS_ADI}_streak`] || 0;
    lastStudyDate = data[`${DERS_ADI}_last_study_date`] || '';
    bugunCalisilanSure = data[`${DERS_ADI}_daily_time`] || 0;
    
    // Bugünkü tarih, son çalışma tarihinden farklıysa
    if (lastStudyDate !== today) {
        
        const yesterday = new Date(Date.now() - YESTERDAY_MS).toISOString().slice(0, 10);
        
        // Eğer son çalışma tarihi dün değilse, seriyi sıfırla.
        if (lastStudyDate !== yesterday) {
             mevcutSeri = 0; // Seri kırıldı
        }
        
        isStreakCompletedToday = false; 
        bugunCalisilanSure = 0; // Yeni gün için sıfırdan başla
    } else {
         // Son çalışma günü bugün ise
        isStreakCompletedToday = true;
    }
    
    if (streakContainer) streakContainer.textContent = `${mevcutSeri} Gün`;
    updateDailyProgressUI();
}


// 3. Firebase'e Kayıt Fonksiyonu
function sureyiFirebaseKaydet() {
    // auth nesnesinin firebase-init.js'de global tanımlandığını varsayıyoruz
    if (!firebase.auth().currentUser || typeof db === 'undefined') return; 

    const userID = firebase.auth().currentUser.uid;
    // 🔥 KRİTİK DÜZELTME: Merkezi koleksiyona kaydediyoruz.
    const dersRef = db.collection(ANA_TAKIP_COLLECTION).doc(userID);
    const today = getTodayDateString();
    
    let updateData = {
        [`${DERS_ADI}_sure`]: toplamSureSaniye, 
        [`${DERS_ADI}_daily_time`]: bugunCalisilanSure
    };
    
    // KRİTİK KONTROL: Eğer bugün 15 dakikalık eşik geçildiyse VE daha önce sayılmadıysa
    if (bugunCalisilanSure >= MIN_SURE_SERI_SAYACI && !isStreakCompletedToday) {
        
        const YESTERDAY_MS = 24 * 60 * 60 * 1000;
        const yesterday = new Date(Date.now() - YESTERDAY_MS).toISOString().slice(0, 10);

        // Seri artışı kontrolü:
        if (lastStudyDate === yesterday) {
             mevcutSeri += 1;
        } else if (mevcutSeri === 0 || lastStudyDate === '') {
             mevcutSeri = 1; // İlk defa seri tamamlanıyor
        } 
        
        updateData[`${DERS_ADI}_streak`] = mevcutSeri;
        updateData[`${DERS_ADI}_last_study_date`] = today;
        
        isStreakCompletedToday = true;
        
        if (streakContainer) streakContainer.textContent = `${mevcutSeri} Gün`;
    }
    
    dersRef.set(updateData, { merge: true }) 
    .then(() => {
        updateDailyProgressUI();
    })
    .catch((error) => {
        console.error("Süre/Seri kaydı hatası:", error);
    });
}


// 4. Sayaç Başlatma
function sayaciBaslat() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        toplamSureSaniye += 1;
        
        // Sadece günlük hedef tamamlanmadıysa bugunCalisilanSure'yi biriktir.
        if (!isStreakCompletedToday) {
            bugunCalisilanSure += 1;
        }
        
        if (sureSayacElementi) {
            sureSayacElementi.textContent = formatTime(toplamSureSaniye);
        }
        
        // Her 10 saniyede bir kaydet
        if (toplamSureSaniye % 10 === 0) {
            sureyiFirebaseKaydet();
        }
    }, 1000);
}


// 5. Ana Başlatma ve Veri Çekme İşlevi
firebase.auth().onAuthStateChanged(user => {
    // db nesnesinin firebase-init.js'de global tanımlandığını varsayıyoruz
    if (!user || typeof db === 'undefined') {
        return; 
    }
    
    const userID = user.uid;
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `${user.email}`; 
    }
    
    // 🔥 KRİTİK DÜZELTME: Merkezi koleksiyondan verileri çekiyoruz.
    db.collection(ANA_TAKIP_COLLECTION).doc(userID).get()
        .then(doc => {
            const data = doc.exists ? doc.data() : {};
            
            // Toplam Süreyi yükle
            toplamSureSaniye = data[`${DERS_ADI}_sure`] || 0;
            if (sureSayacElementi) {
                sureSayacElementi.textContent = formatTime(toplamSureSaniye);
            }
            
            // Seriyi ve bugünkü çalışma süresini kontrol et ve yükle
            checkStreak(data);
            
            // Süre yüklendikten sonra sayacı başlat
            sayaciBaslat();
        })
        .catch((error) => {
            console.error("Fen Bilimleri Veri yüklenirken kritik hata:", error);
            toplamSureSaniye = 0;
            bugunCalisilanSure = 0;
            checkStreak({});
            sayaciBaslat(); 
        });
});

// 6. Sayfadan Ayrılma Durumunda Son Kez Kaydetme
window.addEventListener('beforeunload', sureyiFirebaseKaydet);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Sekme gizlendiğinde durdur ve kaydet
        clearInterval(timerInterval);
        timerInterval = null;
        sureyiFirebaseKaydet();
    } else {
        // Sekme geri geldiğinde tekrar başlat
        sayaciBaslat();
    }
});
