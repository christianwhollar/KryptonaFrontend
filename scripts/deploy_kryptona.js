/**
 * @fileoverview
 * This script deploys the Kryptona ERC-20 token contract, which is the governance and utility token
 * for the Kryptona decentralized autonomous organization (DAO). The Kryptona token facilitates various
 * operations within the DAO, such as voting and payments.
 *
 * @author: Christian Hollar
 * @date: 05/01/2024
 *
 * Usage:
 * To deploy the Kryptona token contract, run this script with Hardhat by specifying the desired network:
 * `npx hardhat run path/to/this/script --network <network-name>`
 *
 * Warning:
 * This script should not be executed against the main Hardhat network, as it is ephemeral and resets
 * with each session. Use a persistent local development network like 'localhost' for testing.
 */

const { saveFrontendFiles } = require('./utilities');

// Main asynchronous function to deploy the Kryptona token
async function main() {
  // Convenience check for the network context
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        " gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // Retrieve the deployer's account information
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  // Log the deployer's account balance
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Set the initial token supply for the Kryptona token (1,000,000 tokens)
  const initialSupply = 1000000n * 10n ** 18n;  // Token has 18 decimal places

  // Deploy the Kryptona token contract
  const Kryptona = await ethers.getContractFactory("Kryptona");
  const kryptona = await Kryptona.deploy(initialSupply);
  await kryptona.deployed();

  // Output the address of the newly deployed token
  console.log("Kryptona Address:", kryptona.address);

  // Save the contract's address and ABI to be used by the frontend application
  saveFrontendFiles(kryptona, "Kryptona");
}

// Execute the main function with proper error handling
main()
  .then(() => process.exit(0))  // Normal exit
  .catch((error) => {
    console.error(error);  // Log any errors that occur
    process.exit(1);       // Exit with an error code
  });

// Export the main function to allow it to be included in other modules
module.exports = main;
