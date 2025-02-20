import React, { useEffect, useState } from 'react';
import './levels.css';
import back from "../../images/front.gif";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import bgmusic from "../../images/bg_music.mp3";

function App() {
  const [audio] = useState(new Audio(bgmusic));

  const playMusic = () => {
    audio.loop = true;
    audio.play().catch(error => console.error("Autoplay blocked:", error));
  };

  return (
    <div className="App" onClick={playMusic}> 
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
      
      <div className="content" style={{
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: `'Poppins', sans-serif`,
        color: '#ffffff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ marginBottom: '30px', fontSize: '2.5rem', fontWeight: 'bold', animation: 'fadeIn 2s ease-in-out' }}>
          Select Your Level
        </h1>
        
        <div className="box-container" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ color: '#90EE90' }}>Easy</h2>
          <div className="row" style={{ display: 'flex', marginBottom: '15px' }}>
            <Link to="l1" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 1</div>
            </Link>
            <Link to="l2" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 2</div>
            </Link>
            <Link to="l3" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 3</div>
            </Link>
            <Link to="l4" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 4</div>
            </Link>
          </div>

          <h2 style={{ color: '#FFD700' }}>Medium</h2>
          <div className="row" style={{ display: 'flex', marginBottom: '15px' }}>
            <Link to="l5" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 5</div>
            </Link>
            <Link to="l6" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 6</div>
            </Link>
            <Link to="l7" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 7</div>
            </Link>
            <Link to="l8" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 8</div>
            </Link>
          </div>

          <h2 style={{ color: '#FF6347' }}>Hard</h2>
          <div className="row" style={{ display: 'flex' }}>
            <Link to="l9" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 9</div>
            </Link>
            <Link to="l10" style={{ textDecoration: 'none' }}>
              <div className="box" style={boxStyle}>Level 10</div>
            </Link>
          </div>
        </div>

        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={homeButtonStyle}>Back to Home</div>
        </Link>
      </div>
    </div>
  );
}

const boxStyle = {
  width: '80px',
  height: '80px',
  margin: '10px',
  background: 'linear-gradient(45deg, #FF5722, #FFC107)',
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

export default App;
