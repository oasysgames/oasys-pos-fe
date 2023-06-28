import clsx from 'clsx';
import { Table } from '@/components/atoms';
import { genesisVersions } from '@/consts';

type Props = {
  className?: string;
  version: string;
};


export const GenesisVersionDetail = (props: Props) => {
  const {
    className,
    version,
  } = props;

  const heads = [
    'Key',
    'Version'
  ];

  const records = [
    [
      'genesis.json',
      version,
    ],
    [
      'bridge contract',
      `${genesisVersions[version].bridgeContractVersion}`,
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
