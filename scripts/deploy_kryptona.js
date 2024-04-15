const { saveFrontendFiles } = require('./utilities');

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        " gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Define the initial supply for the Kryptona token
  const initialSupply = 1000000n * 10n ** 18n;

  // Deploy the Kryptona contract
  const Kryptona = await ethers.getContractFactory("Kryptona");
  const kryptona = await Kryptona.deploy(initialSupply);
  await kryptona.deployed();

  console.log("Kryptona Address:", kryptona.address);

  // Save the contract address and ABI for the frontend
  saveFrontendFiles(kryptona, "Kryptona");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  module.exports = main;