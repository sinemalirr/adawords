// js/sure-takip-turkce.js

// 1. Sabitler
const DERS_ADI = "turkce";
const MIN_KAYIT_SURESI_SANIYE = 10; // 10 saniyeden fazla süre kayıt edilecek.
const sureSayacElementi = document.getElementById('sure-sayac');
const userEmailDisplay = document.getElementById('user-email-display');

let toplamSureSaniye = 0; // Firebase'den çekilen + yeni eklenen süre
let timerInterval = null; // Sayacı tutan değişken
let sureKaydiGerekli = false; // 10 saniye doldu mu?

// 2. Süre Formatlama Fonksiyonu (Saniyeyi HH:MM:SS formatına çevirir)
function formatTime(saniye) {
    const saat = Math.floor(saniye / 3600);
    const dakika = Math.floor((saniye % 3600) / 60);
    const saniyeKalan = saniye % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(saat)}:${pad(dakika)}:${pad(saniyeKalan)}`;
}

// 3. Firebase'e Süre Kaydetme Fonksiyonu
function sureyiFirebaseKaydet() {
    // Oturum açık mı ve 10 saniye limitini geçtik mi kontrol et
    if (!auth.currentUser || !sureKaydiGerekli) return; 

    const userID = auth.currentUser.uid;
    const dersRef = db.collection(DERS_TAKIP_COLLECTION).doc(userID);
    
    // Veritabanına kaydet
    dersRef.set({
        [DERS_ADI + '_sure']: toplamSureSaniye
    }, { merge: true }) // Merge: Sadece bu alanı günceller, diğer verileri korur
    .then(() => {
        console.log(`${DERS_ADI} için süre başarıyla kaydedildi: ${toplamSureSaniye} saniye.`);
        sureKaydiGerekli = false; // Kayıt başarılı, bayrağı sıfırla
    })
    .catch((error) => {
        console.error("Süre kaydı hatası:", error);
    });
}

// 4. Sayaç Başlatma Fonksiyonu
function sayaciBaslat() {
    if (timerInterval) return; // Zaten çalışıyorsa tekrar başlatma

    timerInterval = setInterval(() => {
        toplamSureSaniye += 1; // Her saniye 1 saniye ekle
        sureSayacElementi.textContent = formatTime(toplamSureSaniye);
        
        // 10 saniyelik limit dolduğunda kayda hazır hale getir
        if (toplamSureSaniye % MIN_KAYIT_SURESI_SANIYE === 0) {
            sureKaydiGerekli = true;
            sureyiFirebaseKaydet(); // Her 10 saniyede bir kaydet
        }
    }, 1000); // 1 saniyede bir çalış
}

// 5. Ana Başlatma ve Veri Çekme İşlevi
auth.onAuthStateChanged(user => {
    if (!user) {
        // Oturum kapalıysa dersler.html'den geri atılacak
        return; 
    }
    
    const userID = user.uid;
    userEmailDisplay.textContent = `(${user.email})`;
    
    // Firebase'den mevcut süreyi çek
    db.collection(DERS_TAKIP_COLLECTION).doc(userID).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                const key = DERS_ADI + '_sure';
                
                // Mevcut süreyi yükle
                toplamSureSaniye = data[key] || 0;
                sureSayacElementi.textContent = formatTime(toplamSureSaniye);
            }
            // Süre yüklendikten sonra sayacı başlat
            sayaciBaslat();
        })
        .catch(error => {
            console.error("Firebase'den süre çekme hatası:", error);
            sayaciBaslat(); // Hata olsa bile sıfırdan saymaya başla
        });
});

// 6. Sayfadan Ayrılma Durumunda Son Kez Kaydetme (Tarayıcı Sekme Değişikliği/Kapama)
window.addEventListener('beforeunload', sureyiFirebaseKaydet);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Sayfa gizlenirse sayacı durdur ve kaydet
        clearInterval(timerInterval);
        timerInterval = null;
        sureyiFirebaseKaydet();
    } else {
        // Sayfa tekrar görünür hale gelirse, kaldığı yerden saymaya devam et
        sayaciBaslat();
    }
});
