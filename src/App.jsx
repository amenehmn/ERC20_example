import './styles/App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import WebMetric20 from './utils/WebMetric20.json';

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0x5B2fd046f99fF0ad4Df1bb04c340AB3229cb8C35";

const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
					setCurrentAccount(account)
          
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
      } else {
          console.log("No authorized account found")
      }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintToken = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, WebMetric20.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let AddrTxt = document.getElementById("addr").value;
        let AmountTxt = document.getElementById("amount").value;
        try{
        let mintTxn = await connectedContract.mint(AddrTxt, AmountTxt, { gasLimit: 300000 })

        console.log("Mining...please wait.")
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${mintTxn.hash}`);
        document.getElementById("miningTxt").innerHTML = `Mining...please wait.`
        await mintTxn.wait();
        console.log(mintTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${mintTxn.hash}`);
        document.getElementById("miningTxt").innerHTML = " مقدار "+ AmountTxt + " برای این آدرس " + AddrTxt + "مینت شد. برای دیدن تراکنش لینک زیر را در مرورگر خود کپی کنید" + `https://rinkeby.etherscan.io/tx/${mintTxn.hash}` ;
      }catch (err) {
       document.getElementById("miningTxt").innerHTML = "";
        if (mintTxn.hash){
        alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${mintTxn.hash}`)
    }
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  //// Burn Function
  const askContractToBurnToken = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, WebMetric20.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let burnAmountTxt = document.getElementById("amountBurn").value;
        try {
        let Txn = await connectedContract.burn(burnAmountTxt, { gasLimit: 300000 });

        console.log("Mining...please wait.")
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${Txn.hash}`);
        document.getElementById("miningTxt").innerHTML = `Mining...please wait.`
        await Txn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${Txn.hash}`);
      document.getElementById("miningTxt").innerHTML = " شما این مقدار "+ burnAmountTxt  + "توکن سوزاندید. برای دیدن تراکنش لینک زیر را در مرورگر خود کپی کنید " + `https://rinkeby.etherscan.io/tx/${mintTxn.hash}` ;
        }catch (err) {
      document.getElementById("miningTxt").innerHTML = "";
        if (Txn.hash){
        alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${Txn.hash}`)
    }
    } 
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderFuncUI = () => (
    <div className="tokenFuncs">
      <div className="mintBlock">
        <label for="addr" style={{color:"White"}}>Address: </label>
        <input type="text" id="addr" className="addr"/><br></br>
        <label for="amount" style={{color:"White", marginLeft: "15px"}}>Amount: </label>
        <input type="text" id="amount" className="amount"/><br></br> 
  </div>
      <button onClick={askContractToMintToken} className="cta-button mint-button">Mint</button>
      
    <div className="burnBlock" style={{marginTop:"50px"}}>
        <label for="amountBurn" style={{color:"White"}}>Burn Amount: </label>
        <input type="text" id="amountBurn" className="amountBurn"/><br></br> 
  </div>
      <button onClick={askContractToBurnToken} className="cta-button mint-button">
        Burn
      </button>
      <div id="miningTxt" style={{textAlign: 'center', marginTop:"30px", color:"White", direction: "rtl"}}></div>
    </div>
  )


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">WebMetric ERC20</p>
          <p className="sub-text">
            این پروژه برای ضرب کردن و سوزاندن یک توکن ERC20 طراحی شده است.
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderFuncUI()}
        </div>
      </div>
    </div>
  );
};

export default App;