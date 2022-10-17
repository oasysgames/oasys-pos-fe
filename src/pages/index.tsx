import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { useState, useRef } from 'react';
import { ethers } from 'ethers';
import StakeManager from '../contracts/StakeManager.json';
import { contractAddress } from '../config';
import { getSigner } from '../features';

const Home: NextPage = () => {
  let signer: ethers.providers.JsonRpcSigner
  const [ownerAddress, setOwnerAddress] = useState('');
  const [operatorAddressError, setOperatorAddressError] = useState('');
  const [operatorAddress, setOperatorAddress] = useState('');

  const setOwner = async () => {
    signer = await getSigner();
    const address = await signer.getAddress();
    setOwnerAddress(address);
  }
  const Submit = async () => {
    if (!signer) {
      signer = await getSigner();
    }
    const contract = new ethers.Contract(contractAddress, StakeManager.abi, signer);
    try {
      await contract.joinValidator(operatorAddress);
    } catch (err) {
      if (err instanceof Error) {
        setOperatorAddressError(err.message);
      }
    }
  }
  return (
    <div>
      <div>
        <p>Owner Address:  { ownerAddress}</p>
        <button onClick={setOwner}>Set owner  by metamask</button>
      </div>
      <div>
        {operatorAddressError && (
          <p>{ operatorAddressError }</p>
        )}
        <p>Operator address</p>
        <input
          value={operatorAddress}
          onChange={e => setOperatorAddress(e.target.value)}
          type="text" />
        <button onClick={Submit}>Submit</button>
      </div>
    </div>
  )
}

export default Home
