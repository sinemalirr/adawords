// ====================================================================
// js/sure-takip-fen.js
// Matematik Script'inin Gelişmiş Mantığına Uyarlanmıştır.
// ====================================================================

const DERS_ADI = "fen";
// KRİTİK EŞİK: Günlük 15 dakika = 900 saniye
const MIN_SURE_SERI_SAYACI = 15 * 60; 
// 🔥 DÜZELTME: Tanımlama hatasını çözmek için benzersiz isim kullanıldı.
const FEN_SURE_COLLECTION = 'fenSureleri'; 

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
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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

    dailyProgressContainer.innerHTML = `
        <span class="text-xs font-medium text-gray-600">Bugünkü Hedef:</span>
        <div class="text-lg font-semibold ${timeDisplayColor}">
            ${formatTime(bugunCalisilanSure)} / ${formatTime(MIN_SURE_SERI_SAYACI).substring(3)}
        </div>
        <div class="h-1.5 bg-gray-200 rounded-full w-24 overflow-hidden ml-4" title="Hedefe Kalan: ${100 - progressPercent}%">
            <div class="h-full bg-green-500 transition-all duration-500" style="width: ${progressPercent}%;"></div>
        </div>
    `;
    
    if (isStreakCompletedToday && bugunCalisilanSure >= MIN_SURE_SERI_SAYACI) {
         const div = dailyProgressContainer.querySelector(`.${timeDisplayColor}`);
         if (div) div.textContent += ' ✅';
    }
}

// 2. Seri (Streak) Kontrolü
function checkStreak(data) {
    const today = getTodayDateString();
    const YESTERDAY_MS = 24 * 60 * 60 * 1000;

    // Firebase'den verileri çek
    mevcutSeri = data[`${DERS_ADI}_streak`] || 0;
    lastStudyDate = data[`${DERS_ADI}_last_study_date`] || '';
    
    // Bugüne ait süreyi Firebase'den çek, eğer bugün çalışılmadıysa 0'dan başlar
    bugunCalisilanSure = data[`${DERS_ADI}_daily_time`] || 0;
    
    // Bugünkü tarih dünden farklıysa (seri kırılmış/devam ediyor olabilir)
    if (lastStudyDate !== today) {
        
        const yesterday = new Date(Date.now() - YESTERDAY_MS).toISOString().slice(0, 10);
        
        // Dün çalışılmış ve bugün hiç çalışılmamışsa, dünün tarihi dünün tarihine eşit değilse seri kırılır.
        // KRİTİK KONTROL: Eğer dün çalışıldıysa (lastStudyDate'in dün olup olmadığı)
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
    if (!firebase.auth().currentUser) return; 

    const auth = firebase.auth();
    const db = firebase.firestore();

    const userID = auth.currentUser.uid;
    // 🔥 UYARLAMA: Fen Bilimleri koleksiyon adı kullanıldı.
    const dersRef = db.collection(FEN_SURE_COLLECTION).doc(userID);
    const today = getTodayDateString();
    
    let updateData = {
        [`${DERS_ADI}_sure`]: toplamSureSaniye, 
        [`${DERS_ADI}_daily_time`]: bugunCalisilanSure 
    };
    
    // KRİTİK KONTROL: Eğer bugün 15 dakikalık eşik geçildiyse VE daha önce sayılmadıysa
    if (bugunCalisilanSure >= MIN_SURE_SERI_SAYACI && !isStreakCompletedToday) {
        
        // Seriyi artırmadan önce dünün tarihi olup olmadığını tekrar kontrol et
        const YESTERDAY_MS = 24 * 60 * 60 * 1000;
        const yesterday = new Date(Date.now() - YESTERDAY_MS).toISOString().slice(0, 10);

        // Seri kırılmamışsa (dün çalışılmış VEYA mevcut seri 0 ise)
        if (mevcutSeri > 0 && lastStudyDate === yesterday || mevcutSeri === 0) {
             mevcutSeri += 1;
        } else if (lastStudyDate !== today) {
             // Dün çalışılmadıysa ve bugünden önce tamamlandıysa seri kırılmıştır, 1'den başlar.
             mevcutSeri = 1;
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
    if (!user) {
        // Oturum açma sayfasına yönlendirme (isteğe bağlı)
        return; 
    }
    
    const userID = user.uid;
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `${user.email}`; 
    }
    
    const db = firebase.firestore();

    // 🔥 UYARLAMA: Fen Bilimleri koleksiyon adı kullanıldı.
    db.collection(FEN_SURE_COLLECTION).doc(userID).get()
        .then(doc => {
            const data = doc.exists ? doc.data() : {};
            
            // Toplam Süreyi yükle
            toplamSureSaniye = data[`${DERS_ADI}_sure`] || 0;
            if (sureSayacElementi) {
                sureSayacElementi.textContent = formatTime(toplamSureSaniye);
            }
            
            // Seriyi ve bugünkü çalışma süresini kontrol et
            checkStreak(data);
            
            // Süre yüklendikten sonra sayacı başlat
            sayaciBaslat();
        })
        .catch((error) => {
            console.error("Veri yüklenirken kritik hata:", error);
            // Hata durumunda da sayacı sıfırdan başlatmayı dene (en azından sayar)
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
        clearInterval(timerInterval);
        timerInterval = null;
        sureyiFirebaseKaydet();
    } else {
        sayaciBaslat();
    }
});
