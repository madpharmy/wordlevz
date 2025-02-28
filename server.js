const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

app.use(express.static('public')); // Serve static files from the public folder

let players = []; // Store player data: { id, name, row, colors }

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  // Handle player joining with a name
  socket.on('join', (name) => {
    players.push({ id: socket.id, name, row: 1, colors: Array(5).fill('gray') });
    io.emit('playersUpdate', players); // Broadcast updated player list
  });

  // Handle player guessing (update row and colors)
  socket.on('guess', (guess) => {
    const player = players.find(p => p.id === socket.id);
    if (player) {
      player.row = Math.min(player.row + 1, 6); // Move to next row, max 6
      player.colors = checkGuess(guess, "FLAME"); // Update colors for guess
      io.emit('playersUpdate', players); // Broadcast updated player list
    }
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('playersUpdate', players); // Broadcast updated player list
    console.log('A player disconnected:', socket.id);
  });
});

function checkGuess(guess, target) {
  let feedback = Array(5).fill('gray');
  let targetLetters = target.split('');
  
  // First pass: Mark correct positions (green)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      feedback[i] = 'green';
      targetLetters[i] = null; // Mark as used
    }
  }

  // Second pass: Mark correct letters in wrong positions (yellow)
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

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Find your local IP and use it for other devices, e.g., http://192.168.1.100:3000');
});