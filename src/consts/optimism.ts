import { GenesisVersion } from "@/types/optimism/genesis";

export const L2ContractAddresses: { [name: string]: string } = {
  OVM_L2ToL1MessagePasser: "0x4200000000000000000000000000000000000000",
  OVM_DeployerWhitelist: "0x4200000000000000000000000000000000000002",
  L2CrossDomainMessenger: "0x4200000000000000000000000000000000000007",
  OVM_GasPriceOracle: "0x420000000000000000000000000000000000000F",
  L2StandardBridge: "0x4200000000000000000000000000000000000010",
  L2ERC721Bridge: "0x6200000000000000000000000000000000000001",
  OVM_SequencerFeeVault: "0x4200000000000000000000000000000000000011",
  L2StandardTokenFactory: "0x4200000000000000000000000000000000000012",
  OVM_L1BlockNumber: "0x4200000000000000000000000000000000000013",
  OVM_ETH: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
  WETH9: "0x4200000000000000000000000000000000000006",
} as const;

export const genesisVersions: GenesisVersion = {
  '1': {
    bridgeContractVersion: 1,
  },
  '2': {
    bridgeContractVersion: 2,
  },
};

export const GenesisGasParams = {
  gasPriceOracleL2GasPrice: 0,
  gasPriceOracleL1BaseFee: 1,
  gasPriceOracleOverhead: 2750,
  gasPriceOracleScalar: 1500000,
  gasPriceOracleDecimals: 6,
  l2BlockGasLimit: 15000000,
};

export const GenesisBlockParams = {
  homesteadBlock: 0,
  eip150Block: 0,
  eip155Block: 0,
  eip158Block: 0,
  byzantiumBlock: 0,
  constantinopleBlock: 0,
  petersburgBlock: 0,
  istanbulBlock: 0,
  muirGlacierBlock: 0,
  berlinBlock: 0,
};

export const GenesisCliqueParams = {
  period: 0,
  epoch: 30000,
};

export const L2ContractStorageLayouts: { [name: string]: any } = {
  OVM_DeployerWhitelist: {
    storage: [
      {
        astId: 9496,
        contract:
          "contracts/L2/predeploys/OVM_DeployerWhitelist.sol:OVM_DeployerWhitelist",
        label: "owner",
        offset: 0,
        slot: "0",
        type: "t_address",
      },
      {
        astId: 9500,
        contract:
          "contracts/L2/predeploys/OVM_DeployerWhitelist.sol:OVM_DeployerWhitelist",
        label: "whitelist",
        offset: 0,
        slot: "1",
        type: "t_mapping(t_address,t_bool)",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
      t_bool: { encoding: "inplace", label: "bool", numberOfBytes: "1" },
      "t_mapping(t_address,t_bool)": {
        encoding: "mapping",
        key: "t_address",
        label: "mapping(address => bool)",
        numberOfBytes: "32",
        value: "t_bool",
      },
    },
  },
  L2CrossDomainMessenger: {
    storage: [
      {
        astId: 8948,
        contract:
          "contracts/L2/messaging/L2CrossDomainMessenger.sol:L2CrossDomainMessenger",
        label: "relayedMessages",
        offset: 0,
        slot: "0",
        type: "t_mapping(t_bytes32,t_bool)",
      },
      {
        astId: 8952,
        contract:
          "contracts/L2/messaging/L2CrossDomainMessenger.sol:L2CrossDomainMessenger",
        label: "successfulMessages",
        offset: 0,
        slot: "1",
        type: "t_mapping(t_bytes32,t_bool)",
      },
      {
        astId: 8956,
        contract:
          "contracts/L2/messaging/L2CrossDomainMessenger.sol:L2CrossDomainMessenger",
        label: "sentMessages",
        offset: 0,
        slot: "2",
        type: "t_mapping(t_bytes32,t_bool)",
      },
      {
        astId: 8958,
        contract:
          "contracts/L2/messaging/L2CrossDomainMessenger.sol:L2CrossDomainMessenger",
        label: "messageNonce",
        offset: 0,
        slot: "3",
        type: "t_uint256",
      },
      {
        astId: 8962,
        contract:
          "contracts/L2/messaging/L2CrossDomainMessenger.sol:L2CrossDomainMessenger",
        label: "xDomainMsgSender",
        offset: 0,
        slot: "4",
        type: "t_address",
      },
      {
        astId: 8964,
        contract:
          "contracts/L2/messaging/L2CrossDomainMessenger.sol:L2CrossDomainMessenger",
        label: "l1CrossDomainMessenger",
        offset: 0,
        slot: "5",
        type: "t_address",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
      t_bool: { encoding: "inplace", label: "bool", numberOfBytes: "1" },
      t_bytes32: { encoding: "inplace", label: "bytes32", numberOfBytes: "32" },
      "t_mapping(t_bytes32,t_bool)": {
        encoding: "mapping",
        key: "t_bytes32",
        label: "mapping(bytes32 => bool)",
        numberOfBytes: "32",
        value: "t_bool",
      },
      t_uint256: { encoding: "inplace", label: "uint256", numberOfBytes: "32" },
    },
  },
  OVM_GasPriceOracle: {
    storage: [
      {
        astId: 977,
        contract:
          "contracts/L2/predeploys/OVM_GasPriceOracle.sol:OVM_GasPriceOracle",
        label: "_owner",
        offset: 0,
        slot: "0",
        type: "t_address",
      },
      {
        astId: 9713,
        contract:
          "contracts/L2/predeploys/OVM_GasPriceOracle.sol:OVM_GasPriceOracle",
        label: "gasPrice",
        offset: 0,
        slot: "1",
        type: "t_uint256",
      },
      {
        astId: 9715,
        contract:
          "contracts/L2/predeploys/OVM_GasPriceOracle.sol:OVM_GasPriceOracle",
        label: "l1BaseFee",
        offset: 0,
        slot: "2",
        type: "t_uint256",
      },
      {
        astId: 9717,
        contract:
          "contracts/L2/predeploys/OVM_GasPriceOracle.sol:OVM_GasPriceOracle",
        label: "overhead",
        offset: 0,
        slot: "3",
        type: "t_uint256",
      },
      {
        astId: 9719,
        contract:
          "contracts/L2/predeploys/OVM_GasPriceOracle.sol:OVM_GasPriceOracle",
        label: "scalar",
        offset: 0,
        slot: "4",
        type: "t_uint256",
      },
      {
        astId: 9721,
        contract:
          "contracts/L2/predeploys/OVM_GasPriceOracle.sol:OVM_GasPriceOracle",
        label: "decimals",
        offset: 0,
        slot: "5",
        type: "t_uint256",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
      t_uint256: { encoding: "inplace", label: "uint256", numberOfBytes: "32" },
    },
  },
  L2StandardBridge: {
    storage: [
      {
        astId: 10569,
        contract:
          "contracts/L2/messaging/L2StandardBridge.sol:L2StandardBridge",
        label: "messenger",
        offset: 0,
        slot: "0",
        type: "t_address",
      },
      {
        astId: 9182,
        contract:
          "contracts/L2/messaging/L2StandardBridge.sol:L2StandardBridge",
        label: "l1TokenBridge",
        offset: 0,
        slot: "1",
        type: "t_address",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
    },
  },
  OVM_SequencerFeeVault: {
    storage: [
      {
        astId: 9980,
        contract:
          "contracts/L2/predeploys/OVM_SequencerFeeVault.sol:OVM_SequencerFeeVault",
        label: "l1FeeWallet",
        offset: 0,
        slot: "0",
        type: "t_address",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
    },
  },
  OVM_ETH: {
    storage: [
      {
        astId: 1181,
        contract: "contracts/L2/predeploys/OVM_ETH.sol:OVM_ETH",
        label: "_balances",
        offset: 0,
        slot: "0",
        type: "t_mapping(t_address,t_uint256)",
      },
      {
        astId: 1187,
        contract: "contracts/L2/predeploys/OVM_ETH.sol:OVM_ETH",
        label: "_allowances",
        offset: 0,
        slot: "1",
        type: "t_mapping(t_address,t_mapping(t_address,t_uint256))",
      },
      {
        astId: 1189,
        contract: "contracts/L2/predeploys/OVM_ETH.sol:OVM_ETH",
        label: "_totalSupply",
        offset: 0,
        slot: "2",
        type: "t_uint256",
      },
      {
        astId: 1191,
        contract: "contracts/L2/predeploys/OVM_ETH.sol:OVM_ETH",
        label: "_name",
        offset: 0,
        slot: "3",
        type: "t_string_storage",
      },
      {
        astId: 1193,
        contract: "contracts/L2/predeploys/OVM_ETH.sol:OVM_ETH",
        label: "_symbol",
        offset: 0,
        slot: "4",
        type: "t_string_storage",
      },
      {
        astId: 20418,
        contract: "contracts/L2/predeploys/OVM_ETH.sol:OVM_ETH",
        label: "l1Token",
        offset: 0,
        slot: "5",
        type: "t_address",
      },
      {
        astId: 20420,
        contract: "contracts/L2/predeploys/OVM_ETH.sol:OVM_ETH",
        label: "l2Bridge",
        offset: 0,
        slot: "6",
        type: "t_address",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
      "t_mapping(t_address,t_mapping(t_address,t_uint256))": {
        encoding: "mapping",
        key: "t_address",
        label: "mapping(address => mapping(address => uint256))",
        numberOfBytes: "32",
        value: "t_mapping(t_address,t_uint256)",
      },
      "t_mapping(t_address,t_uint256)": {
        encoding: "mapping",
        key: "t_address",
        label: "mapping(address => uint256)",
        numberOfBytes: "32",
        value: "t_uint256",
      },
      t_string_storage: {
        encoding: "bytes",
        label: "string",
        numberOfBytes: "32",
      },
      t_uint256: { encoding: "inplace", label: "uint256", numberOfBytes: "32" },
    },
  },
  WETH9: {
    storage: [
      {
        astId: 4,
        contract: "contracts/L2/predeploys/WETH9.sol:WETH9",
        label: "name",
        offset: 0,
        slot: "0",
        type: "t_string_storage",
      },
      {
        astId: 7,
        contract: "contracts/L2/predeploys/WETH9.sol:WETH9",
        label: "symbol",
        offset: 0,
        slot: "1",
        type: "t_string_storage",
      },
      {
        astId: 10,
        contract: "contracts/L2/predeploys/WETH9.sol:WETH9",
        label: "decimals",
        offset: 0,
        slot: "2",
        type: "t_uint8",
      },
      {
        astId: 42,
        contract: "contracts/L2/predeploys/WETH9.sol:WETH9",
        label: "balanceOf",
        offset: 0,
        slot: "3",
        type: "t_mapping(t_address,t_uint256)",
      },
      {
        astId: 48,
        contract: "contracts/L2/predeploys/WETH9.sol:WETH9",
        label: "allowance",
        offset: 0,
        slot: "4",
        type: "t_mapping(t_address,t_mapping(t_address,t_uint256))",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
      "t_mapping(t_address,t_mapping(t_address,t_uint256))": {
        encoding: "mapping",
        key: "t_address",
        label: "mapping(address => mapping(address => uint256))",
        numberOfBytes: "32",
        value: "t_mapping(t_address,t_uint256)",
      },
      "t_mapping(t_address,t_uint256)": {
        encoding: "mapping",
        key: "t_address",
        label: "mapping(address => uint256)",
        numberOfBytes: "32",
        value: "t_uint256",
      },
      t_string_storage: {
        encoding: "bytes",
        label: "string",
        numberOfBytes: "32",
      },
      t_uint256: { encoding: "inplace", label: "uint256", numberOfBytes: "32" },
      t_uint8: { encoding: "inplace", label: "uint8", numberOfBytes: "1" },
    },
  },
  L2ERC721Bridge: {
    storage: [
      {
        astId: 10569,
        contract:
          "contracts/oasys/L2/messaging/L2ERC721Bridge.sol:L2ERC721Bridge",
        label: "messenger",
        offset: 0,
        slot: "0",
        type: "t_address",
      },
      {
        astId: 19605,
        contract:
          "contracts/oasys/L2/messaging/L2ERC721Bridge.sol:L2ERC721Bridge",
        label: "l1ERC721Bridge",
        offset: 0,
        slot: "1",
        type: "t_address",
      },
    ],
    types: {
      t_address: { encoding: "inplace", label: "address", numberOfBytes: "20" },
    },
  },
} as const;

// ---------- Verse 2.0 ----------

export const L2_GASLIMIT = 30000000;
// The defualt of opstack is 120
// The submission interval significantly impacts both the waiting time for L2->L1 withdrawals and the speed at which the L2 state proposer operates. If the interval is short, the waiting time for L2 withdrawals decreases. Conversely, if the interval is too short, the state proposer may fail to keep pace with the growth speed of the L2 block height.
// ----
// Why have we set the default value to 80?
// Assumptions:
// - The L2 block time is 1a.
// - The operational proposer (op-proposer) confirms 4 blocks.
// - The op-proposer cannot send multiple rollups to a single block.
// The op-proposer submits the L2 state every 5 L1 block intervals. During this period, the L2 block grows by 75 blocks. Therefore, 80 was selected as the default value.
export const L2_OO_SUBMISSION_INTERVAL = 70;
// 7 days
export const FINALIZATION_PERIOD_SECONDS = 604800;
