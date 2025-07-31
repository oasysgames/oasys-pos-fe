import type { NextPage } from 'next';
import { DepositVerse } from '@/components/templates';
import { useAppKitAccount } from '@reown/appkit/react';
import dynamic from 'next/dynamic'

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () => import('@/components/organisms/walletConnect').then(m => m.WalletConnect),
  { ssr: false }
);

const Verse: NextPage = () => {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' });

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect />
      <DepositVerse
        className='space-y-4 col-span-4 col-start-3'
        ownerAddress={ownerAddress ?? ''}
      />
    </div>
  );
};

export default dynamic(
  () => Promise.resolve(Verse),
  { ssr: false }
);
