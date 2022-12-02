import { ethers } from 'ethers';
import { Deposit } from '../organisms';
import clsx from 'clsx';
import { useState } from 'react';
import { getSigner, handleError } from '@/features';
import { OASTokenUnit, sOASTokenUnit } from '@/const';
import { useL1BuildDeposit, useRefreshL1BuildDeposit } from '@/hooks';
import L1BuildDeposit from '@/contracts/oasysHub/L1BuildDeposit.json';
import { L1BuildDepositAddress, sOASAddress } from '@/config';
import { ErrorMsg, SuccessMsg } from '../atoms';

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
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
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
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
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
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
      const value = ethers.utils.parseEther(SOASAmount);
      setIsDepositLoading(true);
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
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
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

  return (
    <div className={clsx(
      className,
    )}>
      <p>Deposit total amount{`(${OASTokenUnit})`}: 
        {depositData?.depositTotal ? `${ethers.utils.formatEther(depositData?.depositTotal.toString())}` : ''}
      </p> 
      {depositSuccess && (
        <SuccessMsg className='text-center' text={depositSuccess} />
      )}
      {depositLoadError instanceof Error && (
        <ErrorMsg className='text-center' text={depositLoadError.message} />
      )}
      {depositError && (
        <ErrorMsg className='text-center' text={ depositError } />
      )}
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
