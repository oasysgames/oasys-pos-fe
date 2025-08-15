import type { NextPage } from 'next';
import { useState, ChangeEvent } from 'react';
import {
  getBuilderFromChainID,
  getBuilderFromChainIDV2,
  handleError,
} from '@/features';
import { ErrorMsg, InputType } from '@/components/atoms';
import {
  VerseInfo,
  VerseInfoV2,
  Form,
  LoadingModal,
} from '@/components/organisms';
import {
  VerseInfo as VerseInfoType,
  VerseInfoV2 as VerseInfoV2Type,
} from '@/types/optimism/verse';
import { getVerseInfo, getVerseInfoV2 } from '@/features/optimism/verse';
import dynamic from 'next/dynamic';

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () =>
    import('@/components/organisms/walletConnect').then((m) => m.WalletConnect),
  { ssr: false },
);

const CheckVerse: NextPage = () => {
  const [txHashError, setTxHashError] = useState('');
  const [l2ChainId, setL2ChainId] = useState<number>();
  const [verseBuilder, setVerseBuilder] = useState('');
  const [verseInfo, setVerseInfo] = useState<VerseInfoType>();
  const [verseInfoV2, setVerseInfoV2] = useState<VerseInfoV2Type>();
  const [isVerseInfoLoading, setIsVerseInfoLoading] = useState(false);

  const handleChainChanged = async () => {
    setVerseInfo(undefined);
    setVerseInfoV2(undefined);
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
        const builder = await getBuilderFromChainID(l2ChainId!);
        setVerseBuilder(builder);
        setVerseInfo(await getVerseInfo(builder, l2ChainId!));
        setVerseInfoV2(undefined);
      } else {
        const builder = await getBuilderFromChainIDV2(l2ChainId!);
        setVerseBuilder(builder);
        setVerseInfoV2(await getVerseInfoV2(l2ChainId!));
        setVerseInfo(undefined);
      }
    } catch (err) {
      handleError(err, setTxHashError);
    }
    setIsVerseInfoLoading(false);
  };

  const inputs = [
    {
      placeholder: 'Chain ID',
      value: l2ChainId?.toString() || '',
      inputType: InputType.Number,
      handleClick: (e: ChangeEvent<HTMLInputElement>) =>
        setL2ChainId(Number(e.target.value.trim())),
    },
  ];

  const buttons = [
    {
      handleClick: () => getVerseConfig(false),
      disabled: !l2ChainId,
      value: 'Get Verse v1 Info',
    },
    {
      handleClick: () => getVerseConfig(true),
      disabled: !l2ChainId,
      value: 'Get Verse v0 Info',
    },
  ];

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect handleChainChanged={handleChainChanged} />

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

export default dynamic(() => Promise.resolve(CheckVerse), { ssr: false });
