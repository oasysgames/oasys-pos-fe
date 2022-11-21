import { ethers } from 'ethers';
import { formattedDate } from '../../features';
import { Button, ErrorMsg, SuccessMsg } from '../atoms';
import { ClaimInfo as sOASClaimInfo  } from '../../types/sOAS';
import { ClaimInfo as lOASClaimInfo } from '../../types/lOAS';
import clsx from 'clsx';

type Props = {
  className?: string;
  ownerAddress: string;
  claimInfo?: sOASClaimInfo | lOASClaimInfo;
  isClaimInfoLoading: boolean;
  claimInfoError: any;
  claim: () => Promise<void>;
  errorMsg: string;
  successMsg: string;
  isMinted: boolean;
  isClaimable: boolean;
  tokenUnit: string;
};

export const Claim = (props: Props) => {
  const {
    className,
    ownerAddress,
    claimInfo,
    isClaimInfoLoading,
    claimInfoError,
    claim,
    errorMsg,
    successMsg,
    isMinted,
    isClaimable,
    tokenUnit,
  } = props;

  if (ownerAddress && isClaimInfoLoading) return <div className='text-center'>Loading...</div>;

  return (
    <div className={clsx(
      className,
      'space-y-10',
    )}>
      <div>
        <p className='text-center mb-10'>
          Vesting Period: {isMinted && claimInfo?.since && claimInfo?.until ? `${formattedDate(claimInfo.since)} ~ ${formattedDate(claimInfo.until)}` : ''}
        </p>
        <div className='grid grid-cols-8 mb-5'>
          <div className='col-start-2 col-span-2 text-center space-y-2'>
            <p>Total</p>
            <p>{typeof claimInfo?.amount === 'string' ? `${ethers.utils.formatEther(claimInfo.amount)} $${tokenUnit}` : ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimable</p>
            <p>{typeof claimInfo?.claimable === 'string' ? `${ethers.utils.formatEther(claimInfo.claimable)} $${tokenUnit}` : ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimed</p>
            <p>{typeof claimInfo?.claimed === 'string' ? `${ethers.utils.formatEther(claimInfo.claimed)} $${tokenUnit}` : ''}</p>
          </div>
        </div>
        <div className='grid grid-cols-6'>
          <Button
            handleClick={claim}
            className='col-start-2 col-span-4 h-10'
            disabled={!isClaimable}
          >
            claim
          </Button>
        </div>
      </div>
      <div>
        {claimInfoError instanceof Error && (
          <ErrorMsg className='text-center' text={claimInfoError.message} />
        )}
        {errorMsg && (
          <ErrorMsg className='text-center' text={errorMsg} />
        )}
        {successMsg && (
          <SuccessMsg className='text-center' text={successMsg} />
        )}
      </div>
    </div>
  )
};
