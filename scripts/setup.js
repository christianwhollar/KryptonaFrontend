/**
 * @fileoverview
 * This script automates the setup process for deploying the Kryptona DAO ecosystem on a local development network.
 * It sequentially deploys various components of the system, including the main Kryptona contracts, treasury,
 * and proposal contracts, and also simulates a week of blockchain time to test time-dependent functionalities.
 *
 * Additionally, it provides initial funding to specified wallet addresses to facilitate immediate testing
 * of transaction-based functionalities within the deployed smart contracts.
 *
 * @author: Christian Hollar
 * @date: 05/01/2024
 *
 * Usage:
 * Execute this script through Hardhat to set up the entire Kryptona system on localhost for development and testing:
 * `npx hardhat run path/to/this/script --network localhost`
 *
 * Warning:
 * This script is intended for development purposes only and should not be used on a production network.
 */

const { execSync } = require('child_process');

// Main function to execute the deployment and setup of the Kryptona DAO system
async function main() {
  // Deploy the Kryptona ERC20 token contract
  execSync('npx hardhat run ./scripts/deploy_kryptona.js --network localhost');
  // Provide initial faucet tokens to specified addresses for testing
  execSync('npx hardhat --network localhost faucet 0x8D48c4951114a719382422667C911f2876d6ebB7');
  execSync('npx hardhat --network localhost faucet 0xBcd4042DE499D14e55001CcbB24a551F3b954096');
  // Deploy the DAO Kryptona Treasury contract
  execSync('npx hardhat run ./scripts/deploy_daokryptonatreasury.js --network localhost');
  // Deploy the main DAO Kryptona contract
  execSync('npx hardhat run ./scripts/deploy_daokryptona.js --network localhost');
  // Deploy the proposal contracts for members and treasury management
  execSync('npx hardhat run ./scripts/deploy_proposalkryptonamember.js --network localhost');
  execSync('npx hardhat run ./scripts/deploy_proposalkryptonatreasury.js --network localhost');
  // Simulate the advance of one week's time on the blockchain to enable certain time-dependent features
  execSync('npx hardhat run ./scripts/evmAdvanceTimeWeek.js --network localhost');
}

// Execute the main function
main()
  .then(() => process.exit(0)) // Exit successfully after all scripts have run
  .catch((error) => {
    console.error(error); // Log any errors that occur during the setup process
    process.exit(1); // Exit with an error code if there are failures
  });
