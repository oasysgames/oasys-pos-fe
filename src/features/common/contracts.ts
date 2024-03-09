import { ethers } from 'ethers';
import {
  Multicall,
} from 'ethereum-multicall';
import {
  environmentAddress,
  stakeManagerAddress,
  allowListAddress,
  sOASAddress,
  lOASAddress,
  L1BuildDepositAddress,
  LegacyL1BuildDepositAddress,
  L1BuildAgentAddress,
  LegacyL1BuildAgentAddress,
  multicallContractAddress,
} from '@/consts';
import Environment from '@/contracts/oasysHub/Environment.json';
import StakeManager from '@/contracts/oasysHub/StakeManager.json';
import AllowList from '@/contracts/oasysHub/AllowList.json';
import SOAS from '@/contracts/oasysHub/SOAS.json';
import LOAS from '@/contracts/oasysHub/LOAS.json';
import L1BuildDeposit from '@/contracts/oasysHub/L1BuildDeposit.json';
import L1BuildAgent from '@/contracts/oasysHub/L1BuildAgent.json';
import L1ChugSplashProxy from '@/contracts/oasysHub/L1ChugSplashProxy.json';
import ProxyAdmin from '@/contracts/oasysHub/ProxyAdmin.json';
import OasysL2OutputOracle from '@/contracts/oasysHub/OasysL2OutputOracle.json';
import OasysPortal from '@/contracts/oasysHub/OasysPortal.json';
import SystemConfig from '@/contracts/oasysHub/SystemConfig.json';
import { getSigner, getProvider } from './wallet';
import {
  Environment as EnvironmentContractType,
  StakeManager as StakeManagerContractType,
  AllowList as AllowListContractType,
  SOAS as SOASContractType,
  LOAS as LOASContractType,
  L1BuildDeposit as L1BuildDepositContractType,
  L1BuildAgent as L1BuildAgentContractType,
} from '@/types/contracts';

export const getEnvironmentContract = async () => {
  const signer = await getSigner();
  const environmentContract = new ethers.Contract(environmentAddress, Environment.abi, signer);
  return environmentContract as EnvironmentContractType;
}
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
export const getL1BuildDepositContract = async (isLegacy: boolean = true) => {
  const signer = await getSigner();
  const address = isLegacy ? LegacyL1BuildDepositAddress : L1BuildDepositAddress;
  const L1BuildDepositContract = new ethers.Contract(address, L1BuildDeposit.abi, signer);
  return L1BuildDepositContract as L1BuildDepositContractType;
};
export const getL1BuildAgentContract = async (isLegacy: boolean = true) => {
  const signer = await getSigner();
  const address = isLegacy ? LegacyL1BuildAgentAddress : L1BuildAgentAddress;
  const L1BuildAgentContract = new ethers.Contract(address, L1BuildAgent.abi, signer);
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

export const getMulticallContract = async () => {
  const provider = await getProvider();
  const multicall = new Multicall({
    multicallCustomContractAddress: multicallContractAddress,
    ethersProvider: provider
  });
  return multicall;
}

export const getProxyAdminContract = async (address: string) => {
  const signer = await getSigner();
  return new ethers.Contract(address, ProxyAdmin.abi, signer);
}

export const getOasysL2OutputOracleContract = async (address: string) => {
  const signer = await getSigner();
  return new ethers.Contract(address, OasysL2OutputOracle.abi, signer);
}

export const getOasysPortalContract = async (address: string) => {
  const signer = await getSigner();
  return new ethers.Contract(address, OasysPortal.abi, signer);
}

export const getSystemConfigContract = async (address: string) => {
  const signer = await getSigner();
  return new ethers.Contract(address, SystemConfig.abi, signer);
}
