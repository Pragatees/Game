// src/HowToPlay.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './HowToPlay.css'; // Import the CSS file for styling

function HowToPlay() {
  return (
    <div className="rules-page">
      {/* Rules Page Container */}
      <div className="rules-container">
        {/* Overlay for content visibility */}
        <div className="overlay">
          {/* Title of the page */}
          <div className="rules-title">
            <h1>How to Play</h1>
          </div>

          {/* Game Objective */}
          <div className="rules-content">
            <h2>Game Objective</h2>
            <p>
              In this game, you control a runner who must jump over obstacles by typing the words displayed above them. The goal is to avoid collisions and score as many points as possible before time runs out!
            </p>
          </div>

          {/* Game Mechanics */}
          <div className="rules-content">
            <h3>Game Mechanics</h3>
            <ul>
              <li>
                <strong>Jumping:</strong> Press the <span className="key">Spacebar</span> to make your runner jump over obstacles.
              </li>
              <li>
                <strong>Obstacles:</strong> Obstacles will appear randomly from the right side of the screen and move toward the runner.
              </li>
              <li>
                <strong>Typing Challenge:</strong> Each obstacle has a word displayed above it. You must type the word correctly to make the runner jump over it.
              </li>
              <li>
                <strong>Avoid Collisions:</strong> If the runner collides with an obstacle, the game is over.
              </li>
              <li>
                <strong>Timer:</strong> You have <strong>30 seconds</strong> to play. Try to avoid obstacles and score as many points as you can before time expires!
              </li>
            </ul>
          </div>

          {/* Tips for Success */}
          <div className="rules-content">
            <h3>Tips for Success</h3>
            <ul>
              <li>
                <strong>Stay Calm:</strong> Focus on typing the word correctly. Mistakes can happen, but don’t panic!
              </li>
              <li>
                <strong>Be Quick:</strong> Speed matters! The faster you type, the better your chances of avoiding obstacles.
              </li>
              <li>
                <strong>Improve Your Reflexes:</strong> Practice regularly to boost your typing speed and reaction time.
              </li>
            </ul>
          </div>

          {/* Back to Home Button */}
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HowToPlay;
