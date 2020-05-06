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
