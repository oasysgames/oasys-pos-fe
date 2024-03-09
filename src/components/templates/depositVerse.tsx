import clsx from 'clsx';
import { useState } from 'react';
import { Button } from '../atoms';
import { ChangeDepositModal, CheckDepositModal } from '../organisms';
import { set } from 'lodash';

type Props = {
  className?: string;
  ownerAddress: string;
};

export const DepositVerse = (props: Props) => {
  const {
    className,
    ownerAddress,
  } = props;

  const [changeDepositModalOpen, setChangeDepositModalOpen] = useState(false);
  const [checkDepositModalOpen, setCheckDepositModalOpen] = useState(false);
  const [isLegacy, setIsLegacy] = useState(false);

  return (
    <div className={clsx(
      className,
    )}>
      {changeDepositModalOpen &&
        <ChangeDepositModal
          setModalState={setChangeDepositModalOpen}
          isLegacy={isLegacy}
        />
      }
      {checkDepositModalOpen &&
        <CheckDepositModal
          setModalState={setCheckDepositModalOpen}
          ownerAddress={ownerAddress}
          isLegacy={isLegacy}
        />
      }
      <h2>Deposit / Withdraw Token for Verse 2.0</h2>
      <div className='space-x-2'>
        <Button
          handleClick={() => {
            setChangeDepositModalOpen(true)
            setIsLegacy(false)
          }}
        >
          Continue with Deposit / Withdrawal
        </Button>
        <Button
          handleClick={() => {
            setCheckDepositModalOpen(true)
            setIsLegacy(false)
          }}
        >
          Check Deposit Amount
        </Button>
      </div>
      <hr/>
      <h2>Witdraw Token for Verse 1.0</h2>
      <p>Since the Verse 1.0 has been deprecated, depositing and building can only be performed through a direct function call to the contract.</p>
      <div className='space-x-2'>
      <Button
          handleClick={() => {
            setChangeDepositModalOpen(true)
            setIsLegacy(true)
          }}
        >
          Continue with Withdrawal
        </Button>
        <Button
          handleClick={() => {
            setCheckDepositModalOpen(true)
            setIsLegacy(true)
          }}
        >
          Check Deposit Amount
        </Button>
      </div>
    </div>
  )
};
