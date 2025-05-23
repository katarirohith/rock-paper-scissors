import React from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';
import './MultiplayerHistory.css';

const MultiplayerHistory = () => {
  const { gameHistory, gameState } = useMultiplayer();

  if (!gameHistory.length) {
    return null;
  }

  return (
    <div className="multiplayer-history">
      <div className="streak-info">
        <div className="streak-item">
          <span className="streak-label">Current Streak:</span>
          <span className="streak-value">{gameState.stats?.currentStreak || 0}</span>
        </div>
        <div className="streak-item">
          <span className="streak-label">Best Streak:</span>
          <span className="streak-value">{gameState.stats?.bestStreak || 0}</span>
        </div>
      </div>

      <h3>Recent Games</h3>
      <div className="history-list">
        {gameHistory.map((game, index) => (
          <div key={index} className="history-item">
            <div className="history-header">
              <span className="opponent-name">vs {game.opponent}</span>
              <span className="game-time">{new Date(game.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="game-details">
              <div className="move-info">
                <span>You played: <strong>{game.yourChoice}</strong></span>
                <span>Opponent played: <strong>{game.opponentChoice}</strong></span>
              </div>
              <div className={`game-result ${
                game.result === 'You win!' 
                  ? 'win' 
                  : game.result === 'You lose!' 
                    ? 'lose' 
                    : 'tie'
              }`}>
                {game.result}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiplayerHistory; 