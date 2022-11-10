import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SOAS from '../contracts/SOAS.json';
import { getSigner, formattedDate } from '../features';
import { sOASAddress } from '../config';
import { PageTitle, Button, ErrorMsg, SuccessMsg } from '../components';
import { ClaimInfo } from '../types/sOAS';

const SOASPage: NextPage = () => {
  const pageTitle = 'Claim sOAS';
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const getClaimInfo = async () => {
    const signer = await getSigner();
    const ownerAddress = await signer.getAddress();
    const sOASContract = new ethers.Contract(sOASAddress, SOAS.abi, signer);

    try {
      const res = await sOASContract.claimInfo(ownerAddress);
      const claimable = await sOASContract.getClaimableOAS(ownerAddress);
      const data: ClaimInfo = {
        amount: res.amount.toNumber(),
        claimed: res.claimed.toNumber(),
        claimable: claimable.toNumber(),
        since: new Date(res.since.toNumber()),
        until: new Date(res.until.toNumber()),
        from: res.from,
      };
      setClaimInfo(data);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getClaimInfo();
    };
    fetchData();
  }, []);

  return (
    <div  className='px-2 py-2 space-y-10'>
      <PageTitle text={pageTitle} />
      <div>
        {errorMsg && (
          <ErrorMsg className='text-center' text={ errorMsg } />
        )}
        {successMsg && (
          <SuccessMsg className='text-center' text={ successMsg } />
        )}
      </div>
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
    </div>
  )
}

export default SOASPage;
