/**
 * @fileoverview
 * This script deploys the ProposalKryptonaTreasury contract as part of the Kryptona DAO's governance system.
 * This contract is specifically responsible for handling proposals related to treasury operations, such as
 * funding allocations and financial management within the DAO.
 *
 * The script automates the deployment process by connecting to the main Kryptona DAO contract and setting up
 * the ProposalKryptonaTreasury to manage treasury-related decisions and transactions.
 *
 * @author: Your Name
 * @date: The current date
 *
 * Usage:
 * Run this script with Hardhat to deploy the Proposal Kryptona Treasury contract:
 * `npx hardhat run path/to/this/script --network <network-name>`
 *
 * Warning:
 * Running this script on the default Hardhat network (which is ephemeral) is not recommended because the
 * network resets each session. Use '--network localhost' for persistent testing and development.
 */

const { saveFrontendFiles, getDAOKryptonaContractAddress } = require('./utilities');

// Main asynchronous function to deploy the Proposal Kryptona Treasury contract
async function main() {
  // Warn if deploying to the ephemeral Hardhat network
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which " +
      "gets automatically created and destroyed every time. Use the Hardhat " +
      "option '--network localhost'"
    );
  }

  // Retrieve the deployer's signer information
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  // Retrieve the main Kryptona DAO contract address
  const daoKryptonaAddress = getDAOKryptonaContractAddress();

  // Deploy the Proposal Kryptona Treasury contract using the DAO address
  const ProposalKryptonaTreasury = await ethers.getContractFactory("ProposalKryptonaTreasury");
  const proposalKryptonaTreasury = await ProposalKryptonaTreasury.deploy(daoKryptonaAddress);
  
  // Ensure the contract is fully deployed before proceeding
  await proposalKryptonaTreasury.deployed();
  console.log("Kryptona Treasury Proposal Address:", proposalKryptonaTreasury.address);

  // Save the contract's address and ABI to be used by the frontend application
  saveFrontendFiles(proposalKryptonaTreasury, "ProposalKryptonaTreasury");
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
