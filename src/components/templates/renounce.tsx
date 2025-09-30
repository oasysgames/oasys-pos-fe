import { ethers } from 'ethers';
import { formattedDate } from '@/features';
import { Input, Button, ErrorMsg, SuccessMsg } from '@/components/atoms';
import { LoadingModal } from '../organisms';
import { ClaimInfo as sOASClaimInfo } from '@/types/oasysHub/sOAS';
import { ClaimInfo as lOASClaimInfo } from '@/types/oasysHub/lOAS';
import clsx from 'clsx';
import { ChangeEvent, SetStateAction } from 'react';

type Props = {
  className?: string;
  ownerAddress?: string;
  claimInfo?: sOASClaimInfo | lOASClaimInfo;
  isClaimInfoLoading: boolean;
  claimInfoError: any;
  renounce: () => Promise<void>;
  renounceOASAmount: string;
  setRenounceOASAmount: (value: SetStateAction<string>) => void;
  isRenouncing: boolean;
  errorMsg: string;
  successMsg: string;
  isMinted: boolean;
  isRenounceable: boolean;
  tokenUnit: string;
};

export const Renounce = (props: Props) => {
  const {
    className,
    ownerAddress,
    claimInfo,
    isClaimInfoLoading,
    claimInfoError,
    renounce,
    renounceOASAmount,
    setRenounceOASAmount,
    isRenouncing,
    errorMsg,
    successMsg,
    isMinted,
    isRenounceable,
    tokenUnit,
  } = props;

  if (ownerAddress && isClaimInfoLoading) return <LoadingModal />;

  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    setRenounceOASAmount(e.target.value);
  };

  return (
    <div className={clsx(className, 'space-y-10')}>
      <div>
        <p className='text-center'>“Renounce” means returning {tokenUnit} to the minter.</p>
        <p className='text-center mb-10'>You will not receive any OAS.</p>
        <p className='text-center mb-10'>
          Vesting Period:{' '}
          {isMinted && claimInfo?.since && claimInfo?.until
            ? `${formattedDate(claimInfo.since)} ~ ${formattedDate(
                claimInfo.until,
              )}`
            : ''}
        </p>
        <div className='grid grid-cols-6 mb-20'>
          <div className='col-start-2 col-span-2 text-center space-y-2'>
            <p>Total</p>
            <p>
              {claimInfo?.amount
                ? `${ethers.utils.formatEther(
                    claimInfo.amount.toString(),
                  )} $${tokenUnit}`
                : ''}
            </p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Renounceable</p>
            <p>
              {claimInfo?.renounceable
                ? `${ethers.utils.formatEther(
                    claimInfo.renounceable.toString(),
                  )} $${tokenUnit}`
                : ''}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-6 space-y-4'>
          <Input
            placeholder={`Set Renounce Amount(${tokenUnit})`}
            value={renounceOASAmount}
            handleClick={handleClick}
            disabled={!isRenounceable || isRenouncing}
            className='w-full col-start-2 col-span-4 h-10'
          />
          <Button
            handleClick={renounce}
            className='col-start-2 col-span-4 h-10'
            disabled={!isRenounceable || isRenouncing}
          >
            renounce
          </Button>
        </div>
      </div>
      <div>
        {claimInfoError instanceof Error && (
          <ErrorMsg className='text-center' text={claimInfoError.message} />
        )}
        {errorMsg && <ErrorMsg className='text-center' text={errorMsg} />}
        {successMsg && <SuccessMsg className='text-center' text={successMsg} />}
      </div>
    </div>
  );
};
