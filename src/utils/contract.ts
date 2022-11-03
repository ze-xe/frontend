// import dotenv from 'dotenv';
// dotenv.config()

import tronWebObject from "./tronWeb";
import { ADDRESSES } from './const';

const networkId = process.env.REACT_APP_NETWORK_ID ?? 3;

export function getABI(contractName: string) {
  const contractBuild = require('../abis/' + contractName + '.json');
  return contractBuild.abi;
}

export function getAddress(contractName: string) {
  return ADDRESSES[contractName]
}