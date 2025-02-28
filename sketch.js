document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const nameInput = document.getElementById('nameInput');
  const startButton = document.getElementById('startButton');
  const tryButton = document.getElementById('tryButton');
  const finishButton = document.getElementById('finishButton');

  // Load and initialize game state
  if (localStorage.getItem('gameStarted') === 'true') {
    // Resume ongoing game
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    nameInput.value = localStorage.getItem('playerName') || '';
  } else {
    // Show start screen
    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
  }
  updateLeaderBoard();

  // Start game event
  startButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
      // Save initial game state
      localStorage.setItem('playerName', name);
      localStorage.setItem('startTime', Date.now());
      localStorage.setItem('tries', 0);
      localStorage.setItem('gameStarted', 'true');
      // Switch to game screen
      startScreen.style.display = 'none';
      gameScreen.style.display = 'block';
    } else {
      alert('Please enter a name!');
    }
  });

  // Increment tries event
  tryButton.addEventListener('click', () => {
    let tries = parseInt(localStorage.getItem('tries') || '0');
    tries++;
    localStorage.setItem('tries', tries);
  });

  // Finish game event
  finishButton.addEventListener('click', () => {
    const endTime = Date.now();
    const startTime = parseInt(localStorage.getItem('startTime'));
    const time = (endTime - startTime) / 1000; // Time in seconds
    const tries = parseInt(localStorage.getItem('tries'));
    const name = localStorage.getItem('playerName');

    // Update leaderboard
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, time, tries });
    leaderboard.sort((a, b) => a.time - b.time); // Sort by time ascending
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Reset game state
    localStorage.setItem('gameStarted', 'false');
    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    updateLeaderBoard();
  });

  // Function to update leaderboard display
  function updateLeaderBoard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const table = document.querySelector('#leaderboard table');
    table.innerHTML = '<tr><th>Name</th><th>Time (s)</th><th>Tries</th></tr>';
    leaderboard.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.name}</td>
        <td>${entry.time.toFixed(2)}</td>
        <td>${entry.tries}</td>
      `;
      table.appendChild(row);
    });
  }
});
