// js/sure-takip-turkce.js - 15 DAKİKA KURALINA UYGUN KESİN ÇÖZÜM

const DERS_ADI = "turkce";
// GÜNLÜK SERİNİN SAYILMASI İÇİN KRİTİK EŞİK: 15 dakika = 900 saniye
const MIN_SURE_SERI_SAYACI = 900; 

const sureSayacElementi = document.getElementById('sure-sayac');
const userEmailDisplay = document.getElementById('user-email-display');
const streakContainer = document.getElementById('streak-container'); 
const rewardSection = document.getElementById('reward-section'); 
const dailyProgressContainer = document.getElementById('daily-progress'); // turkce.html'e eklenecek

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
    
    // UI Güncelleme: Hedef süresini ve ilerleme çubuğunu gösterir
    dailyProgressContainer.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="text-xs font-medium text-gray-600">Bugünkü Hedef:</span>
            <div class="text-lg font-semibold text-green-600">${formatTime(bugunCalisilanSure)} / 15:00</div>
        </div>
        <div class="h-1.5 bg-gray-200 rounded-full w-24 overflow-hidden ml-4" title="Hedefe Kalan: ${100 - progressPercent}%">
            <div class="h-full bg-green-500 transition-all duration-500" style="width: ${progressPercent}%;"></div>
        </div>
    `;
    
    // Not: Hedef tamamlandıysa uyarı vermek için küçük bir emoji eklenebilir.
    if (isStreakCompletedToday && bugunCalisilanSure >= MIN_SURE_SERI_SAYACI) {
        dailyProgressContainer.querySelector('.text-green-600').textContent += ' ✅';

}

// 2. Seri (Streak) Kontrolü
function checkStreak(data) {
    const today = getTodayDateString();
    
    mevcutSeri = data[DERS_ADI + '_streak'] || 0;
    lastStudyDate = data[DERS_ADI + '_last_study_date'] || '';
    
    if (lastStudyDate === today) {
        // Bugün zaten seri tamamlanmış ve sayılmış.
        isStreakCompletedToday = true;
    } else {
        // Bugün daha önce çalışılmamış. bugunCalisilanSure'yi sıfırla
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
    if (rewardSection) {
        if (mevcutSeri >= 15) {
             rewardSection.classList.remove('hidden');
        } else {
             rewardSection.classList.add('hidden');
        }
    }
    updateDailyProgressUI();
}


// 3. Firebase'e Kayıt Fonksiyonu
function sureyiFirebaseKaydet() {
    if (!auth.currentUser) return; 

    const userID = auth.currentUser.uid;
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
        
        // Ödül kontrolünü tekrar yap
        if (rewardSection) {
            if (mevcutSeri >= 15) {
                rewardSection.classList.remove('hidden');
            }
        }
    }
    
    dersRef.set(updateData, { merge: true }) 
    .then(() => {
        // console.log(`${DERS_ADI} süre/seri kaydedildi. Bugün: ${formatTime(bugunCalisilanSure)}`);
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
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = '../dersler.html'; 
        return; 
    }
    
    const userID = user.uid;
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `(${user.email})`;
    }
    
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
