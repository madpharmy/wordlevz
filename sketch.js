// Global variables
let playerName = '';
let gameStarted = false;
let startTime = 0;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;

// Word-guessing variables
let targetWord = "FLAME"; // Example 5-letter word
let currentGuess = "";
let guesses = [];
let currentRow = 0;
let maxRows = 6; // Max guess attempts

function setup() {
  createCanvas(400, 600);
  textAlign(CENTER, CENTER);
  textSize(20);

  // Input field for player name
  inputField = createInput('');
  inputField.position(150, 180);
  inputField.size(100, 20);

  // Start button
  startButton = createButton('Start Game');
  startButton.position(165, 220);
  startButton.mousePressed(startGame);

  // Finish button (hidden initially)
  finishButton = createButton('Finish Game');
  finishButton.position(165, 220);
  finishButton.hide();
  finishButton.mousePressed(finishGame);
}

function draw() {
  background(220); // Light gray background
  if (!gameStarted) {
    text("Enter your name and click 'Start Game'", width / 2, height / 2 - 50);
  } else {
    drawGrid(); // Draw letter boxes
    if (currentRow >= maxRows) {
      text("Out of guesses! Word was: " + targetWord, width / 2, height - 50);
    } else if (guesses[currentRow - 1] === targetWord) {
      text("Correct! Click 'Finish Game'", width / 2, height - 50);
    } else {
      text("Type a 5-letter word", width / 2, height - 50);
    }
  }
}

// Draw the letter box grid
function drawGrid() {
  let boxSize = 50;
  let spacing = 10;
  let startX = (width - (5 * boxSize + 4 * spacing)) / 2;
  let startY = 100;

  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < 5; col++) {
      let x = startX + col * (boxSize + spacing);
      let y = startY + row * (boxSize + spacing);
      if (row < currentRow) {
        let guess = guesses[row];
        let feedback = getFeedback(guess);
        fill(feedback[col]);
        rect(x, y, boxSize, boxSize);
        fill(0);
        text(guess[col], x + boxSize / 2, y + boxSize / 2);
      } else if (row === currentRow && col < currentGuess.length) {
        fill(255); // White for current guess
        rect(x, y, boxSize, boxSize);
        fill(0);
        text(currentGuess[col], x + boxSize / 2, y + boxSize / 2);
      } else {
        fill(200); // Gray for empty boxes
        rect(x, y, boxSize, boxSize);
      }
    }
  }
}

// Provide feedback on guesses
function getFeedback(guess) {
  let feedback = [];
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      feedback.push(color(0, 255, 0)); // Green for correct position
    } else if (targetWord.includes(guess[i])) {
      feedback.push(color(255, 255, 0)); // Yellow for wrong position
    } else {
      feedback.push(color(120)); // Gray for not in word
    }
  }
  return feedback;
}

// Handle keyboard input
function keyPressed() {
  if (gameStarted && currentRow < maxRows) {
    if (keyCode >= 65 && keyCode <= 90 && currentGuess.length < 5) { // A-Z
      currentGuess += key.toUpperCase();
    } else if (keyCode === BACKSPACE && currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
    } else if (keyCode === ENTER && currentGuess.length === 5) {
      guesses.push(currentGuess);
      if (currentGuess === targetWord || currentRow + 1 >= maxRows) {
        finishButton.show(); // Show when correct or out of guesses
      }
      currentRow++;
      currentGuess = "";
    }
  }
}

function startGame() {
  let name = inputField.value().trim();
  if (name) {
    playerName = name;
    inputField.value('');
    inputField.hide();
    startButton.hide();
    finishButton.hide(); // Ensure hidden at start
    gameStarted = true;
    guesses = [];
    currentGuess = "";
    currentRow = 0;
    startTime = millis();
  }
}

function finishGame() {
  totalTime = (millis() - startTime) / 1000; // Time in seconds
  gameStarted = false;
  finishButton.hide();
  startButton.show();
  inputField.show();
  alert(`Nice job, ${playerName}! Time: ${totalTime.toFixed(2)} seconds`);
}
