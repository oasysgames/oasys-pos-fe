import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import StakeManager from '../contracts/StakeManager.json';
import { contractAddress } from '../config';
import { getSigner } from '../features';

const Home: NextPage = () => {
  const [ownerAddressError, setOwnerAddressError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [operatorAddressError, setOperatorAddressError] = useState('');
  const [operatorAddress, setOperatorAddress] = useState('');

  const setOwner = async () => {
    const signer = await getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, StakeManager.abi, signer);

    setOwnerAddress(address);
    try {
      const result = await contract.getValidatorInfo(address, 0);
      if (result.operator !== '0x0000000000000000000000000000000000000000' && result.candidate) {
        setOperatorAddress(result.operator);
      }
    } catch (err) {
      if (err instanceof Error) {
        setOwnerAddressError(err.message);
      }
    }
  }
  const Submit = async () => {
    const signer = await getSigner();
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
        {ownerAddressError && (
          <p>{ ownerAddressError }</p>
        )}
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
