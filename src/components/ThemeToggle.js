import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-button"
        aria-label="Toggle theme"
      >
        {theme.name === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default ThemeToggle; 