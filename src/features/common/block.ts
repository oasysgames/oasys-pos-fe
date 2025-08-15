import { providers } from 'ethers';

// Search for the block that exactly matches the specified timestamp.
export const getBlockByTime = async (
  provider: providers.Provider,
  targetBlockTime: number,
  blockPeriod: number,
): Promise<null | providers.Block> => {
  const latest = await provider.getBlock('latest');
  if (targetBlockTime > latest.timestamp) {
    return null;
  }

  let number =
    latest.number - ~~((latest.timestamp - targetBlockTime) / blockPeriod);
  if (number < 0) {
    return null;
  }

  while (true) {
    const block = await provider.getBlock(number);
    const diff = block.timestamp - targetBlockTime;
    if (diff === 0) {
      return block;
    }
    if (Math.abs(diff) < blockPeriod) {
      break;
    }
    number -= ~~(diff / blockPeriod);
  }

  return null;
};
