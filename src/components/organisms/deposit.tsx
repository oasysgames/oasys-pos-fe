import clsx from 'clsx';
import { ethers } from 'ethers';
import { ChangeEvent, SetStateAction } from 'react';
import { Form } from '@/components/organisms';

type Props = {
  className?: string;
  depositedAmount?: ethers.BigNumber;
  amount: string;
  setAmount: (value: SetStateAction<string>) => void;
  deposit: () => Promise<void>;
  withdraw: () => Promise<void>;
  idDepositLoading: boolean;
  tokenUnit: string;
};

export const Deposit = (props: Props) => {
  const {
    className,
    depositedAmount,
    amount,
    setAmount,
    deposit,
    withdraw,
    idDepositLoading,
    tokenUnit,
  } = props;

  const depositInputs = [
    {
      placeholder: `set amount(${tokenUnit})`,
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
      <Form
        inputs={depositInputs}
        buttons={depositButtons}
      />
    </div>
  );
};
