// define the time limit
let TIME_LIMIT = 60;

// define quotes to be used
let quotes_array = [
  "Learning never exhausts the mind.",
  "Push yourself, because no one else is going to do it for you.",
  "Failure is the condiment that gives success its flavor.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It's going to be hard, but hard does not mean impossible.",
  "The only way to do great work is to love what you do.",
];

// selecting required elements
let timer_text = document.querySelector(".curr_time");
let accuracy_text = document.querySelector(".curr_accuracy");
let error_text = document.querySelector(".curr_errors");
let cpm_text = document.querySelector(".curr_cpm");
let wpm_text = document.querySelector(".curr_wpm");
let quote_text = document.querySelector(".quote");
let input_area = document.querySelector(".input_area");
let restart_btn = document.querySelector(".restart_btn");
let cpm_group = document.querySelector(".cpm");
let wpm_group = document.querySelector(".wpm");
let error_group = document.querySelector(".errors");
let accuracy_group = document.querySelector(".accuracy");

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0; // errors from completed quotes
let errors = 0; // live errors in the current quote
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;

// load a new quote
function updateQuote() {
  quote_text.textContent = "";
  current_quote = quotes_array[quoteNo];

  // split quote into characters
  current_quote.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.textContent = char; // safer than innerText for spaces
    quote_text.appendChild(charSpan);
  });

  // move to next quote or loop
  quoteNo = (quoteNo + 1) % quotes_array.length;
  //(0+1) % 5
}

// process the current input (FREE MODE)
function processCurrentText() {
  const curr_input = input_area.value;
  const curr_input_array = curr_input.split("");

  characterTyped++;

  // recompute live errors from scratch for this quote
  errors = 0;

  const quoteSpanArray = quote_text.querySelectorAll("span");
  quoteSpanArray.forEach((char, index) => {
    const typedChar = curr_input_array[index];

    if (typedChar == null) {
      char.classList.remove("correct_char", "incorrect_char");
    } else if (typedChar === char.textContent) {
      char.classList.add("correct_char");
      char.classList.remove("incorrect_char");
    } else {
      char.classList.add("incorrect_char");
      char.classList.remove("correct_char");
      errors++;
    }
  });

  // live error display = past completed errors + current quote errors
  error_text.textContent = total_errors + errors;

  // live accuracy
  const correctCharacters = characterTyped - (total_errors + errors);
  const accuracyVal =
    characterTyped > 0 ? (correctCharacters / characterTyped) * 100 : 0;
  accuracy_text.textContent = Math.max(0, Math.round(accuracyVal));

  // if current quote completed
  if (curr_input.length === current_quote.length) {
    // lock in this quote's errors ONCE
    total_errors += errors;

    // finalize display for a moment (no carry-over)
    error_text.textContent = total_errors;

    // prepare next quote
    errors = 0; // <<< important: reset live errors for next quote
    input_area.value = "";
    updateQuote();
  }
}

// start the game
function startGame() {
  resetValues();
  updateQuote();

  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}
// reset everything
function resetValues() {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  total_errors = 0;
  accuracy = 0;
  characterTyped = 0;
  quoteNo = 0;
  input_area.disabled = false;

  input_area.value = "";
  quote_text.textContent = "Click on the area below to start the game.";
  accuracy_text.textContent = 100;
  timer_text.textContent = timeLeft + "s";
  error_text.textContent = 0;
  restart_btn.style.display = "none";
  cpm_group.style.display = "none";
  wpm_group.style.display = "none";
}

// update timer each second
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeElapsed++;
    timer_text.textContent = timeLeft + "s";
  } else {
    finishGame();
  }
}

// finish the game
function finishGame() {
  clearInterval(timer);
  input_area.disabled = true;
  quote_text.textContent = "Click restart to play again.";

  restart_btn.style.display = "block";

  const correctCharacters = characterTyped - total_errors;

  const cpm = Math.round((correctCharacters / timeElapsed) * 60);
  const wpm = Math.round((correctCharacters / 5 / timeElapsed) * 60);

  cpm_text.textContent = isFinite(cpm) ? cpm : 0;
  wpm_text.textContent = isFinite(wpm) ? wpm : 0;

  cpm_group.style.display = "block";
  wpm_group.style.display = "block";
}

// initialize with first quote (optional: you can call startGame on button click instead)
updateQuote();