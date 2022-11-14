import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getSigner } from '../features';
import LOAS from '../contracts/LOAS.json';
import { lOASAddress } from '../config';
import { ClaimInfo } from '../types/lOAS';

const SWR_KEY = 'LOASClaimInfo';

const getLOASClaimInfo = async () => {
  const signer = await getSigner();
  const ownerAddress = await signer.getAddress();
  const lOASContract = new ethers.Contract(lOASAddress, LOAS.abi, signer);
  const res = await lOASContract.claimInfo(ownerAddress);
  const claimable = await lOASContract.getClaimableOAS(ownerAddress);
  const data: ClaimInfo = {
    amount: res.amount.toNumber(),
    claimed: res.claimed.toNumber(),
    claimable: claimable.toNumber(),
    since: new Date(res.since.toNumber()),
    until: new Date(res.until.toNumber()),
    from: res.from,
  };
  return data;
};

export const useLOASClaimInfo = () => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getLOASClaimInfo();
  });
  return {
    claimInfo: data,
    isClaimInfoLoading: !error && !data,
    claimInfoError: error,
  };
}

export const useRefreshLOASClaimInfo = () => {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(SWR_KEY), [mutate]);
};