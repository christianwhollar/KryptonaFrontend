const path = require("path");
const fs = require("fs-extra"); // Use fs-extra module

function saveFrontendFiles(contract, contractName) {
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Convert contractName to lowercase
  const lowerCaseContractName = contractName.toLowerCase();

  fs.outputFileSync( // Use outputFileSync instead of writeFileSync
    path.join(contractsDir, `${lowerCaseContractName}-contract-address.json`),
    JSON.stringify({ [lowerCaseContractName]: contract.address }, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync(contractName);

  fs.outputFileSync( // Use outputFileSync instead of writeFileSync
    path.join(contractsDir, `${lowerCaseContractName}.json`),
    JSON.stringify(ContractArtifact, null, 2)
  );
}

function getKryptonaContractAddress() {
  const contractAddress = require("../frontend/src/contracts/kryptona-contract-address.json");
  return contractAddress.kryptona;
}

function getDAOKryptonaTreasuryContractAddress() {
  const contractAddress = require("../frontend/src/contracts/daokryptonatreasury-contract-address.json");
  return contractAddress.daokryptonatreasury;
}

module.exports = {
  saveFrontendFiles,
  getKryptonaContractAddress,
  getDAOKryptonaTreasuryContractAddress
};