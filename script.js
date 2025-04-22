let quizData = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const leaderboardEl = document.getElementById("leaderboard");
const progressBar = document.getElementById("progress-bar");
const percentageEl = document.getElementById("percentage");

// Load questions from questions.json
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    quizData = data;
    loadQuestion();
  })
  .catch(error => {
    questionEl.textContent = "Error loading questions.";
    console.error("Error loading questions.json:", error);
  });

function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      lockOptions();
    }
  }, 1000);
}

function loadQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  nextBtn.disabled = true;

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.onclick = () => selectAnswer(btn, current.answer, current.explanation);
    optionsEl.appendChild(btn);
  });

  // Start timer and update progress
  startTimer();
  updateProgress();
}

function updateProgress() {
  const progress = (currentQuestion / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;

  const percentage = Math.round((score / quizData.length) * 100);
  percentageEl.textContent = `Progress: ${Math.round(progress)}% | Score: ${percentage}%`;
}

function selectAnswer(button, correctAnswer, explanation) {
  clearInterval(timer);

  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.style.backgroundColor = "#c8e6c9"; // green
    } else {
      btn.style.backgroundColor = "#ffcdd2"; // red
    }
  });

  if (button.textContent === correctAnswer) {
    score++;
  }

  // Show explanation
  if (explanation) {
    const explainEl = document.createElement("p");
    explainEl.textContent = `💡 Explanation: ${explanation}`;
    explainEl.style.marginTop = "10px";
    explainEl.style.fontStyle = "italic";
    explainEl.style.color = "#666";
    optionsEl.appendChild(explainEl);
  }

  nextBtn.disabled = false;
}

function lockOptions() {
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === quizData[currentQuestion].answer) {
      btn.style.backgroundColor = "#c8e6c9";
    }
  });

  const explanation = quizData[currentQuestion].explanation;
  if (explanation) {
    const explainEl = document.createElement("p");
    explainEl.textContent = `⏰ Time's up! Explanation: ${explanation}`;
    explainEl.style.marginTop = "10px";
    explainEl.style.fontStyle = "italic";
    explainEl.style.color = "#666";
    optionsEl.appendChild(explainEl);
  }

  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  clearInterval(timer);
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
  updateProgress();
});

function showResult() {
  document.getElementById("question-container").style.display = "none";
  resultEl.style.display = "block";
  scoreEl.textContent = `${score} / ${quizData.length}`;

  const finalProgress = (currentQuestion / quizData.length) * 100;
  progressBar.style.width = `${finalProgress}%`;

  const finalPercentage = Math.round((score / quizData.length) * 100);
  percentageEl.textContent = `You scored: ${finalPercentage}%`;

  const name = prompt("Enter your name to save your score:");
  if (name) {
    saveScore(name, score);
  }

  displayLeaderboard();
}

function saveScore(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardEl.innerHTML = "<h2>🏆 Leaderboard</h2>";
  leaderboard.forEach((entry, index) => {
    leaderboardEl.innerHTML += `<p>${index + 1}. ${entry.name} - ${entry.score}</p>`;
  });
}
