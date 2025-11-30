// js/sure-takip-turkce.js - GÜNCELLENMİŞ VERSİYON (Streak Takibi Eklendi)

// 1. Sabitler
const DERS_ADI = "turkce";
const MIN_KAYIT_SURESI_SANIYE = 10; // 10 saniyeden fazla süre kayıt edilecek.
const sureSayacElementi = document.getElementById('sure-sayac');
const userEmailDisplay = document.getElementById('user-email-display');
const streakContainer = document.getElementById('streak-container'); // turkce.html'den

let toplamSureSaniye = 0;
let timerInterval = null;
let sureKaydiGerekli = false;
let mevcutSeri = 0; // Güncel seri (streak) değeri

// Tarih işlemlerini kolaylaştıran yardımcı fonksiyon
function getTodayDateString() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD formatı
}

// 2. Süre Formatlama Fonksiyonu
function formatTime(saniye) {
    const saat = Math.floor(saniye / 3600);
    const dakika = Math.floor((saniye % 3600) / 60);
    const saniyeKalan = saniye % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(saat)}:${pad(dakika)}:${pad(saniyeKalan)}`;
}

// 3. Seri (Streak) Güncelleme ve Kaydetme Fonksiyonu
function updateStreak(lastStudyDate) {
    const today = getTodayDateString();
    
    if (lastStudyDate === today) {
        // Zaten bugün çalışılmış, seriyi değiştirmeye gerek yok
        return mevcutSeri; 
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().slice(0, 10);

    let newStreak = mevcutSeri;

    if (lastStudyDate === yesterdayString) {
        // Dünden sonra bugün devam ediyor -> Seriyi 1 artır
        newStreak += 1;
    } else {
        // Dün çalışılmamış (veya hiç çalışılmamış) -> Seriyi 1'e sıfırla
        newStreak = 1;
    }
    
    // Veritabanına yeni seri ve tarihi kaydet
    db.collection(DERS_TAKIP_COLLECTION).doc(auth.currentUser.uid).set({
        [DERS_ADI + '_streak']: newStreak,
        [DERS_ADI + '_last_study_date']: today 
    }, { merge: true });
    
    mevcutSeri = newStreak;
    
    // Arayüzü güncelle (sadece turkce.html'de çalışır)
    if (streakContainer) {
        streakContainer.textContent = `${mevcutSeri} Gün`;
        // 15 Gün kontrolü
        if (mevcutSeri >= 15) {
             document.getElementById('reward-section').classList.remove('hidden');
        }
    }

    return newStreak;
}


// 4. Firebase'e Süre Kaydetme Fonksiyonu
function sureyiFirebaseKaydet() {
    if (!auth.currentUser || !sureKaydiGerekli) return; 

    const userID = auth.currentUser.uid;
    const dersRef = db.collection(DERS_TAKIP_COLLECTION).doc(userID);
    
    // Seriyi güncelle
    updateStreak(getTodayDateString()); // Bugün çalıştığımızı teyit et
    
    // Veritabanına toplam süreyi kaydet
    dersRef.set({
        [DERS_ADI + '_sure']: toplamSureSaniye,
        [DERS_ADI + '_streak']: mevcutSeri,
        [DERS_ADI + '_last_study_date']: getTodayDateString() 
    }, { merge: true }) 
    .then(() => {
        console.log(`${DERS_ADI} süre/seri kaydedildi. Seri: ${mevcutSeri}`);
        sureKaydiGerekli = false;
    })
    .catch((error) => {
        console.error("Süre/Seri kaydı hatası:", error);
    });
}


// 5. Sayaç Başlatma Fonksiyonu
function sayaciBaslat() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        toplamSureSaniye += 1;
        if (sureSayacElementi) {
            sureSayacElementi.textContent = formatTime(toplamSureSaniye);
        }
        
        // Her 10 saniyede bir kaydet
        if (toplamSureSaniye % MIN_KAYIT_SURESI_SANIYE === 0) {
            sureKaydiGerekli = true;
            sureyiFirebaseKaydet();
        }
    }, 1000);
}


// 6. Ana Başlatma ve Veri Çekme İşlevi
auth.onAuthStateChanged(user => {
    if (!user) {
        // Oturum kapalıysa dersler.html'e yönlendir
        window.location.href = 'dersler.html'; 
        return; 
    }
    
    const userID = user.uid;
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `(${user.email})`;
    }
    
    // Firebase'den mevcut süreyi ve seriyi çek
    db.collection(DERS_TAKIP_COLLECTION).doc(userID).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                
                // Toplam Süreyi yükle
                toplamSureSaniye = data[DERS_ADI + '_sure'] || 0;
                if (sureSayacElementi) {
                    sureSayacElementi.textContent = formatTime(toplamSureSaniye);
                }
                
                // Seriyi yükle
                mevcutSeri = data[DERS_ADI + '_streak'] || 0;
                const lastStudyDate = data[DERS_ADI + '_last_study_date'] || '';

                // Seriyi kontrol et ve gerekirse güncelle (Örn: Dün çalıştıysa +1, çalışmadıysa 1'e sıfırla)
                updateStreak(lastStudyDate);
            }
            // Süre yüklendikten sonra sayacı başlat
            sayaciBaslat();
        });
});

// 7. Sayfadan Ayrılma Durumunda Son Kez Kaydetme
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
