import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { getLOASContract, getProvider, getSigner } from '@/features';
import { ClaimInfo } from '@/types/oasysHub/lOAS';

const SWR_KEY = 'LOASClaimInfo';

const getLOASClaimInfo = async () => {
  const provider = await getProvider();
  const accounts = await provider.send('eth_accounts', []);
  if (accounts.length === 0) return undefined;

  const signer = await getSigner();
  const lOASContract = await getLOASContract();

  const allowedClaimer = await signer.getAddress();
  const originalClaimer = await lOASContract.originalClaimer(allowedClaimer);

  const balance = await lOASContract.balanceOf(allowedClaimer);
  const claimInfo = await lOASContract.claimInfo(originalClaimer);
  const claimable = await lOASContract.getClaimableOAS(originalClaimer);

  let currentClaimable = claimable.sub(claimInfo.claimed);
  if (balance.lte(currentClaimable)) {
    currentClaimable = balance;
  }

  let currentRenounceable = claimInfo.amount.sub(claimInfo.claimed);
  if (balance.lte(currentRenounceable)) {
    currentRenounceable = balance;
  }

  // We actually have to toString since and until because since and until are uint64 at solidity.
  // But when mint, since and until are set by javascript.
  // That's why It is ok that claimInfo.since.toNumber() and claimInfo.until.toNumber().
  const data: ClaimInfo = {
    amount: balance,
    claimed: claimInfo.claimed,
    claimable: currentClaimable,
    renounceable: currentRenounceable,
    since: new Date(claimInfo.since.toNumber() * 1000), // claimInfo.since unit is seconds
    until: new Date(claimInfo.until.toNumber() * 1000), // claimInfo.until unit is seconds
    from: claimInfo.from,
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
};

export const useRefreshLOASClaimInfo = () => {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(SWR_KEY), [mutate]);
};
