import clsx from 'clsx';
import { Table } from '@/components/atoms';
import { ValidatorInfoType } from '@/types/oasysHub/validatorInfo';
import { formatWeiAmount } from '@/features';

type Props = {
  className?: string;
  ownerAddress: string;
  validatorInfo: ValidatorInfoType;
};


export const ValidatorInfo = (props: Props) => {
  const {
    className,
    ownerAddress,
    validatorInfo,
  } = props;

  const baseInfoHeads = [
    'Key',
    'Value'
  ];

  const baseInfoRecords = [
    [
      'Validator Owner',
      ownerAddress,
    ],
    [
      'Validator Operator',
      validatorInfo.operatorAddress,
    ],
    [
      'joined',
      validatorInfo.joined ? 'Yes' : 'No',
    ],
    [
      'status',
      validatorInfo.status,
    ],
    [
      'jailed',
      validatorInfo.jailed ? 'Yes' : 'No',
    ],
    [
      'commissions (OAS)',
      formatWeiAmount(validatorInfo.commissions),
    ],
    [
      'currentEpochStakes (OAS)',
      formatWeiAmount(validatorInfo.currentEpochStakes),
    ],
    [
      'nextEpochStakes (OAS)',
      formatWeiAmount(validatorInfo.nextEpochStakes),
    ],
  ];

  const slashInfoHeads = [
    'Epoch',
    'Slash Count',
  ];

  const slashInfoRecords = Object.entries(validatorInfo.epochToSlashes).map(([epoch, slashCount]) => { return [epoch, `${slashCount.toNumber()}`]});

  return (
    <div className={clsx(
      className,
    )}>
      <p>Validator Base Information</p>
      <Table
        heads={baseInfoHeads}
        records={baseInfoRecords}
      />
      <p>Validator Slash Information (Last 30 Epoch)</p>
      <Table
        heads={slashInfoHeads}
        records={slashInfoRecords}
      />
    </div>
  );
};
