
"use strict";

// =====================================
// CHEMLAB - KIMYOVIY TENGLASHTIRISH
// =====================================

const $ = id => document.getElementById(id);

// Reaksiyalar bazasi
// coefficients: to'g'ri eng kichik butun koeffitsiyentlar

const reactions = [
  {
    name: "Vodorod va kislorod",
    difficulty: "OSON",
    terms: [
      { formula: "H<sub>2</sub>", atoms: { H: 2 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } },
      { formula: "H<sub>2</sub>O", atoms: { H: 2, O: 1 } }
    ],
    signs: ["+", "→"],
    answer: [2, 1, 2],
    hint: "Suv hosil bo‘lish reaksiyasida avval kislorod atomlarini tenglashtiring."
  },
  {
    name: "Azot va vodorod",
    difficulty: "O‘RTA",
    terms: [
      { formula: "N<sub>2</sub>", atoms: { N: 2 } },
      { formula: "H<sub>2</sub>", atoms: { H: 2 } },
      { formula: "NH<sub>3</sub>", atoms: { N: 1, H: 3 } }
    ],
    signs: ["+", "→"],
    answer: [1, 3, 2],
    hint: "Ammiak tarkibida 1 ta azot va 3 ta vodorod atomi bor."
  },
  {
    name: "Uglerod yonishi",
    difficulty: "OSON",
    terms: [
      { formula: "C", atoms: { C: 1 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } },
      { formula: "CO<sub>2</sub>", atoms: { C: 1, O: 2 } }
    ],
    signs: ["+", "→"],
    answer: [1, 1, 1],
    hint: "CO₂ tarkibida 1 ta uglerod va 2 ta kislorod atomi bor."
  },
  {
    name: "Magniy yonishi",
    difficulty: "O‘RTA",
    terms: [
      { formula: "Mg", atoms: { Mg: 1 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } },
      { formula: "MgO", atoms: { Mg: 1, O: 1 } }
    ],
    signs: ["+", "→"],
    answer: [2, 1, 2],
    hint: "O‘ng tomonda kislorod atomlari sonini 2 taga yetkazing."
  },
  {
    name: "Kaliy xlorat parchalanishi",
    difficulty: "MURAKKAB",
    terms: [
      { formula: "KClO<sub>3</sub>", atoms: { K: 1, Cl: 1, O: 3 } },
      { formula: "KCl", atoms: { K: 1, Cl: 1 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } }
    ],
    signs: ["→", "+"],
    answer: [2, 2, 3],
    hint: "KClO₃ dagi 6 ta kislorod atomini o‘ng tomonda 3O₂ bilan tenglashtiring."
  },
  {
    name: "Temir va kislorod",
    difficulty: "O‘RTA",
    terms: [
      { formula: "Fe", atoms: { Fe: 1 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } },
      { formula: "Fe<sub>2</sub>O<sub>3</sub>", atoms: { Fe: 2, O: 3 } }
    ],
    signs: ["+", "→"],
    answer: [4, 3, 2],
    hint: "Fe₂O₃ da 2 ta temir va 3 ta kislorod atomi mavjud."
  },
  {
    name: "Metan yonishi",
    difficulty: "MURAKKAB",
    terms: [
      { formula: "CH<sub>4</sub>", atoms: { C: 1, H: 4 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } },
      { formula: "CO<sub>2</sub>", atoms: { C: 1, O: 2 } },
      { formula: "H<sub>2</sub>O", atoms: { H: 2, O: 1 } }
    ],
    signs: ["+", "→", "+"],
    answer: [1, 2, 1, 2],
    hint: "Avval uglerod, keyin vodorod va oxirida kislorodni tenglashtiring."
  },
  {
    name: "Alyuminiy oksid hosil bo‘lishi",
    difficulty: "MURAKKAB",
    terms: [
      { formula: "Al", atoms: { Al: 1 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } },
      { formula: "Al<sub>2</sub>O<sub>3</sub>", atoms: { Al: 2, O: 3 } }
    ],
    signs: ["+", "→"],
    answer: [4, 3, 2],
    hint: "O‘ng tomonda 6 ta kislorod atomi bo‘lishi uchun 2Al₂O₃ kerak."
  },
  {
    name: "Natriy va xlor",
    difficulty: "O‘RTA",
    terms: [
      { formula: "Na", atoms: { Na: 1 } },
      { formula: "Cl<sub>2</sub>", atoms: { Cl: 2 } },
      { formula: "NaCl", atoms: { Na: 1, Cl: 1 } }
    ],
    signs: ["+", "→"],
    answer: [2, 1, 2],
    hint: "Cl₂ molekulasida 2 ta xlor atomi bor."
  },
  {
    name: "Fosfor yonishi",
    difficulty: "MURAKKAB",
    terms: [
      { formula: "P", atoms: { P: 1 } },
      { formula: "O<sub>2</sub>", atoms: { O: 2 } },
      { formula: "P<sub>2</sub>O<sub>5</sub>", atoms: { P: 2, O: 5 } }
    ],
    signs: ["+", "→"],
    answer: [4, 5, 2],
    hint: "2P₂O₅ tarkibida 4 ta fosfor va 10 ta kislorod atomi bor."
  }
];

// O'yin holati
let score = 0;
let correctCount = 0;
let questionIndex = 0;
let timeLeft = 300;
let timerInterval = null;
let answered = false;
let soundEnabled = true;
let audioContext = null;
let hintUsed = false;
let gameFinished = false;

let record = Number(localStorage.getItem("chemlabRecord") || 0);

// =====================================
// REAKSIYANI EKRANGA CHIQARISH
// =====================================

function renderQuestion() {
  if (questionIndex >= reactions.length) {
    finishGame(true);
    return;
  }

  answered = false;
  hintUsed = false;

  const reaction = reactions[questionIndex];

  $("questionNumber").textContent =
    `TAJRIBA № ${String(questionIndex + 1).padStart(2, "0")}`;

  $("difficultyTag").textContent = reaction.difficulty;

  $("equation").innerHTML = "";

  reaction.terms.forEach((term, index) => {
    const part = document.createElement("div");
    part.className = "formula-part";

    const input = document.createElement("input");
    input.className = "coefficient";
    input.type = "number";
    input.min = "1";
    input.max = "99";
    input.value = "1";
    input.dataset.coeff = index;
    input.setAttribute("aria-label", `Koeffitsiyent ${index + 1}`);

    input.addEventListener("input", updateAtomCounts);

    const formula = document.createElement("span");
    formula.className = "formula";
    formula.innerHTML = term.formula;

    part.append(input, formula);
    $("equation").appendChild(part);

    if (index < reaction.signs.length) {
      const sign = document.createElement("span");
      sign.className =
        reaction.signs[index] === "→" ? "arrow" : "operator";
      sign.textContent = reaction.signs[index];
      $("equation").appendChild(sign);
    }
  });

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  $("nextBtn").disabled = true;
  $("nextBtn").textContent = "Keyingi tajriba →";

  $("questionProgress").textContent =
    `${questionIndex + 1} / ${reactions.length}`;

  $("totalQuestions").textContent = `${reactions.length} ta`;

  updateAtomCounts();
  updateProgress();
}

// =====================================
// ATOMLARNI HISOBLASH
// =====================================

function getCoefficients() {
  return [...document.querySelectorAll(".coefficient")].map(input => {
    const value = Number(input.value);

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      return null;
    }

    return value;
  });
}

function countAtoms(terms, coefficients, start, end) {
  const result = {};

  for (let i = start; i < end; i++) {
    const atoms = terms[i].atoms;
    const coefficient = coefficients[i];

    if (coefficient === null || coefficient === undefined) continue;

    for (const element in atoms) {
      result[element] =
        (result[element] || 0) + atoms[element] * coefficient;
    }
  }

  return result;
}

function formatAtoms(atoms) {
  const entries = Object.entries(atoms);

  if (!entries.length) return "—";

  return entries.map(([element, count]) =>
    `${element}: ${count}`
  ).join(" | ");
}

function updateAtomCounts() {
  if (questionIndex >= reactions.length) return;

  const reaction = reactions[questionIndex];
  const coefficients = getCoefficients();

  const middle = reaction.signs.indexOf("→");

  const left = countAtoms(
    reaction.terms,
    coefficients,
    0,
    middle
  );

  const right = countAtoms(
    reaction.terms,
    coefficients,
    middle,
    reaction.terms.length
  );

  $("leftAtoms").textContent = formatAtoms(left);
  $("rightAtoms").textContent = formatAtoms(right);

  const elements = new Set([
    ...Object.keys(left),
    ...Object.keys(right)
  ]);

  let balanced = coefficients.every(value => value !== null);

  for (const element of elements) {
    if ((left[element] || 0) !== (right[element] || 0)) {
      balanced = false;
    }
  }

  if (balanced && elements.size > 0) {
    $("balanceMessage").textContent = "⚖️ Atomlar soni teng!";
    $("balanceMessage").style.color = "var(--green)";
  } else {
    $("balanceMessage").textContent =
      "Koeffitsiyentlarni o‘zgartiring.";
    $("balanceMessage").style.color = "var(--muted)";
  }
}

// =====================================
// JAVOBNI TEKSHIRISH
// =====================================

function checkAnswer() {
  if (answered || gameFinished) return;

  const reaction = reactions[questionIndex];
  const values = getCoefficients();

  if (values.some(value => value === null)) {
    showFeedback(
      "Barcha kataklarga 1 dan 99 gacha butun son kiriting!",
      "error"
    );
    playSound(180);
    return;
  }

  const correct = values.every(
    (value, index) => value === reaction.answer[index]
  );

  if (!correct) {
    showFeedback(
      "Hali noto‘g‘ri. Atomlar sonini qayta tekshiring!",
      "error"
    );
    playSound(180);
    return;
  }

  answered = true;
  correctCount++;

  const points = hintUsed ? 5 : 10;
  score += points;

  saveRecord();
  updateStats();
  updateProgress();

  showFeedback(
    `Ajoyib! To‘g‘ri tenglashtirdingiz! +${points} ball`,
    "success"
  );

  $("nextBtn").disabled = false;

  if (questionIndex === reactions.length - 1) {
    $("nextBtn").textContent = "Natijani ko‘rish →";
  }

  $("balanceMessage").textContent = "✓ Reaksiya to‘liq tenglashtirildi!";
  $("balanceMessage").style.color = "var(--green)";

  document.querySelectorAll(".coefficient").forEach(input => {
    input.style.borderColor = "#6cf0ae";
  });

  playSound(850);
}

// =====================================
// YORDAM
// =====================================

function showHint() {
  if (answered || gameFinished) return;

  const reaction = reactions[questionIndex];

  hintUsed = true;

  showFeedback("💡 " + reaction.hint, "success");
  playSound(550);
}

// =====================================
// BALL VA REKORD
// =====================================

function saveRecord() {
  if (score > record) {
    record = score;
    localStorage.setItem("chemlabRecord", String(record));
  }
}

function updateStats() {
  $("score").textContent = score;
  $("record").textContent = record;
  $("correctCount").textContent = correctCount;
  $("reward").textContent = `${score} XP`;
}

function updateProgress() {
  const progress = (correctCount / reactions.length) * 100;

  $("progressFill").style.width = `${progress}%`;
  $("progressText").textContent =
    `${correctCount} / ${reactions.length} topshiriq`;

  $("level").textContent = Math.min(
    5,
    Math.floor(correctCount / 2) + 1
  );
}

// =====================================
// VAQT
// =====================================

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (gameFinished) return;

    timeLeft--;

    $("timer").textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      finishGame(false);
    }
  }, 1000);
}

// =====================================
// O'YIN NATIJASI
// =====================================

function finishGame(allCompleted) {
  if (gameFinished) return;

  gameFinished = true;
  clearInterval(timerInterval);

  saveRecord();
  updateStats();

  $("resultTitle").textContent =
    allCompleted ? "🏆 Ajoyib natija!" : "⏰ Vaqt tugadi!";

  $("resultText").textContent = allCompleted
    ? `Barcha ${reactions.length} ta reaksiyani bajardingiz!`
    : `${correctCount} ta reaksiyani to‘g‘ri tenglashtirdingiz.`;

  $("finalScore").textContent = score;

  $("resultModal").classList.add("show");
}

// =====================================
// MODALLAR
// =====================================

function openModal(id) {
  $(id).classList.add("show");
}

function closeModal(id) {
  $(id).classList.remove("show");
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    closeModal(button.dataset.close);
  });
});

// =====================================
// KEYINGI SAVOL
// =====================================

function nextQuestion() {
  if (!answered || gameFinished) return;

  questionIndex++;

  renderQuestion();
  playSound(650);
}

// =====================================
// QAYTA BOSHLASH
// =====================================

function restartGame() {
  clearInterval(timerInterval);

  score = 0;
  correctCount = 0;
  questionIndex = 0;
  timeLeft = 300;
  answered = false;
  hintUsed = false;
  gameFinished = false;

  $("timer").textContent = formatTime(timeLeft);

  closeModal("resultModal");

  updateStats();
  updateProgress();
  renderQuestion();
  startTimer();

  showToast("Yangi tajriba boshlandi!");
}

// =====================================
// OVOZ EFFEKTI
// =====================================

function playSound(frequency = 500) {
  if (!soundEnabled) return;

  try {
    audioContext = audioContext ||
      new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.09, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.22
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.22);
  } catch (error) {
    console.log("Ovoz ishlamadi:", error);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;

  $("soundBtn").textContent = soundEnabled ? "🔊" : "🔇";

  if (soundEnabled) playSound(500);
}

// =====================================
// XABAR
// =====================================

let toastTimeout;

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function showFeedback(message, type) {
  const feedback = $("feedback");

  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

// =====================================
// TUGMALAR
// =====================================

$("checkBtn").addEventListener("click", checkAnswer);
$("hintBtn").addEventListener("click", showHint);
$("nextBtn").addEventListener("click", nextQuestion);
$("helpBtn").addEventListener("click", () => openModal("helpModal"));
$("restartBtn").addEventListener("click", restartGame);
$("playAgainBtn").addEventListener("click", restartGame);
$("soundBtn").addEventListener("click", toggleSound);

// Enter tugmasi bilan tekshirish
document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    if (!$("resultModal").classList.contains("show")) {
      checkAnswer();
    }
  }
});

// =====================================
// O'YINNI BOSHLASH
// =====================================

function init() {
  $("record").textContent = record;
  $("timer").textContent = formatTime(timeLeft);

  updateStats();
  updateProgress();
  renderQuestion();
  startTimer();

  console.log("CHEMLAB muvaffaqiyatli ishga tushdi!");
}

init();
