// Global variables
let playerName = '';
let gameStarted = false;
let startTime;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;
let displayMessage = '';
let showingMessage = false;

// Leaderboard variables
let leaderBoard = [];
const MAX_LEADERS = 5; // Show top 5 players

// Sample list of valid English words (uppercase for consistency)
const validWords = ["FLAME", "APPLE", "BREAD", "CLOUD", "GRASS", "STONE"];

// Check if localStorage is available
function isStorageAvailable() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

// Load leaderboard from localStorage if available
function loadLeaderBoard() {
    if (isStorageAvailable()) {
        const data = localStorage.getItem('leaderBoard');
        if (data) {
            leaderBoard = JSON.parse(data);
        }
    }
}

// Save leaderboard to localStorage if available
function saveLeaderBoard() {
    if (isStorageAvailable()) {
        localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard));
    }
}

// Add player to leaderboard and sort
function addToLeaderBoard(name, time) {
    leaderBoard.push({ name, time });
    leaderBoard.sort((a, b) => a.time - b.time); // Sort by time (ascending)
    if (leaderBoard.length > MAX_LEADERS) {
        leaderBoard = leaderBoard.slice(0, MAX_LEADERS); // Keep top 5
    }
    saveLeaderBoard();
}

// Validate input as a real English word
function isValidWord(word) {
    return validWords.includes(word.toUpperCase());
}

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

    // Create finish button (hidden initially)
    finishButton = createButton('Finish Game');
    finishButton.position(165, 220);
    finishButton.hide();
    finishButton.mousePressed(finishGame);

    // Load leaderboard if available
    loadLeaderBoard();
}

function draw() {
    background(220);
    if (!gameStarted) {
        if (showingMessage) {
            text(displayMessage, width / 2, height / 2);
        } else {
            text("Enter a word as your name and click 'Start Game'", width / 2, height / 2 - 50);
        }
    } else {
        text(`Playing as ${playerName}`, width / 2, height / 2 - 50);
        text("Click 'Finish Game' when done", width / 2, height / 2 - 30);
    }
}

function startGame() {
    let name = inputField.value().trim();
    if (name) {
        // Validate the input as a real word
        if (!isValidWord(name)) {
            displayMessage = `'${name}' is not a valid English word. Try again.`;
            showingMessage = true;
            return;
        }

        playerName = name;
        gameStarted = true;
        showingMessage = false;
        totalTime = 0;
        startTime = millis();
        inputField.hide();
        startButton.hide();
        finishButton.show();
    } else {
        displayMessage = "Please enter a name.";
        showingMessage = true;
    }
}

function finishGame() {
    if (gameStarted) {
        let endTime = millis();
        totalTime = (endTime - startTime) / 1000; // Time in seconds

        // Add to leaderboard
        addToLeaderBoard(playerName, totalTime);

        // Reset game state
        gameStarted = false;
        finishButton.hide();
        startButton.show();
        inputField.show();
        inputField.value(''); // Clear input field

        // Display completion time and leaderboard
        displayMessage = `Your time: ${totalTime.toFixed(2)} seconds\n\nLeader Board:\n`;
        leaderBoard.forEach((player, index) => {
            displayMessage += `${index + 1}. ${player.name}: ${player.time.toFixed(2)} seconds\n`;
        });
        showingMessage = true;
    }
}
