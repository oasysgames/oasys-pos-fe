import { ethers } from 'ethers';
import { isNotAllowedAddressMsg } from '@/consts';
import { getAllowListContract } from '@/features/';

export const isAllowedAddress = async (address: string) => {
  const allowListContract = await getAllowListContract();
  const iaAllow = await allowListContract.containsAddress(address);
  if (!iaAllow) {
    throw new Error(isNotAllowedAddressMsg);
  }
}