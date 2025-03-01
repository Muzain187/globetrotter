let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;
let challengeID = new URLSearchParams(window.location.search).get("challenge");

// const API_URL = "https://globetrotter-alpha.vercel.app"
const API_URL = "http://127.0.0.1:8000"


document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("play-btn");
    const challengeBtn = document.getElementById("challenge-btn");

    if (playBtn) playBtn.onclick = () => window.location.href = "game.html";
    if (challengeBtn) challengeBtn.onclick = createChallenge;

    if (window.location.pathname.includes("game.html")) startGame();
});

function createChallenge() {
    fetch(`${API_URL}/create_challenge`)
        .then(response => response.json())
        .then(data => {
            const challengeUrl = `${window.location.origin}/game.html?challenge=${data.challenge_id}`;
            document.getElementById("challenge-link").innerText = `Share this link: ${challengeUrl}`;
            document.getElementById("challenge-link").style.display = "block";
        });
}

function startGame() {
    const endpoint = challengeID 
        ? `${API_URL}/get_challenge/${challengeID}`
        : `${API_URL}/get_questions`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            questions = data;
            showQuestion();
        });
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        submitScore();
        return;
    }

    clearInterval(timerInterval);
    
    const question = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = `Guess the city in ${question.country}`;
    
    // Display the image hint
    document.getElementById("image-container").innerHTML = `<img src="${question.image_url}" alt="Hint Image" class="hint-image">`;

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    question.choices.forEach(choice => {
        const button = document.createElement("button");
        button.innerText = choice;
        button.classList.add("option-btn");
        button.onclick = () => checkAnswer(button, choice, question.city);
        optionsContainer.appendChild(button);
    });

    startTimer(30);
}

function checkAnswer(button, selected, correct) {
    clearInterval(timerInterval);
    
    const feedback = document.createElement("p");
    feedback.classList.add("feedback");

    if (selected === correct) {
        button.classList.add("option-correct");
        feedback.innerText = "✅ Correct!";
        score++;
    } else {
        button.classList.add("option-wrong");
        feedback.innerText = "❌ Wrong!";
    }

    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function submitScore() {
    const username = prompt("Enter your name for the leaderboard:");
    if (!username) {
        window.location.href = "leaderboard.html";
        return;
    }

    fetch(`${API_URL}/submit_score/${username}/${score}`, { method: "POST" })
        .then(() => {
            window.location.href = "leaderboard.html";
        });
}

function startTimer(seconds) {
    const timerElement = document.getElementById("timer");
    let timeLeft = seconds;

    timerInterval = setInterval(() => {
        timerElement.innerText = `Time left: ${timeLeft} sec`;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            currentQuestionIndex++;
            showQuestion();
        }
        timeLeft--;
    }, 1000);
}
