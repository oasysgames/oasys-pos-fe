import clsx from 'clsx';
import { Table } from '@/components/atoms';

type Props = {
  className?: string;
  ownerAddress: string;
  operatorAddress: string;
};


export const ValidatorInfo = (props: Props) => {
  const {
    className,
    ownerAddress,
    operatorAddress,
  } = props;

  const heads = [
    'Address',
    'Value'
  ];

  const records = [
    [
      'Validator Owner',
      ownerAddress,
    ],
    [
      'Validator Operator',
      operatorAddress,
    ]
  ];

  return (
    <div className={clsx(
      className,
    )}>
      <Table
        heads={heads}
        records={records}
      />
    </div>
  );
};
