import React from 'react';
import './ScoreBoard.css';
import { useMultiplayer } from '../context/MultiplayerContext';

const ScoreBoard = ({ isSinglePlayer, score, gameHistory, difficulty }) => {
  const { gameState } = useMultiplayer();

  if (isSinglePlayer) {
    const totalGames = score.user + score.computer;
    const ties = gameHistory?.filter(game => game.result === "It's a tie!").length || 0;
    const winRate = totalGames > 0 ? Math.round((score.user / totalGames) * 100) : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    let streakType = null;
    
    for (let i = 0; i < (gameHistory?.length || 0); i++) {
      const result = gameHistory[i].result;
      if (i === 0) {
        currentStreak = 1;
        streakType = result;
      } else if (result === streakType) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate difficulty-specific stats
    const difficultyGames = gameHistory?.filter(game => game.difficulty === difficulty) || [];
    const difficultyWins = difficultyGames.filter(game => game.result === 'You win!').length;
    const difficultyTotal = difficultyGames.length;
    const difficultyWinRate = difficultyTotal > 0 
      ? Math.round((difficultyWins / difficultyTotal) * 100)
      : 0;

    return (
      <div className="score-board single-player">
        <div className="difficulty-banner">
          Playing on {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
        </div>
        <div className="score-container">
          <div className="score-box">
            <h3>Your Score</h3>
            <div className="score-value">{score.user}</div>
            <div className="score-stats">
              <div className="stat-item">
                <span className="stat-label">Overall Win Rate</span>
                <span className="stat-value">{winRate}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{difficulty} Mode Win Rate</span>
                <span className="stat-value">{difficultyWinRate}%</span>
              </div>
              {currentStreak > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Current Streak</span>
                  <span className="stat-value">
                    {currentStreak} {streakType === 'You win!' ? '🏆' : streakType === 'Computer wins!' ? '❌' : '🤝'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="score-divider">vs</div>
          <div className="score-box">
            <h3>Computer</h3>
            <div className="score-value">{score.computer}</div>
            <div className="score-stats">
              <div className="stat-item">
                <span className="stat-label">Win Rate</span>
                <span className="stat-value">
                  {totalGames > 0 ? Math.round((score.computer / totalGames) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="game-summary">
          <div className="summary-item">
            <span className="summary-label">Total Games</span>
            <span className="summary-value">{totalGames}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Games in {difficulty} Mode</span>
            <span className="summary-value">{difficultyTotal}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Ties</span>
            <span className="summary-value">{ties}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="score-board multiplayer">
      <div className="score-container">
        <div className="score-box">
          <h3>You ({gameState.username})</h3>
          <div className="score-value">{score.user}</div>
          <div className="streak-info">
            <div className="streak-item">
              <span className="streak-label">Current Streak</span>
              <span className="streak-value">{gameState.stats?.currentStreak || 0}</span>
            </div>
            <div className="streak-item">
              <span className="streak-label">Best Streak</span>
              <span className="streak-value">{gameState.stats?.bestStreak || 0}</span>
            </div>
          </div>
        </div>
        <div className="score-divider">vs</div>
        <div className="score-box">
          <h3>{gameState.opponent || 'Opponent'}</h3>
          <div className="score-value">{score.computer}</div>
        </div>
      </div>
      <div className="win-rate">
        Win Rate: {score.user + score.computer > 0 
          ? Math.round((score.user / (score.user + score.computer)) * 100)
          : 0}%
      </div>
    </div>
  );
};

export default ScoreBoard; 