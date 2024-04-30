const { execSync } = require('child_process');

async function main() {
  execSync('npx hardhat run ./scripts/deploy_kryptona.js --network localhost');
  execSync('npx hardhat --network localhost faucet 0x8D48c4951114a719382422667C911f2876d6ebB7');
  execSync('npx hardhat run ./scripts/deploy_daokryptonatreasury.js --network localhost');
  execSync('npx hardhat run ./scripts/deploy_daokryptona.js --network localhost');
  execSync('npx hardhat run ./scripts/deploy_proposalkryptonamember.js --network localhost');
  execSync('npx hardhat run ./scripts/deploy_proposalkryptonatreasury.js --network localhost');
  execSync('npx hardhat run ./scripts/evmAdvanceTimeWeek.js --network localhost');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });