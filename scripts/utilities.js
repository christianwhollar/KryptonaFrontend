/**
 * @fileoverview
 * Utility functions to handle common filesystem operations related to saving contract data
 * and retrieving stored addresses for the Kryptona DAO project. This includes saving contract
 * artifacts and addresses to the frontend directory, ensuring that the frontend can interact
 * with deployed contracts seamlessly.
 *
 * Functions:
 * - saveFrontendFiles: Saves contract artifacts and addresses in a structured format.
 * - getKryptonaContractAddress: Retrieves the address of the main Kryptona contract.
 * - getDAOKryptonaTreasuryContractAddress: Retrieves the address of the Kryptona Treasury contract.
 * - getDAOKryptonaContractAddress: Retrieves the address for the main DAO Kryptona contract.
 * - getProposalKryptonaMemberContractAddress: Retrieves the address for the Proposal Kryptona Member contract.
 */

const path = require("path");
const fs = require("fs-extra"); // Enhanced file system operations with fs-extra

/**
 * Saves contract address and artifact to the frontend directory.
 * @param {Object} contract The contract object after deployment.
 * @param {string} contractName The name of the contract.
 */
function saveFrontendFiles(contract, contractName) {
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  // Ensure the directory exists, create if it does not
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Convert contractName to lowercase for filename consistency
  const lowerCaseContractName = contractName.toLowerCase();

  // Save the contract address to a JSON file
  fs.outputFileSync(
    path.join(contractsDir, `${lowerCaseContractName}-contract-address.json`),
    JSON.stringify({ [lowerCaseContractName]: contract.address }, undefined, 2)
  );

  // Retrieve and save the contract artifact (ABI, bytecode, etc.)
  const ContractArtifact = artifacts.readArtifactSync(contractName);
  fs.outputFileSync(
    path.join(contractsDir, `${lowerCaseContractName}.json`),
    JSON.stringify(ContractArtifact, null, 2)
  );
}

/**
 * Retrieves the address of the deployed Kryptona contract from the frontend directory.
 * @return {string} Contract address.
 */
function getKryptonaContractAddress() {
  const contractAddress = require("../frontend/src/contracts/kryptona-contract-address.json");
  return contractAddress.kryptona;
}

/**
 * Retrieves the address of the deployed DAO Kryptona Treasury contract.
 * @return {string} Contract address.
 */
function getDAOKryptonaTreasuryContractAddress() {
  const contractAddress = require("../frontend/src/contracts/daokryptonatreasury-contract-address.json");
  return contractAddress.daokryptonatreasury;
}

/**
 * Retrieves the address for the deployed main DAO Kryptona contract.
 * @return {string} Contract address.
 */
function getDAOKryptonaContractAddress() {
  const contractAddress = require("../frontend/src/contracts/daokryptona-contract-address.json");
  return contractAddress.daokryptona;
}

/**
 * Retrieves the address for the deployed Proposal Kryptona Member contract.
 * @return {string} Contract address.
 */
function getProposalKryptonaMemberContractAddress() {
  const contractAddress = require("../frontend/src/contracts/proposalkryptonamember-contract-address.json");
  return contractAddress.proposalkryptonamember;
}

// Export all utility functions
module.exports = {
  saveFrontendFiles,
  getKryptonaContractAddress,
  getDAOKryptonaTreasuryContractAddress,
  getDAOKryptonaContractAddress,
  getProposalKryptonaMemberContractAddress
};
