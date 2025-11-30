
// 1. Firebase Yapılandırması (Sizin Verileriniz)
const firebaseConfig = {
    apiKey: "AIzaSyB3FGM38oeHMjFhjncqfaw430vv3YAtqTw",
    authDomain: "ada-dersler.firebaseapp.com",
    projectId: "ada-dersler",
    storageBucket: "ada-dersler.firebasestorage.app",
    messagingSenderId: "790521826524",
    appId: "1:790521826524:web:216ca419c75c59e7b37819"
};

// Firebase Uygulamasını Başlat
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore(); // Firestore veritabanını kullanacağız

// Veri depolamak için kullanacağımız ana koleksiyon adı:
const DERS_TAKIP_COLLECTION = "lgs_ders_takip";

// 2. DOM Öğeleri
const derslerButton = document.getElementById('dersler-btn');
const mainContent = document.querySelector('.w-full.max-w-lg');

// 3. Giriş/Kayıt Modal HTML'i oluşturma ve ekleme
function setupAuthModal() {
    const authModalHTML = `
        <div id="auth-modal-backdrop" class="fixed inset-0 bg-gray-900 bg-opacity-80 hidden items-center justify-center z-50">
            <div class="bg-white p-6 rounded-xl shadow-2xl w-11/12 max-w-sm">
                <h3 class="text-2xl font-bold mb-4 text-rose-600">Giriş Yap / Kayıt Ol</h3>
                <input type="email" id="auth-email" placeholder="E-posta Adresi" class="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <input type="password" id="auth-password" placeholder="Şifre (Min. 6 Karakter)" class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                
                <button id="login-btn" class="p-3 bg-blue-600 text-white rounded-lg w-full font-semibold mb-2 hover:bg-blue-700">Giriş Yap</button>
                <button id="register-btn" class="p-3 bg-rose-600 text-white rounded-lg w-full font-semibold hover:bg-rose-700">Kayıt Ol</button>
                
                <p id="auth-error-message" class="text-red-500 mt-3 text-sm hidden"></p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', authModalHTML);
}
setupAuthModal();

const authModal = document.getElementById('auth-modal-backdrop');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error-message');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');

function showAuthModal() {
    authModal.classList.remove('hidden');
    authModal.classList.add('flex');
    authError.classList.add('hidden');
}

function hideAuthModal() {
    authModal.classList.remove('flex');
    authModal.classList.add('hidden');
}

function displayError(message) {
    authError.textContent = message;
    authError.classList.remove('hidden');
}

// 4. Kimlik Doğrulama İşlevleri
loginBtn.addEventListener('click', () => {
    const email = authEmail.value;
    const password = authPassword.value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            hideAuthModal();
            // Başarılı girişten sonra Dersler sayfasına yönlendir.
            window.location.href = 'dersler.html';
        })
        .catch(error => {
            displayError("Giriş Başarısız: " + error.message);
        });
});

registerBtn.addEventListener('click', () => {
    const email = authEmail.value;
    const password = authPassword.value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            hideAuthModal();
            alert("Kayıt Başarılı! Otomatik giriş yapıldı.");
            // Başarılı kayıttan sonra Dersler sayfasına yönlendir.
            window.location.href = 'dersler.html';
        })
        .catch(error => {
            displayError("Kayıt Başarısız: " + error.message);
        });
});

// 5. 'Dersler' Butonunun İşlevini Ayarlama
// Mevcut onclick fonksiyonunu kaldırıp kendi işlevimizi ekliyoruz.
const derslerContainer = document.querySelector('button[onclick*="showCustomModal"]');
if (derslerContainer) {
    // Mevcut butonun bağlantısını kesip yeni bir elemente saralım
    const derslerBtn = derslerContainer.cloneNode(true);
    derslerBtn.removeAttribute('onclick');
    derslerBtn.id = 'dersler-btn'; // Yeni ID verdik
    
    derslerContainer.parentNode.replaceChild(derslerBtn, derslerContainer);

    // Butona tıklama olayını ekle
    derslerBtn.addEventListener('click', () => {
        // Kullanıcı oturumu kontrol et
        if (auth.currentUser) {
            // Oturum varsa direkt dersler sayfasına git
            window.location.href = 'dersler.html';
        } else {
            // Oturum yoksa giriş modalını göster
            showAuthModal();
        }
    });
}
