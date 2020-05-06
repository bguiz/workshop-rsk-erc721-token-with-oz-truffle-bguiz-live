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

  async loadBlockchainData() {
    const web3 = window.web3;

    // Load account
    const accounts = await web3.eth.getAccounts();
    console.log ('account: ', accounts[0]);
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Colours.networks[networkId];
    if (!networkData) {
      window.alert('Smart contract not deployed to detected network.');
      return;
    }

    const abi = Colours.abi;
    const address = networkData.address;

    const contract = new web3.eth.Contract(abi, address);
    this.setState({ contract });

    const totalSupply = await contract
      .methods.totalSupply().call();
    this.setState({ totalSupply });

    // Load Colors
    for (var i = 1; i <= totalSupply; i++) {
      const colourBytes = await contract
        .methods.colours(i - 1).call();
      const colourStr = colourHexToString(colourBytes);
      this.setState({
        colours: [...this.state.colours, colourStr],
      });
    }
  }

  mint = (colourStr) => {
    const colourBytes = colourStringToBytes(colourStr);
    this.state.contract.methods
      .mint(colourBytes)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        console.log ('transaction receipt: ', receipt)
        this.setState({
          colours: [...this.state.colours, colourStr],
        });
      });
  }

}

export default App;
