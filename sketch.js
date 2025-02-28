// Global variables
let playerName = '';
let gameStarted = false;
let startTime;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;
const targetWord = "FLAME"; // Example target word (change as needed)
let guesses = [];
let tryCount = 0;
const maxTries = 6;

// Setup function: Initialize the game
function setup() {
  createCanvas(400, 600); // Create a canvas for the game
  textAlign(CENTER, CENTER);
  textSize(20);

  // Create input field for player name and guesses
  inputField = createInput('');
  inputField.position(150, 180);
  inputField.size(100, 20);

  // Create start button
  startButton = createButton('Start Game');
  startButton.position(165, 220);
  startButton.mousePressed(startGame);

  // Create finish button (hidden initially)
  finishButton = createButton('Finish Game');
  finishButton.position(165, 250);
  finishButton.hide();
  finishButton.mousePressed(finishGame);
}

// Draw function: Update the game display
function draw() {
  background(220); // Light gray background
  fill(0); // Black text

  if (!gameStarted) {
    text("Enter your name and click 'Start Game'", width / 2, height / 2 - 50);
  } else {
    text(`Playing as ${playerName}`, width / 2, 50);
    // Display guesses and feedback
    for (let i = 0; i < guesses.length; i++) {
      let feedback = getFeedback(guesses[i]);
      text(`${guesses[i]} - ${feedback}`, width / 2, 100 + i * 30);
    }
    if (tryCount < maxTries) {
      text("Enter a 5-letter word (press Enter)", width / 2, height - 50);
    } else {
      text(`Out of tries! The word was ${targetWord}`, width / 2, height - 50);
      finishButton.show();
    }
  }
}

// Start the game
function startGame() {
  playerName = inputField.value().trim();
  if (playerName.length > 0) { // Ensure a name is entered
    gameStarted = true;
    guesses = []; // Reset guesses
    tryCount = 0; // Reset try count
    startTime = millis(); // Start timing
    inputField.value(''); // Clear input
    startButton.hide(); // Hide start button
    finishButton.hide(); // Ensure finish button is hidden
  }
}

// Finish the game
function finishGame() {
  totalTime = (millis() - startTime) / 1000; // Calculate time in seconds
  gameStarted = false;
  alert(`Game over, ${playerName}! You took ${totalTime.toFixed(2)} seconds.`);
  startButton.show(); // Show start button again
  inputField.show(); // Show input field
}

// Handle guesses when Enter is pressed
function keyPressed() {
  if (gameStarted && keyCode === ENTER && tryCount < maxTries) {
    let guess = inputField.value().toUpperCase().trim();
    if (guess.length === 5) { // Ensure guess is 5 letters
      guesses.push(guess);
      tryCount++;
      inputField.value(''); // Clear input
      if (guess === targetWord) { // Check if guess is correct
        finishButton.show();
      }
    } else {
      alert("Please enter a 5-letter word!");
    }
  }
}

// Provide feedback on guesses
function getFeedback(guess) {
  let feedback = "";
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      feedback += "🟩"; // Correct letter, correct position
    } else if (targetWord.includes(guess[i])) {
      feedback += "🟨"; // Correct letter, wrong position
    } else {
      feedback += "⬜"; // Incorrect letter
    }
  }
  return feedback;
}
