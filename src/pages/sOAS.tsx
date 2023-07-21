import type { NextPage } from 'next';
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletConnect } from '@/components/organisms';
import { Claim } from '@/components/templates';
import { useSOASClaimInfo, useRefreshSOASClaimInfo } from '@/hooks';
import { getProvider, getSigner, handleError, getSOASContract } from '@/features';
import { isNotConnectedMsg, sOASTokenUnit } from '@/consts';

const SOASPage: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimOASAmount, setClaimOASAmount] = useState('');
  const { claimInfo, isClaimInfoLoading, claimInfoError } = useSOASClaimInfo();
  const refreshSOASClaimInfo = useRefreshSOASClaimInfo();

  
  const isMinted = !!claimInfo?.amount && claimInfo.amount.gt('0');
  const isClaimable = !!claimInfo?.claimable && claimInfo?.claimable.gt('0');
  
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
      refreshSOASClaimInfo();
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

  const claim = useCallback(async () => {
    const sOASContract = await getSOASContract();
    try {
      const claimAmount = ethers.utils.parseEther(claimOASAmount);
      if (!isClaimable) throw new Error(`You do not have claimable ${sOASTokenUnit}`);
      if (claimAmount.gt(claimInfo.claimable)) throw new Error('It is above the claimable amount');

      setIsClaiming(true);
      await sOASContract.claim(claimAmount);

      const filter = sOASContract.filters.Claim(ownerAddress, null);
      sOASContract.once(filter, (address, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setSuccessMsg(`Success to convert ${oasAmount}${sOASTokenUnit} to ${oasAmount}OAS`);
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
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshSOASClaimInfo();
  }, [ownerAddress, refreshSOASClaimInfo]);

  return (
    <div className='space-y-20 grid grid-cols-10 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        className='space-y-0.5 col-span-6 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
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

export default SOASPage;
