// js/sure-takip-turkce.js - KESİN ÇÖZÜM VERİSİ (Seri Takibi ve Kalıcılık)

const DERS_ADI = "turkce";
// Günlük serinin sayılması için sayfada kalınması gereken minimum süre (saniye)
const MIN_SURE_SERI_SAYACI = 60; // 60 saniye = 1 dakika

const sureSayacElementi = document.getElementById('sure-sayac');
const userEmailDisplay = document.getElementById('user-email-display');
const streakContainer = document.getElementById('streak-container'); 
const rewardSection = document.getElementById('reward-section'); // turkce.html'den

let toplamSureSaniye = 0;
let bugunCalisilanSure = 0; // Seriyi takip etmek için bugün kaç saniye çalışıldı
let timerInterval = null;
let sureKaydiGerekli = false;
let mevcutSeri = 0; 
let lastStudyDate = '';


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

// 2. Seri (Streak) Güncelleme Mantığı
function checkAndUpdateStreak(data) {
    const today = getTodayDateString();
    
    // Veriden gelen son çalışma tarihi ve seri
    mevcutSeri = data[DERS_ADI + '_streak'] || 0;
    lastStudyDate = data[DERS_ADI + '_last_study_date'] || '';
    
    // 1. Durum: Bugün zaten çalışıldıysa (sayaç 1 dakikayı geçtiyse) seriyi ellemiyoruz.
    if (lastStudyDate === today) {
        // Seriyi zaten artırmışız, sadece güncel seriyi görüntülüyoruz
        return; 
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().slice(0, 10);

    let newStreak = mevcutSeri;

    if (lastStudyDate === yesterdayString) {
        // 2. Durum: Dün çalışılmışsa, seriyi 1 artırırız
        newStreak += 1;
    } else if (lastStudyDate !== today) {
        // 3. Durum: Dün çalışılmamışsa, seriyi 1'e sıfırlarız (eğer hiç çalışılmadıysa da 1 olur)
        newStreak = 1;
    }
    
    mevcutSeri = newStreak;
    // UI'da seriyi göster
    if (streakContainer) {
        streakContainer.textContent = `${mevcutSeri} Gün`;
    }
    
    // Ödül kontrolü (turkce.html'de görünür)
    if (rewardSection) {
        if (mevcutSeri >= 15) {
             rewardSection.classList.remove('hidden');
        } else {
             rewardSection.classList.add('hidden');
        }
    }
}


// 3. Firebase'e Kayıt Fonksiyonu
function sureyiFirebaseKaydet() {
    if (!auth.currentUser || !sureKaydiGerekli) return; 

    const userID = auth.currentUser.uid;
    const dersRef = db.collection(DERS_TAKIP_COLLECTION).doc(userID);
    
    let updateData = {
        [DERS_ADI + '_sure']: toplamSureSaniye, // Toplam süreyi kaydet (kalıcı)
    };
    
    // Eğer bugün 1 dakikadan fazla çalışılmışsa, seriyi kaydetme zamanı gelmiştir.
    if (bugunCalisilanSure >= MIN_SURE_SERI_SAYACI && lastStudyDate !== getTodayDateString()) {
        
        // Seriyi sadece süre kaydında değil, veri çekilirken kontrol ettik. 
        // Burada sadece kaydı basıyoruz.
        updateData[DERS_ADI + '_streak'] = mevcutSeri;
        updateData[DERS_ADI + '_last_study_date'] = getTodayDateString();
        
        // UI'ı serinin arttığını yansıtacak şekilde güncelle
        if (streakContainer) {
             streakContainer.textContent = `${mevcutSeri} Gün`;
        }
    }
    
    dersRef.set(updateData, { merge: true }) 
    .then(() => {
        console.log(`${DERS_ADI} süre kaydedildi. Günlük süre: ${bugunCalisilanSure}s`);
        sureKaydiGerekli = false;
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
        bugunCalisilanSure += 1; // Bugün çalışılan süreyi de takip et
        
        if (sureSayacElementi) {
            sureSayacElementi.textContent = formatTime(toplamSureSaniye);
        }
        
        // Her 10 saniyede bir kaydet
        if (toplamSureSaniye % 10 === 0) {
            sureKaydiGerekli = true;
            sureyiFirebaseKaydet();
        }
    }, 1000);
}


// 5. Ana Başlatma ve Veri Çekme İşlevi
auth.onAuthStateChanged(user => {
    if (!user) {
        // Oturum kapalıysa dersler.html'e yönlendir
        window.location.href = '../dersler.html'; // turkce_ic/ alt sayfaları için '../' gerekli
        return; 
    }
    
    const userID = user.uid;
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `(${user.email})`;
    }
    
    db.collection(DERS_TAKIP_COLLECTION).doc(userID).get()
        .then(doc => {
            const data = doc.exists ? doc.data() : {};
            
            // Verileri yükle
            toplamSureSaniye = data[DERS_ADI + '_sure'] || 0;
            if (sureSayacElementi) {
                sureSayacElementi.textContent = formatTime(toplamSureSaniye);
            }
            
            // Seriyi kontrol et ve yükle
            checkAndUpdateStreak(data);
            
            // Süre yüklendikten sonra sayacı başlat
            sayaciBaslat();
        });
});

// 6. Sayfadan Ayrılma Durumunda Son Kez Kaydetme (Görünürlük veya Kapatma)
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
