import clsx from 'clsx';
import { ErrorMsg, Button, Table } from '@/components/atoms';
import { useState } from 'react';
import { download, handleError } from '@/features';
import { VerseInfo as VerseInfoType } from '@/types/optimism/verse';

type Props = {
  className?: string;
  ownerAddress: string;
  verseInfo: VerseInfoType;
};


export const VerseInfo = (props: Props) => {
  const {
    className,
    ownerAddress,
    verseInfo,
  } = props;

  const [downloadError, setDownloadError] = useState('');

  const downloadAddresses = async () => {
    try {
      if (!verseInfo?.namedAddresses) throw new Error('You have to build verse');
      download(verseInfo.namedAddresses, 'addresses.json');
    } catch (err) {
      handleError(err, setDownloadError);
    }
  };

  const downloadGenesis = async () => {
    try {
      if (!verseInfo?.genesis) throw new Error('You have to build verse');
      download(verseInfo.genesis, 'genesis.json');
    } catch (err) {
      handleError(err, setDownloadError);
    }
  };

  const heads = [
    'Config',
    'Value'
  ];

  const records = [
    [
      'Chain_id',
      verseInfo.chainId.toString(),
    ],
    [
      'Builder',
      ownerAddress,
    ],
    [
      'Sequencer',
      verseInfo.namedAddresses.OVM_Sequencer,
    ],
    [
      'Proposer',
      verseInfo.namedAddresses.OVM_Proposer,
    ],
    [
      'L1CrossDomainMessenger',
      verseInfo.namedAddresses.Proxy__OVM_L1CrossDomainMessenger,
    ],
    [
      'L1StandardBridge',
      verseInfo.namedAddresses.Proxy__OVM_L1StandardBridge,
    ],
    [
      'L1ERC721Bridge',
      verseInfo.namedAddresses.Proxy__OVM_L1ERC721Bridge ,
    ],
  ];

  return (
    <div className={clsx(
      className,
    )}>
      {downloadError && (
          <ErrorMsg text={ downloadError } className='w-full' />
        )}
        <p>Download verse config</p>
        <Table
          heads={heads}
          records={records}
        />
        <div className="flex items-center space-x-2">
          <Button
            handleClick={downloadAddresses}
            disabled={ !verseInfo?.namedAddresses }
          >
            Download Address.json
          </Button>
          <Button
            handleClick={downloadGenesis}
            disabled={ !verseInfo?.genesis }
          >
            Download genesis.json
          </Button>
        </div>
    </div>
  );
};
