import React from 'react';
import { Link } from 'react-router-dom';
import './Explore.css';

const Explore = () => (
  <div className="explore-container">
    <h1 className="explore-subtitle">Subsidiary DAOs</h1>
    <div className='explore-content'>
    <Link to="/orchestrator-demo-dao" className="explore-button-container">
      <button className="explore-button">Orchestrator Demo</button>
    </Link>
    <Link to="/agent-demo-dao" className="explore-button-container">
      <button className="explore-button">Agent Demo</button>
    </Link>
    </div>
  </div>
);

export default Explore;