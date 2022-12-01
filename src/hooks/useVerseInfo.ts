import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getChainId, getNamedAddresses } from '@/features';
import { GenesisParams } from '@/types/optimism/genesis';
import { GenesisGasParams, GenesisBlockParams, GenesisCliqueParams, ZERO_ADDRESS } from '@/const';
import { makeGenesisJson } from '@/features/optimism';


const SWR_KEY = 'VerseInfo';

const getVerseInfo = async (builder: string, sequencer: string) => {
  const chainId = await getChainId(builder);
  if (!chainId) return undefined;

  const namedAddresses = await getNamedAddresses(chainId);
  const genesisParams: GenesisParams = {
    chainId,
    ovmWhitelistOwner: ZERO_ADDRESS,
    ovmGasPriceOracleOwner: builder,
    ovmFeeWalletAddress: builder,
    ovmBlockSignerAddress: sequencer,
    ...GenesisGasParams,
    ...GenesisBlockParams,
    ...GenesisCliqueParams,
  };
  const genesis = await makeGenesisJson(genesisParams, namedAddresses);
  return {
    chainId,
    namedAddresses,
    genesis,
  }
};

export const useVerseInfo = (builder: string, sequencer: string) => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getVerseInfo(builder, sequencer);
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