const quizData = [
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Performance Unit", "Control Processing Unit"],
    answer: "Central Processing Unit"
  },
  {
    question: "Which of the following is a non-volatile memory?",
    options: ["RAM", "ROM", "Cache", "Register"],
    answer: "ROM"
  },
  {
    question: "What is the function of an ALU?",
    options: ["Store data", "Perform arithmetic and logic operations", "Manage memory", "Control input/output devices"],
    answer: "Perform arithmetic and logic operations"
  },
  {
    question: "Which component manages communication between hardware and software?",
    options: ["ALU", "Operating System", "Compiler", "BIOS"],
    answer: "Operating System"
  },
  {
    question: "Which of these is NOT an input device?",
    options: ["Mouse", "Keyboard", "Monitor", "Scanner"],
    answer: "Monitor"
  }
];

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

function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      lockOptions(); // disable choices
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
}

loadQuestion();
