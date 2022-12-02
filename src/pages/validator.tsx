import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import StakeManager from '@/contracts/oasysHub/StakeManager.json';
import AllowList from '@/contracts/oasysHub/AllowList.json';
import { stakeManagerAddress, allowListAddress } from '@/config';
import { getProvider, getSigner, isAllowedAddress, isAllowedChain, handleError } from '@/features';
import { Button, ErrorMsg, SuccessMsg } from '@/components/atoms';
import { Form } from '@/components/organisms';
import { isNotConnectedMsg, ZERO_ADDRESS } from '@/consts';

const Home: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [ownerSuccessMsg, setOwnerSuccessMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [isOperatorUpdating, setIsOperatorUpdating] = useState(false);
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
      if (result.operator !== ZERO_ADDRESS) {
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
      refreshError();
      setIsOperatorUpdating(true);
      await stakeManagerContract.joinValidator(newOperator);

      const filter = stakeManagerContract.filters.ValidatorJoined(null);
      const callback = (owner: string) => {
        if (owner === ownerAddress) {
          setOperatorAddress(newOperator);
          setNewOperator('');
          setOperatorSuccessMsg(`operator register is successful`);
          setIsOperatorUpdating(false);
          stakeManagerContract.off(filter, callback);
        }
      };
      stakeManagerContract.on(filter, callback);
    } catch (err) {
      setOperatorSuccessMsg('');
      setIsOperatorUpdating(false);
      handleError(err, setOperatorError);
    }
  }

  const updateOperator = async () => {
    const signer = await getSigner();
    const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
    const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);

    try {
      await isAllowedAddress(allowListContract, ownerAddress);
      refreshError();
      setIsOperatorUpdating(true);
      await stakeManagerContract.updateOperator(newOperator);
      const filter = stakeManagerContract.filters.OperatorUpdated(ownerAddress, null, null);
      const callback = (owner: string, oldOperator: string, operator: string) => {
        setOperatorAddress(newOperator);
        setNewOperator('');
        setOperatorSuccessMsg(`update is successful. (${oldOperator} => ${operator})`);
        setIsOperatorUpdating(false);
      }
      stakeManagerContract.once(filter, callback);
    } catch (err) {
      setOperatorSuccessMsg('');
      setIsOperatorUpdating(false);
      handleError(err, setOperatorError);
    }
  }

  const claimCommissions = async () => {
    const signer = await getSigner();
    const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
    const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);

    try {
      await isAllowedAddress(allowListContract, ownerAddress);
      refreshError();
      setIsClaiming(true);
      await stakeManagerContract.claimCommissions(ownerAddress, 0);
      const filter = stakeManagerContract.filters.ClaimedCommissions(ownerAddress, null);
      stakeManagerContract.once(filter, (owner: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setOwnerSuccessMsg(`claim commissions is successful(${oasAmount}OAS)`);
        setIsClaiming(false);
      });
    } catch (err) {
      setOwnerSuccessMsg('');
      setIsClaiming(false);
      handleError(err, setOwnerError);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  const operatorInputs = [
    {
      placeholder: 'set operator address',
      value: newOperator,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setNewOperator(e.target.value)},
    },
  ];

  const operatorButtons = [
    {
      handleClick: registerOperator,
      disabled: !!operatorAddress || isOperatorUpdating,
      value: 'Register',
    },
    {
      handleClick: updateOperator,
      disabled: !operatorAddress || isOperatorUpdating,
      value: 'Update',
    },
  ];

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
            disabled={!ownerAddress || isClaiming}
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
        <Form
          inputs={operatorInputs}
          buttons={operatorButtons}
        />
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
