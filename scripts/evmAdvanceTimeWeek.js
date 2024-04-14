const ethers = require('ethers');

async function advanceEvmTime(provider) {
  await provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  await provider.send("evm_mine");
}

module.exports = advanceEvmTime;