const Web3 = require("web3");

module.exports = function(value) {
  return Web3.utils.toWei(value, "ether");
};
