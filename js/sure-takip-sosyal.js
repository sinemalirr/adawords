// js/sure-takip-sosyal.js - 15 DAKİKA KURALINA UYGUN KESİN ÇÖZÜM

const DERS_ADI = "sosyal";
// GÜNLÜK SERİNİN SAYILMASI İÇİN KRİTİK EŞİK: 15 dakika = 900 saniye
const MIN_SURE_SERI_SAYACI = 900; 

// DOM Elementleri
const sureSayacElementi = document.getElementById('sure-sayac');
const userEmailDisplay = document.getElementById('user-email-display');
const streakContainer = document.getElementById('streak-container'); 
const dailyProgressContainer = document.getElementById('daily-progress'); 

// Genel durum değişkenleri
let toplamSureSaniye = 0;
// Firebase'den çekilen veya kaydedilen değer
let bugunCalisilanSure = 0; 
let timerInterval = null;
let mevcutSeri = 0; 
let lastStudyDate = '';
let isStreakCompletedToday = false; // Bugün 15 dakikalık koşul tamamlandı mı?


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
    
    // Yüzde hesaplama
    let progressPercent = Math.min(100, (bugunCalisilanSure / MIN_SURE_SERI_SAYACI) * 100);
    
    // Rengi Sosyal Bilgiler'e göre ayarla (Örneğin: Indigo/Blue)
    let timeDisplayColor = 'text-red-600';
    let progressBarColor = 'bg-red-500';

    if (bugunCalisilanSure >= MIN_SURE_SERI_SAYACI) {
        timeDisplayColor = 'text-green-600';
        progressBarColor = 'bg-indigo-500';
    } else if (bugunCalisilanSure > 0) {
        timeDisplayColor = 'text-yellow-600';
        progressBarColor = 'bg-yellow-500';
    }


    // UI Güncelleme: Hedef süresini ve ilerleme çubuğunu gösterir
    dailyProgressContainer.innerHTML = `
        <span class="text-xs font-medium text-gray-600">Bugünkü Hedef:</span>
        <div class="text-lg font-semibold ${timeDisplayColor}">
            ${formatTime(bugunCalisilanSure).substring(3)} / ${formatTime(MIN_SURE_SERI_SAYACI).substring(3)}
        </div>
        <div class="h-1.5 bg-gray-200 rounded-full w-24 overflow-hidden ml-4" title="Hedefe Kalan: ${100 - progressPercent}%">
            <div class="h-full ${progressBarColor} transition-all duration-500" style="width: ${progressPercent}%;"></div>
        </div>
    `;
    
    // Not: Hedef tamamlandıysa uyarı vermek için küçük bir emoji eklenebilir.
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
    
    mevcutSeri = data[DERS_ADI + '_streak'] || 0;
    lastStudyDate = data[DERS_ADI + '_last_study_date'] || '';
    
    // 🔥 KRİTİK DÜZELTME: lastStudyDate === today kontrolü
    if (lastStudyDate === today) {
        // Bugün zaten seri tamamlanmış ve sayılmış (bu bayrakla kontrol edilir).
        isStreakCompletedToday = true;
        // Günlük süreyi kayıttan çek (sayacın doğru yerden devam etmesi için)
        bugunCalisilanSure = data[DERS_ADI + '_daily_time'] || 0; 
    } else {
        // Bugün daha önce çalışılmamış. bugunCalisilanSure'yi kayıttan çek (birikmiş süreyi korumak için)
        bugunCalisilanSure = data[DERS_ADI + '_daily_time'] || 0; 
        isStreakCompletedToday = false;
        
        // Dünden sonra bugün çalışılmadıysa seriyi sıfırla
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().slice(0, 10);

        if (lastStudyDate !== yesterdayString) {
             mevcutSeri = 0; // Seri kırıldı
        }
    }
    
    // UI'ı seriyi ve ödülü göstermek üzere güncelle
    if (streakContainer) streakContainer.textContent = `${mevcutSeri} Gün`;
    updateDailyProgressUI();
}


// 3. Firebase'e Kayıt Fonksiyonu
function sureyiFirebaseKaydet() {
    // auth ve db nesnelerinin firebase-init.js'de global tanımlandığını varsayıyoruz
    if (!auth.currentUser || typeof db === 'undefined' || typeof DERS_TAKIP_COLLECTION === 'undefined') return; 

    const userID = auth.currentUser.uid;
    // 🔥 KRİTİK: Merkezi koleksiyona kaydediyoruz.
    const dersRef = db.collection(DERS_TAKIP_COLLECTION).doc(userID);
    const today = getTodayDateString();
    
    let updateData = {
        [DERS_ADI + '_sure']: toplamSureSaniye, // Toplam süreyi kaydet (kalıcı)
        [DERS_ADI + '_daily_time']: bugunCalisilanSure // Bugün çalışılan toplam süreyi kaydet
    };
    
    // KRİTİK KONTROL: Eğer bugün 15 dakikalık (900 saniye) eşik geçildiyse VE daha önce sayılmadıysa
    if (bugunCalisilanSure >= MIN_SURE_SERI_SAYACI && !isStreakCompletedToday) {
        
        // Seriyi artır
        mevcutSeri += 1;
        
        // Kayıt verilerini güncelle
        updateData[DERS_ADI + '_streak'] = mevcutSeri;
        updateData[DERS_ADI + '_last_study_date'] = today;
        
        // Bayrağı güncelle (Bu sayım bir daha yapılmasın)
        isStreakCompletedToday = true;
        
        // Arayüzü güncelle
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
        
        // Sadece bugün seri tamamlanmadıysa, bugünkü süreyi artır.
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
// auth objesinin global tanımlandığını varsayıyoruz
auth.onAuthStateChanged(user => {
    // db ve DERS_TAKIP_COLLECTION nesnelerinin global tanımlandığını varsayıyoruz
    if (!user || typeof db === 'undefined' || typeof DERS_TAKIP_COLLECTION === 'undefined') {
        return; 
    }
    
    const userID = user.uid;
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `(${user.email})`; 
    }
    
    // 🔥 KRİTİK: Merkezi koleksiyondan verileri çekiyoruz.
    db.collection(DERS_TAKIP_COLLECTION).doc(userID).get()
        .then(doc => {
            const data = doc.exists ? doc.data() : {};
            
            // Toplam Süreyi yükle
            toplamSureSaniye = data[DERS_ADI + '_sure'] || 0;
            if (sureSayacElementi) {
                sureSayacElementi.textContent = formatTime(toplamSureSaniye);
            }
            
            // Seriyi kontrol et (bugünkü çalışma durumu ve kırılma kontrolü)
            checkStreak(data);
            
            // Süre yüklendikten sonra sayacı başlat
            sayaciBaslat();
        })
        .catch((error) => {
            console.error("Sosyal Bilgiler Veri yüklenirken kritik hata:", error);
            // Hata durumunda da sayacı sıfırdan başlatmayı dene
            toplamSureSaniye = 0;
            bugunCalisilanSure = 0;
            checkStreak({});
            sayaciBaslat(); 
        });
});

// 6. Sayfadan Ayrılma Durumunda Son Kez Kaydetme (Görünürlük veya Kapatma)
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
