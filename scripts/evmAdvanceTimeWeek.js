const ethers = require('ethers');

async function main(provider) {
  provider = hre.ethers.provider;
  await provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  await provider.send("evm_mine");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  module.exports = main;