import { MAINNET_CHAIN_ID, TESTNET_CHAIN_ID } from "@/consts";

export const getNetworkName = (chainId: number) => {
  if (chainId === MAINNET_CHAIN_ID) return "Oasys mainnet";
  if (chainId === TESTNET_CHAIN_ID) return "Oasys testnet";
  return "Unknown";
}
