import { ethers } from 'ethers';
import { Deposit } from '.';
import { useState, SetStateAction } from 'react';
import { getL1BuildDepositContract, getSOASContract, handleError } from '@/features';
import { OASTokenUnit, sOASTokenUnit } from '@/consts';
import { useRefreshL1BuildDeposit } from '@/hooks';
import { L1BuildDepositAddress, sOASAddress } from '@/consts';
import { ErrorMsg, SuccessMsg, Modal } from '../atoms';
import { LoadingModal } from '.';

type Props = {
  className?: string;
  setModalState: (value: SetStateAction<boolean>) => void;
  isLegacy: boolean;
};

export const ChangeDepositModal = (props: Props) => {
  const {
    className,
    setModalState,
    isLegacy,
  } = props;

  const [depositSuccess, setDepositSuccess] = useState('');
  const [idDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState('');
  const [OASVerseBuilder, setOASVerseBuilder] = useState('');
  const [SOASVerseBuilder, setSOASVerseBuilder] = useState('');
  const [OASAmount, setOASAmount] = useState('');
  const [SOASAmount, setSOASAmount] = useState('');

  const refreshL1BuildDeposit = useRefreshL1BuildDeposit();

  const depositOAS = async () => {
    try {
      const L1BuildDepositContract = await getL1BuildDepositContract(isLegacy);
      const value = ethers.utils.parseEther(OASAmount);
      const options = { value: value };
      setIsDepositLoading(true);
      await L1BuildDepositContract.deposit(OASVerseBuilder, options);

      const filter = L1BuildDepositContract.filters.Deposit(OASVerseBuilder, null, null);
      L1BuildDepositContract.once(filter, (builder, depositer, token, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}${OASTokenUnit} deposit is successful`);
        setOASAmount('');
        setOASVerseBuilder('');
        setDepositError('');
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
      const L1BuildDepositContract = await getL1BuildDepositContract(isLegacy);
      const value = ethers.utils.parseEther(OASAmount);
      setIsDepositLoading(true);
      await L1BuildDepositContract.withdraw(OASVerseBuilder, value);

      const filter = L1BuildDepositContract.filters.Withdrawal(OASVerseBuilder, null, null);
      L1BuildDepositContract.once(filter,  (builder, depositer, token, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}${OASTokenUnit} withdraw is successful`);
        setOASAmount('');
        setOASVerseBuilder('');
        setDepositError('');
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
      const L1BuildDepositContract = await getL1BuildDepositContract(isLegacy);
      const sOASContract = await getSOASContract();
      const value = ethers.utils.parseEther(SOASAmount);
      setIsDepositLoading(true);
      const tx = await sOASContract.approve(L1BuildDepositAddress, value);
      await tx.wait();
      await L1BuildDepositContract.depositERC20(SOASVerseBuilder, sOASAddress, value);

      const filter = L1BuildDepositContract.filters.Deposit(SOASVerseBuilder, null, null);
      L1BuildDepositContract.once(filter, (builder, depositer, token, amount) => {
        const sOASAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${sOASAmount}${sOASTokenUnit} deposit is successful`);
        setSOASAmount('');
        setSOASVerseBuilder('');
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
      const L1BuildDepositContract = await getL1BuildDepositContract(isLegacy);
      const value = ethers.utils.parseEther(SOASAmount);
      setIsDepositLoading(true);
      await L1BuildDepositContract.withdrawERC20(SOASVerseBuilder, sOASAddress, value);

      const filter = L1BuildDepositContract.filters.Withdrawal(SOASVerseBuilder, null, null);
      L1BuildDepositContract.once(filter,  (builder, depositer, token, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}${sOASTokenUnit} withdraw is successful`);
        setSOASAmount('');
        setSOASVerseBuilder('');
        setIsDepositLoading(false);
        refreshL1BuildDeposit();
      });
    } catch (err) {
      setIsDepositLoading(false);
      handleError(err, setDepositError);
    }
  };

  return (
    <>
    {idDepositLoading &&
      <LoadingModal />
    }
    {!idDepositLoading &&
    <Modal
      setModalState={setModalState}
    >
      <div className='space-y-4'>
        {depositSuccess && (
          <SuccessMsg className='text-center' text={depositSuccess} />
        )}
        {depositError && (
          <ErrorMsg className='text-center' text={depositError} />
        )}
        <Deposit
          className='space-y-0.5'
          amount={OASAmount}
          builder={OASVerseBuilder}
          setAmount={setOASAmount}
          setBuilder={setOASVerseBuilder}
          deposit={depositOAS}
          withdraw={withdrawOAS}
          idDepositLoading={idDepositLoading}
          tokenUnit={OASTokenUnit}
          isLegacy={isLegacy}
        />
        {isLegacy && (
          <Deposit
            className='space-y-0.5'
            amount={SOASAmount}
            builder={SOASVerseBuilder}
            setAmount={setSOASAmount}
            setBuilder={setSOASVerseBuilder}
            deposit={depositSOAS}
            withdraw={withdrawSOAS}
            idDepositLoading={idDepositLoading}
            tokenUnit={sOASTokenUnit}
            isLegacy={isLegacy}
          />
        )}
      </div>
    </Modal>
    }
    </>
  )
};
