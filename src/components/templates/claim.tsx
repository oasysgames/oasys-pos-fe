import { ethers } from 'ethers';
import { formattedDate } from '@/features';
import { Input, Button, ErrorMsg, SuccessMsg } from '@/components/atoms';
import { LoadingModal } from '../organisms';
import { ClaimInfo as sOASClaimInfo  } from '@/types/oasysHub/sOAS';
import { ClaimInfo as lOASClaimInfo } from '@/types/oasysHub/lOAS';
import clsx from 'clsx';
import { ChangeEvent, SetStateAction } from "react";

type Props = {
  className?: string;
  ownerAddress: string;
  claimInfo?: sOASClaimInfo | lOASClaimInfo;
  isClaimInfoLoading: boolean;
  claimInfoError: any;
  claim: () => Promise<void>;
  claimOASAmount: string;
  setClaimOASAmount:  (value: SetStateAction<string>) => void;
  isClaiming: boolean;
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
    claimOASAmount,
    setClaimOASAmount,
    isClaiming,
    errorMsg,
    successMsg,
    isMinted,
    isClaimable,
    tokenUnit,
  } = props;

  if (ownerAddress && isClaimInfoLoading) return <LoadingModal />;
  
  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    setClaimOASAmount(e.target.value);
  };

  return (
    <div className={clsx(
      className,
      'space-y-10',
    )}>
      <div>
        <p className='text-center mb-10'>
          Vesting Period: {isMinted && claimInfo?.since && claimInfo?.until ? `${formattedDate(claimInfo.since)} ~ ${formattedDate(claimInfo.until)}` : ''}
        </p>
        <div className='grid grid-cols-8 mb-20'>
          <div className='col-start-2 col-span-2 text-center space-y-2'>
            <p>Total</p>
            <p>{claimInfo?.amount ? `${ethers.utils.formatEther(claimInfo.amount.toString())} $${tokenUnit}` : ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimable</p>
            <p>{claimInfo?.claimable ? `${ethers.utils.formatEther(claimInfo.claimable.toString())} $${tokenUnit}` : ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimed</p>
            <p>{claimInfo?.claimed ? `${ethers.utils.formatEther(claimInfo.claimed.toString())} $${tokenUnit}` : ''}</p>
          </div>
        </div>
        <div className='grid grid-cols-6 space-y-4'>
          <Input
            placeholder={`Set Claim Amount(${tokenUnit})`}
            value={claimOASAmount}
            handleClick={handleClick}
            disabled={!isClaimable || isClaiming}
            className='w-full col-start-2 col-span-4 h-10'
          />
          <Button
            handleClick={claim}
            className='col-start-2 col-span-4 h-10'
            disabled={!isClaimable || isClaiming}
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
