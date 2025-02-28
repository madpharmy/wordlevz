let startButton, finishButton, inputField;
let playerName = '';
let gameStarted = false;
let currentGuess = '';
const wordLength = 5;
const targetWord = 'FLAME';  // Replace with your target word

function setup() {
  createCanvas(400, 400);
  inputField = createInput('');
  inputField.position(165, 180);
  startButton = createButton('Start Game');
  startButton.position(165, 220);
  startButton.mousePressed(startGame);
  finishButton = createButton('Finish Game');
  finishButton.position(165, 220);
  finishButton.hide();
  finishButton.mousePressed(finishGame);
}

function draw() {
  background(220);
  if (gameStarted) {
    text(`Playing as ${playerName}`, 50, 50);
    text(`Current guess: ${currentGuess}`, 50, 100);
    text("Click 'Finish Game' when done", 50, 150);
  } else {
    text("Enter your name and click 'Start Game'", 50, 50);
  }
}

function startGame() {
  playerName = inputField.value().trim();
  if (playerName) {
    gameStarted = true;
    inputField.hide();
    startButton.hide();
    finishButton.show();
    let canvas = select('canvas');
    canvas.elt.focus();
  }
}

function finishGame() {
  gameStarted = false;
  finishButton.hide();
  startButton.show();
  inputField.show();
  inputField.value('');
}

function keyPressed() {
  if (gameStarted) {
    if (key.match(/[a-z]/i) && currentGuess.length < wordLength) {
      currentGuess += key.toUpperCase();
    } else if (keyCode === BACKSPACE && currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
    } else if (keyCode === ENTER && currentGuess.length === wordLength) {
      checkGuess(currentGuess);
      currentGuess = '';
    }
  }
}

function checkGuess(guess) {
  if (guess === targetWord) {
    console.log("Correct! You guessed the word: " + targetWord);
    finishGame();
  } else {
    console.log("Incorrect guess: " + guess);
  }
}
