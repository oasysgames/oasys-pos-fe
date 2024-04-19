import clsx from 'clsx';
import { ChangeEvent, SetStateAction } from 'react';
import { Form } from '@/components/organisms';

type Props = {
  className?: string;
  amount: string;
  builder: string;
  setAmount: (value: SetStateAction<string>) => void;
  setBuilder: (value: SetStateAction<string>) => void;
  deposit: () => Promise<void>;
  withdraw: () => Promise<void>;
  idDepositLoading: boolean;
  tokenUnit: string;
  isLegacy: boolean;
};

export const Deposit = (props: Props) => {
  const {
    className,
    builder,
    amount,
    setBuilder,
    setAmount,
    deposit,
    withdraw,
    idDepositLoading,
    tokenUnit,
    isLegacy
  } = props;

  const depositInputs = [
    {
      placeholder: 'set verse builder address',
      value: builder,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setBuilder(e.target.value)},
    },
    {
      placeholder: `set amount(${tokenUnit})`,
      value: amount,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setAmount(e.target.value)},
    },
  ];

  const depositButtons = [
    {
      handleClick: deposit,
      disabled: !builder || !amount || idDepositLoading || isLegacy,
      value: 'Deposit',
    },
    {
      handleClick: withdraw,
      disabled: !builder || !amount || idDepositLoading,
      value: 'Withdraw',
    },
  ];

  // evic deposit button for legacy
  if (isLegacy) depositButtons.shift();

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
