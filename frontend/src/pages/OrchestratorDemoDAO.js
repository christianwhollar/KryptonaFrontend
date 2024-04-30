import React, { useState } from 'react';
import axios from 'axios';
import './OrchestratorDemoDAO.css';

const OrchestratorDemoDAO = () => {
  const [dataFileHash, setDataFileHash] = useState('Awaiting data file upload...');
  const [architectureFileHash, setArchitectureFileHash] = useState('Awaiting architecture file upload...');
  const [modelFileHash, setModelFileHash] = useState('Awaiting model file upload...');
  // const [dataFileHash, setDataFileHash] = useState('bafybeiesd4mzbkxoqo5bcmsts3yfnpckfbs3jqd5dycbs5gt6ezjvsfxga');
  // const [architectureFileHash, setArchitectureFileHash] = useState('bafkreiajlwvkxy5fpjmh7g65r3xhvkmrbhmjx7qnd2lvnm45nocfjudrba');
  // const [modelFileHash, setModelFileHash] = useState('bafkreifirvejhplfxelw7zz4j47z3kfokmukcbuiw3h5auomaq6ooqa4ka');
  // Function to handle file upload
  const handleFileUpload = (event, setFileHash) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // POST request to the server with the file
    axios.post('http://localhost:3001/api/pinFileToIPFS', formData)
    .then(response => {
      console.log('File uploaded successfully', response.data.message, response.data.ipfsHash);
      setFileHash(response.data.ipfsHash);
    })
    .catch(error => {
      console.error('Error uploading file', error);
    });
  };

  const sendFileHashes = async () => {
    const data = {
      data_ipfs_hash: dataFileHash,
      architecture_ipfs_hash: architectureFileHash,
      model_ipfs_hash: modelFileHash,
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/run_setup', data, {
        responseType: 'blob', // to handle the file download
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Create a blob link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'model.pkl'); // or any other extension you need
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error sending file hashes', error);
    }
  };

  return (
    <div className="orchestrator-demo-dao-container">
      <h2 className="orchestrator-demo-dao-subtitle">Tokenize Data: </h2>
      <div className="orchestrator-demo-dao-content">
        <div className="orchestrator-demo-dao-button-container">
          <input id="file-upload-1" type="file" style={{display: 'none'}} onChange={(event) => handleFileUpload(event, setDataFileHash)} />
          <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-1').click()}>
            Upload Data
          </button>
          <p className="orchestrator-demo-dao-paragraph">
            {dataFileHash}
          </p>
          <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-1').click()}>
            Tokenize
          </button>
        </div>
      </div>

      <h2 className="orchestrator-demo-dao-subtitle">Tokenize Architecture: </h2>
      <div className="orchestrator-demo-dao-content">
        <div className="orchestrator-demo-dao-button-container">
          <input id="file-upload-2" type="file" style={{display: 'none'}} onChange={(event) => handleFileUpload(event, setArchitectureFileHash)} />
          <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-2').click()}>
            Upload Architecture
          </button>
          <p className="orchestrator-demo-dao-paragraph">
            {architectureFileHash}
          </p>
          <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-2').click()}>
            Tokenize
          </button>
        </div>
      </div>

      <h2 className="orchestrator-demo-dao-subtitle">Tokenize Model: </h2>
      <div className="orchestrator-demo-dao-content">
        <div className="orchestrator-demo-dao-button-container">
          <input id="file-upload-3" type="file" style={{display: 'none'}} onChange={(event) => handleFileUpload(event, setModelFileHash)} />
          <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-3').click()}>
            Upload Model
          </button>
          <p className="orchestrator-demo-dao-paragraph">
            {modelFileHash}
          </p>
          <button className="orchestrator-demo-dao-button" onClick={() => document.getElementById('file-upload-3').click()}>
            Tokenize
          </button>
        </div>
      </div>
      <h2 className="orchestrator-demo-dao-subtitle">Orchestrator</h2>
      <div>
      <button className="orchestrator-demo-dao-button" onClick={sendFileHashes}>
        Call Orchestrator
      </button>
      </div>
    </div>
  );
};

export default OrchestratorDemoDAO;