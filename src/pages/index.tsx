import type { NextPage } from 'next';
import { useState } from 'react';
import { ethers } from 'ethers';
import StakeManager from '../contracts/StakeManager.json';
import { contractAddress } from '../config';
import { getSigner } from '../features';
import { Button, Input, ErrorMsg, SuccessMsg } from '../components';

const Home: NextPage = () => {
  const [ownerAddressError, setOwnerAddressError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [operatorAddressError, setOperatorAddressError] = useState('');
  const [operatorAddress, setOperatorAddress] = useState('');
  const [input, setInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
      await contract.joinValidator(input);
      setOperatorAddress(input);
      setInput('');
      setOwnerAddressError('');
      setOperatorAddressError('');
      setSuccessMsg('validator setting is successful');
    } catch (err) {
      if (err instanceof Error) {
        setOperatorAddressError(err.message);
      }
    }
  }
  return (
    <div className='px-2 py-2'>
      <div className='space-y-4'>
        <div className='space-y-0.5'>
          {ownerAddressError && (
            <ErrorMsg text={ ownerAddressError } />
          )}
          <p>Owner Address:  { ownerAddress}</p>
          <Button
            handleClick={setOwner}
          >
            Connect
          </Button>
        </div>
        <div className='space-y-0.5'>
          {operatorAddressError && (
            <ErrorMsg text={ operatorAddressError } />
          )}
          <p>Operator address: { operatorAddress }</p>
          <Input
            placeholder='set operator address'
            value={input}
            disabled={!!operatorAddress}
            handleClick={e => setInput(e.target.value)}
          />
          <Button
            handleClick={Submit}
            disabled={!!operatorAddress}
          >
            Submit
          </Button>
        </div>
        <SuccessMsg text={ successMsg } />
      </div>

    </div>
  )
}

export default Home
