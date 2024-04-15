import React from 'react';
import './OrchestratorDemoDAO.css';

const tokenize = () => {
  // Add your tokenization logic here
};

const OrchestratorDemoDAO = () => (
  <div className="orchestrator-demo-dao-container">
    <h2 className="orchestrator-demo-dao-subtitle">Tokenize File 1</h2>
    <div className="orchestrator-demo-dao-content">
      <div className="orchestrator-demo-dao-button-container">
        <input id="file-upload-1" type="file" style={{display: 'none'}} />
        <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-1').click()}>Upload File</button>
        <button className="orchestrator-demo-dao-button" onClick={tokenize}>Tokenize</button>
      </div>
    </div>

    <h2 className="orchestrator-demo-dao-subtitle">Tokenize File 2</h2>
    <div className="orchestrator-demo-dao-content">
      <div className="orchestrator-demo-dao-button-container">
        <input id="file-upload-2" type="file" style={{display: 'none'}} />
        <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-2').click()}>Upload File</button>
        <button className="orchestrator-demo-dao-button" onClick={tokenize}>Tokenize</button>
      </div>
    </div>

    <h2 className="orchestrator-demo-dao-subtitle">Tokenize File 3</h2>
    <div className="orchestrator-demo-dao-content">
      <div className="orchestrator-demo-dao-button-container">
        <input id="file-upload-3" type="file" style={{display: 'none'}} />
        <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-3').click()}>Upload File</button>
        <button className="orchestrator-demo-dao-button" onClick={tokenize}>Tokenize</button>
      </div>
    </div>
  </div>
);

export default OrchestratorDemoDAO;