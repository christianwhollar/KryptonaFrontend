const fs = require("fs");

task("faucet", "Sends ETH and Kryptona to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }, { ethers }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/kryptona-contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.kryptona)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const kryptona = await ethers.getContractAt("Kryptona", address.kryptona);
    const [sender] = await ethers.getSigners();

    amount = 100n * 10n ** 18n;

    const tx = await kryptona.transfer(receiver, amount);
    await tx.wait();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH and 100 Kryptona to ${receiver}`);
  });
