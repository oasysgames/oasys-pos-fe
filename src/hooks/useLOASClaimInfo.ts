import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getLOASContract, getProvider, getSigner } from '@/features';
import { ClaimInfo } from '@/types/oasysHub/lOAS';

const SWR_KEY = 'LOASClaimInfo';

const getLOASClaimInfo = async () => {
  const provider = await getProvider();
  const accounts = await provider.send('eth_accounts', []);
  if (accounts.length === 0) return undefined;

  const signer = await getSigner();
  const ownerAddress = await signer.getAddress();
  const lOASContract = await getLOASContract();
  const res = await lOASContract.claimInfo(ownerAddress);
  const claimable: ethers.BigNumber = await lOASContract.getClaimableOAS(ownerAddress);
  const balance: ethers.BigNumber = await lOASContract.balanceOf(ownerAddress);
  const currentClaimable = claimable.sub(res.claimed);

  // We actually have to toString since and until because since and until are uint64 at solidity.
  // But when mint, since and until are set by javascript.
  // That's why It is ok that res.since.toNumber() and res.until.toNumber().
  const data: ClaimInfo = {
    amount: res.amount,
    claimed: res.claimed,
    claimable: currentClaimable.gte(balance) ? balance :currentClaimable,
    since: new Date(res.since.toNumber() * 1000), // res.since unit is seconds
    until: new Date(res.until.toNumber() * 1000), // res.until unit is seconds
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