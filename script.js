const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR-CSV-LINK-HERE/pub?output=csv';

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

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csvText => {
    quizData = parseCSV(csvText);
    loadQuestion();
  })
  .catch(err => {
    questionEl.textContent = "Error loading questions.";
    console.error(err);
  });

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const question = values[0];
    const options = values[1].split(";").map(opt => opt.trim());
    const answer = values[2].trim();
    return { question, options, answer };
  });
}

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
    btn.onclick = () => selectAnswer(btn, current.answer);
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function selectAnswer(button, correctAnswer) {
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
});

function showResult() {
  document.getElementById("question-container").style.display = "none";
  resultEl.style.display = "block";
  scoreEl.textContent = `${score} / ${quizData.length}`;
  
  // Prompt for name and save score
  const name = prompt("Enter your name to save your score:");
  if (name) {
    saveScore(name, score);
  }

  // Show the leaderboard
  displayLeaderboard();
}

function saveScore(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  
  // Add new score and sort by descending order
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score); // Sort in descending order of score

  // Keep only top 5 scores
  leaderboard = leaderboard.slice(0, 5);
  
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const leaderboardEl = document.getElementById("leaderboard");
  
  leaderboardEl.innerHTML = "<h2>Leaderboard</h2>";
  
  leaderboard.forEach((entry, index) => {
    leaderboardEl.innerHTML += `<p>${index + 1}. ${entry.name} - ${entry.score}</p>`;
  });
}

