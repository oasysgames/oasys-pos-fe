import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRefreshL1BuildDeposit, useVerseInfo, useRefreshVerseInfo, useL1BuildDeposit } from '@/hooks';
import { ErrorMsg } from '@/components/atoms';
import { VerseInfo, LoadingModal, DepositDetail } from '@/components/organisms';
import { BuildVerse } from '@/components/templates';
import { useAppKitAccount } from '@reown/appkit/react';
import dynamic from 'next/dynamic'

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () => import('@/components/organisms/walletConnect').then(m => m.WalletConnect),
  { ssr: false }
);

const BuildVersePage: NextPage = () => {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' });
  const isLegacy = false;
  const { data: depositData, error: depositLoadError, isLoading: isDepositLoading } = useL1BuildDeposit(isLegacy);
  const { verseInfo, isVerseInfoLoading, verseInfoError } = useVerseInfo(ownerAddress);
  const refreshL1BuildDeposit = useRefreshL1BuildDeposit();
  const refreshVerseInfo = useRefreshVerseInfo();

  const handleChainChanged = async () => {
    refreshL1BuildDeposit();
    refreshVerseInfo();
  };

  useEffect(() => {
    refreshL1BuildDeposit();
  }, [ownerAddress, refreshL1BuildDeposit]);

  useEffect(() => {
    refreshVerseInfo();
  }, [ownerAddress, refreshVerseInfo]);

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      {(ownerAddress && (isDepositLoading || isVerseInfoLoading)) && <LoadingModal/>}
      <WalletConnect
        handleChainChanged={ handleChainChanged }
      />
      {depositLoadError instanceof Error && (
        <ErrorMsg className='w-full' text={depositLoadError.message} />
      )}
      { depositData && !depositLoadError && 
        <div className='space-y-4 col-span-4 col-start-3'>
          <p>Deposits from Connected Account</p>
          <DepositDetail
            depositTotal={depositData.depositTotal}
            depositOAS={depositData.depositOAS}
            depositSOAS={depositData.depositSOAS}
          />
        </div>
      }
      <BuildVerse
        className='space-y-0.5 col-span-4 col-start-3'
      />
      {verseInfoError instanceof Error && (
        <ErrorMsg className='w-full' text={verseInfoError.message} />
      )}
      { verseInfo?.chainId && 
        <VerseInfo 
          className='space-y-4 col-span-4 col-start-3'
          verseBuilder={ownerAddress || ''}
          verseInfo={verseInfo}
        />
      }
    </div>
  );
};

export default dynamic(
  () => Promise.resolve(BuildVersePage),
  { ssr: false }
);
