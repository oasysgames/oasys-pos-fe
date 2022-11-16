import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getProvider, getSigner } from '../features';
import SOAS from '../contracts/SOAS.json';
import { sOASAddress } from '../config';
import { ClaimInfo } from '../types/sOAS';

const SWR_KEY = 'SOASClaimInfo';

const getSOASClaimInfo = async () => {
  const provider = await getProvider();
  const accounts = await provider.send('eth_accounts', []);
  if (accounts.length === 0) return undefined;

  const signer = await getSigner();
  const ownerAddress = await signer.getAddress();
  const sOASContract = new ethers.Contract(sOASAddress, SOAS.abi, signer);
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
}

export const useRefreshSOASClaimInfo = () => {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(SWR_KEY), [mutate]);
};