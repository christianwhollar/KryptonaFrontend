/**
 * @fileoverview
 * This script is used to deploy the DAOKryptona smart contract, which is part of the Kryptona DAO ecosystem.
 * The DAOKryptona contract is an ERC20 token that serves as the governance token for the Kryptona decentralized
 * autonomous organization. This script handles the deployment of the contract to the Ethereum blockchain, 
 * sets up initial parameters, and contributes to the DAO's treasury. It also ensures that all necessary 
 * contract interactions are handled properly, such as contributing ETH to the treasury and fetching the 
 * treasury balance.
 *
 * @author: Christian Hollar
 * @date: 05/01/2024
 *
 * Usage:
 * To deploy the Kryptona ERC20 token and interact with the DAO's treasury, run this script with Hardhat:
 * `npx hardhat run path/to/this/script --network <network-name>`
 *
 * Warning:
 * Do not run this script against the main Hardhat network as it gets reset each time Hardhat is restarted.
 * Instead, use the '--network localhost' option to deploy to a persistent local network for development purposes.
 */

// Import utility functions from the 'utilities' file.
const { 
  saveFrontendFiles, 
  getKryptonaContractAddress, 
  getDAOKryptonaTreasuryContractAddress 
} = require('./utilities');

// Main asynchronous function to deploy contracts and interact with them.
async function main() {
  // Warning when trying to deploy directly to the Hardhat network
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

  // Fetch contract addresses for the Kryptona Token and Treasury
  const kryptonaContractAddress = getKryptonaContractAddress();
  const daoKryptonaTreasuryContractAddress = getDAOKryptonaTreasuryContractAddress();

  // Deploy the DAOKryptona contract with necessary constructor arguments
  const DAOKryptona = await ethers.getContractFactory("DAOKryptona");
  const daoKryptona = await DAOKryptona.deploy(
    kryptonaContractAddress, 
    daoKryptonaTreasuryContractAddress
  );
  await daoKryptona.deployed();

  // Log the deployed DAO Treasury contract address
  console.log("DAO Treasury Address:", daoKryptona.address);

  // Contribute to the DAO Treasury with 100 ETH
  const amountToSend = ethers.utils.parseUnits("100", "ether");
  await daoKryptona.connect(deployer).contributeToTreasuryETH({ value: amountToSend });
  
  // Fetch and log the new treasury balance
  const treasuryBalance = await daoKryptona.getTreasuryBalance();
  console.log("DAO Kryptona Treasury ETH Balance:", (treasuryBalance / 10**18).toString());

  // Save the contract's address and ABI for the frontend application
  saveFrontendFiles(daoKryptona, "DAOKryptona");
}

// Execute the main function and handle any errors
main()
  .then(() => process.exit(0)) // Successful execution
  .catch((error) => {
    console.error(error); // Log any errors that occur
    process.exit(1); // Exit with a failure code
  });

// Export the main function (useful for testing or when imported in other files)
module.exports = main;
