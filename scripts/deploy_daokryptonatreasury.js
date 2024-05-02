/**
 * @fileoverview
 * This script is responsible for deploying the DAOKryptonaTreasury smart contract as part of the Kryptona DAO ecosystem.
 * The DAOKryptonaTreasury contract manages the treasury operations of the DAO, allowing for the handling and storage
 * of financial assets within the DAO. This includes contributions to the treasury and governance over its assets.
 *
 * @author: Christian Hollar
 * @date: 05/01/2024
 *
 * Usage:
 * To deploy the Kryptona Treasury contract, run this script using Hardhat:
 * `npx hardhat run path/to/this/script --network <network-name>`
 *
 * Warning:
 * It is not recommended to deploy this script directly to the Hardhat network because it is volatile and resets with each session.
 * Instead, deploy it to a persistent network like 'localhost' for development and testing.
 */

const { saveFrontendFiles, getKryptonaContractAddress } = require('./utilities');

// Main function to deploy the Kryptona Treasury contract
async function main() {
  // Warn if deploying to the non-persistent Hardhat network
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

  // Retrieve the address of the already deployed Kryptona Contract to link with the treasury
  const kryptonaContractAddress = getKryptonaContractAddress();

  // Deploy the DAOKryptonaTreasury contract using the Kryptona contract address
  const DAOKryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
  const daoKryptonaTreasury = await DAOKryptonaTreasury.deploy(kryptonaContractAddress);

  // Ensure the contract is fully deployed before proceeding
  await daoKryptonaTreasury.deployed();

  // Output the address of the newly deployed treasury contract
  console.log("DAO Kryptona Treasury Address:", daoKryptonaTreasury.address);

  // Save the contract's ABI and address to the frontend directory for use in the frontend application
  saveFrontendFiles(daoKryptonaTreasury, "DAOKryptonaTreasury");
}

// Execute the main function and handle errors or successful execution
main()
  .then(() => process.exit(0)) // Exit successfully if deployment is successful
  .catch((error) => {
    console.error(error); // Log any errors that occur
    process.exit(1); // Exit with error code if an error occurs
  });

// Make the main function available for import in other JavaScript files
module.exports = main;
