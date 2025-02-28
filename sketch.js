let playerName, startTime, totalTime = 0, gameStarted = false;

function setup() {
  // Existing setup code (e.g., createCanvas, buttons, inputField)
  startButton.mousePressed(startGame);
  finishButton.mousePressed(finishGame);
}

function startGame() {
  let name = inputField.value().trim();
  if (name) {
    fetch('http://localhost:3000/start-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName: name, startTime: Date.now() })
    })
    .then(response => response.json())
    .then(data => {
      playerName = data.playerName;
      startTime = data.startTime;
      gameStarted = true;
      startButton.hide();
      finishButton.show();
    })
    .catch(error => console.error('Error:', error));
  }
}

function finishGame() {
  if (gameStarted) {
    let endTime = Date.now();
    fetch('http://localhost:3000/finish-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, endTime })
    })
    .then(response => response.json())
    .then(data => {
      totalTime = data.totalTime;
      gameStarted = false;
      finishButton.hide();
      startButton.show();
      inputField.show();
      fetchLeaderboard(); // Optional: Update leaderboard
    })
    .catch(error => console.error('Error:', error));
  }
}

function fetchLeaderboard() {
  fetch('http://localhost:3000/leaderboard')
    .then(response => response.json())
    .then(data => {
      console.log('Leaderboard:', data); // Display or render leaderboard
      // Add code to show leaderboard in your UI
    });
}

function draw() {
  background(220);
  textAlign(CENTER);
  fill(0);
  if (!gameStarted && totalTime === 0) {
    text("Click 'Start Game'", width / 2, height / 2 - 50);
  } else if (gameStarted) {
    text(`Playing as ${playerName}`, width / 2, height / 2 - 50);
  } else if (totalTime > 0) {
    text(`Finished in ${totalTime} seconds`, width / 2, height / 2 - 30);
    text("Enter a new name to play again", width / 2, height / 2 + 30);
  }
}
