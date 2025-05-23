import React from 'react';
import './App.css';
import Game from './components/Game';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { MultiplayerProvider } from './context/MultiplayerContext';

function App() {
  return (
    <ThemeProvider>
      <MultiplayerProvider>
        <div className="App">
          <ThemeToggle />
          <Game />
        </div>
      </MultiplayerProvider>
    </ThemeProvider>
  );
}

export default App;
