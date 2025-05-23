import React, { useState } from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';
import './MultiplayerLobby.css';

const MultiplayerLobby = () => {
  const { gameState, joinGame, leaveGame } = useMultiplayer();
  const [inputUsername, setInputUsername] = useState(gameState.username);

  const handleJoin = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      joinGame(inputUsername.trim());
    }
  };

  if (gameState.isWaiting) {
    return (
      <div className="multiplayer-lobby waiting">
        <div className="waiting-message">
          <div className="spinner"></div>
          <h2>Waiting for opponent...</h2>
          <button className="cancel-button" onClick={leaveGame}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!gameState.isInGame) {
    return (
      <div className="multiplayer-lobby">
        <h2>Join Multiplayer Game</h2>
        <form onSubmit={handleJoin} className="join-form">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Enter your username"
            maxLength={20}
            required
          />
          <button type="submit">Join Game</button>
        </form>
      </div>
    );
  }

  return null;
};

export default MultiplayerLobby; 