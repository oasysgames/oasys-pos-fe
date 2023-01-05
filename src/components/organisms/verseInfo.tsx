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

  const configs = [
    {
      key: 'Chain_id',
      value: verseInfo.chainId.toString(),
    },
    {
      key: 'Builder',
      value: ownerAddress,
    },
    {
      key: 'Sequencer',
      value: verseInfo.namedAddresses.OVM_Sequencer,
    },
    {
      key: 'Proposer',
      value: verseInfo.namedAddresses.OVM_Proposer,
    },
    {
      key: 'L1CrossDomainMessenger',
      value: verseInfo.namedAddresses.Proxy__OVM_L1CrossDomainMessenger,
    },
    {
      key: 'L1StandardBridge',
      value: verseInfo.namedAddresses.Proxy__OVM_L1StandardBridge,
    },
    {
      key: 'L1ERC721Bridge',
      value: verseInfo.namedAddresses.Proxy__OVM_L1ERC721Bridge ,
    },
  ];

  return (
    <div className={clsx(
      className,
    )}>
      {downloadError && (
          <ErrorMsg text={ downloadError } className='w-full' />
        )}
        <p>Download verse config</p>
        <table className="table-auto border-collapse border border-slate-500">
          <thead>
            <tr>
              <th className='border border-slate-600'>Config</th>
              <th className='border border-slate-600'>Value</th>
            </tr>
          </thead>
          <tbody>
            { configs.map((config) => {
              return (
                <tr key={config.key}>
                  <td className='border border-slate-700'>{config.key}</td>
                  <td className='border border-slate-700'>{config.value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
