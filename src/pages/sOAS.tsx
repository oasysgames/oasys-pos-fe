import type { NextPage } from 'next';
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { Claim } from '@/components/templates';
import { useSOASClaimInfo, useRefreshSOASClaimInfo } from '@/hooks';
import { handleError, getSOASContract } from '@/features';
import { sOASTokenUnit } from '@/consts';
import { useAppKitAccount } from '@reown/appkit/react';
import dynamic from 'next/dynamic'

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () => import('@/components/organisms/walletConnect').then(m => m.WalletConnect),
  { ssr: false }
);

const SOASPage: NextPage = () => {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimOASAmount, setClaimOASAmount] = useState('');
  const { claimInfo, isClaimInfoLoading, claimInfoError } = useSOASClaimInfo();

  const refreshSOASClaimInfo = useRefreshSOASClaimInfo();

  const isMinted = !!claimInfo?.amount && claimInfo.amount.gt('0');
  const isClaimable = !!claimInfo?.claimable && claimInfo?.claimable.gt('0');
  
  const handleChainChanged = async () => {
    refreshSOASClaimInfo();
  };

  const claim = useCallback(async () => {
    const sOASContract = await getSOASContract();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const claimAmount = ethers.utils.parseEther(claimOASAmount);
      if (!isClaimable) throw new Error(`You do not have claimable ${sOASTokenUnit}`);
      if (claimAmount.gt(claimInfo.claimable)) throw new Error('It is above the claimable amount');

      setIsClaiming(true);
      await sOASContract.claim(claimAmount);

      const filter = sOASContract.filters.Claim(ownerAddress, null);
      sOASContract.once(filter, (address, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setSuccessMsg(`Success to convert ${oasAmount} ${sOASTokenUnit} to ${oasAmount} OAS`);
        refreshSOASClaimInfo();
        setIsClaiming(false);
        setClaimOASAmount('');
      })
    } catch (err) {
      setIsClaiming(false);
      handleError(err, setErrorMsg);
    }
  }, [isClaimable, claimInfo, ownerAddress, claimOASAmount, refreshSOASClaimInfo]);

  useEffect(() => {
    refreshSOASClaimInfo();
  }, [ownerAddress, refreshSOASClaimInfo]);

  return (
    <div className='space-y-20 grid grid-cols-10 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        handleChainChanged={ handleChainChanged }
      />
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
        tokenUnit={sOASTokenUnit}
      />
    </div>
  )
}

export default dynamic(
  () => Promise.resolve(SOASPage),
  { ssr: false }
);
