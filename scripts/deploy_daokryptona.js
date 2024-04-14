const { saveFrontendFiles, getKryptonaContractAddress, getDAOKryptonaTreasuryContractAddress } = require('./utilities');

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
  const daoKryptonaTreasuryContractAddress = getDAOKryptonaTreasuryContractAddress();

  const DAOKryptona = await ethers.getContractFactory("DAOKryptona");
  const daoKryptona = await DAOKryptona.deploy(kryptonaContractAddress, daoKryptonaTreasuryContractAddress);

  await daoKryptona.deployed();

  console.log("DAO Treasury Address:", daoKryptona.address);

  // Save the contract address and ABI for the frontend
  saveFrontendFiles(daoKryptona, "DAOKryptona");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });