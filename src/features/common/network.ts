import { isInvalidNetworkMsg, MAINNET_CHAIN_ID, TESTNET_CHAIN_ID } from "@/consts";

export const isAllowedChain = (chainId: number) => {
  if (process.env.NEXT_PUBLIC_IS_PROD && !(chainId === MAINNET_CHAIN_ID || chainId === TESTNET_CHAIN_ID))
    throw new Error(isInvalidNetworkMsg);
};

export const getNetworkName = (chainId: number) => {
  if (chainId === MAINNET_CHAIN_ID) return "Oasys mainnet";
  if (chainId === TESTNET_CHAIN_ID) return "Oasys testnet";
  return "Network not Oasys";
}
