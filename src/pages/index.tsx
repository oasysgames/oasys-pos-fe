import type { NextPage } from 'next';
import { useState } from 'react';
import { ethers } from 'ethers';
import StakeManager from '../contracts/StakeManager.json';
import AllowList from '../contracts/AllowList.json';
import { stakeManagerAddress, allowListAddress } from '../config';
import { getSigner } from '../features';
import { Button, Input, ErrorMsg, SuccessMsg } from '../components';
import { isNotAllowedMessage } from '../const';

const Home: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [ownerSuccessMsg, setOwnerSuccessMsg] = useState('');
  const [operatorError, setOperatorError] = useState('');
  const [operatorAddress, setOperatorAddress] = useState('');
  const [newOperator, setNewOperator] = useState('');
  const [operatorSuccessMsg, setOperatorSuccessMsg] = useState('');

  const refreshError = () => {
    setOwnerError('');
    setOperatorError('');
  };

  const setOwner = async () => {
    const signer = await getSigner();
    const address = await signer.getAddress();
    const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
    const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);

    setOwnerAddress(address);
    try {
      const iaAllow = await allowListContract.containsAddress(address);
      if (!iaAllow) {
        throw new Error(isNotAllowedMessage);
      }
      const result = await stakeManagerContract.getValidatorInfo(address, 0);
      if (result.operator !== '0x0000000000000000000000000000000000000000') {
        setOperatorAddress(result.operator);
      }
    } catch (err) {
      if (err instanceof Error) {
        setOwnerError(err.message);
      }
    }
  }

  const registerOperator = async () => {
    const signer = await getSigner();
    const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
    const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);

    try {
      const iaAllow = await allowListContract.containsAddress(ownerAddress);
      if (!iaAllow) {
        throw new Error(isNotAllowedMessage);
      }
      await stakeManagerContract.joinValidator(newOperator);
      setOperatorAddress(newOperator);
      setNewOperator('');
      refreshError();
      setOperatorSuccessMsg('operator register is successful');
    } catch (err) {
      if (err instanceof Error) {
        setOperatorError(err.message);
        setOperatorSuccessMsg('');
      }
    }
  }

  const updateOperator = async () => {
    const signer = await getSigner();
    const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
    const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);

    try {
      const iaAllow = await allowListContract.containsAddress(ownerAddress);
      if (!iaAllow) {
        throw new Error(isNotAllowedMessage);
      }
      await stakeManagerContract.updateOperator(newOperator);
      setOperatorAddress(newOperator);
      setNewOperator('');
      refreshError();
      setOperatorSuccessMsg('operator update is successful');
    } catch (err) {
      if (err instanceof Error) {
        setOperatorError(err.message);
        setOperatorSuccessMsg('');
      }
    }
  }

  const claimCommissions = async () => {
    const signer = await getSigner();
    const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
    const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);

    try {
      const iaAllow = await allowListContract.containsAddress(ownerAddress);
      if (!iaAllow) {
        throw new Error(isNotAllowedMessage);
      }
      await stakeManagerContract.claimCommissions(ownerAddress, 0);
      refreshError();
      setOwnerSuccessMsg('claim commissions is successful');
    } catch (err) {
      if (err instanceof Error) {
        setOwnerError(err.message);
        setOwnerSuccessMsg('');
      }
    }
  };

  return (
    <div className='px-2 py-2'>
      <div className='space-y-4'>
        <div className='space-y-0.5'>
          {ownerError && (
            <ErrorMsg text={ ownerError } />
          )}
          <p>Owner Address:  {ownerAddress}</p>
          <div className="flex items-center space-x-2">
            <Button
              handleClick={setOwner}
            >
              Connect
            </Button>
            <Button
              handleClick={claimCommissions}
              disabled={true}
              // todo: After it's enable to claimCommissions, enable following code.
              // disabled={!ownerAddress}
            >
              Claim Commissions
            </Button>
          </div>
          <SuccessMsg text={ ownerSuccessMsg } />
        </div>
        <div className='space-y-0.5 col-span-6'>
          {operatorError && (
            <ErrorMsg text={ operatorError } />
          )}
          <p>Operator address: { operatorAddress }</p>
          <Input
            placeholder='set operator address'
            value={newOperator}
            handleClick={e => setNewOperator(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Button
              handleClick={registerOperator}
              disabled={!!operatorAddress}
            >
              Register
            </Button>
            <Button
              handleClick={updateOperator}
              disabled={!operatorAddress}
            >
              Update
            </Button>
          </div>
          <SuccessMsg text={ operatorSuccessMsg } />
        </div>
      </div>

    </div>
  )
}

export default Home
