const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store active games, waiting players, game history, and player stats
const games = new Map();
const waitingPlayers = new Map();
const gameHistory = new Map();
const playerStats = new Map(); // Store player statistics including streaks

function initPlayerStats(socketId) {
  if (!playerStats.has(socketId)) {
    playerStats.set(socketId, {
      currentStreak: 0,
      bestStreak: 0,
      lastResult: null
    });
  }
  return playerStats.get(socketId);
}

function updatePlayerStreak(socketId, won) {
  const stats = initPlayerStats(socketId);
  
  if (won) {
    stats.currentStreak = stats.lastResult === 'won' ? stats.currentStreak + 1 : 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
    stats.lastResult = 'won';
  } else {
    stats.currentStreak = 0;
    stats.lastResult = 'lost';
  }
  
  playerStats.set(socketId, stats);
  return stats;
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  initPlayerStats(socket.id);

  socket.on('get_history', () => {
    const playerHistory = gameHistory.get(socket.id) || [];
    const stats = playerStats.get(socket.id) || initPlayerStats(socket.id);
    socket.emit('history_data', { history: playerHistory, stats });
  });

  socket.on('join_queue', (username) => {
    console.log(`${username} joined queue`);
    
    if (!gameHistory.has(socket.id)) {
      gameHistory.set(socket.id, []);
    }
    initPlayerStats(socket.id);
    
    let opponent = null;
    for (const [waitingId, waitingName] of waitingPlayers) {
      if (waitingId !== socket.id) {
        opponent = { id: waitingId, username: waitingName };
        waitingPlayers.delete(waitingId);
        break;
      }
    }

    if (opponent) {
      const gameId = `game_${Date.now()}`;
      const game = {
        id: gameId,
        players: [
          { id: socket.id, username, choice: null },
          { id: opponent.id, username: opponent.username, choice: null }
        ],
        status: 'playing'
      };
      games.set(gameId, game);

      io.to(socket.id).emit('game_start', { 
        gameId, 
        opponent: opponent.username,
        stats: playerStats.get(socket.id)
      });
      io.to(opponent.id).emit('game_start', { 
        gameId, 
        opponent: username,
        stats: playerStats.get(opponent.id)
      });
    } else {
      waitingPlayers.set(socket.id, username);
      socket.emit('waiting_for_opponent');
    }
  });

  socket.on('make_move', ({ gameId, choice }) => {
    const game = games.get(gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === socket.id);
    if (player) {
      player.choice = choice;

      const allChoicesMade = game.players.every(p => p.choice !== null);
      if (allChoicesMade) {
        const [player1, player2] = game.players;
        const result = determineWinner(player1.choice, player2.choice);
        
        // Update streaks for both players
        const player1Won = result === 'player1';
        const player2Won = result === 'player2';
        const player1Stats = updatePlayerStreak(player1.id, player1Won);
        const player2Stats = updatePlayerStreak(player2.id, player2Won);

        const timestamp = new Date().toISOString();
        
        // Update and send results for both players
        game.players.forEach(p => {
          const isPlayer1 = p.id === player1.id;
          const playerWon = isPlayer1 ? player1Won : player2Won;
          const playerStats = isPlayer1 ? player1Stats : player2Stats;
          const opponent = isPlayer1 ? player2 : player1;
          
          const gameResult = {
            timestamp,
            opponent: opponent.username,
            yourChoice: p.choice,
            opponentChoice: isPlayer1 ? player2.choice : player1.choice,
            result: getPlayerResult(p.id, player1.id, result),
            currentStreak: playerStats.currentStreak,
            bestStreak: playerStats.bestStreak
          };

          const playerHistory = gameHistory.get(p.id) || [];
          playerHistory.unshift(gameResult);
          if (playerHistory.length > 10) playerHistory.pop();
          gameHistory.set(p.id, playerHistory);
          
          io.to(p.id).emit('game_result', {
            ...gameResult,
            stats: playerStats
          });
        });

        game.players.forEach(p => p.choice = null);
        games.set(gameId, game);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    waitingPlayers.delete(socket.id);
    
    for (const [gameId, game] of games) {
      const opponent = game.players.find(p => p.id !== socket.id);
      if (opponent) {
        io.to(opponent.id).emit('opponent_left');
        games.delete(gameId);
        break;
      }
    }
  });
});

function determineWinner(choice1, choice2) {
  if (choice1 === choice2) return 'tie';
  if (
    (choice1 === 'rock' && choice2 === 'scissors') ||
    (choice1 === 'paper' && choice2 === 'rock') ||
    (choice1 === 'scissors' && choice2 === 'paper')
  ) {
    return 'player1';
  }
  return 'player2';
}

function getPlayerResult(playerId, player1Id, result) {
  if (result === 'tie') return "It's a tie!";
  if (playerId === player1Id) {
    return result === 'player1' ? 'You win!' : 'You lose!';
  }
  return result === 'player2' ? 'You win!' : 'You lose!';
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 