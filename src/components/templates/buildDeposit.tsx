import { ethers } from 'ethers';
import clsx from 'clsx';
import { useState } from 'react';
import { useL1BuildDeposit } from '@/hooks';
import { Table, Button } from '../atoms';
import { BuildDepositModal } from '../organisms';

type Props = {
  className?: string;
  ownerAddress: string;
};

export const BuildDeposit = (props: Props) => {
  const {
    className,
    ownerAddress,
  } = props;

  const { data: depositData } = useL1BuildDeposit();
  const [depositModalOpen, setDepositModalOpen] = useState(false);

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
      {depositModalOpen &&
        <BuildDepositModal
          ownerAddress={ownerAddress}
          setModalState={setDepositModalOpen}
        />
      }
      <p>Deposit Token</p>
      <Table
        heads={heads}
        records={records}
      />
      <Button
        handleClick={() => {
          setDepositModalOpen(true)
        }}
      >
        Change Deposit Amount
      </Button>
    </div>
  )
};
