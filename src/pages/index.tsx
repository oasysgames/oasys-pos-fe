import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { isNotConnectedMsg } from '@/consts';
import { getProvider, getSigner, handleError } from '@/features';
import { useRefreshL1BuildDeposit, useVerseInfo, useRefreshVerseInfo } from '@/hooks';
import { ErrorMsg } from '@/components/atoms';
import { WalletConnect, VerseInfo, LoadingModal } from '@/components/organisms';
import { BuildDeposit, BuildVerse } from '@/components/templates';

const Verse: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const { verseInfo, isVerseInfoLoading, verseInfoError } = useVerseInfo(ownerAddress);
  const refreshL1BuildDeposit = useRefreshL1BuildDeposit();
  const refreshVerseInfo = useRefreshVerseInfo();

  const handleAccountsChanged = async () => {
    const provider = await getProvider();
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length === 0) {
      setOwnerAddress('');
      setOwnerError(isNotConnectedMsg);
      return;
    };
    setOwner();
  };

  const handleChainChanged = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    try {
      setConnectedChainId(chainId);
      setOwner();
      refreshL1BuildDeposit();
      refreshVerseInfo();
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

  useEffect(() => {
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshL1BuildDeposit();
  }, [ownerAddress, refreshL1BuildDeposit]);

  useEffect(() => {
    refreshVerseInfo();
  }, [ownerAddress, refreshVerseInfo]);

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      {(ownerAddress && isVerseInfoLoading) && <LoadingModal/>}
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
      />
      <BuildDeposit
        className='space-y-4 col-span-4 col-start-3'
        ownerAddress={ownerAddress}
      />
      <BuildVerse
        className='space-y-0.5 col-span-4 col-start-3'
      />
      {verseInfoError instanceof Error && (
        <ErrorMsg className='w-full' text={verseInfoError.message} />
      )}
      { verseInfo?.chainId && 
        <VerseInfo 
          className='space-y-4 col-span-4 col-start-3'
          verseBuilder={ownerAddress}
          verseInfo={verseInfo}
        />
      }
    </div>
  );
};

export default Verse