import React from 'react';
import './levels.css';
import back from '../../images/p1.gif'; // Import the background image
import { BrowserRouter as Router, Link } from 'react-router-dom';

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: `'Poppins', sans-serif`, // Elegant font style
        color: '#ffffff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
      }}
    >
      <h1 style={{ marginBottom: '30px', fontSize: '2.5rem', fontWeight: 'bold', animation: 'fadeIn 2s ease-in-out' }}>
        Select Your Level
      </h1>

      {/* Container for the boxes */}
      <div className="box-container" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Row 1 */}
        <div className="row" style={{ display: 'flex', marginBottom: '15px' }}>
          <Link to="lt" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 1
            </div>
          </Link>
          <Link to="l2" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 2
            </div>
          </Link>
          <Link to="l3" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 3
            </div>
          </Link>
          <Link to="l4" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 4
            </div>
          </Link>
          <Link to="l5" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 5
            </div>
          </Link>
        </div>

        {/* Row 2 */}
        <div className="row" style={{ display: 'flex' }}>
          <Link to="l6" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 6
            </div>
          </Link>
          <Link to="l7" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 7
            </div>
          </Link>
          <Link to="l8" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 8
            </div>
          </Link>
          <Link to="l9" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 9
            </div>
          </Link>
          <Link to="l10" style={{ textDecoration: 'none' }}>
            <div className="box" style={boxStyle}>
              Level 10
            </div>
          </Link>
        </div>
      </div>

      {/* Back to Home Button */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={homeButtonStyle}>
          Back to Home
        </div>
      </Link>
    </div>
  );
}

const boxStyle = {
  width: '80px',
  height: '80px',
  margin: '10px',
  background: 'linear-gradient(45deg, #FF5722, #FFC107)', // Gradient background
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1rem',
  fontWeight: 'bold',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
  transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
  cursor: 'pointer',
  animation: 'fadeIn 1s ease-in-out',
};

const homeButtonStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '10px 20px',
  background: '#FF5722',
  color: '#ffffff',
  fontSize: '1rem',
  fontWeight: 'bold',
  borderRadius: '5px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
  textAlign: 'center',
  animation: 'fadeIn 2s ease-in-out',
};

// Add hover effects
boxStyle[':hover'] = {
  transform: 'scale(1.1)',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.5)',
  background: 'linear-gradient(45deg, #FFC107, #FF5722)',
};

homeButtonStyle[':hover'] = {
  transform: 'scale(1.1)',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.5)',
  background: '#FFC107',
};

// Add keyframes for fadeIn animation
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .box:hover {
    transform: scale(1.1);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.5);
    background: linear-gradient(45deg, #FFC107, #FF5722);
  }

  .box {
    animation: fadeIn 1s ease-in-out;
  }

  .App h1 {
    animation: fadeIn 2s ease-in-out;
  }

  .App {
    animation: fadeIn 2s ease-in-out;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;