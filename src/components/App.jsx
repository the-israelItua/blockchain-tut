import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import Main from "./Main";

const App = () => {
  const [account, setAccount] = useState(null);
  const [daiToken, setDaiToken] = useState({});
  const [dappToken, setDappToken] = useState({});
  const [tokeFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState("0");
  const [dappTokenBalance, setDappTokenBalance] = useState("0");
  const [stakingBalance, setStakingBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    };

    const loadBlockChain = async () => {
      setLoading(true);
      const web3 = window.web3;

      const accounts = await web3.eth.getAccounts();

      let userAccount = accounts[0];
      setAccount(userAccount);

      const networkId = await web3.eth.net.getId();

      const daiTokenData = DaiToken.networks[networkId];
      if (daiTokenData) {
        const fetchedDaiToken = new web3.eth.Contract(
          DaiToken.abi,
          daiTokenData.address
        );

        setDaiToken(fetchedDaiToken);

        const daiTokenBalance = await fetchedDaiToken.methods
          .balanceOf(userAccount)
          .call();

        setDaiTokenBalance(daiTokenBalance.toString());
      } else {
        window.alert("DaiToken contract not deployed to detected network");
      }

      const dappTokenData = DappToken.networks[networkId];
      if (dappTokenData) {
        const fetchedDappToken = new web3.eth.Contract(
          DappToken.abi,
          dappTokenData.address
        );

        setDappToken(fetchedDappToken);

        const dappTokenBalance = await fetchedDappToken.methods
          .balanceOf(userAccount)
          .call();

        setDappTokenBalance(dappTokenBalance.toString());
      } else {
        window.alert("DappToken contract not deployed to detected network");
      }

      const tokenFarmData = TokenFarm.networks[networkId];
      if (tokenFarmData) {
        const fetchedTokenFarm = new web3.eth.Contract(
          TokenFarm.abi,
          tokenFarmData.address
        );
        setTokenFarm(fetchedTokenFarm);
        let stakingBalance = await fetchedTokenFarm.methods
          .stakingBalance(userAccount)
          .call();
        setStakingBalance(stakingBalance.toString());
      } else {
        window.alert("TokenFarm contract not deployed to detected network.");
      }

      setLoading(false);
    };

    loadWeb3();
    loadBlockChain();
  }, []);

  return (
    <div>
      {loading ? (
        <p id="loader" className="text-center">
          Loading ...
        </p>
      ) : (
        <Main
          daiTokenBalance={daiTokenBalance}
          dappTokenBalance={dappTokenBalance}
          stakingBalance={stakingBalance}
        />
      )}
    </div>
  );
};

export default App;
