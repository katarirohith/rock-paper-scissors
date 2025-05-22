import React from 'react';
import './App.css';
import Game from './components/Game';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <ThemeToggle />
        <Game />
      </div>
    </ThemeProvider>
  );
}

export default App;
