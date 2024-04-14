const { saveFrontendFiles } = require('./utilities');

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
  console.log(kryptonaContractAddress);
  const KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
  const kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaContractAddress);

  await kryptonaTreasury.deployed();

  console.log("DAO Kryptona Treasury Address:", kryptonaTreasury.address);

  // Save the contract address and ABI for the frontend
  saveFrontendFiles(kryptonaTreasury, "DAOKryptonaTreasury");
}

function getKryptonaContractAddress() {
  const contractAddress = require("../frontend/src/contracts/kryptona-contract-address.json");
  return contractAddress.Kryptona;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });