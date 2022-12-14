import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { getVerseInfo } from '@/features/optimism/verse';

const SWR_KEY = 'VerseInfo';

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