export interface L1BuildDeposit {
  amount: string;
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