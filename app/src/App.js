import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Colours from './contracts/Colours.json';

function colourHexToString(hexStr) {
  return '#' + hexStr.substring(2);
}

function colourStringToBytes(str) {
  if (str.length !== 7 || str.charAt(0) !== '#') {
    throw new Error('invalid colour string');
  }
  const hexStr = '0x' + str.substring(1);
  return Web3.utils.hexToBytes(hexStr);
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colours: [],
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      // current web3 providers
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      // fallback for older web3 providers
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      // no web3 provider, user needs to install one in their browser
      window.alert(
        'No injected web3 provider detected');
    }
    console.log(window.web3.currentProvider);
  }
}

export default App;
