let startButton, finishButton, inputField;
let gameStarted = false;
let playerName = '';
let startTime, totalTime;

function setup() {
  createCanvas(400, 400);
  
  // Initialize DOM elements
  inputField = createInput('');
  inputField.position(165, 180);
  
  startButton = createButton('Start Game');
  startButton.position(165, 220);
  startButton.mousePressed(startGame);
  
  finishButton = createButton('Finish Game');
  finishButton.position(165, 220);
  finishButton.mousePressed(finishGame);
  finishButton.hide(); // Safe now
}

function draw() {
  background(220); // Gray background
  textAlign(CENTER);
  
  if (!gameStarted && !startTime) {
    text("Enter your name and click 'Start Game'", width / 2, height / 2 - 50);
  } else if (gameStarted) {
    text(`Playing as ${playerName}`, width / 2, height / 2 - 50);
    text("Click 'Finish Game' when done", width / 2, height / 2);
  } else if (totalTime) {
    text(`${playerName}, you finished in ${totalTime.toFixed(2)} seconds`, width / 2, height / 2 - 50);
    text("Enter a new name to play again", width / 2, height / 2);
  }
}

function startGame() {
  playerName = inputField.value() || '';
  inputField.value('');
  inputField.hide();
  startButton.hide();
  finishButton.show();
  totalTime = 0;
  startTime = millis();
  gameStarted = true;
}

function finishGame() {
  if (gameStarted) {
    let endTime = millis();
    totalTime = (endTime - startTime) / 1000;
    finishButton.hide();
    startButton.show();
    inputField.show();
    gameStarted = false;
    startTime = null;
  }
}
