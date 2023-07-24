import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getProvider, getSigner, handleError, getStakeManagerContract } from '@/features';
import { Button, ErrorMsg, SuccessMsg } from '@/components/atoms';
import { LoadingModal, WalletConnect, ValidatorInfo } from '@/components/organisms';
import { isNotConnectedMsg } from '@/consts';
import { useValidatorInfo, useRefreshValidatorInfo } from '@/hooks';

const ClaimCommissions: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');
  const [claimErrorMsg, setClaimErrorMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const { validatorInfo, isValidatorInfoLoading, validatorInfoError } = useValidatorInfo(ownerAddress);
  const refreshValidatorInfo = useRefreshValidatorInfo();

  const refreshError = () => {
    setOwnerError('');
    setClaimErrorMsg('');
  };

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
      refreshValidatorInfo();
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
  }

  const claimCommissions = async () => {
    try {
      const stakeManagerContract = await getStakeManagerContract();
      refreshError();
      setIsClaiming(true);
      await stakeManagerContract.claimCommissions(ownerAddress, 0);
      const filter = stakeManagerContract.filters.ClaimedCommissions(ownerAddress, null);
      stakeManagerContract.once(filter, (owner, amount) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setClaimSuccessMsg(`claim commissions is successful(${oasAmount}OAS)`);
        setIsClaiming(false);
      });
    } catch (err) {
      setClaimSuccessMsg('');
      setIsClaiming(false);
      handleError(err, setClaimErrorMsg);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshValidatorInfo();
  }, [ownerAddress, refreshValidatorInfo]);

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      {(isClaiming || isValidatorInfoLoading) && <LoadingModal/>}
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
      />
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {(!ownerAddress || !validatorInfo || !validatorInfo.joined) &&
        <p>You have to join validator.</p>
        }
        {(ownerAddress && validatorInfo && validatorInfo.joined)  &&
          <div className='space-y-4'>
            {claimErrorMsg && (
              <ErrorMsg text={ claimErrorMsg } className='w-full' />
            )}
            {claimSuccessMsg && (
              <SuccessMsg text={claimSuccessMsg} className='w-full' />
            )}
            {validatorInfoError instanceof Error && (
              <ErrorMsg text={validatorInfoError.message} className='w-full' />
            )}
            <ValidatorInfo
              className='space-y-2'
              ownerAddress={ownerAddress}
              validatorInfo={validatorInfo}
            />
            <div className="flex items-center space-x-2">
              <Button
                handleClick={claimCommissions}
              >
                Claim Commissions
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default ClaimCommissions
