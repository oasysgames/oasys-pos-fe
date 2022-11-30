import { isNotMainnetConnectMsg, IS_MAINNET, MAINNET_CHAIN_ID } from "../../const";

export const isAllowedChain = (chainId: number) => {
  if (IS_MAINNET && chainId !== MAINNET_CHAIN_ID)
    throw new Error(isNotMainnetConnectMsg);
};
