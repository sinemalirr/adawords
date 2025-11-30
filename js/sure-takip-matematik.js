// ====================================================================
// js/sure-takip-matematik.js
// Matematik Dersi İçin Zaman Takibi ve Firestore Entegrasyonu
// ====================================================================

// --- Firestore Koleksiyon Adı ---
const SURE_COLLECTION = 'matematikSureleri';
const HEDEF_SURE = 15 * 60; // Günlük 15 dakika hedef (saniye cinsinden)

let timerInterval;
let startTime;
let currentElapsedSeconds = 0;
let streak = 0;

// --- DOM Elementleri ---
const sureSayac = document.getElementById('sure-sayac');
const streakContainer = document.getElementById('streak-container');
const dailyProgressContainer = document.getElementById('daily-progress');
const userEmailDisplay = document.getElementById('user-email-display');

// Kullanıcı Giriş Durumu Kontrolü ve Timer Başlatma
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        userEmailDisplay.textContent = `Giriş: ${user.email}`;
        loadUserData(user.uid);
        startTimer(); // Kullanıcı girince sayacı başlat
    } else {
        userEmailDisplay.textContent = 'Giriş yapılmadı';
        if (timerInterval) {
            stopTimer(); // Kullanıcı çıkınca sayacı durdur
        }
    }
});

// Veri yükleme ve Görüntüleme
async function loadUserData(userId) {
    const db = firebase.firestore();
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    
    // 1. Günlük Süreyi Çek
    try {
        const sureDocRef = db.collection(SURE_COLLECTION).doc(userId);
        const sureDoc = await sureDocRef.get();

        if (sureDoc.exists) {
            const data = sureDoc.data();
            currentElapsedSeconds = data.sureler[todayStr] || 0;
            streak = data.streak || 0;
            updateProgressDisplay();
            updateStreakDisplay();
        } else {
             // Yeni kullanıcı veya ilk giriş
            updateProgressDisplay();
            updateStreakDisplay();
        }
    } catch (error) {
        console.error("Kullanıcı verisi yüklenirken hata:", error);
    }
}

// Timer Başlat
function startTimer() {
    if (!firebase.auth().currentUser || timerInterval) return;

    startTime = Date.now();
    timerInterval = setInterval(() => {
        const now = Date.now();
        const secondsPassed = Math.floor((now - startTime) / 1000);
        
        // Sadece her tam saniyede update et
        if (secondsPassed > 0) {
            currentElapsedSeconds += secondsPassed;
            startTime = now; // Yeni başlangıç zamanı
            updateProgressDisplay();

            // Her 60 saniyede bir (veya uygun gördüğünüz aralıkta) Firestore'a kaydet
            if (currentElapsedSeconds % 60 === 0) { 
                saveTime(firebase.auth().currentUser.uid);
            }
        }
    }, 1000); // 1 saniyede bir kontrol et
}

// Timer Durdur ve Son Kaydı Yap
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    if (firebase.auth().currentUser) {
        saveTime(firebase.auth().currentUser.uid);
    }
}

// Süreyi Firestore'a kaydet
async function saveTime(userId) {
    if (!userId) return;

    const db = firebase.firestore();
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const sureDocRef = db.collection(SURE_COLLECTION).doc(userId);
    
    // Veritabanı işlemleri için Transaction kullan
    try {
        await db.runTransaction(async (transaction) => {
            const sureDoc = await transaction.get(sureDocRef);
            let sureler = sureDoc.exists ? sureDoc.data().sureler || {} : {};
            let currentStreak = sureDoc.exists ? sureDoc.data().streak || 0 : 0;
            let lastDate = sureDoc.exists ? sureDoc.data().lastDate : null;

            // Günlük süreyi güncelle
            sureler[todayStr] = currentElapsedSeconds;

            // Streak Kontrolü (Daha karmaşık bir mantık gerekebilir, basitleştirildi)
            if (currentElapsedSeconds >= HEDEF_SURE) {
                if (!lastDate || lastDate !== todayStr) {
                    // Streak artışı için mantık eklenebilir. Şimdilik sadece güncel süreyi yazar.
                    // (Gerçek bir streak için dünün tarihi kontrol edilmelidir.)
                }
            }
            
            // Firestore'a kaydet
            transaction.set(sureDocRef, {
                userId: userId,
                sureler: sureler,
                streak: currentStreak, // Şimdilik değişmiyor
                lastDate: todayStr
            }, { merge: true });

            console.log(`[MATEMATİK] ${todayStr} için ${Math.round(currentElapsedSeconds / 60)} dakika kaydedildi.`);
        });
    } catch (error) {
        console.error("Firestore transaction başarısız:", error);
    }
}


// Görünüm Güncelleme
function updateProgressDisplay() {
    // Toplam Süre Sayacı
    const hours = Math.floor(currentElapsedSeconds / 3600);
    const minutes = Math.floor((currentElapsedSeconds % 3600) / 60);
    const seconds = currentElapsedSeconds % 60;
    
    sureSayac.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Günlük Hedef Çubuğu/Süresi
    const minutesToday = Math.floor(currentElapsedSeconds / 60);
    const minutesGoal = Math.floor(HEDEF_SURE / 60);
    
    let displayColor = 'text-red-600';
    if (minutesToday >= minutesGoal) {
        displayColor = 'text-emerald-600'; // Hedef tamamlandıysa yeşil
    } else if (minutesToday > 0) {
        displayColor = 'text-yellow-600'; // Başladıysa sarı
    }

    dailyProgressContainer.innerHTML = `
        <span class="text-xs font-medium text-gray-600">Bugünkü Hedef:</span>
        <div class="text-lg font-semibold ${displayColor}">${String(minutesToday).padStart(2, '0')}:${String(seconds).padStart(2, '0')} / ${String(minutesGoal).padStart(2, '0')}:00</div>
    `;
}

function updateStreakDisplay() {
    streakContainer.textContent = `${streak} Gün`;
}

// Pencere Kapatılırken/Yenilenirken süreyi kaydet
window.addEventListener('beforeunload', () => {
    if (firebase.auth().currentUser && timerInterval) {
        saveTime(firebase.auth().currentUser.uid);
    }
});
