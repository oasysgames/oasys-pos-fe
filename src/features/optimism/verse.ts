import { getNamedAddresses, getSigner } from '@/features';
import { GenesisParams } from '@/types/optimism/genesis';
import { GenesisGasParams, GenesisBlockParams, GenesisCliqueParams, ZERO_ADDRESS, MAINNET_CHAIN_ID, Mainnet_OvmBlockSignerAddress, Testnet_OvmBlockSignerAddress } from '@/consts';
import { makeGenesisJson } from '@/features/optimism';
import { VerseInfo } from '@/types/optimism/verse';

export const getVerseInfo = async (builder: string, verseChainId: number): Promise<VerseInfo> => {
  const signer = await getSigner();
  const chainId = await signer.getChainId();

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