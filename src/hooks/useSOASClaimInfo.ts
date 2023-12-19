import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getProvider, getSigner, getSOASContract } from '@/features';
import { ClaimInfo } from '@/types/oasysHub/sOAS';

const SWR_KEY = 'SOASClaimInfo';

const getSOASClaimInfo = async () => {
  const provider = await getProvider();
  const accounts = await provider.send('eth_accounts', []);
  if (accounts.length === 0) return undefined;

  const signer = await getSigner();
  const sOASContract = await getSOASContract();

  const allowedClaimer = await signer.getAddress();
  const originalClaimer = await sOASContract.originalClaimer(allowedClaimer);

  const balance = await sOASContract.balanceOf(allowedClaimer);
  const claimInfo = await sOASContract.claimInfo(originalClaimer);
  const claimable = await sOASContract.getClaimableOAS(originalClaimer);

  let currentClaimable = claimable.sub(claimInfo.claimed);
  if (balance.lte(currentClaimable)) {
    currentClaimable = balance;
  }

  // We actually have to toString since and until because since and until are uint64 at solidity.
  // But when mint, since and until are set by javascript.
  // That's why It is ok that claimInfo.since.toNumber() and claimInfo.until.toNumber().
  const data: ClaimInfo = {
    amount: balance,
    claimed: claimInfo.claimed,
    claimable: currentClaimable,
    since: new Date(claimInfo.since.toNumber() * 1000), // claimInfo.since unit is seconds
    until: new Date(claimInfo.until.toNumber() * 1000), // claimInfo.until unit is seconds
    from: claimInfo.from,
  };
  return data;
};

export const useSOASClaimInfo = () => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getSOASClaimInfo();
  });
  return {
    claimInfo: data,
    isClaimInfoLoading: !error && !data,
    claimInfoError: error,
  };
};

export const useRefreshSOASClaimInfo = () => {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(SWR_KEY), [mutate]);
};
