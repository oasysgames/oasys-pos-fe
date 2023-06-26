/**
 * @oasysgames/oasys-optimism
 * https://github.com/oasysgames/oasys-optimism/blob/c724bfe6e326c7bcc321e20deb9c2129ec0d4112/packages/contracts/tasks/take-dump.ts
 */

import clone from "lodash/clone";

import {
  L2ContractAddresses,
  L2ContractStorageLayouts,
  ZERO_ADDRESS,
} from "@/consts";
import { remove0x } from "@/features/smock/hexUtils";
import { computeStorageSlots } from "@/features/smock/storage";
import { Genesis, GenesisParams } from "@/types/optimism/genesis";
import { NamedAddresses } from "@/types/oasysHub/verseBuild";

// https://github.com/oasysgames/oasys-optimism/tree/c724bfe6e326c7bcc321e20deb9c2129ec0d4112/packages/contracts
const INITIAL_COMMIT = "c724bfe6e326c7bcc321e20deb9c2129ec0d4112";

// https://github.com/oasysgames/oasys-optimism/tree/49914499ead3d1f5686c2eeaa91aa9f61f7cb6f6/packages/contracts
const OVM_OAS_COMMIT = "49914499ead3d1f5686c2eeaa91aa9f61f7cb6f6";

// https://github.com/oasysgames/oasys-optimism/tree/5186190c3250121179064b70d8e2fbd2d0a03ce3/packages/contracts
const BRIDGE_CONTRACT_V2_COMMIT = "5186190c3250121179064b70d8e2fbd2d0a03ce3";

const getContractCommit = (version: number): { [name: string]: string } => {

  const CONTRACT_COMMITS: { [name: string]: string } = {
    OVM_L2ToL1MessagePasser: INITIAL_COMMIT,
    OVM_DeployerWhitelist: INITIAL_COMMIT,
    L2CrossDomainMessenger: INITIAL_COMMIT,
    OVM_GasPriceOracle: INITIAL_COMMIT,
    L2StandardBridge: (version === 1) ? INITIAL_COMMIT : BRIDGE_CONTRACT_V2_COMMIT,
    L2ERC721Bridge: (version === 1) ? INITIAL_COMMIT : BRIDGE_CONTRACT_V2_COMMIT,
    OVM_SequencerFeeVault: INITIAL_COMMIT,
    L2StandardTokenFactory: INITIAL_COMMIT,
    OVM_L1BlockNumber: INITIAL_COMMIT,
    OVM_ETH: INITIAL_COMMIT,
    WETH9: INITIAL_COMMIT,
    OVM_OAS: OVM_OAS_COMMIT,
  } as const;

  return CONTRACT_COMMITS;
}

const getContractArtifact = async (
  commit: string,
  name: string
): Promise<{ deployedBytecode: string }> => {
  const content = import(
    `@/contracts/optimism/${commit.slice(0, 10)}/${name}.json`
  );
  return await content;
};

export const makeGenesisJson = async (
  params: GenesisParams,
  contracts: NamedAddresses,
  version: number,
): Promise<Genesis> => {
  let commit = INITIAL_COMMIT;
  const addresses = clone(L2ContractAddresses);
  const storageLayouts = clone(L2ContractStorageLayouts);

  const variables: { [name: string]: any } = {
    OVM_DeployerWhitelist: {
      owner: params.ovmWhitelistOwner,
    },
    OVM_GasPriceOracle: {
      _owner: params.ovmGasPriceOracleOwner,
      gasPrice: params.gasPriceOracleL2GasPrice,
      l1BaseFee: params.gasPriceOracleL1BaseFee,
      overhead: params.gasPriceOracleOverhead,
      scalar: params.gasPriceOracleScalar,
      decimals: params.gasPriceOracleDecimals,
    },
    L2StandardBridge: {
      l1TokenBridge: contracts.Proxy__OVM_L1StandardBridge,
      messenger: addresses.L2CrossDomainMessenger,
    },
    L2ERC721Bridge: {
      l1ERC721Bridge: contracts.Proxy__OVM_L1ERC721Bridge,
      messenger: addresses.L2CrossDomainMessenger,
    },
    OVM_SequencerFeeVault: {
      l1FeeWallet: params.ovmFeeWalletAddress,
    },
    OVM_ETH: {
      l2Bridge: addresses.L2StandardBridge,
      l1Token: ZERO_ADDRESS,
      _name: "Ether",
      _symbol: "ETH",
    },
    L2CrossDomainMessenger: {
      xDomainMsgSender: "0x000000000000000000000000000000000000dEaD",
      l1CrossDomainMessenger: contracts.Proxy__OVM_L1CrossDomainMessenger,
      messageNonce: 100000,
    },
    WETH9: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
    },
  };

  // Change OVM_ETH to OVM_OAS.
  if (params.useOvmOas) {
    commit = OVM_OAS_COMMIT;
    addresses.OVM_OAS = addresses.OVM_ETH;
    storageLayouts.OVM_OAS = storageLayouts.OVM_ETH;
    variables.OVM_OAS = {
      l2Bridge: addresses.L2StandardBridge,
      l1Token: ZERO_ADDRESS,
      _name: "OAS",
      _symbol: "OAS",
    };
    delete addresses.OVM_ETH;
    delete storageLayouts.OVM_ETH;
    delete variables.OVM_ETH;
  }

  const dump: any = {};
  const CONTRACT_COMMITS = getContractCommit(version);
  for (const [predeployName, predeployAddress] of Object.entries(addresses)) {
    dump[predeployAddress] = {
      balance: "00",
      storage: {},
    };

    if (predeployName === "OVM_L1BlockNumber") {
      // OVM_L1BlockNumber is a special case where we just inject a specific bytecode string.
      // We do this because it uses the custom L1BLOCKNUMBER opcode (0x4B) which cannot be
      // directly used in Solidity (yet). This bytecode string simply executes the 0x4B opcode
      // and returns the address given by that opcode.
      dump[predeployAddress].code = "0x4B60005260206000F3";
    } else {
      const artifact = await getContractArtifact(
        CONTRACT_COMMITS[predeployName],
        predeployName
      );
      dump[predeployAddress].code = artifact.deployedBytecode;
    }

    // Compute and set the required storage slots for each contract that needs it.
    if (predeployName in variables) {
      const storageLayout = storageLayouts[predeployName];
      const slots = computeStorageSlots(
        storageLayout,
        variables[predeployName]
      );
      for (const slot of slots) {
        dump[predeployAddress].storage[slot.key] = slot.val;
      }
    }
  }

  // Grab the commit hash so we can stick it in the genesis file.
  const genesis = {
    commit: commit,
    config: {
      chainId: params.chainId,
      homesteadBlock: params.homesteadBlock,
      eip150Block: params.eip150Block,
      eip155Block: params.eip155Block,
      eip158Block: params.eip158Block,
      byzantiumBlock: params.byzantiumBlock,
      constantinopleBlock: params.constantinopleBlock,
      petersburgBlock: params.petersburgBlock,
      istanbulBlock: params.istanbulBlock,
      muirGlacierBlock: params.muirGlacierBlock,
      berlinBlock: params.berlinBlock,
      clique: {
        period: params.period,
        epoch: params.epoch,
      },
    },
    difficulty: "1",
    gasLimit: params.l2BlockGasLimit.toString(10),
    extradata:
      "0x" +
      "00".repeat(32) +
      remove0x(params.ovmBlockSignerAddress) +
      "00".repeat(65),
    alloc: dump,
  };

  return genesis;
};
