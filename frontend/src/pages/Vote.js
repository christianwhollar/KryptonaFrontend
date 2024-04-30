import React from 'react';
import './Vote.css';

const Vote = () => (
  <div style={{ textAlign: 'center' }}>
    <h2 className='vote-subtitle'>Vote on Proposal</h2>
    <div className='vote-container'>
      <div className='vote-content'>
        <p className='vote-paragraph'>
          There are no active proposals at this time.
        </p>
      </div>
    </div>
  </div>
);

export default Vote;