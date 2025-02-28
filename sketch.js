// Global variables for the game
let playerName = '';
let gameStarted = false;
let startTime;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;

let targetWord = "FLAME"; // The word to guess (5 letters, uppercase)
let currentGuess = "";    // Current letters being typed by this player
let guesses = [];         // Array of past guesses for this player
let maxGuesses = 6;       // Maximum attempts allowed

// Simulated other players (shared via BroadcastChannel)
let otherPlayers = [];    // List of other players from BroadcastChannel
const broadcastChannel = new BroadcastChannel('wordleChannel'); // Channel for communication

function setup() {
  createCanvas(600, 600);  // Larger canvas for Wordle grid and player panel
  textAlign(CENTER, CENTER);
  textSize(32);            // Default text size for letters

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

  // Listen for messages from other tabs/windows via BroadcastChannel
  broadcastChannel.onmessage = (event) => {
    if (event.data.type === 'playerUpdate') {
      otherPlayers = event.data.players.filter(p => p.name !== playerName); // Exclude this player
    }
  };

  // Try to focus the canvas, but handle potential null
  try {
    document.getElementById('defaultCanvas').focus();
  } catch (e) {
    console.log("Canvas focus failed, but game should still work:", e);
  }
}

function draw() {
  background(220); // Light gray background

  if (!gameStarted && playerName === '') {
    fill(0);
    textSize(20); // Smaller text for initial prompt
    text('Enter your name and click "Start Game"', width / 2, height / 2 - 50);
  } else if (gameStarted) {
    drawWordleGrid();
    drawPlayersPanel();
    fill(0);
    textSize(20); // Smaller text for playing state
    text(`Playing as ${playerName}`, width / 2, 50);
    text('Type 5 letters, press Enter to guess', width / 2, 530);
    text('Press Backspace to delete', width / 2, 560);
  } else if (totalTime > 0) {
    fill(0);
    textSize(20); // Smaller text for finish state
    text(`${playerName}, you finished in ${totalTime.toFixed(2)} seconds!`, width / 2, height / 2 - 50);
    text('Enter a new name to play again', width / 2, height / 2 - 30);
  }
  textSize(32); // Restore for Wordle letters in grid
}

function drawWordleGrid() {
  for (let row = 0; row < maxGuesses; row++) {
    for (let col = 0; col < 5; col++) {
      let x = 50 + col * 70; // Position with spacing
      let y = 100 + row * 70; // Position with spacing

      if (row < guesses.length) {
        let guess = guesses[row];
        let feedback = checkGuess(guess);
        let color;
        if (feedback[col] === 'green') {
          color = [0, 255, 0]; // Green for correct position
        } else if (feedback[col] === 'yellow') {
          color = [255, 255, 0]; // Yellow for correct letter, wrong position
        } else {
          color = [120, 120, 120]; // Gray for incorrect letter
        }
        fill(color[0], color[1], color[2]);
        rect(x, y, 60, 60); // Draw tile
        fill(0); // Black text
        text(guess[col], x + 30, y + 30); // Center letter in tile
      } else if (row === guesses.length && col < currentGuess.length) {
        fill(255); // White for current guess
        rect(x, y, 60, 60);
        fill(0);
        text(currentGuess[col], x + 30, y + 30);
      } else {
        fill(200); // Light gray for empty tiles
        rect(x, y, 60, 60);
      }
    }
  }
}

function drawPlayersPanel() {
  fill(240); // Light gray box
  rect(400, 0, 200, 600); // Right panel for players
  fill(0); // Black text
  textSize(16); // Smaller text for player list

  for (let i = 0; i < otherPlayers.length; i++) {
    let player = otherPlayers[i];
    text(player.name, 450, 30 + i * 80); // Player name at top of box
    text(`Row: ${player.row}`, 450, 50 + i * 80); // Show their current row

    // Draw colored tiles for their guesses (no letters)
    for (let col = 0; col < 5; col++) {
      let x = 450 + col * 30; // Position tiles horizontally
      let y = 70 + i * 80;    // Position tiles vertically for each player
      let color;
      if (player.colors[col] === 'green') {
        color = [0, 255, 0]; // Green
      } else if (player.colors[col] === 'yellow') {
        color = [255, 255, 0]; // Yellow
      } else {
        color = [120, 120, 120]; // Gray
      }
      fill(color[0], color[1], color[2]);
      rect(x, y, 25, 25); // Smaller tiles for colors only
    }
  }
  textSize(32); // Restore for Wordle letters in grid
}

function keyPressed() {
  console.log("Key pressed:", key, "KeyCode:", keyCode); // Debug log
  if (gameStarted && !gameOver()) {
    // Handle typing letters (A-Z)
    if ((keyCode >= 65 && keyCode <= 90) && currentGuess.length < 5) { // A-Z keys
      currentGuess += String.fromCharCode(keyCode); // Add uppercase letter
    }
    // Handle Backspace to delete the last letter
    else if (keyCode === BACKSPACE && currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1); // Remove the last letter
    }
    // Handle Enter to submit a guess
    else if (keyCode === ENTER && currentGuess.length === 5) {
      guesses.push(currentGuess); // Submit guess
      broadcastPlayerUpdate(); // Broadcast this player's update
      if (currentGuess === targetWord || guesses.length === maxGuesses) {
        finishGame(); // End game if won or out of guesses
      }
      currentGuess = ""; // Reset current guess
    }
  }
}

function checkGuess(guess) {
  let feedback = Array(5).fill('gray');
  let targetLetters = targetWord.split('');

  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      feedback[i] = 'green';
      targetLetters[i] = null; // Mark as used
    }
  }

  for (let i = 0; i < 5; i++) {
    if (feedback[i] !== 'green') {
      let index = targetLetters.indexOf(guess[i]);
      if (index !== -1) {
        feedback[i] = 'yellow';
        targetLetters[index] = null; // Mark as used
      }
    }
  }
  return feedback;
}

function gameOver() {
  return guesses.length === maxGuesses || guesses.includes(targetWord);
}

function broadcastPlayerUpdate() {
  let thisPlayer = { name: playerName, row: guesses.length + 1, colors: checkGuess(guesses[guesses.length - 1] || Array(5).fill('')) };
  let players = [thisPlayer, ...otherPlayers.filter(p => p.name !== playerName)]; // Include this player and others
  broadcastChannel.postMessage({ type: 'playerUpdate', players: players });
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
    guesses = []; // Reset guesses
    currentGuess = ""; // Reset current guess
    startTime = millis(); // Start timing
    broadcastPlayerUpdate(); // Add this player to the channel
    try {
      document.getElementById('defaultCanvas').focus();
    } catch (e) {
      console.log("Canvas focus failed, but game should still work:", e);
    }
  }
}

function finishGame() {
  if (gameStarted) {
    let endTime = millis();
    totalTime = (endTime - startTime) / 1000; // Time in seconds
    gameStarted = false;
    finishButton.hide();
    startButton.show();
    inputField.show();
    inputField.elt.focus(); // Ensure input field is ready for typing
    broadcastPlayerUpdate(); // Final update for this player
  }
}
