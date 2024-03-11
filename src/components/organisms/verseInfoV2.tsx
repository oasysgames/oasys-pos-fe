import clsx from 'clsx';
import { ErrorMsg, Button, Table } from '@/components/atoms';
import { useCallback, useState } from 'react';
import { download, handleError } from '@/features';
import {
  VerseInfoV2 as VerseInfoType,
  DeployConfig,
} from '@/types/optimism/verse';
import { NamedAddressesV2 as NamedAddresses } from '@/types/oasysHub/verseBuild';

type Props = {
  className?: string;
  verseBuilder: string;
  verseInfo: VerseInfoType;
};

export const VerseInfoV2 = (props: Props) => {
  const { className, verseBuilder, verseInfo } = props;

  const [downloadError, setDownloadError] = useState('');

  const downloadAddresses = useCallback((namedAddresses: NamedAddresses) => {
    try {
      download(namedAddresses, 'addresses.json');
    } catch (err) {
      handleError(err, setDownloadError);
    }
  }, []);

  const downloadDeployConfig = useCallback((deployConfig: DeployConfig) => {
    try {
      download(deployConfig, 'deploy-config.json');
    } catch (err) {
      handleError(err, setDownloadError);
    }
  }, []);

  const heads = ['Config', 'Value'];

  const records = [
    ['Chain_id', verseInfo.chainId.toString()],
    ['Builder', verseBuilder],
    ['FinalSystemOwner', verseInfo.namedAddresses.FinalSystemOwner],
    ['L2OutputOracleProposer', verseInfo.namedAddresses.L2OutputOracleProposer],
    [
      'L2OutputOracleChallenger',
      verseInfo.namedAddresses.L2OutputOracleChallenger,
    ],
    ['BatchSender', verseInfo.namedAddresses.BatchSender],
    ['ProxyAdmin', verseInfo.namedAddresses.ProxyAdmin],
    ['SystemConfigProxy', verseInfo.namedAddresses.SystemConfigProxy],
    ['L1StandardBridgeProxy', verseInfo.namedAddresses.L1StandardBridgeProxy],
    ['L1ERC721BridgeProxy', verseInfo.namedAddresses.L1ERC721BridgeProxy],
    [
      'L1CrossDomainMessengerProxy',
      verseInfo.namedAddresses.L1CrossDomainMessengerProxy,
    ],
    ['L2OutputOracleProxy', verseInfo.namedAddresses.L2OutputOracleProxy],
    ['OptimismPortalProxy', verseInfo.namedAddresses.OptimismPortalProxy],
    ['ProtocolVersions', verseInfo.namedAddresses.ProtocolVersions],
    ['BatchInbox', verseInfo.namedAddresses.BatchInbox],
    ['AddressManager', verseInfo.namedAddresses.AddressManager],
    ['P2PSequencer', verseInfo.namedAddresses.P2PSequencer],
  ];

  return (
    <div className={clsx(className)}>
      {downloadError && <ErrorMsg text={downloadError} className='w-full' />}
      <p>Download Config Files</p>
      <Table heads={heads} records={records} />
      {verseInfo?.namedAddresses && verseInfo?.deployConfig && (
        <div className='flex flex-col space-y-2'>
          <Button
            handleClick={() => downloadAddresses(verseInfo.namedAddresses)}
          >
            Download address.json
          </Button>
          <Button
            handleClick={() => downloadDeployConfig(verseInfo.deployConfig)}
          >
            Download deploy-config.json
          </Button>
        </div>
      )}
    </div>
  );
};
