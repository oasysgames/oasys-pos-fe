import { ethers } from 'ethers';
import { useState, SetStateAction, ChangeEvent } from 'react';
import { handleError } from '@/features';
import { ErrorMsg, Modal } from '@/components/atoms';
import {
  LoadingModal,
  Form,
  GenesisVersionDetail,
} from '@/components/organisms';
import { getGenesisVersion } from '@/features/optimism';

type Props = {
  className?: string;
  setModalState: (value: SetStateAction<boolean>) => void;
};

export const CheckGenesisVersionModal = (props: Props) => {
  const {
    className,
    setModalState,
  } = props;

  const [isChecking, setIsChecking] = useState(false);
  const [genesisVersionError, setGenesisVersionError] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [genesisVersion, setGenesisVersion] = useState<string>();

  const checkGenesisVersion = async () => {
    try {
      setIsChecking(true);
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const version = await getGenesisVersion(provider);
  
      setGenesisVersion(version);
      setGenesisVersionError('');
    } catch (err) {
      handleError(err, setGenesisVersionError);
    } finally {
      setIsChecking(false);
    }
  };

  const inputs = [
    {
      placeholder: 'Verse RPC URL (e.g. https://rpc.verse.example.com/)',
      value: rpcUrl,
      handleClick: (e: ChangeEvent<HTMLInputElement>) =>
        setRpcUrl(e.target.value.trim()),
    },
  ];

  const buttons = [
    {
      handleClick: checkGenesisVersion,
      disabled: !rpcUrl,
      value: 'Check genesis version',
    },
  ];

  return (
    <>
    {isChecking &&
      <LoadingModal />
    }
    {!isChecking &&
      <Modal
        setModalState={setModalState}
      >
        <div className='space-y-4'>
          {genesisVersionError && <ErrorMsg text={genesisVersionError} className='w-full' />}
          <Form inputs={inputs} buttons={buttons} className='space-y-2'/>
          {genesisVersion && 
            <GenesisVersionDetail version={genesisVersion} />
          }
        </div>
      </Modal>
    }
    </>
  )
};
