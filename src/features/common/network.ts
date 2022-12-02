import { isNotMainnetConnectMsg, IS_MAINNET, MAINNET_CHAIN_ID } from "@/consts";

export const isAllowedChain = (chainId: number) => {
  if (IS_MAINNET && chainId !== MAINNET_CHAIN_ID)
    throw new Error(isNotMainnetConnectMsg);
};
