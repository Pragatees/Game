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

// Level 9 specific words - mix of 6, 7, and 8 letters, 30 words total
const level9Words = [
  // 6 letter words (10 words)
  "system", "format", "random", "vector", "puzzle", "cipher", "knight", "meadow", "quartz", "rhythm",
  // 7 letter words (10 words)
  "cryptic", "dynamic", "phantom", "quantum", "synergy", "baroque", "eclipse", "whisper", "zephyrs", "yielded",
  // 8 letter words (10 words)
  "abstract", "blueprint", "dynamics", "euphoria", "flashback", "hypnotic", "juggling", "labyrinth", "metaphor", "overtake"
];

function Level9Game() {
  const [obstacleList, setObstacleList] = useState([]);
  const [runnerPosition, setRunnerPosition] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [typedWord, setTypedWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds for level 9
  const [currentWord, setCurrentWord] = useState("");
  const [jumping, setJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [collisionAnimation, setCollisionAnimation] = useState(false);
  const [allWordsCompleted, setAllWordsCompleted] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [obstacleSpeed, setObstacleSpeed] = useState(2.5); // Higher base speed for Level 9

  const videoRef = useRef(null);
  const runnerRef = useRef(null);
  const audioRef = useRef(null);
  const bgMusicRef = useRef(null);

  // Timer Effect
  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !allWordsCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        // Even faster speed increase for level 9
        setObstacleSpeed(prev => Math.min(prev + 0.04, 4.0)); // More aggressive speed increase for level 9
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

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= level9Words.length) {
        setAllWordsCompleted(true);
        clearInterval(interval);
        return;
      }

      const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
      const newWord = level9Words[currentIndex];
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
    }, 1400); // Even faster spawn rate for level 9

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
    
    // Enhanced combo system for Level 9 - faster combo buildup
    if (newConsecutiveCorrect % 2 === 0) {
      setComboMultiplier(prev => Math.min(prev + 2.0, 8.0)); // Higher max multiplier for level 9
    }
    
    // Higher base points for longer words in level 9
    let basePoints;
    if (currentWord.length === 8) {
      basePoints = 60;
    } else if (currentWord.length === 7) {
      basePoints = 50;
    } else {
      basePoints = 45;
    }
    
    const pointsEarned = Math.floor(basePoints * comboMultiplier);
    setScore(prevScore => prevScore + pointsEarned);
    
    setWordsCompleted((prev) => prev + 1);
    setTimeout(() => setJumping(false), 500);
    setTypedWord("");

    if (wordsCompleted + 1 === level9Words.length) {
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
    setTimeLeft(45);
    setCurrentWord("");
    setJumping(false);
    setScore(0);
    setWordsCompleted(0);
    setCollisionAnimation(false);
    setAllWordsCompleted(false);
    setConsecutiveCorrect(0);
    setComboMultiplier(1);
    setObstacleSpeed(2.5);

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
  };

  // Adjusted success rate calculation for level 9 (30 words with higher difficulty)
  const successRate = (score / (level9Words.length * 50)) * 100;
  const levelPassed = successRate >= 140; // Higher threshold for level 9

  // Button hover styles
  const buttonBaseStyle = {
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const buttonHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
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
          color: "#1eff00", // Bright green for level 9
          fontSize: "24px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          background: "rgba(0,0,0,0.7)",
          padding: "10px 20px",
          borderRadius: "10px",
          zIndex: "1"
        }}>
          Level 9 - Hard Challenge
        </div>

        {/* Difficulty Indicator */}
        <div style={{
          position: "absolute",
          top: "170px",
          right: "20px",
          color: "#00ff44", // Green shade
          fontSize: "18px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1"
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
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1"
        }}>
          Progress: {wordsCompleted}/{level9Words.length}
        </div>

        {/* Speed Display */}
        <div style={{
          position: "absolute",
          top: "120px",
          right: "20px",
          color: obstacleSpeed > 3.2 ? "#ff4444" : "#1eff00", // Green when normal, red when fast
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1"
        }}>
          Speed: {obstacleSpeed.toFixed(1)}x
        </div>

        {/* Combo Display */}
        <div style={{
          position: "absolute",
          top: "70px",
          right: "20px",
          color: comboMultiplier > 1 ? "#00ff80" : "white", // Light green for combo
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1",
          animation: comboMultiplier > 1 ? "pulse 1s infinite" : "none"
        }}>
          Combo: x{comboMultiplier.toFixed(1)}
        </div>

        {/* Stats Display */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          color: timeLeft <= 15 ? "#ff4444" : "white",
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1"
        }}>
          Time: {timeLeft}s
        </div>

        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "10px",
          zIndex: "1"
        }}>
          Score: {score}
        </div>

        {/* Current Word Display */}
        <div className="word-display" style={{
          position: "absolute",
          top: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "24px",
          color: "white",
          textAlign: "center",
          zIndex: "1"
        }}>
          <span style={{
            display: "inline-block",
            padding: "5px 15px",
            background: "linear-gradient(to right, rgb(0, 212, 35), rgb(0, 170, 20))", // Green gradient for level 9
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 255, 21, 0.8)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}>
            {currentWord.toUpperCase()}
          </span>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={typedWord}
          onChange={handleInputChange}
          placeholder="Type the word..."
          style={{
            position: "absolute",
            top: "130px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px",
            fontSize: "18px",
            borderRadius: "5px",
            border: "2px solid #00ff44", // Green border for level 9
            background: "rgba(255,255,255,0.9)",
            width: "240px", // Wider for longer words
            textAlign: "center",
            zIndex: "1",
            transition: "all 0.3s ease",
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
            padding: "20px",
            borderRadius: "15px",
            color: "white",
            textAlign: "center",
            zIndex: "2"
          }}>
            <h2 style={{ color: "#00ff44" }}>{allWordsCompleted ? "Level Complete!" : "Game Over!"}</h2>
            <p>Final Score: {score}</p>
            <p>Words Completed: {wordsCompleted}/{level9Words.length}</p>
            <p>Success Rate: {successRate.toFixed(1)}%</p>
            {levelPassed ? (
              <p style={{ color: "#00ff44" }}>Level Passed! You can proceed to Level 10!</p>
            ) : (
              <p style={{ color: "#ff4444" }}>Try again to achieve 140% success rate</p>
            )}
            <button
              onClick={restartGame}
              style={{
                ...buttonBaseStyle,
                background: "linear-gradient(to right, rgb(0, 212, 35), rgb(0, 170, 20))", // Green gradient for level 9
                ":hover": buttonHoverStyle
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Retry Level
            </button>
            {levelPassed && (
              <button
                onClick={() => window.location.href = "/level10"}
                style={{
                  ...buttonBaseStyle,
                  background: "linear-gradient(to right, #2dff00, #00cc00)", // Brighter green for next level
                  ":hover": buttonHoverStyle
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Next Level
              </button>
            )}
            <button
              onClick={() => window.location.href = "/"}
              style={{
                ...buttonBaseStyle,
                background: "linear-gradient(to right, #00cc66, #009933)", // Another green shade for menu
                ":hover": buttonHoverStyle
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Main Menu
            </button>
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
              color: "#1eff00", // Bright green for level 9
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "120px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
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
            zIndex: "1"
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
                text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px rgb(0, 212, 71), 0 0 20px rgb(0, 212, 35);
              }
              to {
                text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px rgb(0, 212, 71), 0 0 40px rgb(0, 212, 35);
              }
            }

            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }

            .typing-input:focus {
              outline: none;
              box-shadow: 0 0 10px rgba(3, 146, 27, 0.82);
              transform: scale(1.02);
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
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0); }
            }

            button {
              transition: all 0.3s ease !important;
            }

            button:hover {
              transform: translateY(-2px) !important;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Level9Game;