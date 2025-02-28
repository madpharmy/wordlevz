let startButton, finishButton, inputField, playerName, totalTime, startTime, gameStarted = false;

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
}

function draw() {
  background(220);
  fill(0);
  textAlign(CENTER);
  if (!gameStarted) {
    text("Enter your name and click 'Start Game'", width/2, height/2 - 50);
  } else {
    text("Playing as " + playerName, width/2, height/2 - 50);
  }
}

function startGame() {
  playerName = inputField.value();
  if (playerName !== '') {
    inputField.hide();
    startButton.hide();
    finishButton.show();
    totalTime = 0;
    startTime = millis();
    gameStarted = true;
  }
}

function finishGame() {
  if (gameStarted) {
    totalTime = (millis() - startTime) / 1000;
    gameStarted = false;
    finishButton.hide();
    startButton.show();
    inputField.show();
  }
}
