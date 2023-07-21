import { ethers, BigNumber } from "ethers";
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import StakeManager from '@/contracts/oasysHub/StakeManager.json';
import { getMulticallContract, getEnvironmentContract, getStakeManagerContract } from '@/features';
import { stakeManagerAddress } from "@/config";
import { EpochToSlashes, ValidatorInfoType } from '@/types/oasysHub/validatorInfo';

export const getSlashesForLast30Epochs = async (owner: string, epoch: BigNumber) => {
  const multicallContract = await getMulticallContract();

  let contractCallContext: ContractCallContext[] = [];

  const firstEpoch = epoch.sub(BigNumber.from(30)).toNumber();
  for (var i = firstEpoch; i <= epoch.toNumber(); i++) {
    contractCallContext.push(
      {
        reference: `${i}`,
        contractAddress: stakeManagerAddress,
        abi: StakeManager.abi,
        calls: [{ reference: 'getBlockAndSlashes', methodName: 'getBlockAndSlashes', methodParameters: [owner, i] }]
      }
    );
  }
  const results: ContractCallResults = await multicallContract.call(contractCallContext);

  let epochToSlashes: EpochToSlashes = {};

  Object.keys(results.results).forEach((key) => {
    const result = results.results[key];
    const blockAndSlashes = result.callsReturnContext[0].returnValues;
    const slashes: BigNumber = BigNumber.from(blockAndSlashes[1].hex);

    epochToSlashes[key] = slashes;
  });

  return epochToSlashes;
}

export const getValidatorInfo = async (ownerAddress: string): Promise<ValidatorInfoType> => {
  const environmentContract = await getEnvironmentContract();
  const stakeManagerContract = await getStakeManagerContract();
  const currentEpoch = await environmentContract.epoch();
  const nextEpoch = currentEpoch.add(BigNumber.from(1));
  const validatorCommissions = await stakeManagerContract.getCommissions(ownerAddress, BigNumber.from(0));
  const currentValidatorInfo = await stakeManagerContract.getValidatorInfo(ownerAddress, currentEpoch);
  const nextValidatorInfo = await stakeManagerContract.getValidatorInfo(ownerAddress, nextEpoch);
  const epochToSlashes = await getSlashesForLast30Epochs(ownerAddress, currentEpoch);

  const joined = currentValidatorInfo.operator !== ethers.constants.AddressZero;
  const status = currentValidatorInfo.active ? 'Active' : 'Inactive';
  const jailed = currentValidatorInfo.jailed;
  const operatorAddress = currentValidatorInfo.operator;
  const currentEpochStakes = currentValidatorInfo.stakes;
  const nextEpochStakes = nextValidatorInfo.stakes;

  const data = {
    joined,
    status,
    jailed,
    operatorAddress,
    commissions: validatorCommissions,
    currentEpochStakes,
    nextEpochStakes,
    epochToSlashes,
  }

  return data;
}