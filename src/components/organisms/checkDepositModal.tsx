import { BigNumber, ethers } from 'ethers';
import { useState, SetStateAction, ChangeEvent } from 'react';
import { ErrorMsg, SuccessMsg, Modal, Table } from '@/components/atoms';
import { Form, LoadingModal, DepositDetail } from '@/components/organisms';
import { handleError, getL1BuildDepositContract } from '@/features';
import { sOASAddress } from '@/consts';

type Props = {
  className?: string;
  ownerAddress: string;
  setModalState: (value: SetStateAction<boolean>) => void;
  isLegacy: boolean;
};

export const CheckDepositModal = (props: Props) => {
  const { className, ownerAddress, setModalState, isLegacy } = props;

  const [checkSuccess, setCheckSuccess] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState('');
  const [builder, setBuilder] = useState('');
  const [depositTotal, setDepositTotal] = useState<ethers.BigNumber>();
  const [depositOAS, setDepositOAS] = useState<ethers.BigNumber>();
  const [depositSOAS, setDepositSOAS] = useState<ethers.BigNumber>();

  const check = async () => {
    const L1BuildDepositContract = await getL1BuildDepositContract(isLegacy);

    try {
      setIsChecking(true);
      const depositTotal: ethers.BigNumber =
        await L1BuildDepositContract.getDepositTotal(builder);
      const depositOAS: ethers.BigNumber =
        await L1BuildDepositContract.getDepositAmount(builder, ownerAddress);
      const depositSOAS: ethers.BigNumber =
        await L1BuildDepositContract.getDepositERC20Amount(
          builder,
          ownerAddress,
          sOASAddress,
        );

      setDepositTotal(depositTotal);
      setDepositOAS(depositOAS);
      setDepositSOAS(depositSOAS);

      setCheckSuccess('Check deposit success');
      setBuilder('');
      setIsChecking(false);
    } catch (err) {
      setIsChecking(false);
      handleError(err, setCheckError);
    }
  };

  const inputs = [
    {
      placeholder: 'set builder address',
      value: builder,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {
        setBuilder(e.target.value);
      },
    },
  ];

  const buttons = [
    {
      handleClick: check,
      disabled: !builder || isChecking,
      value: 'Check Deposit',
    },
  ];

  return (
    <>
      {isChecking && <LoadingModal />}
      {!isChecking && (
        <Modal setModalState={setModalState}>
          <div className='space-y-4'>
            {checkSuccess && (
              <SuccessMsg className='w-full' text={checkSuccess} />
            )}
            {checkError && <ErrorMsg className='w-full' text={checkError} />}
            <Form inputs={inputs} buttons={buttons} />
            {depositTotal && depositOAS && depositSOAS && (
              <DepositDetail
                depositTotal={depositTotal}
                depositOAS={depositOAS}
                depositSOAS={depositSOAS}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
