/**
 * @oasysgames/oasys-optimism
 * https://github.com/oasysgames/oasys-optimism/blob/c724bfe6e326c7bcc321e20deb9c2129ec0d4112/packages/contracts/tasks/take-dump.ts
 */

import { L2ContractAddresses, L2ContractStorageLayouts, ZERO_ADDRESS } from "@/const";
import { remove0x } from "@/features/smock/hexUtils";
import { computeStorageSlots } from "@/features/smock/storage";
import { GenesisParams } from "@/types/optimism/genesis";
import { NamedAddresses } from "@/types/oasysHub/verseBuild";

// https://github.com/oasysgames/oasys-optimism/tree/c724bfe6e326c7bcc321e20deb9c2129ec0d4112/packages/contracts
const Commit = "c724bfe6e326c7bcc321e20deb9c2129ec0d4112";

const getContractArtifact = async (
  name: string
): Promise<{ deployedBytecode: string }> => {
  const content = import(`@/contracts/optimism/${Commit.slice(0, 10)}/${name}.json`);
  return await content;
};

export const makeGenesisJson = async (
  params: GenesisParams,
  contracts: NamedAddresses
) => {
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
      messenger: L2ContractAddresses.L2CrossDomainMessenger,
    },
    L2ERC721Bridge: {
      l1ERC721Bridge: contracts.Proxy__OVM_L1ERC721Bridge,
      messenger: L2ContractAddresses.L2CrossDomainMessenger,
    },
    OVM_SequencerFeeVault: {
      l1FeeWallet: params.ovmFeeWalletAddress,
    },
    OVM_ETH: {
      l2Bridge: L2ContractAddresses.L2StandardBridge,
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

  const dump: any = {};
  for (const [predeployName, predeployAddress] of Object.entries(
    L2ContractAddresses
  )) {
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
      const artifact = await getContractArtifact(predeployName);
      dump[predeployAddress].code = artifact.deployedBytecode;
    }

    // Compute and set the required storage slots for each contract that needs it.
    if (predeployName in variables) {
      const storageLayout = L2ContractStorageLayouts[predeployName];
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
    commit: Commit,
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
