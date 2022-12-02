import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getProvider, getSigner } from '@/features';
import L1BuildDeposit from '@/contracts/oasysHub/L1BuildDeposit.json';
import { L1BuildDepositAddress, sOASAddress } from '@/config';
import { L1BuildDeposit as depositType } from '@/types/oasysHub/verseBuild';

const SWR_KEY = 'L1BuildDeposit';

const getL1BuildDeposit = async () => {
  const provider = await getProvider();
  const accounts = await provider.send('eth_accounts', []);
  if (accounts.length === 0) return undefined;

  const signer = await getSigner();
  const ownerAddress = await signer.getAddress();
  const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);
  const depositTotal: ethers.BigNumber = await L1BuildDepositContract.getDepositTotal(ownerAddress);
  const depositOAS: ethers.BigNumber = await L1BuildDepositContract.getDepositAmount(ownerAddress, ownerAddress);
  const depositSOAS: ethers.BigNumber = await L1BuildDepositContract.getDepositERC20Amount(ownerAddress, ownerAddress, sOASAddress);

  const data: depositType = {
    depositTotal,
    depositOAS,
    depositSOAS,
  };
  return data;
};

export const useL1BuildDeposit = () => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getL1BuildDeposit();
  });
  return {
    data: data,
    isLoading: !error && !data,
    error: error,
  };
}

export const useRefreshL1BuildDeposit = () => {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(SWR_KEY), [mutate]);
};