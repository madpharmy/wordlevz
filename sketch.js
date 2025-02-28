// Global variables
let playerName = '';
let gameStarted = false;
let startTime = 0;
let totalTime = 0;
let inputField;
let startButton;
let finishButton;

// Check if cookies are enabled
function areCookiesEnabled() {
    try {
        document.cookie = 'testcookie';
        return document.cookie.indexOf('testcookie') !== -1;
    } catch (e) {
        return false;
    }
}

// Get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Set cookie value with expiration
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
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

    // Load saved data from cookies
    if (areCookiesEnabled()) {
        const savedName = getCookie('playerName');
        const savedGameStarted = getCookie('gameStarted');
        const savedStartTime = getCookie('startTime');

        if (savedName) {
            playerName = savedName;
            inputField.value(playerName); // Show saved name in input
        }
        if (savedGameStarted === 'true') {
            gameStarted = true;
            startTime = parseFloat(savedStartTime) || 0;
            inputField.hide();
            startButton.hide();
            finishButton.show();
        }
    } else {
        console.log("Cookies are disabled. Game won’t remember state.");
    }
}

function draw() {
    background(220);
    if (!gameStarted) {
        text("Enter your name and click 'Start Game'", width / 2, height / 2 - 50);
    } else {
        let currentTime = (millis() - startTime) / 1000; // Time in seconds
        text(`Playing as ${playerName}`, width / 2, height / 2 - 50);
        text(`Time: ${currentTime.toFixed(2)} seconds`, width / 2, height / 2 - 30);
        text("Click 'Finish Game' when done", width / 2, height / 2 - 10);
    }
}

function startGame() {
    let name = inputField.value().trim();
    if (name) {
        playerName = name;
        gameStarted = true;
        startTime = millis();
        
        // Save to cookies
        setCookie('playerName', playerName, 7); // Save for 7 days
        setCookie('gameStarted', 'true', 7);
        setCookie('startTime', startTime, 7);

        inputField.hide();
        startButton.hide();
        finishButton.show();
    } else {
        text("Please enter a name.", width / 2, height / 2 + 50);
    }
}

function finishGame() {
    if (gameStarted) {
        let endTime = millis();
        totalTime = (endTime - startTime) / 1000; // Time in seconds

        // Reset game state
        gameStarted = false;
        setCookie('gameStarted', 'false', 7);

        finishButton.hide();
        startButton.show();
        inputField.show();
        inputField.value(''); // Clear input for next player

        // Display completion time
        text(`You finished in ${totalTime.toFixed(2)} seconds`, width / 2, height / 2);
    }
}
