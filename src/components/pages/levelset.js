import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import back from "D:/Game/type/src/images/backgrou.mp4";
import obstacle1 from "../../images/Obstacle_1.png";
import obstacle2 from "../../images/Obstacle_2.png";
import obstacle3 from "../../images/Obstacle_3.png";
import obstacle4 from "../../images/Obstacle_4.png";
import obstacle5 from "../../images/Obstacle_5.png";
import user from "D:/Game/type/src/images/boy-running.gif"; // Correct the image path here if needed

const obstacles = [obstacle1, obstacle2, obstacle3, obstacle4, obstacle5];
const words = ["cat", "dog", "bat", "hat", "pig", "rat", "owl", "fox", "cow", "ant"];

function App() {
  const [obstacleList, setObstacleList] = useState([]);
  const [runnerPosition, setRunnerPosition] = useState(10); // Initial position on the ground
  const [gameOver, setGameOver] = useState(false);
  const [typedWord, setTypedWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const [jumping, setJumping] = useState(false); // State to track if the runner is jumping
  const [screenOffset, setScreenOffset] = useState(0); // Track screen movement
  const [score, setScore] = useState(0); // Score tracking

  const videoRef = useRef(null); // Ref for the video element
  const runnerRef = useRef(null); // Ref for the runner (GIF)

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (gameOver) {
      if (videoRef.current) videoRef.current.pause(); // Stop the video
      if (runnerRef.current) runnerRef.current.style.display = "none"; // Hide the runner (GIF)
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= words.length) {
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
      const newWord = words[currentIndex];
      setCurrentWord(newWord);

      const newObstacle = {
        image: randomObstacle,
        word: newWord,
        position: {
          bottom: "12%", // Slightly higher
          left: "100%",
        },
      };
      setObstacleList((prevObstacles) => [...prevObstacles, newObstacle]);
      currentIndex++;
    }, 2000);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    const moveObstacles = setInterval(() => {
      setObstacleList((prevObstacles) => {
        const updatedObstacles = prevObstacles.map((obstacle) => ({
          ...obstacle,
          position: {
            ...obstacle.position,
            left: `${parseFloat(obstacle.position.left) - 1}%`,
          },
        }));

        const updatedObstaclesAfterJump = updatedObstacles
          .map((obstacle) => {
            if (
              parseFloat(obstacle.position.left) < 15 &&
              parseFloat(obstacle.position.left) > 0 &&
              obstacle.word.trim().toLowerCase() === typedWord.trim().toLowerCase()
            ) {
              handleWordMatch(); // Call the function to handle word match
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
          setGameOver(true);
          return [];
        }

        return updatedObstaclesAfterJump;
      });
    }, 30);

    return () => clearInterval(moveObstacles);
  }, [typedWord, gameOver, runnerPosition]);

  useEffect(() => {
    if (jumping) {
      setRunnerPosition(40);
    } else {
      setRunnerPosition(10);
    }
  }, [jumping]);

  const handleWordMatch = () => {
    setJumping(true);
    setScore((prevScore) => prevScore + 10); // Increment score
    setTimeout(() => setJumping(false), 500);
    setTypedWord(""); // Clear the typed word
  };

  const handleInputChange = (event) => {
    setTypedWord(event.target.value);
  };

  const restartGame = () => {
    setObstacleList([]);
    setRunnerPosition(10);
    setGameOver(false);
    setTypedWord("");
    setTimeLeft(30);
    setCurrentWord("");
    setJumping(false);
    setScreenOffset(0);
    setScore(0); // Reset score

    // Restart video and GIF
    if (videoRef.current) {
      videoRef.current.play(); // Restart video
    }
    if (runnerRef.current) {
      runnerRef.current.style.display = "block"; // Show the runner GIF again
    }
  };

  return (
    <div className="App" style={{ backgroundColor: "black", height: "100vh" }}>
      <div
        className="game-container"
        style={{
          position: "relative",
          height: "100vh", // Full screen height
          width: "100vw", // Full screen width
          margin: "0", // Remove margin
          border: "none", // Remove border for seamless display
          overflow: "hidden",
        }}
      >
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

        <header
          className="App-header"
          style={{
            textAlign: "center",
            padding: "10px",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            background: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <div
            className="word-list"
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "18px",
              color: "white",
              textAlign: "center",
            }}
          >
            <h2>
            {words.map((word, index) => (
  <span
    key={index}
    style={{
      display: "inline-block",
      padding: "5px 15px",
      margin: "5px 8px",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#ffffff",
      background: "linear-gradient(to right, #ffcc00,rgb(187, 75, 1))",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(255, 204, 0, 0.8)",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      transition: "transform 0.2s ease-in-out",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
  >
    {word.toUpperCase()}
  </span>
))}

            </h2>
          </div>
        </header>

        {/* Time and Score Display */}
        <div
  className="time-display"
  style={{
    position: "absolute",
    top: "30px",
    right: "20px",
    padding: "10px 15px",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    background: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.2s ease-in-out",
  }}
>
  {gameOver ? "" : `Time Left: ${timeLeft} seconds`}
</div>


<div
  className="score-display"
  style={{
    position: "absolute",
    top: "30px",
    left: "20px",
    padding: "10px 15px",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #ff9800, #ff5722)", // Gradient background
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 87, 34, 0.8)",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.2s ease-in-out",
  }}
>
  Score: {score}
</div>


        {gameOver && (
          <div
            className="popup"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2>Game Over!</h2>
            <p>Your Score: {score}</p>
            <div>
              <button
                onClick={restartGame}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  border: "none",
                  background: "linear-gradient(to right, yellow, orange)", // Linear gradient
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Restart Game
              </button>
            </div>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => (window.location.href = "/")} // Redirect to home
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  border: "none",
                  background: "linear-gradient(to right, yellow, orange)",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🏠 Go to Home
              </button>
            </div>
          </div>
        )}

        <div
          className="input-container"
          style={{
            position: "absolute",
            top: "100px", // Slightly lower
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            value={typedWord}
            onChange={handleInputChange}
            className="typing-input"
            placeholder="Type the word to jump..."
            disabled={gameOver}
            style={{
              fontSize: "16px",
              padding: "8px",
              width: "250px",
              borderRadius: "5px",
              border: "2px solid #fff",
              background: "rgba(255, 255, 255, 0.8)",
              marginTop: "20px",
            }}
          />
        </div>

        {obstacleList.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle-container"
            style={{
              position: "absolute",
              bottom: obstacle.position.bottom,
              left: obstacle.position.left,
              transition: "left 0.03s linear",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#FFFF00", // Brightest color (neon yellow)
                fontFamily: "Times New Roman",
                marginBottom: "100px", // Slightly higher
                backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background for contrast
                padding: "8px 12px", // Increased padding for readability
                borderRadius: "5px", // Rounded corners
                display: "inline-block", // Keeps background tight around the word
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)", // Adds a glow effect for visibility
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Text shadow for better contrast
              }}
            >
              {obstacle.word.toUpperCase()}
            </div>
            <img
              src={obstacle.image}
              alt="obstacle"
              className="obstacle"
              style={{
                width: "80px",
                height: "100px",
                bottom: `1%`,
              }}
            />
          </div>
        ))}

        <div
          className="runner"
          style={{
            position: "absolute",
            bottom: `${runnerPosition}%`,
            left: "10%",
            fontSize: "30px",
            transition: "bottom 0.3s",
          }}
          ref={runnerRef}
        >
          <img src={user} alt="runner" style={{ width: "100px", height: "175px" }} />
        </div>
      </div>
    </div>
  );
}

export default App;
