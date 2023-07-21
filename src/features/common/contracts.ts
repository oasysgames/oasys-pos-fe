import {
  stakeManagerAddress,
  allowListAddress,
  sOASAddress,
  lOASAddress,
  L1BuildDepositAddress,
  L1BuildAgentAddress,
} from '@/config';
import StakeManager from '@/contracts/oasysHub/StakeManager.json';
import AllowList from '@/contracts/oasysHub/AllowList.json';
import SOAS from '@/contracts/oasysHub/SOAS.json';
import LOAS from '@/contracts/oasysHub/LOAS.json';
import L1BuildDeposit from '@/contracts/oasysHub/L1BuildDeposit.json';
import L1BuildAgent from '@/contracts/oasysHub/L1BuildAgent.json';
import L1ChugSplashProxy from '@/contracts/oasysHub/L1ChugSplashProxy.json';
import { getSigner } from './wallet';
import { ethers } from 'ethers';
import {
  StakeManager as StakeManagerContractType,
  AllowList as AllowListContractType,
  SOAS as SOASContractType,
  LOAS as LOASContractType,
  L1BuildDeposit as L1BuildDepositContractType,
  L1BuildAgent as L1BuildAgentContractType,
} from '@/types/contracts';

export const getStakeManagerContract = async () => {
  const signer = await getSigner();
  const stakeManagerContract = new ethers.Contract(stakeManagerAddress, StakeManager.abi, signer);
  return stakeManagerContract as StakeManagerContractType;
};
export const getAllowListContract = async () => {
  const signer = await getSigner();
  const allowListContract = new ethers.Contract(allowListAddress, AllowList.abi, signer);
  return allowListContract as AllowListContractType;
};
export const getSOASContract = async () => {
  const signer = await getSigner();
  const sOASContract = new ethers.Contract(sOASAddress, SOAS.abi, signer);
  return sOASContract as SOASContractType;
};
export const getLOASContract = async () => {
  const signer = await getSigner();
  const lOASContract = new ethers.Contract(lOASAddress, LOAS.abi, signer);
  return lOASContract as LOASContractType;
};
export const getL1BuildDepositContract = async () => {
  const signer = await getSigner();
  const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);
  return L1BuildDepositContract as L1BuildDepositContractType;
};
export const getL1BuildAgentContract = async () => {
  const signer = await getSigner();
  const L1BuildAgentContract = new ethers.Contract(L1BuildAgentAddress, L1BuildAgent.abi, signer);
  return L1BuildAgentContract as L1BuildAgentContractType;
};

export const getL1StandardBridgeProxyContract = async (address: string) => {
  const signer = await getSigner();
  const L1StandardBridgeProxyContract = new ethers.Contract(address, L1ChugSplashProxy.abi, signer);
  return L1StandardBridgeProxyContract;
};

export const getL1ERC721BridgeProxyContract = async (address: string) => {
  const signer = await getSigner();
  const L1ERC721BridgeProxyContract = new ethers.Contract(address, L1ChugSplashProxy.abi, signer);
  return L1ERC721BridgeProxyContract;
};