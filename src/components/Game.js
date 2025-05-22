import React, { useState, useEffect } from 'react';
import './Game.css';
import Choice from './Choice';
import Result from './Result';
import Score from './Score';

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

const LOCAL_STORAGE_KEYS = {
  SCORE: 'rpsGameScore',
  HISTORY: 'rpsGameHistory',
};

const TIMEOUTS = {
  COMPUTER_CHOICE_DELAY: 1000,
  NEXT_ROUND_DELAY: 2000,
};

const Game = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');

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

  const handleChoice = (choice) => {
    setIsPlaying(true);
    setUserChoice(choice);
    
    // Generate computer choice
    setTimeout(() => {
      const randomChoice = CHOICES_ARRAY[Math.floor(Math.random() * CHOICES_ARRAY.length)];
      setComputerChoice(randomChoice);
    }, TIMEOUTS.COMPUTER_CHOICE_DELAY);
  };

  useEffect(() => {
    if (userChoice && computerChoice) {
      const newResult = determineWinner(userChoice, computerChoice);
      setResult(newResult);

      if (newResult === OUTCOME_MESSAGES.PLAYER_WINS) {
        setScore(prevScore => ({ ...prevScore, user: prevScore.user + 1 }));
      } else if (newResult === OUTCOME_MESSAGES.COMPUTER_WINS) {
        setScore(prevScore => ({ ...prevScore, computer: prevScore.computer + 1 }));
      }

      setGameHistory(prevHistory => [
        ...prevHistory, 
        { 
          id: prevHistory.length, 
          userChoice, 
          computerChoice, 
          result: newResult 
        }
      ]);

      setTimeout(() => {
        setIsPlaying(false);
        setUserChoice(null);
        setComputerChoice(null);
        setResult('');
      }, TIMEOUTS.NEXT_ROUND_DELAY);
    }
  }, [userChoice, computerChoice]);

  // Effect to save score to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SCORE, JSON.stringify(score));
  }, [score]);

  // Effect to save game history to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(gameHistory));
  }, [gameHistory]);

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
  };

  return (
    <div className="game-container">
      <h1>Rock Paper Scissors</h1>
      
      <Score score={score} />
      
      <div className="choices-container">
        {!isPlaying && (
          <>
            <h2>Make your choice:</h2>
            <div className="choices">
              {CHOICES_ARRAY.map((choice) => (
                <Choice 
                  key={choice} 
                  choice={choice} 
                  onClick={() => handleChoice(choice)} 
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
                <h3>Computer</h3>
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
      
      <button className="reset-button" onClick={resetGame}>Reset Game</button>
      
      {gameHistory.length > 0 && (
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
      )}
    </div>
  );
};

export default Game;
