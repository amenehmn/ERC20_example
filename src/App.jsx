import './styles/App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import devxlab from './utils/devxlab.json';

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0xb3F2ab550aC4975864982FAcfaFb3E0864620bcd";

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
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, devxlab.abi, signer);

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
        console.log(`Mining, see transaction: https://rinkeby.etherscan.io/tx/${mintTxn.hash}`);
        document.getElementById("miningTxt").innerHTML = "Minted The amoun of: "+ AmountTxt + " to this address: " + AddrTxt + "See transaction:" ;
        document.getElementById("etherScanLnk").href = `https://rinkeby.etherscan.io/tx/${mintTxn.hash}`;
        document.getElementById("etherScanLnk").innerHTML = `https://rinkeby.etherscan.io/tx/${mintTxn.hash}`;
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
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, devxlab.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let burnAmountTxt = document.getElementById("amountBurn").value;
        try {
        let Txn = await connectedContract.burn(burnAmountTxt, { gasLimit: 300000 });

        console.log("Mining...please wait.");
        console.log(`Mining, see transaction: https://rinkeby.etherscan.io/tx/${Txn.hash}`);
        document.getElementById("miningTxt").innerHTML = `Mining...please wait.`
        let tnxHash = Txn.hash;
        await Txn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${Txn.hash}`);
      document.getElementById("miningTxt").innerHTML = " You burned "+ burnAmountTxt  + "Token, see transaction:" ;
          document.getElementById("etherScanLnk").href = `https://rinkeby.etherscan.io/tx/${Txn.hash}`;
          document.getElementById("etherScanLnk").innerHTML = `https://rinkeby.etherscan.io/tx/${Txn.hash}`;
        } catch(err) {
        document.getElementById("miningTxt").innerHTML = "";
        if (tnxHash){
        alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${tnxHash}`);
    }
    } 
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
/// allowance
   const transfer_Ownership = async () => {
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
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, devxlab.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let newOwnerTxt = document.getElementById("newOwner").value;
        // try{
        let ownerTxn = await connectedContract.transferOwnership(newOwnerTxt, { gasLimit: 300000 })

        console.log("Mining...please wait.")
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${ownerTxn.hash}`);
        document.getElementById("miningTxt").innerHTML = `Mining...please wait.`
        await ownerTxn.wait();
        console.log(ownerTxn);
        console.log(`Mining, see transaction: https://rinkeby.etherscan.io/tx/${ownerTxn.hash}`);
        document.getElementById("miningTxt").innerHTML = "Minted The amoun of: "+ AmountTxt + " to this address: " + AddrTxt + "See transaction:";
        document.getElementById("etherScanLnk").href = `https://rinkeby.etherscan.io/tx/${ownerTxn.hash}`;
        document.getElementById("etherScanLnk").innerHTML = `https://rinkeby.etherscan.io/tx/${ownerTxn.hash}`;
          
      // }catch (err) {
    //    document.getElementById("miningTxt").innerHTML = "";
    //     if (ownerTxn.hash){
    //     alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${ownerTxn.hash}`)
    // }
    //     }
      } 
      else {
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
        <label for="addr" style={{color:"White", marginRight:"5px"}}>Address: </label>
        <input type="text" id="addr" className="addr"/><br></br>
        <label for="amount" style={{color:"White", marginLeft: "15px", marginRight:"5px"}}>Amount: </label>
        <input type="text" id="amount" className="amount"/><br></br> 
        <button onClick={askContractToMintToken} className="cta-button mint-button">Mint</button>
  </div>
      
    <div className="mintBlock" style={{marginTop:"50px"}}>
        <label for="amountBurn" style={{color:"White", marginRight:"5px"}}>Burn Amount: </label>
        <input type="text" id="amountBurn" className="amountBurn"/><br></br> 
      <button onClick={askContractToBurnToken} className="cta-button mint-button">
        Burn
      </button>
    </div>

      <div className="mintBlock">
        <label for="newOwner" style={{color:"White",marginRight:"5px"}}>New Owner: </label>
        <input type="text" id="newOwner" className="newOwner"/><br></br>
      <button onClick={transfer_Ownership} className="cta-button mint-button">Ownership</button>
  </div>
      
      
      <div id="miningTxt" style={{textAlign: 'center', marginTop:"30px", color:"White",fontSize: "16px",fontWeight: "bold"}}></div>
    <div>
    <a id="etherScanLnk" style={{textAlign: 'center', color:"White",fontSize: "16px",fontWeight: "bold"}}></a>
    </div>
    </div>
  )


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">DevXLab ERC20</p>
          <p className="sub-text">
            This is a project for minting and burning a ERC20 Token
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderFuncUI()}
        </div>
      </div>
    </div>
  );
};

export default App;