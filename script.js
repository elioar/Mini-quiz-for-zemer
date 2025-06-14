const questionsByCategory = {
    'distributions': [
        // ... existing code ...
    ],
    'statistics': [
        // ... existing code ...
    ],
    'descriptive': [
        // ... existing code ...
    ],
    'advanced': [
        // ... existing code ...
    ],
    'expert': [
        // ... existing code ...
    ]
};

let currentCategory = null;
let userAnswers = {};
let quizCompleted = false;

function showCategoryScreen() {
    document.getElementById('categoryContainer').style.display = 'grid';
    document.getElementById('quizContainer').style.display = 'none';
    document.querySelector('.header p').textContent = 'Επιλέξτε μια κατηγορία για να ξεκινήσετε!';
}

function showQuizScreen(category) {
    currentCategory = category;
    document.getElementById('categoryContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.querySelector('.header p').textContent = `Κατηγορία: ${getCategoryTitle(category)}`;
    initializeQuiz();
}

function getCategoryTitle(category) {
    const categoryMap = {
        'distributions': 'Κατανομές & Πιθανότητες',
        'statistics': 'Στατιστικές Μέθοδοι & Μέτρα',
        'descriptive': 'Περιγραφική Στατιστική',
        'advanced': 'Προχωρημένες Μέθοδοι',
        'expert': 'Ειδικά Θέματα Στατιστικής',
        'mixed': 'Τυχαίες Ερωτήσεις'
    };
    return categoryMap[category];
}

function getRandomQuestions() {
    // Get all questions from all categories
    const allQuestions = [];
    const categories = ['distributions', 'statistics', 'descriptive', 'advanced', 'expert'];
    
    categories.forEach(category => {
        questionsByCategory[category].forEach(question => {
            allQuestions.push({
                ...question,
                originalCategory: category
            });
        });
    });

    // Shuffle array
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    // Take first 20 questions
    return allQuestions.slice(0, 20);
}

function initializeQuiz() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    userAnswers = {};
    quizCompleted = false;
    
    let questions;
    if (currentCategory === 'mixed') {
        questions = getRandomQuestions();
    } else {
        questions = questionsByCategory[currentCategory];
    }
    
    questions.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.style.setProperty('--card-index', index);
        let categoryLabel = '';
        if (currentCategory === 'mixed') {
            categoryLabel = `<div class="question-category">${getCategoryTitle(q.originalCategory)}</div>`;
        }
        questionCard.innerHTML = `
            <div class="question-number">Ερώτηση ${index + 1}</div>
            ${categoryLabel}
            <div class="question-text">${q.question}</div>
            <div class="answers">
                ${q.answers.map((answer, answerIndex) => `
                    <div class="answer-option" style="--option-index: ${answerIndex}" data-question="${index}" data-answer="${answerIndex}">
                        <div class="answer-letter">${String.fromCharCode(97 + answerIndex)}</div>
                        <div class="answer-text">${answer}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(questionCard);
    });

    // Add click event listeners
    document.querySelectorAll('.answer-option').forEach(option => {
        option.addEventListener('click', handleAnswerClick);
    });

    // Reset buttons and results
    document.getElementById('checkAnswers').style.display = 'inline-block';
    document.getElementById('restartQuiz').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    updateProgressBar();
}

function handleAnswerClick(event) {
    if (quizCompleted) return;

    const questionIndex = event.currentTarget.dataset.question;
    const answerIndex = parseInt(event.currentTarget.dataset.answer);

    // If this question was already answered, don't allow changing
    if (userAnswers[questionIndex] !== undefined) return;

    // Store the answer
    userAnswers[questionIndex] = answerIndex;

    // Disable all options for this question
    const questionCard = event.currentTarget.closest('.question-card');
    questionCard.classList.add('completed');
    questionCard.querySelectorAll('.answer-option').forEach(option => {
        option.classList.add('disabled');
    });

    // Highlight the selected answer
    event.currentTarget.style.background = '#e3f2fd';
    event.currentTarget.style.borderColor = '#2196f3';

    updateProgressBar();
}

function updateProgressBar() {
    const answered = Object.keys(userAnswers).length;
    const percentage = (answered / questionsByCategory[currentCategory].length) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';
}

function createConfetti() {
    const container = document.getElementById('celebrationContainer');
    const colors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#FF69B4'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 3}s linear forwards`;
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function createFloatingHearts() {
    const container = document.getElementById('celebrationContainer');
    const hearts = ['❤️', '💖', '💝', '💕', '💗'];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'celebration-hearts';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.setProperty('--end-x', (Math.random() * 200 - 100) + 'px');
        heart.style.setProperty('--end-y', (-Math.random() * 200 - 100) + 'px');
        heart.style.setProperty('--rotation', (Math.random() * 360) + 'deg');
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 3000);
    }
}

function celebrate() {
    const container = document.getElementById('celebrationContainer');
    container.classList.add('show');
    
    // Add celebration message
    const message = document.getElementById('celebrationMessage');
    message.textContent = 'Μπράβο στο ζεμπέλ μου! 🦜';
    message.classList.add('show');
    
    // Start animations
    createConfetti();
    createFloatingHearts();
    
    // Repeat animations
    const celebrationInterval = setInterval(() => {
        createConfetti();
        createFloatingHearts();
    }, 3000);
    
    // Stop celebrations after 9 seconds
    setTimeout(() => {
        clearInterval(celebrationInterval);
        container.classList.remove('show');
    }, 9000);
}

function checkAnswers() {
    if (Object.keys(userAnswers).length !== questionsByCategory[currentCategory].length) {
        alert('Παρακαλώ απαντήστε σε όλες τις ερωτήσεις πριν τη βαθμολόγηση!');
        return;
    }

    quizCompleted = true;
    let correctAnswers = 0;

    questionsByCategory[currentCategory].forEach((question, questionIndex) => {
        const userAnswer = userAnswers[questionIndex];
        const correctAnswer = question.correct;
        const questionCard = document.querySelectorAll('.question-card')[questionIndex];
        const options = questionCard.querySelectorAll('.answer-option');

        options[correctAnswer].classList.add('correct');
        
        if (userAnswer !== correctAnswer) {
            options[userAnswer].classList.add('incorrect');
        } else {
            correctAnswers++;
        }
    });

    const totalQuestions = questionsByCategory[currentCategory].length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    document.getElementById('score').textContent = `${correctAnswers}/${totalQuestions}`;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('results').style.display = 'block';

    // Check if score is above 80% and celebrate
    if (percentage >= 80) {
        celebrate();
    }

    document.getElementById('checkAnswers').style.display = 'none';
    document.getElementById('restartQuiz').style.display = 'inline-block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function restartQuiz() {
    initializeQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to category cards
    document.querySelectorAll('.category-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showQuizScreen(category);
        });
    });

    // Add event listener for back button
    document.getElementById('backToCategories').addEventListener('click', () => {
        if (!quizCompleted || confirm('Είστε σίγουροι ότι θέλετε να επιστρέψετε στις κατηγορίες; Η πρόοδός σας θα χαθεί.')) {
            showCategoryScreen();
        }
    });

    // Event listeners
    document.getElementById('checkAnswers').addEventListener('click', checkAnswers);
    document.getElementById('restartQuiz').addEventListener('click', restartQuiz);

    // Initialize with category screen
    showCategoryScreen();
});
