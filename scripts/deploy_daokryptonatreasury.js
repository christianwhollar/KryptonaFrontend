const { saveFrontendFiles, getKryptonaContractAddress } = require('./utilities');

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which " +
      "gets automatically created and destroyed every time. Use the Hardhat " +
      "option '--network localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const kryptonaContractAddress = getKryptonaContractAddress();

  const DAOKryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
  const daoKryptonaTreasury = await DAOKryptonaTreasury.deploy(kryptonaContractAddress);

  await daoKryptonaTreasury.deployed();

  console.log("DAO Kryptona Treasury Address:", daoKryptonaTreasury.address);

  // Save the contract address and ABI for the frontend
  saveFrontendFiles(daoKryptonaTreasury, "DAOKryptonaTreasury");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  module.exports = main;