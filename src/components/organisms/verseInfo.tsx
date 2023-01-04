import clsx from 'clsx';
import { ErrorMsg, Button } from '@/components/atoms';
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

  return (
    <div className={clsx(
      className,
    )}>
      {downloadError && (
          <ErrorMsg text={ downloadError } className='w-full' />
        )}
        <p>Download verse config</p>
        <div>
          <p>Chain_id : { verseInfo.chainId }</p>
          <p>Builder: { ownerAddress }</p>
          <p>Sequencer: { verseInfo.namedAddresses.OVM_Sequencer }</p>
          <p>Proposer: { verseInfo.namedAddresses.OVM_Proposer }</p>
          <p>L1CrossDomainMessenger: { verseInfo.namedAddresses.Proxy__OVM_L1CrossDomainMessenger }</p>
          <p>L1StandardBridge: { verseInfo.namedAddresses.Proxy__OVM_L1StandardBridge }</p>
          <p>L1ERC721Bridge: { verseInfo.namedAddresses.Proxy__OVM_L1ERC721Bridge }</p>
        </div>
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
