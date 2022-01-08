import { useState } from "react";
import SecondaryButton from "./secondary-button";
import { ethers } from "ethers";

export default function TipButton({ keyboardsContract, index }) {

  const [mining, setMining] = useState(false)

  const submitTip = async (e) => {
    if (!keyboardsContract) {
      console.error('KeyboardsContract object is required to submit a tip');
      return;
    }
  
    setMining(true);
    try {
      const tipTxn = await keyboardsContract.tipCreator(index, { value: ethers.utils.parseEther("0.01") })
      console.log('Tip transaction started...', tipTxn.hash)
  
      await tipTxn.wait();
      console.log('Sent tip!', tipTxn.hash);
    } finally {
      setMining(false);
    }
  }
  

  return <SecondaryButton onClick={submitTip} disabled={mining}>
    {mining ? <div>Tipping &nbsp;&nbsp;<span className="animate-ping relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></div> : 'Tip 0.01 eth!'}
  </SecondaryButton>
}