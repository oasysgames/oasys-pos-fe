import type { NextPage } from 'next';
import { useState, ChangeEvent } from 'react';
import { handleError } from '@/features';
import { ErrorMsg } from '@/components/atoms';
import {
  ValidatorInfo,
  Form,
  LoadingModal,
} from '@/components/organisms';
import { ValidatorInfoType } from '@/types/oasysHub/validatorInfo';
import { getValidatorInfo as getValidatorInfoFromContract } from '@/features';
import dynamic from 'next/dynamic'

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () => import('@/components/organisms/walletConnect').then(m => m.WalletConnect),
  { ssr: false }
);

const CheckValidator: NextPage = () => {
  const [formError, setFormError] = useState('');
  const [validatorAddress, setValidatorAddress] = useState('');
  const [validatorInfo, setValidatorInfo] = useState<ValidatorInfoType>();
  const [isValidatorInfoLoading, setIsValidatorInfoLoading] = useState(false);

  const handleChainChanged = async () => {
    setValidatorInfo(undefined);
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
        handleChainChanged={ handleChainChanged }
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

export default dynamic(
  () => Promise.resolve(CheckValidator),
  { ssr: false }
);
