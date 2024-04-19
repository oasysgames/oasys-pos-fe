import type { NextPage } from 'next';
import { useEffect, useState, ChangeEvent } from 'react';
import { isNotConnectedMsg } from '@/consts';
import {
  getBuilderFromChainID,
  getBuilderFromChainIDV2,
  getBuilderFromTx,
  getProvider,
  getSigner,
  getVerseChainId,
  handleError,
  isTxHash,
  isAddress,
} from '@/features';
import { ErrorMsg, InputType } from '@/components/atoms';
import {
  WalletConnect,
  VerseInfo,
  VerseInfoV2,
  Form,
  LoadingModal,
} from '@/components/organisms';
import { VerseInfo as VerseInfoType, VerseInfoV2 as VerseInfoV2Type } from '@/types/optimism/verse';
import { getVerseInfo, getVerseInfoV2 } from '@/features/optimism/verse';

const CheckVerse: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const [txHashError, setTxHashError] = useState('');
  const [l2ChainId, setL2ChainId] = useState<number>();
  const [verseBuilder, setVerseBuilder] = useState('');
  const [verseInfo, setVerseInfo] = useState<VerseInfoType>();
  const [verseInfoV2, setVerseInfoV2] = useState<VerseInfoV2Type>();
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
      setVerseInfo(undefined);
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

  const getVerseConfig = async (isLegacy: boolean = true) => {
    setTxHashError('');
    setIsVerseInfoLoading(true);

    try {
      // NOTE: Disable taking verse info from tx hash and builder address
      // let chainId: undefined | number;
      // let builder: string;
      // if (/^\d+$/.test(l2ChainId)) {
      //   chainId = ~~l2ChainId;
      //   builder = await getBuilderFromChainID(chainId);
      // } else if (isTxHash(l2ChainId)) {
      //   builder = await getBuilderFromTx(l2ChainId);
      //   chainId = await getVerseChainId(builder);
      // } else if (isAddress(l2ChainId)) {
      //   builder = l2ChainId;
      //   chainId = await getVerseChainId(builder);
      // } else {
      //   throw new Error('Invalid format');
      // }

      if (isLegacy) {
        const builder = await getBuilderFromChainID(l2ChainId!)
        setVerseBuilder(builder);
        setVerseInfo(await getVerseInfo(builder, l2ChainId!));
      } else {
        const builder = await getBuilderFromChainIDV2(l2ChainId!);
        setVerseBuilder(builder);
        setVerseInfoV2(await getVerseInfoV2(l2ChainId!));
      }

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
      placeholder: 'Chain ID',
      value: l2ChainId?.toString() || '',
      inputType: InputType.Number,
      handleClick: (e: ChangeEvent<HTMLInputElement>) =>
        setL2ChainId(Number(e.target.value.trim())),
    }
  ];

  const buttons = [
    {
      handleClick: () => (getVerseConfig(false)),
      disabled: !l2ChainId,
      value: 'Get Verse v1 Info',
    },
    {
      handleClick: () => (getVerseConfig(true)),
      disabled: !l2ChainId,
      value: 'Get Verse v0 Info',
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

      {verseInfoV2 && verseBuilder && (
        <VerseInfoV2
          className='space-y-4 col-span-4 col-start-3'
          verseBuilder={verseBuilder}
          verseInfo={verseInfoV2}
        />
      )}

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
