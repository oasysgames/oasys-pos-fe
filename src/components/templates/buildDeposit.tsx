import { ethers } from 'ethers';
import { Deposit } from '../organisms';
import clsx from 'clsx';
import { useState } from 'react';
import { getL1BuildDepositContract, getSOASContract, handleError } from '@/features';
import { OASTokenUnit, sOASTokenUnit } from '@/consts';
import { useL1BuildDeposit, useRefreshL1BuildDeposit } from '@/hooks';
import { L1BuildDepositAddress, sOASAddress } from '@/config';
import { ErrorMsg, SuccessMsg, Table } from '../atoms';

type Props = {
  className?: string;
  ownerAddress: string;
};

export const BuildDeposit = (props: Props) => {
  const {
    className,
    ownerAddress,
  } = props;

  const { data: depositData, error: depositLoadError } = useL1BuildDeposit();
  const [depositSuccess, setDepositSuccess] = useState('');
  const [idDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState('');
  const [OASAmount, setOASAmount] = useState('');
  const [SOASAmount, setSOASAmount] = useState('');
  
  const refreshL1BuildDeposit = useRefreshL1BuildDeposit();

  const depositOAS = async () => {
    try {
      const L1BuildDepositContract = await getL1BuildDepositContract();
      const value = ethers.utils.parseEther(OASAmount);
      const options = { value: value };
      setIsDepositLoading(true);
      await L1BuildDepositContract.deposit(ownerAddress, options);

      const filter = L1BuildDepositContract.filters.Deposit(ownerAddress, null, null);
      L1BuildDepositContract.once(filter, (builder: string, depositer: string, token: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}${OASTokenUnit} deposit is successful`);
        setOASAmount('');
        setIsDepositLoading(false);
        refreshL1BuildDeposit();
      });
    } catch (err) {
      setIsDepositLoading(false);
      handleError(err, setDepositError);
    }
  };

  const withdrawOAS = async () => {
    try {
      const L1BuildDepositContract = await getL1BuildDepositContract();
      const value = ethers.utils.parseEther(OASAmount);
      setIsDepositLoading(true);
      await L1BuildDepositContract.withdraw(ownerAddress, value);

      const filter = L1BuildDepositContract.filters.Withdrawal(ownerAddress, null, null);
      L1BuildDepositContract.once(filter,  (builder: string, depositer: string, token: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}${OASTokenUnit} withdraw is successful`);
        setOASAmount('');
        setIsDepositLoading(false);
        refreshL1BuildDeposit();
      });
    } catch (err) {
      setIsDepositLoading(false);
      handleError(err, setDepositError);
    }
  };

  const depositSOAS = async () => {
    try {
      const L1BuildDepositContract = await getL1BuildDepositContract();
      const sOASContract = await getSOASContract();
      const value = ethers.utils.parseEther(SOASAmount);
      setIsDepositLoading(true);
      const tx = await sOASContract.approve(L1BuildDepositAddress, value);
      await tx.wait();
      await L1BuildDepositContract.depositERC20(ownerAddress, sOASAddress, value);

      const filter = L1BuildDepositContract.filters.Deposit(ownerAddress, null, null);
      L1BuildDepositContract.once(filter, (builder: string, depositer: string, token: string, amount: ethers.BigNumber) => {
        const sOASAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${sOASAmount}${sOASTokenUnit} deposit is successful`);
        setSOASAmount('');
        setIsDepositLoading(false);
        refreshL1BuildDeposit();
      });
    } catch (err) {
      setIsDepositLoading(false);
      handleError(err, setDepositError);
    }
  };

  const withdrawSOAS = async () => {
    try {
      const L1BuildDepositContract = await getL1BuildDepositContract();
      const value = ethers.utils.parseEther(SOASAmount);
      setIsDepositLoading(true);
      await L1BuildDepositContract.withdrawERC20(ownerAddress, sOASAddress, value);

      const filter = L1BuildDepositContract.filters.Withdrawal(ownerAddress, null, null);
      L1BuildDepositContract.once(filter,  (builder: string, depositer: string, token: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}${sOASTokenUnit} withdraw is successful`);
        setSOASAmount('');
        setIsDepositLoading(false);
        refreshL1BuildDeposit();
      });
    } catch (err) {
      setIsDepositLoading(false);
      handleError(err, setDepositError);
    }
  };

  const heads = [
    'Token',
    'Amount'
  ];

  const records = [
    [
      'OAS',
      depositData?.depositOAS ? `${ethers.utils.formatEther(depositData?.depositOAS.toString())}`: ''
    ],
    [
      'sOAS',
      depositData?.depositSOAS ? `${ethers.utils.formatEther(depositData?.depositSOAS.toString())}`: ''
    ],
    [
      'Total',
      depositData?.depositTotal ? `${ethers.utils.formatEther(depositData?.depositTotal.toString())}` : ''
    ],
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
      <p>Deposit Token</p>
      <Table
        heads={heads}
        records={records}
      />
      <Deposit
        className='space-y-0.5'
        depositedAmount={depositData?.depositOAS}
        amount={OASAmount}
        setAmount={setOASAmount}
        deposit={depositOAS}
        withdraw={withdrawOAS}
        idDepositLoading={idDepositLoading}
        tokenUnit={OASTokenUnit}
      />
      <Deposit
        className='space-y-0.5'
        depositedAmount={depositData?.depositSOAS}
        amount={SOASAmount}
        setAmount={setSOASAmount}
        deposit={depositSOAS}
        withdraw={withdrawSOAS}
        idDepositLoading={idDepositLoading}
        tokenUnit={sOASTokenUnit}
      />
    </div>
  )
};
