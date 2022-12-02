import clsx from 'clsx';
import { ethers } from 'ethers';
import { ChangeEvent, SetStateAction } from 'react';
import { ErrorMsg, SuccessMsg } from '@/components/atoms';
import { Form } from '@/components/organisms';
import { L1BuildDeposit } from '@/types/oasysHub/verseBuild';

type Props = {
  className?: string;
  depositSuccess: string;
  depositError: string;
  depositLoadError?: any;
  deposited?: L1BuildDeposit;
  amount: string;
  setAmount: (value: SetStateAction<string>) => void;
  deposit: () => Promise<void>;
  withdraw: () => Promise<void>;
  idDepositLoading: boolean;
};

export const Deposit = (props: Props) => {
  const {
    className,
    depositSuccess,
    depositError,
    depositLoadError,
    deposited,
    amount,
    setAmount,
    deposit,
    withdraw,
    idDepositLoading,
  } = props;

  const depositInputs = [
    {
      placeholder: 'set amount($OAS)',
      value: amount,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setAmount(e.target.value)},
    },
  ];

  const depositButtons = [
    {
      handleClick: deposit,
      disabled: !amount || idDepositLoading,
      value: 'Deposit',
    },
    {
      handleClick: withdraw,
      disabled: !amount || idDepositLoading,
      value: 'Withdraw',
    },
  ];

  return (
    <div className={clsx(
      className,
    )}>
      {depositSuccess && (
        <SuccessMsg className='text-center' text={depositSuccess} />
      )}
      {depositLoadError instanceof Error && (
        <ErrorMsg className='text-center' text={depositLoadError.message} />
      )}
      {depositError && (
        <ErrorMsg className='text-center' text={ depositError } />
      )}
      <p>Deposit amount: {deposited?.amount ? `${ethers.utils.formatEther(deposited.amount)}$OAS`: ''}</p>
      <Form
        inputs={depositInputs}
        buttons={depositButtons}
      />
    </div>
  );
};
