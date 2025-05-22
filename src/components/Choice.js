import React from 'react';
import './Choice.css';

const Choice = ({ choice, onClick, selected }) => {
  const getEmoji = () => {
    switch (choice) {
      case 'rock':
        return '✊';
      case 'paper':
        return '✋';
      case 'scissors':
        return '✌️';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`choice ${selected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <div className="choice-emoji">{getEmoji()}</div>
      <div className="choice-name">{choice}</div>
    </div>
  );
};

export default Choice;
