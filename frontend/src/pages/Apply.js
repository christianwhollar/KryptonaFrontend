import React from 'react';
import './Apply.css';

const Apply = () => (
  <div style={{ textAlign: 'center' }}>
    <h2 className='apply-subtitle'>Apply for Membership</h2>
    <div className='apply-container'>
      <div className='apply-content'>
        <p className='apply-paragraph'>
          To apply for membership, please fill out the form below.
        </p>
        <p className='apply-paragraph'>
          Membership is open to anyone who holds Kryptona tokens.
        </p>
        <input type="text" className="apply-input" placeholder="Type here..."/>
      </div>
      <button className="apply-button">Submit</button>
    </div>
  </div>
);

export default Apply;