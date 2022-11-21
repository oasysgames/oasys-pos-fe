import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import StakeManager from '../contracts/StakeManager.json';
import AllowList from '../contracts/AllowList.json';
import { stakeManagerAddress, allowListAddress } from '../config';
import { getProvider, getSigner, isAllowedAddress, isAllowedChain, handleError } from '../features';
import { Button, Input, ErrorMsg, SuccessMsg } from '../components/atoms';
import { isNotConnectedMsg } from '../const';

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

  const handleAccountsChanged = async () => {
    const provider = await getProvider();
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length === 0) {
      setOwnerAddress('');
      setOwnerError(isNotConnectedMsg);
      return;
    };
    setOwner();
  };

  const handleChainChanged = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    try {
      isAllowedChain(chainId);
      setOwner();
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  const setOwner = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();

      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
      const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);

      setOwnerAddress(address);
      isAllowedChain(chainId);
      await isAllowedAddress(allowListContract, address);
      const result = await stakeManagerContract.getValidatorInfo(address, 0);
      if (result.operator !== '0x0000000000000000000000000000000000000000') {
        setOperatorAddress(result.operator);
      }
      setOwnerError('');
    } catch (err) {
      handleError(err, setOwnerError);
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
      setOperatorSuccessMsg('');
      handleError(err, setOperatorError);
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
      setOperatorSuccessMsg('');
      handleError(err, setOperatorError);
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
      setOwnerSuccessMsg('');
      handleError(err, setOwnerError);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
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
  )
}

export default Home
