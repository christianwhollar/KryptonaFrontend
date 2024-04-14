async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
      console.warn(
        "You are trying to send Ether to an address on the Hardhat Network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
  
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Sending Ether with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    // Replace with the amount of Ether you want to send
    const amount = ethers.utils.parseEther("1");
  
    // Replace with the recipient address
    const recipient = "0x0B733D8b98A5b1214A2D9eB22dA0Ff421DE42DCc";
  
    const tx = await deployer.sendTransaction({
      to: recipient,
      value: amount
    });

    console.log('hi')
    console.log("Transaction:", tx.hash);
  
    await tx.wait();
  
    console.log(`Sent ${ethers.utils.formatEther(amount)} Ether to ${recipient}`);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });