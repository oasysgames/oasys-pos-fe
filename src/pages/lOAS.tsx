import type { NextPage } from 'next';
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import LOAS from '@/contracts/LOAS.json';
import { lOASAddress } from '@/config';
import { Button, ErrorMsg } from '@/components/atoms';
import { getProvider, getSigner, isAllowedChain, handleError } from '@/features';
import { Claim } from '@/components/templates';
import { useLOASClaimInfo, useRefreshLOASClaimInfo } from '@/hooks';
import { isNotConnectedMsg } from '@/const';

const LOASPage: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const { claimInfo, isClaimInfoLoading, claimInfoError } = useLOASClaimInfo();
  const refreshLOASClaimInfo = useRefreshLOASClaimInfo();
  const tokenUnit='lOAS'

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
      isAllowedChain(chainId);
      setOwner();
      refreshLOASClaimInfo();
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

  const claim = useCallback(async () => {
    const signer = await getSigner();
    const lOASContract = new ethers.Contract(lOASAddress, LOAS.abi, signer);
    try {
      if (!isClaimable) throw new Error(`You do not have claimable ${tokenUnit}`);

      setIsClaiming(true);
      await lOASContract.claim(claimInfo.claimable);
      const filter = lOASContract.filters.Claim(ownerAddress, null);
      lOASContract.once(filter, (address: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setSuccessMsg(`Success to convert ${oasAmount}${tokenUnit} to ${oasAmount}OAS`);
        refreshLOASClaimInfo();
        setIsClaiming(false);
      })
    } catch (err) {
      setIsClaiming(false);
      handleError(err, setErrorMsg);
    }
  }, [isClaimable, claimInfo, ownerAddress, refreshLOASClaimInfo]);

  useEffect(() => {
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshLOASClaimInfo();
  }, [ownerAddress, refreshLOASClaimInfo]);

  return (
    <div className='space-y-20 grid grid-cols-10 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <div className='space-y-0.5 col-span-6 col-start-3'>
        {ownerError && (
          <ErrorMsg text={ ownerError } className='w-full' />
        )}
        <p>Owner Address: { ownerAddress }</p>
        <Button
          handleClick={setOwner}
        >
          Connect
        </Button>
      </div>
      <Claim
        className='col-span-8 col-start-2'
        ownerAddress={ownerAddress}
        claimInfo={claimInfo}
        isClaimInfoLoading={isClaimInfoLoading}
        claimInfoError={claimInfoError}
        claim={claim}
        isClaiming={isClaiming}
        errorMsg={errorMsg}
        successMsg={successMsg}
        isMinted={isMinted}
        isClaimable={isClaimable}
        tokenUnit={tokenUnit}
      />
    </div>
  )
}

export default LOASPage;
