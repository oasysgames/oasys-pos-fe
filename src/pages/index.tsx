import type { NextPage } from 'next';
import { useState } from 'react';
import { ethers } from 'ethers';
import StakeManager from '../contracts/StakeManager.json';
import AllowList from '../contracts/AllowList.json';
import { stakeManagerAddress, allowListAddress } from '../config';
import { getSigner, isAllowedAddress } from '../features';
import { PageTitle, Button, Input, ErrorMsg, SuccessMsg } from '../components/atoms';

const Home: NextPage = () => {
  const pageTitle = 'Validator.join';
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
      await isAllowedAddress(allowListContract, address);
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
      await isAllowedAddress(allowListContract, ownerAddress);
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
      await isAllowedAddress(allowListContract, ownerAddress);
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
      await isAllowedAddress(allowListContract, ownerAddress);
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
    <div className='px-2 py-2 space-y-10 pb-96'>
      <PageTitle text={pageTitle} className='pb-48' />
      <div className='space-y-10 grid grid-cols-8'>
        <div className='space-y-0.5 col-span-4 col-start-3'>
          {ownerError && (
            <ErrorMsg text={ ownerError } className='w-full' />
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
              disabled={!ownerAddress}
            >
              Claim Commissions
            </Button>
          </div>
          <div>
            {
              ownerSuccessMsg && (
                <SuccessMsg text={ownerSuccessMsg} />
              )
            }
          </div>
        </div>
        <div className='space-y-0.5 col-span-4 col-start-3'>
          {operatorError && (
            <ErrorMsg text={ operatorError } />
          )}
          <p>Operator address: { operatorAddress }</p>
          <Input
            placeholder='set operator address'
            value={newOperator}
            handleClick={e => setNewOperator(e.target.value)}
            className='w-full'
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
          <div>
            {
              operatorSuccessMsg && (
                <SuccessMsg text={operatorSuccessMsg} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
