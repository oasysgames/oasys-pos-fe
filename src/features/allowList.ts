import { ethers } from 'ethers';
import { isNotAllowedAddressMsg } from '../const';

export const isAllowedAddress = async (allowListContract: ethers.Contract, address: string) => {
  const iaAllow = await allowListContract.containsAddress(address);
  if (!iaAllow) {
    throw new Error(isNotAllowedAddressMsg);
  }
}