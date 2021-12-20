const DappToken = artifacts.require("./DappToken.sol");
const DaiToken = artifacts.require("./DaiToken.sol");
const TokenFarm = artifacts.require("./TokenFarm.sol");

module.exports = async function(deployer, network, accounts) {
  //Deploy Dapp Token
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  //Deploy DAI Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  //Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  //Transfer all tokens to TokenFarm
  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");

  //Transfer 100 DAI tokens tokens to investor
  await daiToken.transfer(accounts[1], "100000000000000000000");
};
