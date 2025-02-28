// Global variables for game state
let playerName = '';
let gameStarted = false;
let startTime;
let totalTime = 0;
let inputField;     // For entering player name
let startButton;
let finishButton;

// Word-guessing game variables
let targetWord = "FLAME";  // The word to guess (5 letters, uppercase)
let guesses = [];          // Array of previous guesses
let currentGuess = "";     // Current letters being typed
let currentRow = 0;        // Current guess row (0 to 5)
let correctGuess = false;  // Flag for correct guess

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
  background(220);  // Light gray background
  if (!gameStarted) {
    text("Enter your name and click 'Start Game'", width / 2, height / 2 - 50);
  } else {
    drawGrid();  // Draw the letter boxes
    if (correctGuess) {
      text("Correct! Click 'Finish Game'", width / 2, height - 50);
    } else if (currentRow >= 6) {
      text("Out of guesses. The word was " + targetWord, width / 2, height - 50);
    } else {
      text("Type your guess", width / 2, height - 50);
    }
  }
}

// Draw the grid of letter boxes with feedback
function drawGrid() {
  let boxSize = 50;  // Size of each letter box
  let spacing = 10;  // Space between boxes
  let startX = (width - (5 * boxSize + 4 * spacing)) / 2;  // Center horizontally
  let startY = 100;  // Start 100 pixels from the top

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      let x = startX + col * (boxSize + spacing);
      let y = startY + row * (boxSize + spacing);
      if (row < currentRow) {
        // Draw previous guesses with feedback
        let guess = guesses[row];
        let feedback = getFeedback(guess);
        let color = feedback[col];
        if (color === "green") {
          fill(0, 255, 0);  // Correct letter, correct position
        } else if (color === "yellow") {
          fill(255, 255, 0);  // Correct letter, wrong position
        } else {
          fill(120);  // Incorrect letter
        }
        rect(x, y, boxSize, boxSize);
        fill(0);  // Black text
        text(guess[col], x + boxSize / 2, y + boxSize / 2);
      } else if (row === currentRow && col < currentGuess.length) {
        // Draw current guess
        fill(255);  // White background
        rect(x, y, boxSize, boxSize);
        fill(0);
        text(currentGuess[col], x + boxSize / 2, y + boxSize / 2);
      } else {
        // Draw empty boxes
        fill(200);  // Light gray
        rect(x, y, boxSize, boxSize);
      }
    }
  }
}

// Provide feedback for a guess (green, yellow, gray)
function getFeedback(guess) {
  let feedback = [];
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      feedback.push("green");
    } else if (targetWord.includes(guess[i])) {
      feedback.push("yellow");
    } else {
      feedback.push("gray");
    }
  }
  return feedback;
}

// Handle keyboard input for guesses
function keyPressed() {
  if (gameStarted && !correctGuess && currentRow < 6) {
    if ((keyCode >= 65 && keyCode <= 90) && currentGuess.length < 5) {  // A-Z
      currentGuess += key.toUpperCase();
    } else if (keyCode === BACKSPACE && currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
    } else if (keyCode === ENTER && currentGuess.length === 5) {
      guesses.push(currentGuess);
      if (currentGuess === targetWord) {
        correctGuess = true;
        finishButton.show();  // Show button when correct word is entered
      } else {
        currentRow++;
        if (currentRow >= 6) {
          finishButton.show();  // Show button if out of guesses
        }
      }
      currentGuess = "";
    }
  }
}

// Start the game
function startGame() {
  let name = inputField.value().trim();
  if (name) {
    playerName = name;
    inputField.value('');
    inputField.hide();
    startButton.hide();
    finishButton.hide();  // Hide finish button at start
    gameStarted = true;
    guesses = [];
    currentGuess = "";
    currentRow = 0;
    correctGuess = false;
    startTime = millis();
  }
}

// Finish the game and show results
function finishGame() {
  if (gameStarted) {
    let endTime = millis();
    totalTime = (endTime - startTime) / 1000;  // Time in seconds
    gameStarted = false;
    finishButton.hide();
    startButton.show();
    inputField.show();
    alert(`Finished in ${totalTime.toFixed(2)} seconds`);
  }
}
