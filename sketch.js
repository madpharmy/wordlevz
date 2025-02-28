let inputField, startButton, finishButton;
let gameStarted = false;
let playerName = '';
let startTime, totalTime;

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
  fill(0);
  textAlign(CENTER, CENTER);
  if (!gameStarted && isNaN(totalTime)) {
    text('Click "Start Game"', width / 2, height / 2 - 50);
  } else if (gameStarted) {
    text(`Playing as ${playerName}`, width / 2, height / 2 - 50);
    text("Click 'Finish Game' when done", width / 2, height / 2 + 20);
  } else {
    text(`${playerName} finished in ${totalTime} seconds`, width / 2, height / 2 - 50);
    text('Enter a new name to play again', width / 2, height / 2 + 20);
  }
}

function startGame() {
  let name = inputField.value();
  if (name) {
    playerName = name;
    inputField.value('');
    startButton.hide();
    finishButton.show();
    totalTime = 0;
    startTime = millis();
    gameStarted = true;
  }
}

function finishGame() {
  let endTime = millis();
  totalTime = (endTime - startTime) / 1000; // Convert to seconds
  gameStarted = false;
  finishButton.hide();
  startButton.show();
  inputField.show();
}
