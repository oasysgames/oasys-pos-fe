import { customChains } from '@/config/chains';

/**
 * Create a lookup map from chainId to name.
 */
const networkNameMap: Record<number, string> = customChains.reduce(
  (acc, { id, name }) => {
    acc[Number(id)] = name;
    return acc;
  },
  {} as Record<number, string>,
);

/**
 * Get network name by chain ID.
 * @param chainId - The numeric chain ID
 * @returns The network name, or "Unknown" if not found
 */
export const getNetworkName = (chainId: number): string => {
  return networkNameMap[chainId] ?? 'Unknown';
};
