let startButton, finishButton, inputField;
let playerName = '';
let startTime = 0;
let totalTime = 0;
let gameStarted = false;

function setup() {
    createCanvas(400, 400);
    startButton = createButton('Start Game');
    startButton.position(165, 220);
    startButton.mousePressed(startGame);
    finishButton = createButton('Finish Game');
    finishButton.position(165, 220);
    finishButton.hide();
    finishButton.mousePressed(finishGame);
    inputField = createInput('');

    // Load saved data
    playerName = localStorage.getItem('playerName') || '';
    startTime = parseFloat(localStorage.getItem('startTime')) || 0;
    gameStarted = localStorage.getItem('gameStarted') === 'true';

    if (gameStarted) {
        startButton.hide();
        finishButton.show();
    } else {
        startButton.show();
        finishButton.hide();
    }
}

function draw() {
    background(220);
    if (gameStarted) {
        text(`Playing as ${playerName}. Click 'Finish Game' when done`, 50, 50);
    } else if (totalTime > 0) {
        text(`Finished! ${playerName}'s time: ${totalTime.toFixed(2)} seconds`, 50, 50);
    } else {
        text('Enter your name and click "Start Game"', 50, 50);
    }
}

function startGame() {
    let name = inputField.value().trim();
    if (name) {
        playerName = name;
        startTime = millis();
        gameStarted = true;
        localStorage.setItem('playerName', playerName);
        localStorage.setItem('startTime', startTime);
        localStorage.setItem('gameStarted', 'true');
        startButton.hide();
        finishButton.show();
        totalTime = 0;
    }
}

function finishGame() {
    if (gameStarted) {
        let endTime = millis();
        totalTime = (endTime - startTime) / 1000;
        let gameData = JSON.parse(localStorage.getItem('gameData')) || [];
        gameData.push({ name: playerName, time: totalTime });
        localStorage.setItem('gameData', JSON.stringify(gameData));
        gameStarted = false;
        localStorage.setItem('gameStarted', 'false');
        finishButton.hide();
        startButton.show();
        inputField.show();
    }
}
