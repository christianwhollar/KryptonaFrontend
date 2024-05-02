/**
 * @fileoverview
 * This script is responsible for deploying the ProposalKryptonaMember contract,
 * which is part of the governance structure of the Kryptona DAO. This contract
 * allows members to propose new candidates for membership within the DAO.
 * 
 * The deployed contract integrates with the main Kryptona DAO contract to ensure
 * governance rules are adhered to and provides functionality for members to submit
 * and vote on membership proposals.
 *
 * @author: Christian Hollar
 * @date: 05/01/2024
 *
 * Usage:
 * To deploy the Proposal Kryptona Member contract, execute this script using Hardhat:
 * `npx hardhat run path/to/this/script --network <network-name>`
 *
 * Warning:
 * Avoid running this script on the main Hardhat network because it is ephemeral and
 * resets with each session. Deploy to a persistent development network like 'localhost'
 * for testing and development purposes.
 */

const { saveFrontendFiles, getDAOKryptonaContractAddress } = require('./utilities');

// Main asynchronous function to deploy the Proposal Kryptona Member contract
async function main() {
  // Warn if deploying to the ephemeral Hardhat network
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which " +
      "gets automatically created and destroyed every time. Use the Hardhat " +
      "option '--network localhost'"
    );
  }

  // Get deployer's address using ethers.js
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  // Retrieve the main Kryptona DAO contract address
  const daoKryptonaAddress = getDAOKryptonaContractAddress();

  // Deploy the Proposal Kryptona Member contract using the DAO address
  const ProposalKryptonaMember = await ethers.getContractFactory("ProposalKryptonaMember");
  const proposalKryptonaMember = await ProposalKryptonaMember.deploy(daoKryptonaAddress);

  // Ensure the contract is fully deployed before proceeding
  await proposalKryptonaMember.deployed();
  console.log("Kryptona Member Proposal Address:", proposalKryptonaMember.address);

  // Save the contract's address and ABI for frontend interaction
  saveFrontendFiles(proposalKryptonaMember, "ProposalKryptonaMember");
}

// Execute the main function and handle any errors or successful execution
main()
  .then(() => process.exit(0)) // Exit successfully if deployment is successful
  .catch((error) => {
    console.error(error); // Log any errors that occur
    process.exit(1); // Exit with an error code if an error occurs
  });

// Export the main function to allow it to be included in other modules
module.exports = main;
