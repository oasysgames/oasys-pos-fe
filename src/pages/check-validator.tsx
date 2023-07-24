import type { NextPage } from 'next';
import { useEffect, useState, ChangeEvent } from 'react';
import { isNotConnectedMsg } from '@/consts';
import {
  getProvider,
  getSigner,
  handleError,
} from '@/features';
import { ErrorMsg } from '@/components/atoms';
import {
  WalletConnect,
  ValidatorInfo,
  Form,
  LoadingModal,
} from '@/components/organisms';
import { ValidatorInfoType } from '@/types/oasysHub/validatorInfo';
import {  getValidatorInfo as getValidatorInfoFromContract } from '@/features';

const CheckValidator: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const [formError, setFormError] = useState('');
  const [validatorAddress, setValidatorAddress] = useState('');
  const [validatorInfo, setValidatorInfo] = useState<ValidatorInfoType>();
  const [isValidatorInfoLoading, setIsValidatorInfoLoading] = useState(false);

  const handleAccountsChanged = async () => {
    const provider = await getProvider();
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length === 0) {
      setOwnerAddress('');
      setOwnerError(isNotConnectedMsg);
      return;
    }
    setOwner();
  };

  const handleChainChanged = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    try {
      setConnectedChainId(chainId);
      setOwner();
      setValidatorInfo(undefined);
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

      setOwnerAddress(address);
      setConnectedChainId(chainId);
      setOwnerError('');
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  const getValidatorInfo = async () => {
    setFormError('');
    setIsValidatorInfoLoading(true);

    try {
      setValidatorInfo(await getValidatorInfoFromContract(validatorAddress));
    } catch (err) {
      handleError(err, setFormError);
    }
    setIsValidatorInfoLoading(false);
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  const inputs = [
    {
      placeholder: 'Validator Owner Address',
      value: validatorAddress,
      handleClick: (e: ChangeEvent<HTMLInputElement>) =>
        setValidatorAddress(e.target.value.trim()),
    },
  ];

  const buttons = [
    {
      handleClick: getValidatorInfo,
      disabled: !validatorAddress,
      value: 'Get Validator Info',
    },
  ];

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
      />

      {isValidatorInfoLoading && <LoadingModal />}
  
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {formError && <ErrorMsg text={formError} className='w-full' />}
        <Form inputs={inputs} buttons={buttons} />
      </div>

      {validatorInfo && (
        <ValidatorInfo
          className='space-y-2 col-span-4 col-start-3'
          ownerAddress={validatorAddress}
          validatorInfo={validatorInfo}
        />
      )}
    </div>
  );
};

export default CheckValidator;
