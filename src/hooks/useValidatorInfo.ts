import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { getValidatorInfo as getValidatorInfoFromContract } from '@/features';

const SWR_KEY = 'ValidatorInfo';

const getValidatorInfo = async (ownerAddress?: string) => {
  if (!ownerAddress) return undefined;

  const data = await getValidatorInfoFromContract(ownerAddress);
  return data;
};

export const useValidatorInfo = (owner?: string) => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getValidatorInfo(owner);
  });
  return {
    validatorInfo: data,
    isValidatorInfoLoading: owner && !error && !data,
    validatorInfoError: error,
  };
};

export const useRefreshValidatorInfo = () => {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(SWR_KEY), [mutate]);
};
