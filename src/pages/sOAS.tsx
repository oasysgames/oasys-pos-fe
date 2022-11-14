import type { NextPage } from 'next';
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import SOAS from '../contracts/SOAS.json';
import { getSigner } from '../features';
import { sOASAddress } from '../config';
import { Claim } from '../components/templates';
import { useSOASClaimInfo } from '../hooks';

const SOASPage: NextPage = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { claimInfo, isClaimInfoLoading, claimInfoError} = useSOASClaimInfo();

  const isMinted = typeof claimInfo?.amount === 'number' && claimInfo.amount > 0;
  const isClaimable = typeof claimInfo?.claimable === 'number' && claimInfo.claimable > 0;

  const claim = useCallback(async () => {
    const signer = await getSigner();
    const ownerAddress = await signer.getAddress();
    const sOASContract = new ethers.Contract(sOASAddress, SOAS.abi, signer);
    try {
      if (!isClaimable) throw new Error('You do not have claimable aOAS');

      await sOASContract.claim(claimInfo.claimable);
      const filter = sOASContract.filters.Claim(ownerAddress, null);
      sOASContract.once(filter, (address, amount) => {
        setSuccessMsg(`Success to convert ${amount}SOAS to ${amount}OAS`);
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
    ></Claim>
  )
}

export default SOASPage;
