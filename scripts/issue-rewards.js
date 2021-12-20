const TokenFarm = artifacts.require("./TokenFarm.sol");

module.exports = async function(callback) {
  console.log("Tokens issued");
  callback();
};
