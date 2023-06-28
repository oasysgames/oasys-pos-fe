import clsx from 'clsx';
import { ErrorMsg, Button, Table } from '@/components/atoms';
import { CheckGenesisVersionModal } from '@/components/organisms';
import { useCallback, useState } from 'react';
import { download, handleError } from '@/features';
import { VerseInfo as VerseInfoType } from '@/types/optimism/verse';
import { Genesis } from '@/types/optimism/genesis';
import { NamedAddresses } from '@/types/oasysHub/verseBuild';

type Props = {
  className?: string;
  verseBuilder: string;
  verseInfo: VerseInfoType;
};


export const VerseInfo = (props: Props) => {
  const {
    className,
    verseBuilder,
    verseInfo,
  } = props;

  const [downloadError, setDownloadError] = useState('');
  const [checkModalOpen, setCheckModalOpen] = useState(false);

  const downloadAddresses = useCallback((namedAddresses: NamedAddresses) => {
    try {
      download(namedAddresses, 'addresses.json');
    } catch (err) {
      handleError(err, setDownloadError);
    }
  }, []);

  const downloadGenesis = useCallback((genesis: Genesis) => {
    try {
      download(genesis, 'genesis.json');
    } catch (err) {
      handleError(err, setDownloadError);
    }
  }, []);

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
      verseBuilder,
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
      {checkModalOpen &&
        <CheckGenesisVersionModal
          setModalState={setCheckModalOpen}
        />
      }
      {downloadError && (
          <ErrorMsg text={ downloadError } className='w-full' />
        )}
        <p>Download verse config</p>
        <Table
          heads={heads}
          records={records}
        />
          {verseInfo?.namedAddresses && verseInfo?.geneses &&
            <div className="flex flex-col space-y-2">
              <Button
                handleClick={() => downloadAddresses(verseInfo.namedAddresses)}
              >
                Download Address.json
              </Button>
              {
                verseInfo.geneses.map((genesis, index) => {
                  const version = index + 1;
                  return (
                    <Button
                      key={index}
                      handleClick={() => downloadGenesis(genesis)}
                    >
                      Download genesis.json(Version{version})
                    </Button>
                  );
                })
              }
              <Button
              handleClick={() => {
                setCheckModalOpen(true)
              }}
              >
                Check Genesis Version
              </Button>
            </div>
          }
    </div>
  );
};
