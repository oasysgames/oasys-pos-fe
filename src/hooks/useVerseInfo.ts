import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { getChainId, getNamedAddresses, getSigner } from '@/features';
import { GenesisParams } from '@/types/optimism/genesis';
import { GenesisGasParams, GenesisBlockParams, GenesisCliqueParams, ZERO_ADDRESS, MAINNET_CHAIN_ID, Mainnet_OvmBlockSignerAddress, Testnet_OvmBlockSignerAddress } from '@/consts';
import { makeGenesisJson } from '@/features/optimism';


const SWR_KEY = 'VerseInfo';

const getVerseInfo = async (builder: string) => {
  const signer = await getSigner();
  const chainId = await signer.getChainId();
  const verseChainId = await getChainId(builder);
  if (!verseChainId) return undefined;

  const namedAddresses = await getNamedAddresses(verseChainId);
  const genesisParams: GenesisParams = {
    chainId: verseChainId,
    ovmWhitelistOwner: ZERO_ADDRESS,
    ovmGasPriceOracleOwner: builder,
    ovmFeeWalletAddress: builder,
    ovmBlockSignerAddress: chainId === MAINNET_CHAIN_ID ? Mainnet_OvmBlockSignerAddress: Testnet_OvmBlockSignerAddress,
    ...GenesisGasParams,
    ...GenesisBlockParams,
    ...GenesisCliqueParams,
  };
  const genesis = await makeGenesisJson(genesisParams, namedAddresses);
  return {
    chainId: verseChainId,
    namedAddresses,
    genesis,
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