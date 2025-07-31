import { BigNumber } from "ethers";
import {
  genesisVersions,
  BaseFeeVaultMinimumWithdrawalAmount,
  BaseFeeVaultWithdrawalNetwork,
  ChannelTimeout,
  Eip1559Denominator,
  Eip1559DenominatorCanyon,
  Eip1559Elasticity,
  EnableGovernance,
  L1BlockTime,
  L1BlockTimeLegacy,
  L1FeeVaultMinimumWithdrawalAmount,
  L1FeeVaultWithdrawalNetwork,
  L2GenesisBlockBaseFeePerGas,
  L2GenesisRegolithTimeOffset,
  MaxSequencerDrift,
  RecommendedProtocolVersion,
  RequiredProtocolVersion,
  SequencerFeeVaultMinimumWithdrawalAmount,
  SequencerFeeVaultWithdrawalNetwork,
  SequencerWindowSize,
} from "@/consts/";

import {
  getNamedAddresses,
  getNamedAddressesV2,
  getSigner,
  getL1BuildDepositContract,
  getSystemConfigContract,
  getOasysL2OutputOracleContract,
  getOasysPortalContract,
  getBlockByTime,
  getProvider,
} from "@/features";
import { Genesis, GenesisParams } from "@/types/optimism/genesis";
import {
  GenesisGasParams,
  GenesisBlockParams,
  GenesisCliqueParams,
  ZERO_ADDRESS,
  Mainnet_OvmBlockSignerAddress,
  Testnet_OvmBlockSignerAddress,
} from "@/consts";
import { makeGenesisJson } from "@/features/optimism";
import { VerseInfo, VerseInfoV2, DeployConfig } from "@/types/optimism/verse";
import { oasys } from "@/config/chains/definitions/oasys";

// Use OVM_OAS if created after this block.
const OVM_OAS_BLOCK = BigNumber.from(630195);
const L1_BLOCK_TIME_CHANGED_BLOCK = BigNumber.from(1725870584);

export const getVerseInfo = async (
  builder: string,
  verseChainId: number
): Promise<VerseInfo> => {
  const signer = await getSigner();
  const chainId = await signer.getChainId();

  // Get the block number the verse was built.
  const isLegacy = true;
  const l1BuildDeposit = await getL1BuildDepositContract(isLegacy);
  const block = (await l1BuildDeposit.getBuildBlock(builder)) as BigNumber;

  const namedAddresses = await getNamedAddresses(verseChainId);
  const genesisParams: GenesisParams = {
    chainId: verseChainId,
    ovmWhitelistOwner: ZERO_ADDRESS,
    ovmGasPriceOracleOwner: builder,
    ovmFeeWalletAddress: builder,
    ovmBlockSignerAddress:
      chainId === oasys.id
        ? Mainnet_OvmBlockSignerAddress
        : Testnet_OvmBlockSignerAddress,
    useOvmOas: block.gte(OVM_OAS_BLOCK),
    ...GenesisGasParams,
    ...GenesisBlockParams,
    ...GenesisCliqueParams,
  };
  const geneses: Genesis[] = [];

  for (const key in genesisVersions) {
    if (genesisVersions.hasOwnProperty(key)) {
      const version = genesisVersions[key];
      const genesis = await makeGenesisJson(genesisParams, namedAddresses, version.bridgeContractVersion);
      geneses.push(genesis);
    }
  }

  return {
    chainId: verseChainId,
    namedAddresses,
    geneses,
  };
};

export const getVerseInfoV2 = async (
  verseChainId: number,
): Promise<VerseInfoV2> => {
  const signer = await getSigner();
  const provider = await getProvider();
  const l1ChainID = await signer.getChainId();
  const latestL1Block = await provider.getBlock('latest');

  const namedAddresses = await getNamedAddressesV2(verseChainId);
  const l2OOContract = await getOasysL2OutputOracleContract(namedAddresses.L2OutputOracleProxy);
  const portalContract = await getOasysPortalContract(namedAddresses.OptimismPortalProxy);
  const systemConfigContract = await getSystemConfigContract(namedAddresses.SystemConfigProxy);
  const messageRelayer = await (await getOasysPortalContract(namedAddresses.OptimismPortalProxy)).messageRelayer();

  namedAddresses.P2PSequencer = await systemConfigContract.unsafeBlockSigner();

  let l2GasLimit = (await systemConfigContract.gasLimit()).toHexString()
  // Remove leading '0' to avoid golang unmarshal error bellow
  // Go ERR: cannot unmarshal deploy config: json: cannot unmarshal hex number with leading zero digits into Go struct field DeployConfig.l2GenesisBlockGasLimit of type hexutil.Uint64
  l2GasLimit = l2GasLimit.replace(/^(0x)0+/, '$1');

  // Search for the L1 starting block from the L2OO starting timestamp.
  const l2StartTime: BigNumber = await l2OOContract.startingTimestamp();
  if (l2StartTime.isZero()) {
    throw new Error("`startingTimestamp` is not set for the L2OutputOracle");
  }
  const l1StartBlock = await getBlockByTime(provider, Number(l2StartTime), l2StartTime.gte(L1_BLOCK_TIME_CHANGED_BLOCK) ? L1BlockTime : L1BlockTimeLegacy);
  if (!l1StartBlock) {
    throw new Error(`Could not find L1 block matching L2 starting timestamp: ${l2StartTime}`);
  }

  return {
    chainId: verseChainId,
    messageRelayer: messageRelayer,
    namedAddresses: namedAddresses,
    deployConfig: {
      baseFeeVaultMinimumWithdrawalAmount: BaseFeeVaultMinimumWithdrawalAmount,
      baseFeeVaultRecipient: namedAddresses.FinalSystemOwner,
      baseFeeVaultWithdrawalNetwork: BaseFeeVaultWithdrawalNetwork,
      batchInboxAddress: namedAddresses.BatchInbox,
      batchSenderAddress: namedAddresses.BatchSender,
      channelTimeout: ChannelTimeout,
      eip1559Denominator: Eip1559Denominator,
      eip1559DenominatorCanyon: Eip1559DenominatorCanyon,
      eip1559Elasticity: Eip1559Elasticity,
      enableGovernance: EnableGovernance,
      finalSystemOwner: namedAddresses.FinalSystemOwner,
      finalizationPeriodSeconds: Number(await l2OOContract.FINALIZATION_PERIOD_SECONDS()),
      gasPriceOracleOverhead: Number(await systemConfigContract.overhead()),
      gasPriceOracleScalar: Number(await systemConfigContract.scalar()),
      governanceTokenName: "",
      governanceTokenOwner: namedAddresses.FinalSystemOwner,
      governanceTokenSymbol: "",
      l1BlockTime: L1BlockTime,
      l1ChainID,
      l1CrossDomainMessengerProxy: namedAddresses.L1CrossDomainMessengerProxy,
      l1ERC721BridgeProxy: namedAddresses.L1ERC721BridgeProxy,
      l1FeeVaultMinimumWithdrawalAmount: L1FeeVaultMinimumWithdrawalAmount,
      l1FeeVaultRecipient: namedAddresses.FinalSystemOwner,
      l1FeeVaultWithdrawalNetwork: L1FeeVaultWithdrawalNetwork,
      l1StandardBridgeProxy: namedAddresses.L1StandardBridgeProxy,
      l1StartingBlockTag: l1StartBlock.hash,
      l2BlockTime: Number(await l2OOContract.L2_BLOCK_TIME()),
      l2ChainID: verseChainId,
      l2GenesisBlockBaseFeePerGas: L2GenesisBlockBaseFeePerGas,
      l2GenesisBlockGasLimit: l2GasLimit,
      l2GenesisRegolithTimeOffset: L2GenesisRegolithTimeOffset,
      l2OutputOracleChallenger: namedAddresses.L2OutputOracleChallenger,
      l2OutputOracleProposer: namedAddresses.L2OutputOracleProposer,
      l2OutputOracleStartingBlockNumber: Number(await l2OOContract.startingBlockNumber()),
      l2OutputOracleStartingTimestamp: Number(l2StartTime),
      l2OutputOracleSubmissionInterval: Number(await l2OOContract.SUBMISSION_INTERVAL()),
      l2ZeroFeeTime: Number(l2StartTime),
      maxSequencerDrift: MaxSequencerDrift,
      optimismPortalProxy: namedAddresses.OptimismPortalProxy,
      p2pSequencerAddress: namedAddresses.P2PSequencer,
      portalGuardian: await portalContract.GUARDIAN(),
      proxyAdminOwner: namedAddresses.FinalSystemOwner,
      recommendedProtocolVersion: RecommendedProtocolVersion,
      requiredProtocolVersion: RequiredProtocolVersion,
      sequencerFeeVaultMinimumWithdrawalAmount: SequencerFeeVaultMinimumWithdrawalAmount,
      sequencerFeeVaultRecipient: namedAddresses.FinalSystemOwner,
      sequencerFeeVaultWithdrawalNetwork: SequencerFeeVaultWithdrawalNetwork,
      sequencerWindowSize: SequencerWindowSize,
      systemConfigProxy: namedAddresses.SystemConfigProxy,
      systemConfigStartBlock: Number(latestL1Block.number),
    } as DeployConfig,
  };
};
