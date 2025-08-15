import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { handleError, getStakeManagerContract } from '@/features';
import { ErrorMsg, SuccessMsg } from '@/components/atoms';
import { Form, LoadingModal, ValidatorInfo } from '@/components/organisms';
import { ZERO_ADDRESS } from '@/consts';
import { useValidatorInfo, useRefreshValidatorInfo } from '@/hooks';
import { useAppKitAccount } from '@reown/appkit/react';
import dynamic from 'next/dynamic';

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () =>
    import('@/components/organisms/walletConnect').then((m) => m.WalletConnect),
  { ssr: false },
);

const JoinValidator: NextPage = () => {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' });
  const [isOperatorUpdating, setIsOperatorUpdating] = useState(false);
  const [operatorError, setOperatorError] = useState('');
  const [operatorAddress, setOperatorAddress] = useState('');
  const [newOperator, setNewOperator] = useState('');
  const [operatorSuccessMsg, setOperatorSuccessMsg] = useState('');
  const { validatorInfo, isValidatorInfoLoading, validatorInfoError } =
    useValidatorInfo(ownerAddress);
  const refreshValidatorInfo = useRefreshValidatorInfo();

  const refreshError = () => {
    setOperatorError('');
  };

  const handleAccountsChanged = async () => {
    if (validatorInfo && validatorInfo.operatorAddress !== ZERO_ADDRESS) {
      setOperatorAddress(validatorInfo.operatorAddress);
    } else {
      setOperatorAddress('');
    }
  };

  const handleChainChanged = async () => {
    refreshValidatorInfo();
  };

  const registerOperator = async () => {
    try {
      const stakeManagerContract = await getStakeManagerContract();
      refreshError();
      setIsOperatorUpdating(true);
      await stakeManagerContract.joinValidator(newOperator);

      const filter = stakeManagerContract.filters.ValidatorJoined(null);
      stakeManagerContract.once(filter, (owner) => {
        setOperatorAddress(newOperator);
        setNewOperator('');
        setOperatorSuccessMsg(`operator register is successful`);
        setIsOperatorUpdating(false);
      });
    } catch (err) {
      setOperatorSuccessMsg('');
      setIsOperatorUpdating(false);
      handleError(err, setOperatorError);
    }
  };

  const updateOperator = async () => {
    try {
      const stakeManagerContract = await getStakeManagerContract();
      refreshError();
      setIsOperatorUpdating(true);
      await stakeManagerContract.updateOperator(newOperator);

      const filter = stakeManagerContract.filters.OperatorUpdated(
        ownerAddress,
        null,
        null,
      );
      stakeManagerContract.once(filter, (owner, oldOperator, operator) => {
        setOperatorAddress(newOperator);
        setNewOperator('');
        setOperatorSuccessMsg(
          `update is successful. (${oldOperator} => ${operator})`,
        );
        setIsOperatorUpdating(false);
      });
    } catch (err) {
      setOperatorSuccessMsg('');
      setIsOperatorUpdating(false);
      handleError(err, setOperatorError);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshValidatorInfo();
  }, [ownerAddress, refreshValidatorInfo]);

  const operatorInputs = [
    {
      placeholder: 'set operator address',
      value: newOperator,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {
        setNewOperator(e.target.value);
      },
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
      {(isOperatorUpdating || isValidatorInfoLoading) && <LoadingModal />}
      <WalletConnect
        handleAccountsChanged={handleAccountsChanged}
        handleChainChanged={handleChainChanged}
      />
      <div className='space-y-4 col-span-4 col-start-3'>
        {operatorError && <ErrorMsg text={operatorError} />}
        {validatorInfoError instanceof Error && (
          <ErrorMsg text={validatorInfoError.message} className='w-full' />
        )}
        {ownerAddress && validatorInfo && validatorInfo.joined && (
          <ValidatorInfo
            className='space-y-2'
            ownerAddress={ownerAddress}
            validatorInfo={validatorInfo}
          />
        )}
        <Form inputs={operatorInputs} buttons={operatorButtons} />
        <div>
          {operatorSuccessMsg && <SuccessMsg text={operatorSuccessMsg} />}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(JoinValidator), { ssr: false });
