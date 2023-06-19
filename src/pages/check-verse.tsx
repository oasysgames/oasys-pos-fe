import type { NextPage } from 'next';
import { useEffect, useState, ChangeEvent } from 'react';
import { isNotConnectedMsg } from '@/consts';
import {
  getBuilderFromChainID,
  getBuilderFromTx,
  getProvider,
  getSigner,
  getVerseChainId,
  handleError,
  isTxHash,
  isAddress,
} from '@/features';
import { ErrorMsg } from '@/components/atoms';
import {
  WalletConnect,
  VerseInfo,
  Form,
  LoadingModal,
} from '@/components/organisms';
import { VerseInfo as VerseInfoType } from '@/types/optimism/verse';
import { getVerseInfo } from '@/features/optimism/verse';

const CheckVerse: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const [txHashError, setTxHashError] = useState('');
  const [formValue, setFormValue] = useState('');
  const [verseBuilder, setVerseBuilder] = useState('');
  const [verseInfo, setVerseInfo] = useState<VerseInfoType>();
  const [isVerseInfoLoading, setIsVerseInfoLoading] = useState(false);

  const handleAccountsChanged = async () => {
    const provider = await getProvider();
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length === 0) {
      setOwnerAddress('');
      setOwnerError(isNotConnectedMsg);
      return;
    }
    setOwner();
  };

  const handleChainChanged = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    try {
      setConnectedChainId(chainId);
      setOwner();
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  const setOwner = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();

      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      setOwnerAddress(address);
      setConnectedChainId(chainId);
      setOwnerError('');
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  const getVerseConfig = async () => {
    setTxHashError('');
    setIsVerseInfoLoading(true);

    try {
      let chainId: undefined | number;
      let builder: string;
      if (/^\d+$/.test(formValue)) {
        chainId = ~~formValue;
        builder = await getBuilderFromChainID(chainId);
      } else if (isTxHash(formValue)) {
        builder = await getBuilderFromTx(formValue);
        chainId = await getVerseChainId(builder);
      } else if (isAddress(formValue)) {
        builder = formValue;
        chainId = await getVerseChainId(builder);
      } else {
        throw new Error('Invalid format');
      }

      if (!chainId) {
        throw new Error('Sorry. We cannot get verse information.');
      }

      setVerseBuilder(builder);
      setVerseInfo(await getVerseInfo(builder, chainId));
    } catch (err) {
      handleError(err, setTxHashError);
    }
    setIsVerseInfoLoading(false);
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  const inputs = [
    {
      placeholder: 'Chain ID / Builder address / Build tx hash',
      value: formValue,
      handleClick: (e: ChangeEvent<HTMLInputElement>) =>
        setFormValue(e.target.value.trim()),
    },
  ];

  const buttons = [
    {
      handleClick: getVerseConfig,
      disabled: !formValue,
      value: 'Get Verse Info',
    },
  ];

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
      />

      <div className='space-y-0.5 col-span-4 col-start-3'>
        {txHashError && <ErrorMsg text={txHashError} className='w-full' />}
        <Form inputs={inputs} buttons={buttons} />
      </div>

      {isVerseInfoLoading && <LoadingModal />}

      {verseInfo && verseBuilder && (
        <VerseInfo
          className='space-y-4 col-span-4 col-start-3'
          verseBuilder={verseBuilder}
          verseInfo={verseInfo}
        />
      )}
    </div>
  );
};

export default CheckVerse;
