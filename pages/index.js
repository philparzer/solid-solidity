import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PrimaryButton from "../components/primary-button";
import Keyboard from "../components/keyboard";
import addressesEqual from "../utils/addressesEqual"; //checks if user is owner of keyboard
import { UserCircleIcon } from "@heroicons/react/solid"; //icon to indicate that user is owner of keyboard
import TipButton from "../components/tip-button";
import getKeyboardsContract from "../utils/getKeyboardsContract";
import { toast } from "react-hot-toast";
import { useMetaMaskAccount } from "../components/meta-mask-account-provider";

export default function Home() {

  const { ethereum, connectedAccount, connectAccount } = useMetaMaskAccount();
  //---------------------------------------------------------------
  //state hooks
  const [keyboards, setKeyboards] = useState([])
  const [retrievingKeyboards, setRetrievingKeyboards] = useState(false)
  const keyboardsContract = getKeyboardsContract(ethereum);

  // //smart contract comm
  const getKeyboards = async () => {
    if (ethereum && connectedAccount) {
      setRetrievingKeyboards(true)
      try {
        const keyboards = await keyboardsContract.getKeyboards();
        console.log('Retrieved keyboards...', keyboards)
        setKeyboards(keyboards)
      } 
      
      finally {
        setRetrievingKeyboards(false)
      }
  }

  }

  const addContractEventHandlers = () => {
    if (keyboardsContract && connectedAccount) {
      keyboardsContract.on('KeyboardCreated', async (keyboard) => {
        if (connectedAccount && !addressesEqual(keyboard.owner, connectedAccount)) {
          toast('Somebody created a new keyboard!', { id: JSON.stringify(keyboard) })
        }
        await getKeyboards();
      })

      keyboardsContract.on('TipSent', (recipient, amount) => {
        if (addressesEqual(recipient, connectedAccount)) {
          toast(`You received a tip of ${ethers.utils.formatEther(amount)} eth!`, { id: recipient + amount });
        }
      })

    }
  }
  

  //---------------------------------------------------------------
  //update hooks
  useEffect(() => getKeyboards(), [!!keyboardsContract, connectedAccount])
  useEffect(addContractEventHandlers, [!!keyboardsContract, connectedAccount]);

  //---------------------------------------------------------------
  //render
  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site</p>
  }
  
    if (!connectedAccount) {
      return <PrimaryButton onClick={connectAccount}>Connect MetaMask</PrimaryButton>
    }
    
    if (keyboards.length > 0) {
      return (
        
        <div className="flex flex-col gap-4">
          <PrimaryButton type="link" href="/create">Create your own Keyboard ⌨️</PrimaryButton>

          {keyboards.map(([size, isPBT, filter, owner], i) => (
            <div key={i} className="relative">
              <Keyboard size={size} isPBT={isPBT} filter={filter} />
              <span className="absolute top-1 right-6">
                {addressesEqual(owner, connectedAccount) ?
                  <UserCircleIcon className="h-5 w-5 text-indigo-100" /> :
                  <TipButton keyboardsContract={keyboardsContract} index={i} />
                }
              </span>
              <span className="absolute bottom-1 right-8 text-white ">by {addressesEqual(owner, connectedAccount) ? "yours truly" : owner.slice(0, 5) + '...' + owner.slice(-3, owner.length)}</span>
            </div>
            )
          )}

        </div>
          
      )
    }
    
    if (retrievingKeyboards) {
      return (
        <div className="flex flex-col gap-4">
          <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
          <div>Loading&nbsp;&nbsp;<span className="animate-ping relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></div>
        </div>
      )
    }

    //No keyboards yet
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <p>No keyboards yet!</p>
      </div>
    )
}  
