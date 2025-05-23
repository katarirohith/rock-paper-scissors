import React, { useState, useEffect } from 'react';
import './Game.css';
import Choice from './Choice';
import Result from './Result';
import ScoreBoard from './ScoreBoard';
import { useMultiplayer } from '../context/MultiplayerContext';
import MultiplayerLobby from './MultiplayerLobby';
import MultiplayerHistory from './MultiplayerHistory';

// Constants for game logic
const MOVES = {
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors',
};

const CHOICES_ARRAY = Object.values(MOVES);

const OUTCOME_MESSAGES = {
  PLAYER_WINS: 'You win!',
  COMPUTER_WINS: 'Computer wins!',
  TIE: "It's a tie!",
};

const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

const DIFFICULTY_SETTINGS = {
  [DIFFICULTY_LEVELS.EASY]: {
    randomChoice: 0.6, // 60% random
    optimalChoice: 0.2, // 20% optimal
    losingChoice: 0.2, // 20% losing choice
    label: 'Easy',
    description: 'Good for beginners, computer makes more mistakes',
  },
  [DIFFICULTY_LEVELS.MEDIUM]: {
    randomChoice: 0.5, // 50% random
    optimalChoice: 0.4, // 40% optimal
    losingChoice: 0.1, // 10% losing choice
    label: 'Medium',
    description: 'Balanced difficulty, mix of random and strategic moves',
  },
  [DIFFICULTY_LEVELS.HARD]: {
    randomChoice: 0.2, // 20% random
    optimalChoice: 0.7, // 70% optimal
    losingChoice: 0.1, // 10% losing choice
    label: 'Hard',
    description: 'Challenging, computer plays more strategically',
  },
};

const LOCAL_STORAGE_KEYS = {
  SCORE: 'rpsGameScore',
  HISTORY: 'rpsGameHistory',
  DIFFICULTY: 'rpsGameDifficulty',
};

const TIMEOUTS = {
  COMPUTER_CHOICE_DELAY: 1000,
  NEXT_ROUND_DELAY: 2000,
};

const Game = () => {
  const { gameState, makeMove, socket, leaveGame } = useMultiplayer();
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DIFFICULTY);
    return saved || DIFFICULTY_LEVELS.MEDIUM;
  });

  // Load score from localStorage or default
  const [score, setScore] = useState(() => {
    try {
      const savedScore = localStorage.getItem(LOCAL_STORAGE_KEYS.SCORE);
      return savedScore ? JSON.parse(savedScore) : { user: 0, computer: 0 };
    } catch (error) {
      console.error("Failed to parse score from localStorage:", error);
      return { user: 0, computer: 0 };
    }
  });

  // Load game history from localStorage or default
  const [gameHistory, setGameHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Failed to parse game history from localStorage:", error);
      return [];
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const getComputerChoice = (playerChoice) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const randomValue = Math.random();
    
    // Get the winning move against the player's choice
    const winningMove = CHOICES_ARRAY[(CHOICES_ARRAY.indexOf(playerChoice) + 1) % 3];
    // Get the losing move against the player's choice
    const losingMove = CHOICES_ARRAY[(CHOICES_ARRAY.indexOf(playerChoice) + 2) % 3];
    
    if (randomValue < settings.losingChoice) {
      return losingMove; // Computer makes a mistake
    } else if (randomValue < settings.losingChoice + settings.randomChoice) {
      return CHOICES_ARRAY[Math.floor(Math.random() * CHOICES_ARRAY.length)]; // Random choice
    } else {
      return winningMove; // Optimal choice
    }
  };

  const handleSinglePlayerChoice = (choice) => {
    setIsPlaying(true);
    setUserChoice(choice);
    
    setTimeout(() => {
      const computerChoice = getComputerChoice(choice);
      setComputerChoice(computerChoice);
      
      const newResult = determineWinner(choice, computerChoice);
      setResult(newResult);

      if (newResult === OUTCOME_MESSAGES.PLAYER_WINS) {
        setScore(prev => ({ ...prev, user: prev.user + 1 }));
      } else if (newResult === OUTCOME_MESSAGES.COMPUTER_WINS) {
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      }

      const newGame = {
        id: Date.now(),
        userChoice: choice,
        computerChoice,
        result: newResult,
        timestamp: new Date().toISOString(),
        difficulty,
      };
      
      setGameHistory(prev => [newGame, ...prev].slice(0, 10));

      setTimeout(() => {
        setUserChoice(null);
        setComputerChoice(null);
        setResult('');
        setIsPlaying(false);
      }, TIMEOUTS.NEXT_ROUND_DELAY);
    }, TIMEOUTS.COMPUTER_CHOICE_DELAY);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DIFFICULTY, newDifficulty);
  };

  const handleMultiplayerChoice = (choice) => {
    setIsPlaying(true);
    setUserChoice(choice);
    makeMove(choice);
  };

  const determineWinner = (user, computer) => {
    if (user === computer) return OUTCOME_MESSAGES.TIE;
    
    if (
      (user === MOVES.ROCK && computer === MOVES.SCISSORS) ||
      (user === MOVES.PAPER && computer === MOVES.ROCK) ||
      (user === MOVES.SCISSORS && computer === MOVES.PAPER)
    ) {
      return OUTCOME_MESSAGES.PLAYER_WINS;
    } else {
      return OUTCOME_MESSAGES.COMPUTER_WINS;
    }
  };

  const resetGame = () => {
    setScore({ user: 0, computer: 0 });
    setGameHistory([]);
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setIsPlaying(false);
    if (!isSinglePlayer) {
      leaveGame();
    }
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SCORE, JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(gameHistory));
  }, [gameHistory]);

  return (
    <div className="game-container">
      <h1>Rock Paper Scissors</h1>
      
      <div className="game-mode-selector">
        <button 
          className={`mode-button ${isSinglePlayer ? 'active' : ''}`}
          onClick={() => setIsSinglePlayer(true)}
        >
          Single Player
        </button>
        <button 
          className={`mode-button ${!isSinglePlayer ? 'active' : ''}`}
          onClick={() => setIsSinglePlayer(false)}
        >
          Multiplayer
        </button>
      </div>

      {isSinglePlayer && (
        <div className="difficulty-selector">
          {Object.entries(DIFFICULTY_SETTINGS).map(([level, settings]) => (
            <div key={level} className="difficulty-option">
              <button
                className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(level)}
              >
                {settings.label}
              </button>
              <span className="difficulty-description">{settings.description}</span>
            </div>
          ))}
        </div>
      )}

      {!isSinglePlayer && <MultiplayerLobby />}
      
      <ScoreBoard 
        isSinglePlayer={isSinglePlayer} 
        score={score} 
        gameHistory={gameHistory}
        difficulty={difficulty}
      />
      
      {(isSinglePlayer || gameState.isInGame) && (
        <div className="choices-container">
          {!isPlaying && (
            <>
              <h2>Make your choice:</h2>
              <div className="choices">
                {CHOICES_ARRAY.map((choice) => (
                  <Choice 
                    key={choice} 
                    choice={choice} 
                    onClick={() => isSinglePlayer ? handleSinglePlayerChoice(choice) : handleMultiplayerChoice(choice)} 
                  />
                ))}
              </div>
            </>
          )}
          
          {isPlaying && (
            <div className="game-play">
              <div className="players">
                <div className="player">
                  <h3>You</h3>
                  {userChoice && <Choice choice={userChoice} selected />}
                </div>
                
                <div className="vs">VS</div>
                
                <div className="player">
                  <h3>{isSinglePlayer ? 'Computer' : gameState.opponent}</h3>
                  {computerChoice ? (
                    <Choice choice={computerChoice} selected />
                  ) : (
                    <div className="thinking">Thinking...</div>
                  )}
                </div>
              </div>
              
              {result && <Result result={result} />}
            </div>
          )}
        </div>
      )}
      
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
      
      {isSinglePlayer ? (
        gameHistory.length > 0 && (
          <div className="history">
            <h3>Game History</h3>
            <ul>
              {gameHistory.map((game) => (
                <li key={game.id}>
                  You chose {game.userChoice}, Computer chose {game.computerChoice} - {game.result}
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <MultiplayerHistory />
      )}
    </div>
  );
};

export default Game;
