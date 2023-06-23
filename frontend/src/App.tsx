import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";
import { NoWalletDetected } from './components/NoWalletDetected';

function App() {

  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  if (!this.state.selectedAddress) {
    return (
      <ConnectWallet 
        connectWallet={() => this._connectWallet()} 
        networkError={this.state.networkError}
        dismiss={() => this._dismissNetworkError()}
      />
    );
  }

  return (
    <>
      <div>

      </div>
    </>
  )
}

export default App
