import React from 'react';
import { Link } from 'react-router-dom';
import './Explore.css';

const Explore = () => (
  <div className="explore-container">
    <h1 className="explore-subtitle">Subsidiary DAOs</h1>
    <Link to="/orchestrator-demo-dao" className="explore-button-container">
      <button className="explore-button">Orchestrator Demo DAO</button>
    </Link>
    <Link to="/agent-demo-dao" className="explore-button-container">
      <button className="explore-button">Agent Demo DAO</button>
    </Link>
  </div>
);

export default Explore;