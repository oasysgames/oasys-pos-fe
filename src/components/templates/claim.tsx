import { ethers } from 'ethers';
import { formattedDate } from '../../features';
import { Button, ErrorMsg, SuccessMsg } from '../atoms';
import { ClaimInfo } from '../../types/sOAS';

type Props = {
  claimInfo?: ClaimInfo;
  isClaimInfoLoading: boolean;
  claimInfoError: any;
  claim: () => Promise<void>;
  errorMsg: string;
  successMsg: string;
  isMinted: boolean;
  isClaimable: boolean;
};

export const Claim = (props: Props) => {
  const {
    claimInfo,
    isClaimInfoLoading,
    claimInfoError,
    claim,
    errorMsg,
    successMsg,
    isMinted,
    isClaimable,
  } = props;
  
  if (isClaimInfoLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-10'>
      <div>
        <p className='text-center mb-10'>
          Vesting Period: {isMinted && claimInfo?.since && claimInfo?.until ? `${formattedDate(claimInfo.since)} ~ ${formattedDate(claimInfo.until)}` : ''}
        </p>
        <div className='grid grid-cols-8 mb-5'>
          <div className='col-start-2 col-span-2 text-center space-y-2'>
            <p>Total</p>
            <p>{typeof claimInfo?.amount === 'number' ? `${ethers.utils.formatEther(claimInfo.amount)} $sOAS` : ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimable</p>
            <p>{typeof claimInfo?.claimable === 'number' ? `${ethers.utils.formatEther(claimInfo.claimable)} $sOAS` : ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimed</p>
            <p>{typeof claimInfo?.claimed === 'number' ? `${ethers.utils.formatEther(claimInfo.claimed)} $sOAS` : ''}</p>
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
