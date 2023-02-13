import { BigNumber } from "ethers";

import {
  getNamedAddresses,
  getSigner,
  getL1BuildDepositContract,
} from "@/features";
import { GenesisParams } from "@/types/optimism/genesis";
import {
  GenesisGasParams,
  GenesisBlockParams,
  GenesisCliqueParams,
  ZERO_ADDRESS,
  MAINNET_CHAIN_ID,
  Mainnet_OvmBlockSignerAddress,
  Testnet_OvmBlockSignerAddress,
} from "@/consts";
import { makeGenesisJson } from "@/features/optimism";
import { VerseInfo } from "@/types/optimism/verse";

// Use OVM_OAS if created after this block.
const OVM_OAS_BLOCK = BigNumber.from(630195);

export const getVerseInfo = async (
  builder: string,
  verseChainId: number
): Promise<VerseInfo> => {
  const signer = await getSigner();
  const chainId = await signer.getChainId();

  // Get the block number the verse was built.
  const l1BuildDeposit = await getL1BuildDepositContract();
  const block = (await l1BuildDeposit.getBuildBlock(builder)) as BigNumber;

  const namedAddresses = await getNamedAddresses(verseChainId);
  const genesisParams: GenesisParams = {
    chainId: verseChainId,
    ovmWhitelistOwner: ZERO_ADDRESS,
    ovmGasPriceOracleOwner: builder,
    ovmFeeWalletAddress: builder,
    ovmBlockSignerAddress:
      chainId === MAINNET_CHAIN_ID
        ? Mainnet_OvmBlockSignerAddress
        : Testnet_OvmBlockSignerAddress,
    useOvmOas: block.gte(OVM_OAS_BLOCK),
    ...GenesisGasParams,
    ...GenesisBlockParams,
    ...GenesisCliqueParams,
  };
  const genesis = await makeGenesisJson(genesisParams, namedAddresses);
  return {
    chainId: verseChainId,
    namedAddresses,
    genesis,
  };
};
