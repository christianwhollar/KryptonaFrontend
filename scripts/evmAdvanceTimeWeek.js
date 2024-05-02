/**
 * @fileoverview
 * This script is used to simulate the passage of time in an Ethereum Virtual Machine (EVM) environment.
 * It advances the blockchain timestamp by one week, which can be useful for testing time-dependent
 * features in smart contracts, such as lock periods, vesting schedules, or deadline-based logic.
 *
 * This script is typically used in a development environment to verify that smart contracts behave as
 * expected after certain periods without having to wait in real time.
 *
 * @author: Christian Hollar
 * @date: 05/01/2024
 *
 * Usage:
 * To advance the EVM time by one week, run this script with Hardhat:
 * `npx hardhat run path/to/this/script`
 *
 * Warning:
 * This script directly manipulates blockchain time and should only be used in test environments.
 */

const ethers = require('ethers');

// Main function to increase EVM time
async function main(provider) {
  // Set the provider from Hardhat runtime environment
  provider = hre.ethers.provider;

  // Send a request to the EVM to increase the time by one week (7 days)
  // Each day has 86400 seconds, thus one week is 604800 seconds
  await provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);

  // Immediately mine a new block after increasing the time
  await provider.send("evm_mine");
}

// Execute the main function
main()
  .then(() => process.exit(0)) // Normal exit after successful execution
  .catch((error) => {
    console.error(error); // Log any errors that occur
    process.exit(1); // Exit with an error code if an error occurs
  });

// Export the main function to allow it to be included in other modules or tests
module.exports = main;
