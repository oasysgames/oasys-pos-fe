import type { NextPage } from 'next';
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { handleError, getLOASContract } from '@/features';
import { Renounce } from '@/components/templates';
import { useLOASClaimInfo, useRefreshLOASClaimInfo } from '@/hooks';
import { lOASTokenUnit } from '@/consts';
import { useAppKitAccount } from '@reown/appkit/react';
import dynamic from 'next/dynamic'

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () => import('@/components/organisms/walletConnect').then(m => m.WalletConnect),
  { ssr: false }
);

const LOASRenouncePage: NextPage = () => {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isRenouncing, setIsRenouncing] = useState(false);
  const [renounceOASAmount, setRenounceOASAmount] = useState('');
  const { claimInfo, isClaimInfoLoading, claimInfoError } = useLOASClaimInfo();

  const refreshLOASClaimInfo = useRefreshLOASClaimInfo();

  const isMinted = !!claimInfo?.amount && claimInfo.amount.gt('0');
  const isRenounceable = !!claimInfo?.renounceable && claimInfo?.renounceable.gt('0');

  const handleChainChanged = async () => {
    refreshLOASClaimInfo();
  };

  const renounce = useCallback(async () => {
    const lOASContract = await getLOASContract();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const renounceAmount = ethers.utils.parseEther(renounceOASAmount);
      if (!isRenounceable) throw new Error(`You do not have renounceable ${lOASTokenUnit}`);
      if (renounceAmount.gt(claimInfo.renounceable)) throw new Error('It is above the renounceable amount');

      setIsRenouncing(true);
      await lOASContract.renounce(renounceAmount);
      const filter = lOASContract.filters.Renounce(ownerAddress, null);
      lOASContract.once(filter, (address, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setSuccessMsg(`Success to renounce ${oasAmount} ${lOASTokenUnit}`);
        refreshLOASClaimInfo();
        setIsRenouncing(false);
        setRenounceOASAmount('');
      })
    } catch (err) {
      setIsRenouncing(false);
      handleError(err, setErrorMsg);
    }
  }, [isRenounceable, claimInfo, ownerAddress, renounceOASAmount, refreshLOASClaimInfo]);

  useEffect(() => {
    refreshLOASClaimInfo();
  }, [ownerAddress, refreshLOASClaimInfo]);

  return (
    <div className='space-y-20 grid grid-cols-10 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        handleChainChanged={ handleChainChanged }
      />
      <Renounce
        className='col-span-8 col-start-2'
        ownerAddress={ownerAddress}
        claimInfo={claimInfo}
        isClaimInfoLoading={isClaimInfoLoading}
        claimInfoError={claimInfoError}
        renounce={renounce}
        renounceOASAmount={renounceOASAmount}
        setRenounceOASAmount={setRenounceOASAmount}
        isRenouncing={isRenouncing}
        errorMsg={errorMsg}
        successMsg={successMsg}
        isMinted={isMinted}
        isRenounceable={isRenounceable}
        tokenUnit={lOASTokenUnit}
      />
    </div>
  )
}

export default dynamic(
  () => Promise.resolve(LOASRenouncePage),
  { ssr: false }
);
