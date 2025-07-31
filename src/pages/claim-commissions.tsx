import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { handleError, getStakeManagerContract, formatWeiAmount } from '@/features';
import { Button, ErrorMsg, SuccessMsg, Table } from '@/components/atoms';
import { LoadingModal } from '@/components/organisms';
import { useValidatorInfo, useRefreshValidatorInfo } from '@/hooks';
import { useAppKitAccount } from '@reown/appkit/react';
import dynamic from 'next/dynamic'

// Disable SSR for WalletConnect
const WalletConnect = dynamic(
  () => import('@/components/organisms/walletConnect').then(m => m.WalletConnect),
  { ssr: false }
);

const ClaimCommissions: NextPage = () => {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' });
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');
  const [claimErrorMsg, setClaimErrorMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const { validatorInfo, isValidatorInfoLoading, validatorInfoError } = useValidatorInfo(ownerAddress);
  const refreshValidatorInfo = useRefreshValidatorInfo();

  const refreshError = () => {
    setClaimErrorMsg('');
  };

  const handleChainChanged = async () => {
    refreshValidatorInfo();
  };

  const claimCommissions = async () => {
    try {
      const stakeManagerContract = await getStakeManagerContract();
      refreshError();
      setIsClaiming(true);
      await stakeManagerContract.claimCommissions(ownerAddress || '', 0);
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
    refreshValidatorInfo();
  }, [ownerAddress, refreshValidatorInfo]);

  const heads = [
    'Key',
    'Value'
  ];

  const records = [
    [
      'commissions (OAS)',
      validatorInfo?.commissions ? formatWeiAmount(validatorInfo.commissions) : '0.0',
    ],
  ];

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      {(isClaiming || isValidatorInfoLoading) && <LoadingModal/>}
      <WalletConnect
        handleChainChanged={ handleChainChanged }
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
            <Table
              heads={heads}
              records={records}
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

export default dynamic(
  () => Promise.resolve(ClaimCommissions),
  { ssr: false }
);
