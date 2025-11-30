<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matematik Quiz ve Testler</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #F8FAFC; min-height: 100vh; }
        .quiz-card {
            background-color: white;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 2rem;
        }
        .answer-option {
            transition: all 0.1s ease;
            cursor: pointer;
        }
        .answer-option:hover {
            background-color: #e0e7ff; /* indigo-100 */
        }
        .selected {
            background-color: #c7d2fe; /* indigo-200 */
            border-color: #6366f1; /* indigo-500 */
        }
        .correct {
            background-color: #a7f3d0; /* emerald-200 */
            border-color: #34d399; /* emerald-500 */
        }
        .wrong {
            background-color: #fecaca; /* red-200 */
            border-color: #f87171; /* red-400 */
        }
    </style>
</head>
<body>

<div class="w-full max-w-4xl mx-auto p-6 md:p-10 mt-8">
    <header class="pb-4 border-b border-gray-200 mb-6">
        <a href="../matematik.html" class="text-indigo-600 hover:text-indigo-800 text-xl mb-4 inline-block">← Matematik Ana Menü</a>
        <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">Matematik Quiz ve Testler 📐</h1>
        <p class="text-sm text-gray-500 mt-2">Aşağıdan bir test seçin ve kendinizi deneyin.</p>
    </header>

    <div id="quiz-selection-area" class="quiz-card mb-8">
        <h2 id="list-title" class="text-2xl font-semibold mb-4 text-gray-700">Test Seçimi</h2>
        <div id="quiz-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            </div>
    </div>

    <div id="quiz-area" class="hidden">
        <div class="flex justify-between items-center mb-4">
            <span id="quiz-title" class="text-xl font-bold text-indigo-600"></span>
            <span id="quiz-counter" class="text-lg font-medium text-gray-500">Soru 1 / 10</span>
        </div>
        
        <div class="quiz-card">
            <p id="question-text" class="text-xl mb-6 font-medium text-gray-800 whitespace-pre-line"></p>
            
            <div id="answers-container" class="space-y-3">
                </div>
            
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <button id="prev-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-150" disabled>
                    ← Önceki
                </button>
                <button id="next-btn" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition duration-150">
                    Sonraki →
                </button>
            </div>
        </div>
    </div>

    <div id="result-area" class="hidden quiz-card text-center">
        <h2 class="text-3xl font-bold mb-4 text-indigo-600">Quiz Sonuçları 🎉</h2>
        <p class="text-xl text-gray-700 mb-2">Doğru Sayısı: <span id="correct-count" class="font-extrabold text-emerald-600"></span></p>
        <p class="text-xl text-gray-700 mb-2">Yanlış Sayısı: <span id="wrong-count" class="font-extrabold text-red-600"></span></p>
        <p class="text-xl text-gray-700 mb-2">Boş Sayısı: <span id="empty-count" class="font-extrabold text-gray-500"></span></p>
        <p class="text-2xl font-bold text-indigo-700 mt-4 mb-6">NET: <span id="net-count" class="font-extrabold"></span></p> 
        <button id="restart-btn" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-150">
            Yeni Test Seç
        </button>
        <div id="answer-review" class="mt-8 text-left space-y-4">
            <h3 class="text-xl font-semibold border-b pb-2 text-gray-700">Cevap İncelemesi:</h3>
        </div>
    </div>
</div>

<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"></script>
<script src="../js/firebase-init.js"></script>
<script src="../js/sure-takip-matematik.js"></script> 
<script src="../js/matematik_data.js"></script> 

<script>
    // Matematik Quiz verileri matematik_data.js'ten çekilir
    const quizListContainer = document.getElementById('quiz-list');
    const quizSelectionArea = document.getElementById('quiz-selection-area');
    const quizArea = document.getElementById('quiz-area');
    const resultArea = document.getElementById('result-area');
    const quizTitle = document.getElementById('quiz-title');
    const quizCounter = document.getElementById('quiz-counter');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const correctCountDisplay = document.getElementById('correct-count');
    const wrongCountDisplay = document.getElementById('wrong-count');
    const emptyCountDisplay = document.getElementById('empty-count'); 
    const netCountDisplay = document.getElementById('net-count');
    const restartBtn = document.getElementById('restart-btn');
    const answerReviewContainer = document.getElementById('answer-review');
    const listTitleElement = document.getElementById('list-title'); 

    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = {}; 

    // --- URL Parametre Okuyucu ---
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    // --- QUIZ LİSTESİ YÜKLEME FONKSİYONU ---
    function loadQuizList() {
        quizListContainer.innerHTML = '';
        
        const groupFilter = getUrlParameter('grup');

        let quizzesToDisplay = [];
        let headerText = 'Test Seçimi';
        
        // KRİTİK KONTROL: Veri yüklenmediyse uyarı ver
        if (typeof tumMatematikQuizler === 'undefined') {
            listTitleElement.textContent = '❌ Veri Yüklenemedi';
            quizListContainer.innerHTML = '<p class="md:col-span-2 text-red-600 font-semibold">Matematik veri dosyası (matematik_data.js) yüklenirken bir sorun oluştu. Lütfen dosya yolunu ve içeriğini kontrol edin (HTML etiketi içermediğinden emin olun).</p>';
            return;
        }


        if (groupFilter === 'deneme') {
            quizzesToDisplay = matematikDenemeler;
            headerText = '🏆 Deneme Sınavları (Tarama Testleri)';
        } else if (groupFilter === 'konu') {
            quizzesToDisplay = matematikKonuQuizler;
            headerText = '📚 Konu Bazlı Quizler';
        } else {
             listTitleElement.textContent = '❌ Lütfen Bir Grup Seçin';
             quizListContainer.innerHTML = '<p class="md:col-span-2 text-red-600 font-semibold">Görüntülenecek quiz grubunu seçmek için ana menüye dönün.</p>';
             return;
        }

        listTitleElement.textContent = headerText;
        
        if (quizzesToDisplay.length === 0) {
             quizListContainer.innerHTML = `<p class="md:col-span-2 text-gray-500 font-medium">Henüz bu gruba ait ${groupFilter === 'deneme' ? 'deneme sınavı' : 'konu quizi'} bulunmamaktadır. Lütfen matematik_data.js dosyanıza quiz ekleyin.</p>`;
             return;
        }

        quizzesToDisplay.forEach(quiz => {
            const quizButton = document.createElement('button');
            quizButton.className = 'w-full text-left p-4 bg-gray-100 hover:bg-indigo-100 border-2 border-indigo-300 rounded-lg shadow font-medium text-gray-700 transition duration-150';
            
            const buttonType = groupFilter === 'deneme' ? 'Deneme' : 'Quiz';
            
            quizButton.textContent = `${buttonType} ${quiz.id}: ${quiz.konu} (${quiz.sorular.length} Soru)`;
            quizButton.onclick = () => startQuiz(quiz.id);
            quizListContainer.appendChild(quizButton);
        });
    }


    // --- QUIZ AKIŞI FONKSİYONLARI ---
    function startQuiz(quizId) {
        // tumMatematikQuizler, matematik_data.js'ten gelir
        currentQuiz = tumMatematikQuizler.find(q => q.id === quizId);
        currentQuestionIndex = 0;
        userAnswers = {};

        quizSelectionArea.classList.add('hidden');
        quizArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        
        quizTitle.textContent = currentQuiz.konu;
        displayQuestion();
    }

    function displayQuestion() {
        const questionData = currentQuiz.sorular[currentQuestionIndex];
        
        quizCounter.textContent = `Soru ${currentQuestionIndex + 1} / ${currentQuiz.sorular.length}`;
        // Matematiksel ifadelerin düzgün görünmesi için \n yerine <br> kullanıldı
        questionText.innerHTML = questionData.metin.replace(/\\n/g, '<br>'); 
        answersContainer.innerHTML = '';
        
        Object.entries(questionData.cevaplar).forEach(([key, value]) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = `answer-option p-3 border-2 border-gray-200 rounded-lg flex items-center ${userAnswers[currentQuestionIndex] === key ? 'selected' : ''}`;
            answerDiv.innerHTML = `<span class="font-bold mr-3 text-indigo-500">${key})</span> ${value}`;
            answerDiv.dataset.answerKey = key;
            answerDiv.onclick = () => selectAnswer(key);
            answersContainer.appendChild(answerDiv);
        });
        
        updateNavigationButtons();
    }

    function selectAnswer(key) {
        userAnswers[currentQuestionIndex] = key;
        answersContainer.querySelectorAll('.answer-option').forEach(div => {
            div.classList.remove('selected');
            if (div.dataset.answerKey === key) {
                div.classList.add('selected');
            }
        });
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === currentQuiz.sorular.length - 1) {
            nextBtn.textContent = 'Quizi Bitir';
            nextBtn.disabled = false;
            nextBtn.onclick = finishQuiz;
        } else {
            nextBtn.textContent = 'Sonraki →';
            nextBtn.disabled = false;
            nextBtn.onclick = goToNextQuestion;
        }
    }

    function goToNextQuestion() {
        if (currentQuestionIndex < currentQuiz.sorular.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    }

    function goToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    }
    
    function finishQuiz() {
        quizArea.classList.add('hidden');
        resultArea.classList.remove('hidden');
        
        let correctCount = 0;
        let wrongCountActual = 0; // Neti götürecek olan yanlışlar
        let emptyCount = 0;       // Neti götürmeyecek olan boşlar
        
        answerReviewContainer.innerHTML = '<h3 class="text-xl font-semibold border-b pb-2 text-gray-700">Cevap İncelemesi:</h3>';
        
        // Doğru, Yanlış ve Boşları hesapla
        currentQuiz.sorular.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isAnswered = userAnswer !== undefined && userAnswer !== null;
            
            if (isAnswered) {
                const isCorrect = userAnswer === question.dogruCevap;
                if (isCorrect) {
                    correctCount++;
                } else {
                    wrongCountActual++;
                }
            } else {
                emptyCount++;
            }
            
            // Cevap İnceleme kartı oluşturma
            const reviewItem = document.createElement('div');
            const isCorrect = userAnswer === question.dogruCevap;

            reviewItem.className = `p-3 rounded-lg border-2 ${isCorrect ? 'border-emerald-500 bg-emerald-50' : (isAnswered ? 'border-red-500 bg-red-50' : 'border-gray-400 bg-gray-100')}`;
            const formattedQuestionText = question.metin.replace(/\\n/g, '<br>');

            reviewItem.innerHTML = `
                <p class="font-bold text-gray-800 mb-1">Soru ${index + 1}:</p>
                <p class="whitespace-pre-line text-sm mb-2">${formattedQuestionText}</p>
                <p class="text-sm">Senin Cevabın: <span class="font-bold ${isCorrect ? 'text-emerald-700' : (isAnswered ? 'text-red-700' : 'text-gray-700')}">${userAnswer || 'Boş'}</span></p>
                <p class="text-sm">Doğru Cevap: <span class="font-bold text-emerald-700">${question.dogruCevap}</span></p>
            `;
            answerReviewContainer.appendChild(reviewItem);
        });

        // LGS Net Hesaplama: Net = Doğru - (Yanlış / 3)
        const netCount = (correctCount - (wrongCountActual / 3)).toFixed(2);
        
        // Ekranda gösterilen sonuçları güncelle
        correctCountDisplay.textContent = correctCount;
        wrongCountDisplay.textContent = wrongCountActual; 
        emptyCountDisplay.textContent = emptyCount;
        netCountDisplay.textContent = netCount;
        
        // --- Sonuçları Firestore'a Kaydet ---
        if (firebase.auth().currentUser) {
            const db = firebase.firestore();
            // KRİTİK: Matematik koleksiyonuna kaydediyoruz.
            db.collection('matematikSonuclari').add({ 
                userId: firebase.auth().currentUser.uid,
                quizId: currentQuiz.id,
                quizName: currentQuiz.konu,
                total: currentQuiz.sorular.length,
                correct: correctCount,
                wrong: wrongCountActual,
                empty: emptyCount,      
                net: parseFloat(netCount), 
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log("Matematik quiz sonucu Firestore'a kaydedildi!");
            }).catch((error) => {
                console.error("Matematik quiz sonucu kaydedilirken hata oluştu: ", error);
            });
        }
    }

    // Baştan Başlat
    restartBtn.addEventListener('click', () => {
        resultArea.classList.add('hidden');
        quizSelectionArea.classList.remove('hidden');
        loadQuizList();
    });

    prevBtn.addEventListener('click', goToPrevQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    
    // Uygulama başlangıcı
    document.addEventListener('DOMContentLoaded', loadQuizList);
</script>
</body>
</html>
