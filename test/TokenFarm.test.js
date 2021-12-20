const { assert } = require("chai");

const valueToWei = require("../src/utils/valueToWei");

const DappToken = artifacts.require("./DappToken.sol");
const DaiToken = artifacts.require("./DaiToken.sol");
const TokenFarm = artifacts.require("./TokenFarm.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    dappToken = await DappToken.new();
    daiToken = await DaiToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //Transfer all Dapp token to token farm

    await dappToken.transfer(tokenFarm.address, valueToWei("1000000"));

    //Transfer 100 Dai tokens to investor

    await daiToken.transfer(investor, valueToWei("100"), { from: owner });
  });

  describe("Mock DAI deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });

    it("has all tokens", async () => {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), valueToWei("1000000"));
    });
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking mDai tokens", async () => {
      let result;

      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), valueToWei("100"));

      await daiToken.approve(tokenFarm.address, valueToWei("100"), {
        from: investor,
      });
      await tokenFarm.stakeTokens(valueToWei("100"), { from: investor });

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        valueToWei("0"),
        "investor has correct balance after transfering"
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        valueToWei("100"),
        "token farm has correct balance after being deposited to"
      );

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        valueToWei("100"),
        "token farm has correct staking balance"
      );

      result = await tokenFarm.isStaking(investor);
      assert.equal(
        result.toString(),
        "true",
        "toke farm isStaking is updated correctly"
      );

      await tokenFarm.issueRewards({ from: owner });

      result = await dappToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        valueToWei("100"),
        "investor has correct balance after being deposited to"
      );

      await tokenFarm.issueRewards({ from: investor }).should.be.rejected;
    });
  });
});
