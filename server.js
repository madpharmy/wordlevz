const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB (replace with your URI)
mongoose.connect('mongodb://localhost:27017/gameDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Define a schema for game data
const gameSchema = new mongoose.Schema({
  playerName: String,
  startTime: Number,
  endTime: Number,
  totalTime: Number
});
const Game = mongoose.model('Game', gameSchema);

// API to start a game
app.post('/start-game', async (req, res) => {
  const { playerName, startTime } = req.body;
  const game = new Game({ playerName, startTime });
  await game.save();
  res.status(201).send(game);
});

// API to finish a game
app.post('/finish-game', async (req, res) => {
  const { playerName, endTime } = req.body;
  const game = await Game.findOne({ playerName, endTime: null });
  if (game) {
    game.endTime = endTime;
    game.totalTime = (endTime - game.startTime) / 1000; // Convert to seconds
    await game.save();
    res.status(200).send(game);
  } else {
    res.status(404).send('Game not found');
  }
});

// API to get all game records (e.g., for a leaderboard)
app.get('/leaderboard', async (req, res) => {
  const games = await Game.find().sort({ totalTime: 1 }).limit(5); // Top 5 fastest times
  res.status(200).send(games);
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
