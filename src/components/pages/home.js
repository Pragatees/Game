import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import frontGif from "../../images/front.gif";

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="title">Typing Adventure Game</h1>
        <div className="button-group">
        <Link to = "/levels"> <button className="animated-button">Start Game</button></Link>
          <Link to="/ht"><button className="animated-button">How to Play</button></Link>
          <Link to="/rules">
            <button className="animated-button">Rules</button>
          </Link>
          <button className="animated-button">Quit Game</button>
        </div>
      </div>
      <img src={frontGif} alt="Typing Adventure Front" className="background-gif" />
    </div>
  );
};

export default Home;
