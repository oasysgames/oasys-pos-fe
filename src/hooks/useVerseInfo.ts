import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { getVerseInfo } from '@/features/optimism/verse';
import { getVerseChainId, getProvider } from '@/features';

const SWR_KEY = 'VerseInfo';

const getVerseInfoFromBuilder = async (builder: string) => {
  const provider = await getProvider();
  const accounts = await provider.send('eth_accounts', []);
  if (accounts.length === 0) return undefined;

  const verseChainId = await getVerseChainId(builder);
  if (!verseChainId) return {
    chainId: undefined,
    namedAddresses: undefined,
    genesis: undefined,
  };

  return await getVerseInfo(builder, verseChainId);
}

export const useVerseInfo = (builder: string) => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getVerseInfoFromBuilder(builder);
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