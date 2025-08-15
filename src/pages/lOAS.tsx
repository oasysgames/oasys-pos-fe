import type { NextPage } from 'next';
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { handleError, getLOASContract } from '@/features';
import { Claim } from '@/components/templates';
import { useLOASClaimInfo, useRefreshLOASClaimInfo } from '@/hooks';
import { lOASTokenUnit } from '@/consts';
import { useAppKitAccount } from '@reown/appkit/react';
import dynamic from 'next/dynamic';

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () =>
    import('@/components/organisms/walletConnect').then((m) => m.WalletConnect),
  { ssr: false },
);

const LOASPage: NextPage = () => {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimOASAmount, setClaimOASAmount] = useState('');
  const { claimInfo, isClaimInfoLoading, claimInfoError } = useLOASClaimInfo();

  const refreshLOASClaimInfo = useRefreshLOASClaimInfo();

  const isMinted = !!claimInfo?.amount && claimInfo.amount.gt('0');
  const isClaimable = !!claimInfo?.claimable && claimInfo?.claimable.gt('0');

  const handleChainChanged = async () => {
    refreshLOASClaimInfo();
  };

  const claim = useCallback(async () => {
    const lOASContract = await getLOASContract();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const claimAmount = ethers.utils.parseEther(claimOASAmount);
      if (!isClaimable)
        throw new Error(`You do not have claimable ${lOASTokenUnit}`);
      if (claimAmount.gt(claimInfo.claimable))
        throw new Error('It is above the claimable amount');

      setIsClaiming(true);
      await lOASContract.claim(claimAmount);
      const filter = lOASContract.filters.Claim(ownerAddress, null);
      lOASContract.once(filter, (address, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setSuccessMsg(
          `Success to convert ${oasAmount} ${lOASTokenUnit} to ${oasAmount} OAS`,
        );
        refreshLOASClaimInfo();
        setIsClaiming(false);
        setClaimOASAmount('');
      });
    } catch (err) {
      setIsClaiming(false);
      handleError(err, setErrorMsg);
    }
  }, [
    isClaimable,
    claimInfo,
    ownerAddress,
    claimOASAmount,
    refreshLOASClaimInfo,
  ]);

  useEffect(() => {
    refreshLOASClaimInfo();
  }, [ownerAddress, refreshLOASClaimInfo]);

  return (
    <div className='space-y-20 grid grid-cols-10 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect handleChainChanged={handleChainChanged} />
      <Claim
        className='col-span-8 col-start-2'
        ownerAddress={ownerAddress}
        claimInfo={claimInfo}
        isClaimInfoLoading={isClaimInfoLoading}
        claimInfoError={claimInfoError}
        claim={claim}
        claimOASAmount={claimOASAmount}
        setClaimOASAmount={setClaimOASAmount}
        isClaiming={isClaiming}
        errorMsg={errorMsg}
        successMsg={successMsg}
        isMinted={isMinted}
        isClaimable={isClaimable}
        tokenUnit={lOASTokenUnit}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(LOASPage), { ssr: false });
