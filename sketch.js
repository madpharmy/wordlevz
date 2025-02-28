let players = [];
let currentPlayer = null;
let squaresSolved = 0;
let gameStarted = false;
let gameFinished = false;
let startTime, totalTime;
let startButton, finishButton, inputField;

function setup() {
  createCanvas(600, 400); // Adjust size as needed
  inputField = createInput("Enter your name");
  inputField.position(165, 180);
  startButton = createButton("Start Game");
  startButton.position(165, 220);
  startButton.mousePressed(startGame);
  finishButton = createButton("Finish Game");
  finishButton.position(165, 220);
  finishButton.mousePressed(finishGame);
  finishButton.hide();
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(0);
  if (!gameStarted && !gameFinished) {
    text("Click 'Start Game'", width / 2, height / 2 - 50);
  } else if (gameStarted) {
    text(`Playing as ${currentPlayer.name}`, width / 2, height / 2 - 50);
    text("Click 'Finish Game' when done", width / 2, height / 2);
  } else if (gameFinished) {
    text(`Finished! ${currentPlayer.name} took ${totalTime.toFixed(2)} seconds`, width / 2, height / 2 - 50);
    text("Enter a new name to play again", width / 2, height / 2);
  }

  let boxWidth = 200;
  let boxX = width - boxWidth - 20;
  let boxY = 20;
  let boxHeight = 20 + players.length * 30;
  fill(255);
  stroke(255, 165, 0);
  strokeWeight(2);
  rect(boxX, boxY, boxWidth, boxHeight);
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Players Playing:", boxX + 10, boxY + 10);
  for (let i = 0; i < players.length; i++) {
    text(`${players[i].name}: ${players[i].squares} squares`, boxX + 10, boxY + 30 + i * 20);
  }
}

function keyPressed() {
  if (gameStarted && !gameFinished) {
    if (key === 'a') {
      squaresSolved++;
    }
  }
}

function startGame() {
  let playerName = inputField.value();
  currentPlayer = players.find(p => p.name === playerName);
  if (!currentPlayer) {
    currentPlayer = { name: playerName, squares: 0 };
    players.push(currentPlayer);
  }
  squaresSolved = currentPlayer.squares;
  gameStarted = true;
  gameFinished = false;
  startTime = millis();
  inputField.hide();
  startButton.hide();
  finishButton.show();
}

function finishGame() {
  currentPlayer.squares = squaresSolved;
  totalTime = (millis() - startTime) / 1000;
  gameStarted = false;
  gameFinished = true;
  finishButton.hide();
  startButton.show();
  inputField.show();
}
