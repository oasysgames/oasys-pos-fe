import { ethers } from 'ethers';
import clsx from 'clsx';
import { Table } from '@/components/atoms';

type Props = {
  className?: string;
  depositTotal: ethers.BigNumber;
  depositOAS: ethers.BigNumber;
  depositSOAS: ethers.BigNumber;
};

export const DepositDetail = (props: Props) => {
  const {
    className,
    depositTotal,
    depositOAS,
    depositSOAS,
  } = props;

  const table1Heads = [
    'Token',
    'Your Deposit Amount'
  ];

  const table1Records = [
    [
      'OAS',
      ethers.utils.formatEther(depositOAS.toString())
    ],
    [
      'sOAS',
      ethers.utils.formatEther(depositSOAS.toString())
    ],
  ];

  const table2Heads = [
    'Token',
    'All Deposit Amount'
  ];

  const table2Records = [
    [
      'Total (OAS + sOAS)',
      ethers.utils.formatEther(depositTotal.toString())
    ],
  ];

  return (
    <div className={clsx(
      className,
    )}>
      <div className='space-y-2'>
        <Table
          heads={table1Heads}
          records={table1Records}
        />
        <Table
          heads={table2Heads}
          records={table2Records}
        />
      </div>
    </div>
  );
};
