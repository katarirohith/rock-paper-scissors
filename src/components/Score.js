import React from 'react';
import './Score.css';

const Score = ({ score }) => {
  return (
    <div className="score-container">
      <div className="score-box">
        <h3>You</h3>
        <div className="score-value">{score.user}</div>
      </div>
      <div className="score-divider">:</div>
      <div className="score-box">
        <h3>Computer</h3>
        <div className="score-value">{score.computer}</div>
      </div>
    </div>
  );
};

export default Score;
