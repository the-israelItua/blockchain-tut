import React from "react";
import valueToWei from "../utils/valueToWei";

const Main = ({ daiTokenBalance, dappTokenBalance, stakingBalance }) => {
  return (
    <div>
      <div>
        <h5>Staking Balance</h5>
        <p>{valueToWei(stakingBalance.toString())} mDai</p>
      </div>

      <div>
        <h5>Reward Balance</h5>
        <p>{dappTokenBalance} DAPP</p>
      </div>
    </div>
  );
};

export default Main;
