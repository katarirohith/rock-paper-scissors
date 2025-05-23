import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const MultiplayerContext = createContext();

const SOCKET_URL = 'http://localhost:3001';

export const MultiplayerProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    isInGame: false,
    gameId: null,
    opponent: null,
    isWaiting: false,
    username: localStorage.getItem('username') || '',
    stats: {
      currentStreak: 0,
      bestStreak: 0
    }
  });
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('waiting_for_opponent', () => {
      setGameState(prev => ({ ...prev, isWaiting: true }));
    });

    socket.on('game_start', ({ gameId, opponent, stats }) => {
      setGameState(prev => ({
        ...prev,
        isInGame: true,
        gameId,
        opponent,
        isWaiting: false,
        stats
      }));
      socket.emit('get_history');
    });

    socket.on('opponent_left', () => {
      setGameState(prev => ({
        ...prev,
        isInGame: false,
        gameId: null,
        opponent: null,
        isWaiting: false
      }));
    });

    socket.on('history_data', ({ history, stats }) => {
      setGameHistory(history);
      setGameState(prev => ({ ...prev, stats }));
    });

    socket.on('game_result', ({ yourChoice, opponentChoice, result, stats }) => {
      setGameState(prev => ({ ...prev, stats }));
    });

    return () => {
      socket.off('waiting_for_opponent');
      socket.off('game_start');
      socket.off('opponent_left');
      socket.off('history_data');
      socket.off('game_result');
    };
  }, [socket]);

  const joinGame = (username) => {
    if (!socket || !username.trim()) return;
    localStorage.setItem('username', username);
    setGameState(prev => ({ ...prev, username }));
    socket.emit('join_queue', username);
  };

  const makeMove = (choice) => {
    if (!socket || !gameState.gameId) return;
    socket.emit('make_move', { gameId: gameState.gameId, choice });
  };

  const leaveGame = () => {
    if (!socket) return;
    socket.disconnect();
    setGameState({
      isInGame: false,
      gameId: null,
      opponent: null,
      isWaiting: false,
      username: gameState.username,
      stats: {
        currentStreak: 0,
        bestStreak: 0
      }
    });
    setGameHistory([]);
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
  };

  return (
    <MultiplayerContext.Provider 
      value={{
        gameState,
        gameHistory,
        joinGame,
        makeMove,
        leaveGame,
        socket,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (context === undefined) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
}; 