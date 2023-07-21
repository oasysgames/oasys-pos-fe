import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { getProvider, getSigner, handleError, getStakeManagerContract } from '@/features';
import { ErrorMsg, SuccessMsg } from '@/components/atoms';
import { Form, LoadingModal, WalletConnect, ValidatorInfo } from '@/components/organisms';
import { isNotConnectedMsg, ZERO_ADDRESS } from '@/consts';

const JoinValidator: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
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
      setConnectedChainId(chainId);
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

      const stakeManagerContract = await getStakeManagerContract();

      setOwnerAddress(address);
      setConnectedChainId(chainId);
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
    try {
      const stakeManagerContract = await getStakeManagerContract();
      refreshError();
      setIsOperatorUpdating(true);
      await stakeManagerContract.joinValidator(newOperator);

      const filter = stakeManagerContract.filters.ValidatorJoined(null);
      stakeManagerContract.once(filter, (owner) => {
        if (owner === ownerAddress) {
          setOperatorAddress(newOperator);
          setNewOperator('');
          setOperatorSuccessMsg(`operator register is successful`);
          setIsOperatorUpdating(false);
        }
      });
    } catch (err) {
      setOperatorSuccessMsg('');
      setIsOperatorUpdating(false);
      handleError(err, setOperatorError);
    }
  }

  const updateOperator = async () => {
    try {
      const stakeManagerContract = await getStakeManagerContract();
      refreshError();
      setIsOperatorUpdating(true);
      await stakeManagerContract.updateOperator(newOperator);
      const filter = stakeManagerContract.filters.OperatorUpdated(ownerAddress, null, null);
      stakeManagerContract.once(filter, (owner, oldOperator, operator) => {
        setOperatorAddress(newOperator);
        setNewOperator('');
        setOperatorSuccessMsg(`update is successful. (${oldOperator} => ${operator})`);
        setIsOperatorUpdating(false);
      });
    } catch (err) {
      setOperatorSuccessMsg('');
      setIsOperatorUpdating(false);
      handleError(err, setOperatorError);
    }
  }

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
      {(isOperatorUpdating) && <LoadingModal/>}
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
      />
      <div className='space-y-4 col-span-4 col-start-3'>
        {operatorError && (
          <ErrorMsg text={ operatorError } />
        )}
        <ValidatorInfo
          ownerAddress={ownerAddress}
          operatorAddress={operatorAddress}
        />
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

export default JoinValidator
