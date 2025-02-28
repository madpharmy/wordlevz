// Global variables for the game
let playerName = '';
let gameStarted = false;
let startTime;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;

let targetWord = "FLAME"; // Define targetWord here as a global variable
let currentGuess = "";    // Current letters being typed by this player
let guesses = [];         // Array of past guesses for this player
let maxGuesses = 6;       // Maximum attempts allowed

// Simulated other players (shared via localStorage, with fallback)
let otherPlayers = JSON.parse(localStorage.getItem('wordlePlayers')) || [
  { name: "Alice", row: 1, colors: Array(5).fill('gray') }, // Initial state
  { name: "Bob", row: 1, colors: Array(5).fill('gray') }
];

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

  // Load other players from localStorage and listen for changes
  window.addEventListener('storage', updatePlayersFromStorage);
  updatePlayersFromStorage(); // Initial load

  // Focus the canvas initially (optional, but helps with key input)
  document.getElementById('defaultCanvas').focus();
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
    if (player.name === playerName) continue; // Skip this player
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
      updateOtherPlayers(); // Update other players' progress
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

function updateOtherPlayers() {
  // Update this player's progress in localStorage, handling potential storage errors
  try {
    let thisPlayer = { name: playerName, row: guesses.length + 1, colors: checkGuess(guesses[guesses.length - 1] || Array(5).fill('')) };
    otherPlayers = otherPlayers.filter(p => p.name !== playerName); // Remove old data for this player
    otherPlayers.push(thisPlayer); // Add updated data
    localStorage.setItem('wordlePlayers', JSON.stringify(otherPlayers)); // Save to localStorage
  } catch (e) {
    console.log("Storage access blocked, using local fallback:", e);
    // Fallback: Use an in-memory array if storage is blocked
    otherPlayers = otherPlayers.filter(p => p.name !== playerName);
    otherPlayers.push(thisPlayer);
  }
}

function updatePlayersFromStorage() {
  // Load other players from localStorage, with a fallback for errors
  try {
    let storedPlayers = JSON.parse(localStorage.getItem('wordlePlayers')) || [];
    otherPlayers = storedPlayers.filter(p => p.name !== playerName); // Exclude this player
  } catch (e) {
    console.log("Cannot access localStorage, using default players:", e);
    otherPlayers = [
      { name: "Alice", row: 1, colors: Array(5).fill('gray') },
      { name: "Bob", row: 1, colors: Array(5).fill('gray') }
    ];
  }
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
    updateOtherPlayers(); // Add this player to the list
    document.getElementById('defaultCanvas').focus(); // Focus the canvas for typing
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
    updateOtherPlayers(); // Final update for this player
  }
}
