// State management
let currentHex = "#1A1A1A";
let timerSeconds = 10;
let countdownInterval;

const hexLabel = document.getElementById("hex-label");
const countdownEl = document.getElementById("countdown");
const body = document.body;

/**
 * Generates a random hex color and updates the UI
 */
function randomizeColor() {
  const randomHex =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();

  currentHex = randomHex;
  body.style.backgroundColor = randomHex;
  hexLabel.innerText = randomHex;

  // Add visual feedback
  hexLabel.classList.add("pop");
  setTimeout(() => hexLabel.classList.remove("pop"), 2000);

  // Ensure text color remains readable (simple luminance check)
  updateTextColor(randomHex);
}

/**
 * Adjusts UI text color based on background brightness for contrast
 */
function updateTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  const color = luminance > 0.5 ? "#1a1a1a" : "#ffffff";
  document.documentElement.style.setProperty("--text-color", color);

  // Adjust glass effect for light backgrounds
  const glassBg =
    luminance > 0.5 ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)";
  const glassBorder =
    luminance > 0.5 ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)";
  document.documentElement.style.setProperty("--glass-bg", glassBg);
  document.documentElement.style.setProperty("--glass-border", glassBorder);
}

/**
 * Handles the countdown logic
 */
function updateTimer() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  countdownEl.innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  if (timerSeconds === 0) {
    randomizeColor();
    timerSeconds = 10;
  } else {
    timerSeconds--;
  }
}

/**
 * Resets the timer to its initial state
 */
function resetTimer() {
  timerSeconds = 10;
  updateTimer();
}

/**
 * Copies the current hex code to clipboard with visual feedback
 */
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(currentHex);
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  } catch (err) {
    console.error("Failed to copy color: ", err);
  }
}

// Event Listeners
document.getElementById("button").addEventListener("click", () => {
  randomizeColor();
  resetTimer();
});

document
  .getElementById("copybutton")
  .addEventListener("click", copyToClipboard);

// Initialization
function init() {
  randomizeColor();
  // Clear any existing interval before starting a new one
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateTimer, 1000);
}

init();
