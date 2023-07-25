import { BigNumber, ethers } from "ethers";

export type EpochToSlashes = { [epoch: string]: BigNumber };

export type ValidatorInfoType = {
  joined: boolean;
  status: string;
  jailed: boolean;
  operatorAddress: string;
  commissions: ethers.BigNumber;
  currentEpochStakes: ethers.BigNumber;
  nextEpochStakes: ethers.BigNumber;
  epochToSlashes: EpochToSlashes;
};