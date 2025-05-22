import React from 'react';
import './Result.css';

const Result = ({ result }) => {
  return (
    <div className={`result ${
      result === 'You win!' 
        ? 'win' 
        : result === 'Computer wins!' 
          ? 'lose' 
          : 'tie'
    }`}>
      <h2>{result}</h2>
    </div>
  );
};

export default Result;
