import { NamedAddresses, NamedAddressesV2 } from "../oasysHub/verseBuild";
import { Genesis } from "./genesis";

export type VerseInfo = {
  chainId: number;
  namedAddresses: NamedAddresses;
  geneses: Genesis[];
}

export type VerseInfoV2 = {
  chainId: number;
  messageRelayer: string;
  namedAddresses: NamedAddressesV2;
  deployConfig: DeployConfig;
}

export type DeployConfig = {
  baseFeeVaultMinimumWithdrawalAmount: string;
  baseFeeVaultRecipient: string;
  baseFeeVaultWithdrawalNetwork: number;
  batchInboxAddress: string;
  batchSenderAddress: string;
  channelTimeout: number;
  eip1559Denominator: number;
  eip1559DenominatorCanyon: number;
  eip1559Elasticity: number;
  enableGovernance: boolean;
  finalSystemOwner: string;
  finalizationPeriodSeconds: number;
  gasPriceOracleOverhead: number;
  gasPriceOracleScalar: number;
  governanceTokenName?: string;
  governanceTokenOwner?: string;
  governanceTokenSymbol?: string;
  l1BlockTime: number;
  l1ChainID: number;
  l1CrossDomainMessengerProxy: string;
  l1ERC721BridgeProxy: string;
  l1FeeVaultMinimumWithdrawalAmount: string;
  l1FeeVaultRecipient: string;
  l1FeeVaultWithdrawalNetwork: number;
  l1StandardBridgeProxy: string;
  l1StartingBlockTag: string;
  l2BlockTime: number;
  l2ChainID: number;
  l2GenesisBlockBaseFeePerGas: string;
  l2GenesisBlockGasLimit: string;
  l2GenesisRegolithTimeOffset: string;
  l2OutputOracleChallenger: string;
  l2OutputOracleProposer: string;
  l2OutputOracleStartingBlockNumber: number;
  l2OutputOracleStartingTimestamp: number;
  l2OutputOracleSubmissionInterval: number;
  l2ZeroFeeTime: number;
  maxSequencerDrift: number;
  optimismPortalProxy: string;
  p2pSequencerAddress: string;
  portalGuardian: string;
  proxyAdminOwner: string;
  recommendedProtocolVersion: string;
  requiredProtocolVersion: string;
  sequencerFeeVaultMinimumWithdrawalAmount: string;
  sequencerFeeVaultRecipient: string;
  sequencerFeeVaultWithdrawalNetwork: number;
  sequencerWindowSize: number;
  systemConfigProxy: string;
  systemConfigStartBlock: number;
}