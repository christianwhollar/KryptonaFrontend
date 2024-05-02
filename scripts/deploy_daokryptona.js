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

  // Kryptona Token & Treasury Contracts
  const kryptonaContractAddress = getKryptonaContractAddress();
  const daoKryptonaTreasuryContractAddress = getDAOKryptonaTreasuryContractAddress();

  const DAOKryptona = await ethers.getContractFactory("DAOKryptona");
  const daoKryptona = await DAOKryptona.deploy(kryptonaContractAddress, daoKryptonaTreasuryContractAddress);

  await daoKryptona.deployed();

  console.log("DAO Treasury Address:", daoKryptona.address);

  // Contribute to the DAO Treasury
  const amountToSend = ethers.utils.parseUnits("100", "ether");
  await daoKryptona.connect(deployer).contributeToTreasuryETH({ value: amountToSend });
  const treasuryBalance = await daoKryptona.getTreasuryBalance();

  // Log the DAO Treasury ETH Balance
  console.log("DAO Kryptona Treasury ETH Balance:", (treasuryBalance / 10**18).toString());

  // Save the contract address and ABI for the frontend
  saveFrontendFiles(daoKryptona, "DAOKryptona");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  module.exports = main;