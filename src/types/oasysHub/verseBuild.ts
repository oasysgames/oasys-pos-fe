import { ethers } from "ethers";

export interface L1BuildDeposit {
  depositTotal: ethers.BigNumber;
  depositOAS: ethers.BigNumber;
  depositSOAS: ethers.BigNumber;
}

export type NamedAddresses = {
  Lib_AddressManager: string;
  BondManager: string;
  CanonicalTransactionChain: string;
  "ChainStorageContainer-CTC-batches": string;
  "ChainStorageContainer-SCC-batches": string;
  L2CrossDomainMessenger: string;
  OVM_L1CrossDomainMessenger: string;
  OVM_Proposer: string;
  OVM_Sequencer: string;
  Proxy__OVM_L1CrossDomainMessenger: string;
  Proxy__OVM_L1ERC721Bridge: string;
  Proxy__OVM_L1StandardBridge: string;
  StateCommitmentChain: string;
}

export type NamedAddressesV2 = {
  FinalSystemOwner: string;
  L2OutputOracleProposer: string;
  L2OutputOracleChallenger: string;
  BatchSender: string;
  ProxyAdmin: string;
  SystemConfigProxy: string;
  L1StandardBridgeProxy: string;
  L1ERC721BridgeProxy: string;
  L1CrossDomainMessengerProxy: string;
  L2OutputOracleProxy: string;
  OptimismPortalProxy: string;
  ProtocolVersions: string;
  BatchInbox: string;
  AddressManager: string;
  P2PSequencer: string;
}
