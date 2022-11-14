import type { NextPage } from 'next';
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import LOAS from '../contracts/LOAS.json';
import { getSigner } from '../features';
import { lOASAddress } from '../config';
import { Claim } from '../components/templates';
import { useLOASClaimInfo } from '../hooks';

const LOASPage: NextPage = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { claimInfo, isClaimInfoLoading, claimInfoError} = useLOASClaimInfo();

  const isMinted = typeof claimInfo?.amount === 'number' && claimInfo.amount > 0;
  const isClaimable = typeof claimInfo?.claimable === 'number' && claimInfo.claimable > 0;

  const claim = useCallback(async () => {
    const signer = await getSigner();
    const ownerAddress = await signer.getAddress();
    const lOASContract = new ethers.Contract(lOASAddress, LOAS.abi, signer);
    try {
      if (!isClaimable) throw new Error('You do not have claimable aOAS');

      await lOASContract.claim(claimInfo.claimable);
      const filter = lOASContract.filters.Claim(ownerAddress, null);
      lOASContract.once(filter, (address, amount) => {
        setSuccessMsg(`Success to convert ${amount}LOAS to ${amount}OAS`);
      })
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      }
    }
  }, [isClaimable, claimInfo]);

  return (
    <Claim
      claimInfo={claimInfo}
      isClaimInfoLoading={isClaimInfoLoading}
      claimInfoError={claimInfoError}
      claim={claim}
      errorMsg={errorMsg}
      successMsg={successMsg}
      isMinted={isMinted}
      isClaimable={isClaimable}
      tokenUnit='lOAS'
    ></Claim>
  )
}

export default LOASPage;
