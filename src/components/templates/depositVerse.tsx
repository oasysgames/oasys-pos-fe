import clsx from 'clsx';
import { useState } from 'react';
import { Button } from '../atoms';
import { ChangeDepositModal, CheckDepositModal } from '../organisms';

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

  return (
    <div className={clsx(
      className,
    )}>
      {changeDepositModalOpen &&
        <ChangeDepositModal
          setModalState={setChangeDepositModalOpen}
        />
      }
      {checkDepositModalOpen &&
        <CheckDepositModal
          setModalState={setCheckDepositModalOpen}
          ownerAddress={ownerAddress}
        />
      }
      <p>Deposit Token</p>
      <div className='space-x-2'>
        <Button
          handleClick={() => {
            setChangeDepositModalOpen(true)
          }}
        >
          Change Deposit Amount
        </Button>
        <Button
          handleClick={() => {
            setCheckDepositModalOpen(true)
          }}
        >
          Check Deposit Amount
        </Button>
      </div>
    </div>
  )
};
