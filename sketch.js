let playerName = '';
let gameStarted = false;
let startTime;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;
let displayMessage = '';
let showingMessage = false;

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(20);

  // Create input field for player name
  inputField = createInput('');
  inputField.position(150, 180);
  inputField.size(100, 20);

  // Create start button
  startButton = createButton('Start Game');
  startButton.position(165, 220);
  startButton.mousePressed(startGame);

  // Create finish button, hidden initially
  finishButton = createButton('Finish Game');
  finishButton.position(165, 220);
  finishButton.hide();
  finishButton.mousePressed(finishGame);
}

function draw() {
  background(220);
  if (!gameStarted) {
    if (showingMessage) {
      // Show the completion time or cooldown message
      text(displayMessage, width / 2, height / 2);
    } else {
      // Initial prompt
      text("Enter your name and click 'Start Game'", width / 2, height / 2 - 50);
    }
  } else {
    // Game in progress
    text(`Playing as ${playerName}`, width / 2, height / 2 - 50);
    text("Click 'Finish Game' when done", width / 2, height / 2 - 30);
  }
}

// Helper function to get player data from localStorage
function getPlayerData() {
  try {
    return JSON.parse(localStorage.getItem('playerData')) || {};
  } catch (e) {
    console.log("Cannot access localStorage:", e);
    return {}; // Fallback to empty object if storage is unavailable
  }
}

// Helper function to save player data to localStorage
function setPlayerData(data) {
  try {
    localStorage.setItem('playerData', JSON.stringify(data));
  } catch (e) {
    console.log("Cannot write to localStorage:", e);
  }
}

function startGame() {
  let name = inputField.value().trim();
  if (name) {
    let playerData = getPlayerData();
    
    // Check if this player has played recently
    if (playerData[name]) {
      let lastPlayed = playerData[name].lastPlayed;
      let now = Date.now();
      let oneHour = 3600000; // 1 hour in milliseconds
      if (now - lastPlayed < oneHour) {
        // Player is within cooldown period
        let timeRemaining = (oneHour - (now - lastPlayed)) / 60000; // Convert to minutes
        displayMessage = `You can play again in ${timeRemaining.toFixed(0)} minutes. Your previous time: ${playerData[name].completionTime.toFixed(2)} seconds`;
        showingMessage = true;
        return; // Prevent the game from starting
      }
    }

    // Start the game if no cooldown restriction applies
    playerName = name;
    gameStarted = true;
    showingMessage = false;
    totalTime = 0; // Reset totalTime
    startTime = millis();
    inputField.hide();
    startButton.hide();
    finishButton.show();
  }
}

function finishGame() {
  let endTime = millis();
  totalTime = (endTime - startTime) / 1000; // Calculate time in seconds
  
  // Update player data with completion time and timestamp
  let playerData = getPlayerData();
  playerData[playerName] = {
    lastPlayed: Date.now(),
    completionTime: totalTime
  };
  setPlayerData(playerData);

  // Reset game state and display only the completion time
  gameStarted = false;
  finishButton.hide();
  startButton.show();
  inputField.show();
  displayMessage = `${totalTime.toFixed(2)} seconds`; // Show only the time
  showingMessage = true;
}
