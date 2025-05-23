# Rock Paper Scissors Game

A modern, feature-rich implementation of the classic Rock Paper Scissors game built with React. Play against the computer with multiple difficulty levels or challenge other players in real-time multiplayer matches.

## Features

### Game Modes

#### Single Player
- Three difficulty levels:
  - **Easy Mode**: Perfect for beginners
    - 60% random moves
    - 20% optimal moves
    - 20% intentional mistakes
  - **Medium Mode**: Balanced challenge
    - 50% random moves
    - 40% optimal moves
    - 10% mistakes
  - **Hard Mode**: For experienced players
    - 70% optimal moves
    - 20% random moves
    - 10% mistakes
- Difficulty level persists between sessions
- Detailed statistics for each difficulty level

#### Multiplayer
- Real-time gameplay via WebSocket
- Player matchmaking system
- Username-based authentication
- Live opponent status updates
- Disconnect handling and game state management

### Scoring & Statistics

#### Single Player Stats
- Overall win/loss record
- Difficulty-specific statistics
- Current winning/losing streaks
- Win rate percentage
- Total games played
- Number of ties
- Per-difficulty performance tracking

#### Multiplayer Stats
- Current win streak
- Best win streak
- Win rate percentage
- Match history
- Real-time score updates

### Game History
- Last 10 games record
- Detailed match information:
  - Player choices
  - Game outcomes
  - Timestamps
  - Difficulty level (single player)
  - Opponent names (multiplayer)

### User Interface
- Modern, responsive design
- Dark/Light theme support
- Animated game elements
- Real-time feedback
- Mobile-friendly layout
- Accessibility features

### Technical Features
- Real-time WebSocket communication
- Local storage for game preferences
- Session persistence
- Responsive design
- Theme-aware styling
- Error handling and recovery

## Technology Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **State Management**: React Context
- **Styling**: CSS with CSS Variables for theming

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd rock-paper-scissors
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../
npm install
```

3. Start the development servers:
```bash
# Start the backend server (from server directory)
npm start

# Start the frontend development server (from root directory)
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Game Controls

1. **Mode Selection**:
   - Choose between Single Player and Multiplayer modes
   - Select difficulty level in Single Player mode

2. **Making Moves**:
   - Click on Rock, Paper, or Scissors buttons to make your choice
   - Wait for computer/opponent response
   - View the result and updated scores

3. **Game Management**:
   - Reset game to clear scores and history
   - Switch between game modes at any time
   - Change difficulty levels during single-player games

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Emoji graphics for game choices
- React community for inspiration
- Modern UI/UX principles
