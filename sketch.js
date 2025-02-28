let inputField, startButton, finishButton;
let playerName = '';
let gameStarted = false;
let startTime, totalTime;

function setup() {
  createCanvas(400, 400);
  inputField = createInput('');
  inputField.position(150, 180);
  startButton = createButton('Start Game');
  startButton.position(165, 220);
  startButton.mousePressed(startGame);
  finishButton = createButton('Finish Game');
  finishButton.position(165, 220);
  finishButton.hide();
  finishButton.mousePressed(finishGame);
}

function draw() {
  background(220); // Light gray
  textAlign(CENTER);
  if (!gameStarted) {
    text("Enter your name and click 'Start Game'", width / 2, height / 2 - 50);
  } else if (totalTime === 0) {
    text(`Playing as ${playerName}`, width / 2, height / 2 - 50);
    text("Click 'Finish Game' when done", width / 2, height / 2 - 30);
  } else {
    text(`Finished! Time: ${(totalTime / 1000).toFixed(2)} sec`, width / 2, height / 2);
  }
}

function startGame() {
  if (inputField) {
    let name = inputField.value();
    if (name) {
      playerName = name;
      inputField.value('');
      inputField.hide();
      startButton.hide();
      finishButton.show();
      startTime = millis();
      gameStarted = true;
    }
  }
}

function finishGame() {
  totalTime = millis() - startTime;
  finishButton.hide();
  inputField.show();
  startButton.show();
  gameStarted = false;
}

function keyPressed() {
  console.log("Key pressed:", key, "KeyCode:", keyCode);
  if (keyCode === ENTER && !gameStarted) {
    startGame();
  }
}
