let socket;
let playerName = '';
let gameStarted = false;
let startTime;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;

let currentGuess = "";    // Current letters being typed
let guesses = [];         // Array of past guesses for this player
let maxGuesses = 6;       // Maximum attempts allowed
let otherPlayers = [];    // List of other players from the server

function setup() {
  createCanvas(600, 600);  // Larger canvas for Wordle grid and player panel
  textAlign(CENTER, CENTER);
  textSize(32);

  // Create input field for the player's name
  inputField = createInput('');
  inputField.position(150, 180);
  inputField.size(100, 20);

  // Create start button
  startButton = createButton('Start Game');
  startButton.position(165, 220);
  startButton.mousePressed(startGame);

  // Create finish button, initially hidden
  finishButton = createButton('Finish Game');
  finishButton.position(165, 220);
  finishButton.hide();
  finishButton.mousePressed(finishGame);

  // Connect to the server via WebSocket
  socket = new WebSocket('ws://localhost:3000');
  socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.playersUpdate) {
      otherPlayers = data.playersUpdate;
    }
  };
}

function draw() {
  background(220);

  if (!gameStarted && playerName === '') {
    fill(0);
    text('Enter your name and click "Start Game"', width / 2, height / 2 - 50);
  } else if (gameStarted) {
    drawWordleGrid();
    drawPlayersPanel();
    fill(0);
    text(`Playing as ${playerName}`, width / 2, 50);
    text('Type 5 letters, press Enter to guess', width / 2, 530);
    text('Press Backspace to delete', width / 2, 560);
  } else if (totalTime > 0) {
    fill(0);
    text(`${playerName}, you finished in ${totalTime.toFixed(2)} seconds!`, width / 2, height / 2 - 50);
    text('Enter a new name to play again', width / 2, height / 2 - 30);
  }
}

function drawWordleGrid() {
  for (let row = 0; row < maxGuesses; row++) {
    for (let col = 0; col < 5; col++) {
      let x = 50 + col * 70;
      let y = 100 + row * 70;

      if (row < guesses.length) {
        let guess = guesses[row];
        let feedback = checkGuess(guess);
        let color;
        if (feedback[col] === 'green') {
          color = [0, 255, 0];
        } else if (feedback[col] === 'yellow') {
          color = [255, 255, 0];
        } else {
          color = [120, 120, 120];
        }
        fill(color[0], color[1], color[2]);
        rect(x, y, 60, 60);
        fill(0);
        text(guess[col], x + 30, y + 30);
      } else if (row === guesses.length && col < currentGuess.length) {
        fill(255);
        rect(x, y, 60, 60);
        fill(0);
        text(currentGuess[col], x + 30, y + 30);
      } else {
        fill(200);
        rect(x, y, 60, 60);
      }
    }
  }
}

function drawPlayersPanel() {
  fill(240);
  rect(400, 0, 200, 600); // Right panel for players
  fill(0);
  textSize(16);

  for (let i = 0; i < otherPlayers.length; i++) {
    let player = otherPlayers.find(p => p.id !== socket.id) || otherPlayers[i];
    if (player.id === socket.id) continue; // Skip this player
    text(player.name, 450, 30 + i * 80);
    text(`Row: ${player.row}`, 450, 50 + i * 80);

    for (let col = 0; col < 5; col++) {
      let x = 450 + col * 30;
      let y = 70 + i * 80;
      let color;
      if (player.colors[col] === 'green') {
        color = [0, 255, 0];
      } else if (player.colors[col] === 'yellow') {
        color = [255, 255, 0];
      } else {
        color = [120, 120, 120];
      }
      fill(color[0], color[1], color[2]);
      rect(x, y, 25, 25); // Smaller tiles for colors only
    }
  }
  textSize(32);
}

function keyPressed() {
  if (gameStarted && !gameOver()) {
    if (key.match(/[a-z]/i) && currentGuess.length < 5) {
      currentGuess += key.toUpperCase();
    } else if (keyCode === BACKSPACE && currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1); // Delete last letter
    } else if (keyCode === ENTER && currentGuess.length === 5) {
      guesses.push(currentGuess);
      socket.send(JSON.stringify({ guess: currentGuess }));
      if (currentGuess === targetWord || guesses.length === maxGuesses) {
        finishGame();
      }
      currentGuess = "";
    }
  }
}

function checkGuess(guess) {
  let feedback = Array(5).fill('gray');
  let targetLetters = targetWord.split('');

  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      feedback[i] = 'green';
      targetLetters[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (feedback[i] !== 'green') {
      let index = targetLetters.indexOf(guess[i]);
      if (index !== -1) {
        feedback[i] = 'yellow';
        targetLetters[index] = null;
      }
    }
  }
  return feedback;
}

function gameOver() {
  return guesses.length === maxGuesses || guesses.includes(targetWord);
}

function startGame() {
  let name = inputField.value().trim();
  if (name !== '') {
    playerName = name;
    inputField.value('');
    inputField.hide();
    startButton.hide();
    finishButton.show();
    gameStarted = true;
    guesses = [];
    currentGuess = "";
    startTime = millis();
    socket.send(JSON.stringify({ join: playerName }));
  }
}

function finishGame() {
  if (gameStarted) {
    let endTime = millis();
    totalTime = (endTime - startTime) / 1000;
    gameStarted = false;
    finishButton.hide();
    startButton.show();
    inputField.show();
    inputField.elt.focus();
  }
}