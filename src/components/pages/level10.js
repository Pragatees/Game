import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import back from "../../images/bg_green.mp4"; 
import obstacle1 from "../../images/Obstacle_1.png";
import obstacle2 from "../../images/Obstacle_2.png";
import obstacle3 from "../../images/Obstacle_3.png";
import obstacle4 from "../../images/Obstacle_4.png";
import obstacle5 from "../../images/Obstacle_5.png";
import user from "../../images/boy-running.gif";
import jumpSound from "../../images/jumop.mp3";
import bgmusic from "../../images/bg_music.mp3";

const obstacles = [obstacle1, obstacle2, obstacle3, obstacle4, obstacle5];

// Level 10 specific words - emphasizing 7 and 8 letter words, 30 words total (extra challenging)
const level10Words = [
  // 6 letter words (5 words)
  "matrix", "binary", "syntax", "zenith", "vortex",
  // 7 letter words (12 words)
  "quantum", "phoenix", "enigmas", "cryptic", "paradox", "mythril", "arcanum", "essence", "phantom", "obscure", "zenithal", "dynasty",
  // 8 letter words (13 words) - more 8-letter words than level 9
  "algorism", "bytecode", "calculus", "database", "exterior", "fulgency", "gradient", "hologram", "iridiums", "keyboard", "labyrinth", "moonbeam", "normalize"
];

function Level10Game() {
  const [obstacleList, setObstacleList] = useState([]);
  const [runnerPosition, setRunnerPosition] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [typedWord, setTypedWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for level 10 (reduced from 45)
  const [currentWord, setCurrentWord] = useState("");
  const [jumping, setJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [collisionAnimation, setCollisionAnimation] = useState(false);
  const [allWordsCompleted, setAllWordsCompleted] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [obstacleSpeed, setObstacleSpeed] = useState(3.0); // Higher initial speed for Level 10
  const [extraTimeAwarded, setExtraTimeAwarded] = useState(0);

  const videoRef = useRef(null);
  const runnerRef = useRef(null);
  const audioRef = useRef(null);
  const bgMusicRef = useRef(null);
  const inputRef = useRef(null);

  // Timer Effect
  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !allWordsCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        // Even faster speed increase for level 10
        setObstacleSpeed(prev => Math.min(prev + 0.05, 4.5)); // More aggressive speed increase for level 10
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 || allWordsCompleted) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, allWordsCompleted]);

  // Game Initialization Effect
  useEffect(() => {
    if (gameOver || allWordsCompleted) {
      if (videoRef.current) videoRef.current.pause();
      if (runnerRef.current) runnerRef.current.style.display = "none";
      if (bgMusicRef.current) bgMusicRef.current.pause();
      return;
    }

    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      bgMusicRef.current.play();
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= level10Words.length) {
        setAllWordsCompleted(true);
        clearInterval(interval);
        return;
      }

      const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
      const newWord = level10Words[currentIndex];
      setCurrentWord(newWord);

      const newObstacle = {
        image: randomObstacle,
        word: newWord,
        position: {
          bottom: "12%",
          left: "100%",
        },
      };
      setObstacleList((prevObstacles) => [...prevObstacles, newObstacle]);
      currentIndex++;
    }, 1200); // Even faster spawn rate for level 10 (compared to 1400 in level 9)

    return () => clearInterval(interval);
  }, [gameOver, allWordsCompleted]);

  // Obstacle Movement Effect
  useEffect(() => {
    const moveObstacles = setInterval(() => {
      setObstacleList((prevObstacles) => {
        const updatedObstacles = prevObstacles.map((obstacle) => ({
          ...obstacle,
          position: {
            ...obstacle.position,
            left: `${parseFloat(obstacle.position.left) - obstacleSpeed}%`,
          },
        }));

        const updatedObstaclesAfterJump = updatedObstacles
          .map((obstacle) => {
            if (
              parseFloat(obstacle.position.left) < 15 &&
              parseFloat(obstacle.position.left) > 0 &&
              obstacle.word.trim().toLowerCase() === typedWord.trim().toLowerCase()
            ) {
              handleWordMatch();
              return null;
            }
            return obstacle;
          })
          .filter(Boolean);

        const collisionDetected = updatedObstaclesAfterJump.some(
          (obstacle) =>
            parseFloat(obstacle.position.left) < 15 &&
            parseFloat(obstacle.position.left) > 0 &&
            runnerPosition <= 15
        );

        if (collisionDetected) {
          setCollisionAnimation(true);
          setConsecutiveCorrect(0);
          setComboMultiplier(1);
          setTimeout(() => {
            setCollisionAnimation(false);
            setGameOver(true);
          }, 500);
          return [];
        }

        return updatedObstaclesAfterJump.filter(
          (obstacle) => parseFloat(obstacle.position.left) > -20
        );
      });
    }, 30);

    return () => clearInterval(moveObstacles);
  }, [typedWord, gameOver, runnerPosition, obstacleSpeed]);

  // Jumping Effect
  useEffect(() => {
    if (jumping) {
      setRunnerPosition(40);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.2;
        audioRef.current.play();
      }
    } else {
      setRunnerPosition(10);
    }
  }, [jumping]);

  const handleWordMatch = () => {
    setJumping(true);
    const newConsecutiveCorrect = consecutiveCorrect + 1;
    setConsecutiveCorrect(newConsecutiveCorrect);
    
    // Enhanced combo system for Level 10 - even faster combo buildup
    if (newConsecutiveCorrect % 2 === 0) {
      setComboMultiplier(prev => Math.min(prev + 2.5, 10.0)); // Higher max multiplier for level 10
    }
    
    // Time bonus for consecutive correct words (unique to level 10)
    if (newConsecutiveCorrect % 3 === 0) {
      const timeBonus = 2;
      setTimeLeft(prev => prev + timeBonus);
      setExtraTimeAwarded(prev => prev + timeBonus);
    }
    
    // Higher base points for longer words in level 10
    let basePoints;
    if (currentWord.length === 8) {
      basePoints = 80; // Higher points for 8-letter words
    } else if (currentWord.length === 7) {
      basePoints = 65; // Higher points for 7-letter words 
    } else {
      basePoints = 50; // Higher points for 6-letter words
    }
    
    const pointsEarned = Math.floor(basePoints * comboMultiplier);
    setScore(prevScore => prevScore + pointsEarned);
    
    setWordsCompleted((prev) => prev + 1);
    setTimeout(() => setJumping(false), 500);
    setTypedWord("");

    if (wordsCompleted + 1 === level10Words.length) {
      setAllWordsCompleted(true);
    }
  };

  const handleInputChange = (event) => {
    setTypedWord(event.target.value);
    if (event.nativeEvent.inputType === 'deleteContentBackward') {
      setConsecutiveCorrect(Math.max(0, consecutiveCorrect - 1));
      setComboMultiplier(Math.max(1, comboMultiplier - 0.5));
    }
  };

  const restartGame = () => {
    setObstacleList([]);
    setRunnerPosition(10);
    setGameOver(false);
    setTypedWord("");
    setTimeLeft(30);
    setCurrentWord("");
    setJumping(false);
    setScore(0);
    setWordsCompleted(0);
    setCollisionAnimation(false);
    setAllWordsCompleted(false);
    setConsecutiveCorrect(0);
    setComboMultiplier(1);
    setObstacleSpeed(3.0);
    setExtraTimeAwarded(0);

    if (videoRef.current) {
      videoRef.current.play();
    }
    if (runnerRef.current) {
      runnerRef.current.style.display = "block";
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play();
    }
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Adjusted success rate calculation for level 10 (harder with higher standards)
  const successRate = (score / (level10Words.length * 60)) * 100;
  const levelPassed = successRate >= 160; // Even higher threshold for level 10

  // Button hover styles - enhanced for level 10
  const buttonBaseStyle = {
    padding: "12px 24px", // Larger buttons
    margin: "10px",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  };

  return (
    <div className="App" style={{ backgroundColor: "black", height: "100vh" }}>
      <div className="game-container" style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        margin: "0",
        overflow: "hidden",
      }}>
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src={back} type="video/mp4" />
        </video>

        {/* Game Interface Elements */}
        <div style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#00ff80", // Brighter emerald green for level 10
          fontSize: "26px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.7), 0 0 15px rgba(0, 255, 128, 0.7)",
          background: "rgba(0,0,0,0.8)",
          padding: "12px 24px",
          borderRadius: "12px",
          zIndex: "1",
          border: "2px solid rgba(0, 255, 128, 0.3)",
        }}>
          Level 10 - Ultimate Challenge
        </div>

        {/* Difficulty Indicator */}
        <div style={{
          position: "absolute",
          top: "170px",
          right: "20px",
          color: "#00ff80", // Emerald green
          fontSize: "18px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1",
          border: "1px solid rgba(0, 255, 128, 0.3)",
        }}>
          Word Length: {currentWord.length} letters
        </div>

        {/* Progress Indicator */}
        <div style={{
          position: "absolute",
          top: "220px",
          right: "20px",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1",
          border: "1px solid rgba(0, 255, 128, 0.3)",
        }}>
          <div>Progress: {wordsCompleted}/{level10Words.length}</div>
          <div style={{
            width: "100%",
            height: "6px",
            backgroundColor: "rgba(0, 255, 128, 0.2)",
            borderRadius: "3px",
            marginTop: "4px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              height: "100%",
              width: `${(wordsCompleted/level10Words.length) * 100}%`,
              backgroundColor: "#00ff80",
              borderRadius: "3px",
              transition: "width 0.3s ease-out",
            }}></div>
          </div>
        </div>

        {/* Speed Display */}
        <div style={{
          position: "absolute",
          top: "120px",
          right: "20px",
          color: obstacleSpeed > 3.5 ? "#ff4444" : "#00ff80", // Green when normal, red when fast
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1",
          border: "1px solid rgba(0, 255, 128, 0.3)",
          boxShadow: obstacleSpeed > 4 ? "0 0 10px rgba(255,0,0,0.5)" : "none",
        }}>
          Speed: {obstacleSpeed.toFixed(1)}x
        </div>

        {/* Combo Display */}
        <div style={{
          position: "absolute",
          top: "70px",
          right: "20px",
          color: comboMultiplier > 1 ? "#00ff80" : "white", // Emerald green for combo
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1",
          animation: comboMultiplier > 1 ? "pulse 1s infinite" : "none",
          border: "1px solid rgba(0, 255, 128, 0.3)",
          boxShadow: comboMultiplier > 4 ? "0 0 15px rgba(0, 255, 128, 0.6)" : "none",
        }}>
          Combo: x{comboMultiplier.toFixed(1)}
        </div>

        {/* Stats Display */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          color: timeLeft <= 10 ? "#ff4444" : "white",
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1",
          border: "1px solid rgba(0, 255, 128, 0.3)",
        }}>
          Time: {timeLeft}s {extraTimeAwarded > 0 && <span style={{color: "#00ff80"}}>+{extraTimeAwarded}</span>}
        </div>

        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1",
          border: "1px solid rgba(0, 255, 128, 0.3)",
        }}>
          Score: {score}
        </div>

        {/* Current Word Display */}
        <div className="word-display" style={{
          position: "absolute",
          top: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "28px", // Larger font
          color: "white",
          textAlign: "center",
          zIndex: "1"
        }}>
          <span style={{
            display: "inline-block",
            padding: "8px 20px",
            background: "linear-gradient(to right, rgb(0, 255, 149), rgb(0, 200, 100))", // Emerald gradient for level 10
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0, 255, 128, 0.9), 0 0 30px rgba(0, 255, 128, 0.3)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            letterSpacing: "1px",
          }}>
            {currentWord.toUpperCase()}
          </span>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={typedWord}
          onChange={handleInputChange}
          placeholder="Type the word..."
          style={{
            position: "absolute",
            top: "130px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px",
            fontSize: "20px", // Larger font
            borderRadius: "8px",
            border: "2px solid #00ff80", // Emerald border for level 10
            background: "rgba(255,255,255,0.9)",
            width: "280px", // Wider for longer words
            textAlign: "center",
            zIndex: "1",
            transition: "all 0.3s ease",
            boxShadow: "0 0 10px rgba(0, 255, 128, 0.4)",
          }}
          className="typing-input"
          disabled={gameOver}
          autoFocus
        />

        {/* Game Over Screen */}
        {gameOver && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.9)",
            padding: "30px",
            borderRadius: "15px",
            color: "white",
            textAlign: "center",
            zIndex: "2",
            border: "2px solid rgba(0, 255, 128, 0.5)",
            boxShadow: "0 0 30px rgba(0, 255, 128, 0.3)",
            minWidth: "350px",
          }}>
            <h2 style={{ color: "#00ff80", fontSize: "28px", marginBottom: "20px" }}>
              {allWordsCompleted ? "Master Level Complete! 🏆" : "Challenge Failed!"}
            </h2>
            <p style={{ fontSize: "20px", marginBottom: "15px" }}>Final Score: {score}</p>
            <p style={{ marginBottom: "10px" }}>Words Completed: {wordsCompleted}/{level10Words.length}</p>
            <p style={{ marginBottom: "10px" }}>Extra Time Earned: {extraTimeAwarded}s</p>
            <p style={{ marginBottom: "20px" }}>Success Rate: {successRate.toFixed(1)}%</p>
            {levelPassed ? (
              <div style={{ 
                color: "#00ff80", 
                padding: "10px", 
                background: "rgba(0,255,128,0.1)", 
                borderRadius: "8px", 
                marginBottom: "20px",
                animation: "celebrate 1s infinite",
                border: "1px solid rgba(0, 255, 128, 0.3)"
              }}>
                <p style={{ fontSize: "20px" }}>🎉 Ultimate Victory! 🎉</p>
                <p>You have mastered all typing challenges!</p>
              </div>
            ) : (
              <p style={{ 
                color: "#ff4444", 
                marginBottom: "20px",
                padding: "10px",
                background: "rgba(255,68,68,0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(255,68,68,0.3)"
              }}>
                Try again to achieve 160% success rate
              </p>
            )}
            <div className="button-container" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={restartGame}
                style={{
                  ...buttonBaseStyle,
                  background: "linear-gradient(to right, rgb(0, 255, 149), rgb(0, 200, 100))", // Emerald gradient
                }}
                className="game-button retry-button"
              >
                Retry Ultimate Challenge
              </button>
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  ...buttonBaseStyle,
                  background: "linear-gradient(to right, #00cc88, #009966)", // Darker emerald for menu
                }}
                className="game-button menu-button"
              >
                Return to Main Menu
              </button>
              {levelPassed && (
                <button
                  onClick={() => window.location.href = "/results"}
                  style={{
                    ...buttonBaseStyle,
                    background: "linear-gradient(to right, #00ffaa, #00dd99)", // Brighter emerald for completion
                  }}
                  className="game-button results-button"
                >
                  View Final Results
                </button>
              )}
            </div>
          </div>
        )}

        {/* Obstacles */}
        {obstacleList.map((obstacle, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              bottom: obstacle.position.bottom,
              left: obstacle.position.left,
              transition: "left 0.03s linear",
            }}
          >
            <div style={{
              textAlign: "center",
              color: "#00ff80", // Emerald green for level 10
              fontSize: "22px", // Slightly larger
              fontWeight: "bold",
              marginBottom: "120px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7), 0 0 10px rgba(0, 255, 128, 0.7)",
              letterSpacing: "1px",
            }}>
              {obstacle.word.toUpperCase()}
            </div>
            <img
              src={obstacle.image}
              alt="obstacle"
              style={{
                width: "80px",
                height: "120px",
                position: "absolute",
                bottom: `${(runnerPosition / 10) - 40}px`,
                filter: "drop-shadow(0 0 8px rgba(0, 255, 128, 0.3))",
              }}
            />
          </div>
        ))}

        {/* Runner */}
        <div
          ref={runnerRef}
          style={{
            position: "absolute",
            bottom: `${runnerPosition}%`,
            left: "10%",
            transition: "bottom 0.3s",
            animation: collisionAnimation ? "shake 0.1s" : "none",
            zIndex: "1",
            filter: comboMultiplier > 5 ? "drop-shadow(0 0 8px rgba(0, 255, 128, 0.6))" : "none",
          }}
        >
          <img
            src={user}
            alt="runner"
            style={{
              width: "100px",
              height: "175px"
            }}
          />
        </div>

        {/* Audio Elements */}
        <audio ref={audioRef} src={jumpSound} preload="auto"></audio>
        <audio ref={bgMusicRef} src={bgmusic} loop preload="auto"></audio>

        {/* Animation Styles */}
        <style>
          {`
            @keyframes shake {
              0% { transform: translateX(0); }
              25% { transform: translateX(-10px); }
              50% { transform: translateX(10px); }
              75% { transform: translateX(-10px); }
              100% { transform: translateX(0); }
            }

            @keyframes glow {
              from {
                text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px rgb(0, 255, 128), 0 0 20px rgb(0, 200, 100);
              }
              to {
                text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px rgb(0, 255, 128), 0 0 40px rgb(0, 200, 100);
              }
            }

            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }

            .typing-input:focus {
              outline: none;
              box-shadow: 0 0 15px rgba(0, 255, 128, 0.7);
              transform: translateX(-50%) scale(1.03);
              border-color: rgb(0, 255, 149);
            }

            .obstacle-container {
              position: absolute;
              transition: all 0.03s linear;
            }

            .runner img {
              transition: transform 0.3s ease-in-out;
            }

            .runner img:hover {
              transform: scale(1.05);
            }

            @keyframes progressFill {
              from { width: 0%; }
              to { width: 100%; }
            }

            @keyframes wordComplete {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }

            @keyframes celebrate {
              0% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
              100% { transform: translateY(0); }
            }

            .game-button {
              transition: all 0.3s ease !important;
              position: relative;
              overflow: hidden;
            }

            .game-button:hover {
              transform: translateY(-3px) !important;
              box-shadow: 0 8px 20px rgba(0, 255, 128, 0.4) !important;
            }

            .game-button:active {
              transform: translateY(1px) !important;
              box-shadow: 0 2px 10px rgba(0, 255, 128, 0.4) !important;
            }

            .game-button::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 5px;
              height: 5px;
              background: rgba(255, 255, 255, 0.5);
              opacity: 0;
              border-radius: 100%;
              transform: scale(1, 1) translate(-50%);
              transform-origin: 50% 50%;
            }

            .game-button:hover::after {
              animation: ripple 1s ease-out;
            }

            @keyframes ripple {
              0% {
                transform: scale(0, 0);
                opacity: 0.5;
              }
              100% {
                transform: scale(20, 20);
                opacity: 0;
              }
            }

            .retry-button:hover {
              background: linear-gradient(to right, rgb(0, 255, 170), rgb(0, 220, 120)) !important;
            }

            .menu-button:hover {
              background: linear-gradient(to right, #00ddaa, #00aa77) !important;
            }

            .results-button:hover {
              background: linear-gradient(to right, #00ffbb, #00eeaa) !important;
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Level10Game;