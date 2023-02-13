import type { NextPage } from 'next';
import { useEffect, useState, ChangeEvent } from 'react';
import { isNotConnectedMsg } from '@/consts';
import { getBuilderFromTx, getProvider, getSigner, getVerseChainId, handleError, isAllowedChain, isValidTxHash } from '@/features';
import { ErrorMsg } from '@/components/atoms';
import { WalletConnect, VerseInfo, Form, LoadingModal } from '@/components/organisms';
import { VerseInfo as VerseInfoType } from '@/types/optimism/verse';
import { getVerseInfo } from '@/features/optimism/verse';

const CheckVerse: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [txHashError, setTxHashError] = useState('');
  const [txHash, setTxHash] = useState('');
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
    };
    setOwner();
  };

  const handleChainChanged = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    try {
      isAllowedChain(chainId);
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
      isAllowedChain(chainId);
      setOwnerError('');
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  const getVerseConfig = async () => {
    try {
      setIsVerseInfoLoading(true);
      isValidTxHash(txHash);
      const verseBuilder = await getBuilderFromTx(txHash);
      setVerseBuilder(verseBuilder);
      const verseChainId = await getVerseChainId(verseBuilder);
      if (!verseChainId) throw new Error('Sorry. We cannot get verse_chain from verse builder');
      const data = await getVerseInfo(verseBuilder, verseChainId);
      setVerseInfo(data);
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
      placeholder: `set transaction hash that built the verse`,
      value: txHash,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setTxHash(e.target.value)},
    },
  ];

  const buttons = [
    {
      handleClick: getVerseConfig,
      disabled: !txHash,
      value: 'Get Verse Info',
    },
  ];

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        className='space-y-0.5 col-span-6 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        setOwner={setOwner}
      />
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {txHashError && (
          <ErrorMsg text={ txHashError } className='w-full' />
        )}
        <p>Transaction hash</p>
        <Form
          inputs={inputs}
          buttons={buttons}
        />
      </div>
      { isVerseInfoLoading && <LoadingModal/>}
      { verseInfo && verseBuilder &&
        <VerseInfo 
          className='space-y-4 col-span-4 col-start-3'
          verseBuilder={verseBuilder}
          verseInfo={verseInfo}
        />
      }
    </div>
  );
};

export default CheckVerse