import { ethers } from "ethers";

import abi from "../utils/Keyboards.json"

const contractAddress = '0xBb02FD08dEdB32e144bD32DAA2c472Ed450D2d16';
const contractABI = abi.abi;

export default function getKeyboardsContract(ethereum) {
  if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}