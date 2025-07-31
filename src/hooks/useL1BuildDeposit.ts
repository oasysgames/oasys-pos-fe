import { useCallback } from 'react';
import { ethers } from 'ethers';
import useSWR, { useSWRConfig } from 'swr';
import { getL1BuildDepositContract, getProvider, getSigner } from '@/features';
import { sOASAddress } from '@/consts';
import { L1BuildDeposit as depositType } from '@/types/oasysHub/verseBuild';

const SWR_KEY = 'L1BuildDeposit';

const getL1BuildDeposit = async (isLegacy: boolean = true) => {
  const provider = await getProvider();
  const accounts = await provider.send('eth_accounts', []);
  if (accounts.length === 0) return undefined;

  const signer = await getSigner();
  const ownerAddress = await signer.getAddress();
  const L1BuildDepositContract = await getL1BuildDepositContract(isLegacy);
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

export const useL1BuildDeposit = (isLegacy: boolean = true) => {
  const { data, error } = useSWR(SWR_KEY, async () => {
    return await getL1BuildDeposit(isLegacy);
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
