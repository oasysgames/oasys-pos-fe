import clsx from 'clsx';
import { ethers } from 'ethers';
import { SetStateAction } from 'react';
import { Button, ErrorMsg, SuccessMsg, Input } from '@/components/atoms';
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
      <Input
        placeholder='set amount($OAS)'
        value={amount}
        handleClick={e => setAmount(e.target.value)}
        className='w-full'
      />
      <div className="flex items-center space-x-2">
        <Button
          handleClick={deposit}
          disabled={!amount || idDepositLoading}
        >
          Deposit
        </Button>
        <Button
          handleClick={withdraw}
          disabled={!amount || idDepositLoading}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};
