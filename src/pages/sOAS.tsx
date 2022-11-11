import type { NextPage } from 'next';
import { useState } from 'react';
import { ethers } from 'ethers';
import SOAS from '../contracts/SOAS.json';
import { getSigner, formattedDate } from '../features';
import { sOASAddress } from '../config';
import { PageTitle, Button, ErrorMsg, SuccessMsg } from '../components';
import { useSOASClaimInfo } from '../hooks';

const SOASPage: NextPage = () => {
  const pageTitle = 'Claim sOAS';
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { claimInfo, isClaimInfoLoading, claimInfoError} = useSOASClaimInfo();
  
  if (isClaimInfoLoading) {
    return <div>Loading...</div>;
  }

  const isMinted = typeof claimInfo?.amount === 'number' && claimInfo.amount > 0;
  const isClaimable = typeof claimInfo?.claimable === 'number' && claimInfo.claimable > 0;

  const claim = async () => {
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
  };

  return (
    <div  className='px-2 py-2 space-y-10 pb-96'>
      <PageTitle text={pageTitle} className='pb-32'/>
      <div>
        <p className='text-center pb-10'>
          Vesting Period: { isMinted && claimInfo?.since && claimInfo?.until ? `${formattedDate(claimInfo.since)} ~ ${formattedDate(claimInfo.until)}`: ''}
        </p>
        <div className='grid grid-cols-8 pb-5'>
          <div className='col-start-2 col-span-2 text-center space-y-2'>
            <p>Total</p>
            <p>{ typeof claimInfo?.amount === 'number' ? `${ethers.utils.formatEther(claimInfo.amount)} $sOAS`: ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimable</p>
            <p>{ typeof claimInfo?.claimable  === 'number' ? `${ethers.utils.formatEther(claimInfo.claimable)} $sOAS` : ''}</p>
          </div>
          <div className='col-span-2 text-center space-y-2'>
            <p>Claimed</p>
            <p>{ typeof claimInfo?.claimed  === 'number' ? `${ethers.utils.formatEther(claimInfo.claimed)} $sOAS` : ''}</p>
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
          <ErrorMsg className='text-center' text={ claimInfoError.message } />
        )}
        {errorMsg && (
          <ErrorMsg className='text-center' text={ errorMsg } />
        )}
        {successMsg && (
          <SuccessMsg className='text-center' text={ successMsg } />
        )}
      </div>
    </div>
  )
}

export default SOASPage;
