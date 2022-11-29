import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getChainId, getNamedAddresses, getSigner } from '../features';
import L1BuildAgent from '../contracts/L1BuildAgent.json';
import { L1BuildAgentAddress } from '../config';

const SWR_KEY = 'VerseInfo';

const getVerseInfo = async (builder: string) => {
  const signer = await getSigner();
  const L1BuildAgentContract = new ethers.Contract(L1BuildAgentAddress, L1BuildAgent.abi, signer);

  const verseChainId = await getChainId(builder);
  if (!verseChainId) return undefined;

  const addresses = await getNamedAddresses(verseChainId);

  return {
    chainId: verseChainId,
    addresses,
  }
};

export const useVerseInfo = (builder: string) => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getVerseInfo(builder);
  });
  return {
    verseInfo: data,
    isVerseInfoLoading: !error && !data,
    verseInfoError: error,
  };
}

export const useRefreshVerseInfo = () => {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(SWR_KEY), [mutate]);
};