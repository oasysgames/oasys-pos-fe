import { BigNumber } from 'ethers';
import { getProvider } from '@/features/common/wallet';
import { NamedAddresses, NamedAddressesV2 } from '@/types/oasysHub/verseBuild';
import {
  getL1BuildAgentContract,
  getL1BuildDepositContract,
  getProxyAdminContract,
  getOasysL2OutputOracleContract,
  getOasysPortalContract,
  getSystemConfigContract,
} from '@/features/';

export const getNamedAddresses = async (chainId: number, isLegacy: boolean = true) => {
  const L1BuildAgentContract = await getL1BuildAgentContract(isLegacy);

  const namedAddresses: { [name: string]: string } = {
    Lib_AddressManager: await L1BuildAgentContract.getAddressManager(chainId),
  };

  const [names, addresses] = await L1BuildAgentContract.getNamedAddresses(
    chainId,
  );
  (names as string[]).forEach((name, i) => {
    namedAddresses[name] = addresses[i];
  });

  return namedAddresses as NamedAddresses;
};

export const getNamedAddressesV2 = async (chainId: number, p2pSequencer: string = "") => {
  const isLegacy = false;
  const l1BuildAgent = await getL1BuildAgentContract(isLegacy);
  const builtAddresses = await l1BuildAgent.builtLists(chainId);

  // Get address manager from Legacy L1BuildAgent
  const l1BuildAgentLegacy = await getL1BuildAgentContract(true);
  const addressManager = await l1BuildAgentLegacy.getAddressManager(chainId);

  const result = {
    ProxyAdmin: builtAddresses[0],
    SystemConfigProxy: builtAddresses[1],
    L1StandardBridgeProxy: builtAddresses[2],
    L1ERC721BridgeProxy: builtAddresses[3],
    L1CrossDomainMessengerProxy: builtAddresses[4],
    L2OutputOracleProxy: builtAddresses[5],
    OptimismPortalProxy: builtAddresses[6],
    ProtocolVersions: builtAddresses[7],
    BatchInbox: builtAddresses[8],
    AddressManager:  addressManager,
    P2PSequencer: p2pSequencer,
  } as NamedAddressesV2;

  result.FinalSystemOwner = await (await getProxyAdminContract(result.ProxyAdmin)).owner();
  result.L2OutputOracleProposer = await (await getOasysL2OutputOracleContract(result.L2OutputOracleProxy)).PROPOSER();
  result.L2OutputOracleChallenger = await (await getOasysL2OutputOracleContract(result.L2OutputOracleProxy)).CHALLENGER();
  result.BatchSender = (await (await getSystemConfigContract(result.SystemConfigProxy)).batcherHash()).replace(/(0{24})(?=\w)/g, '');

  return result;
};

export const getBuilderFromTx = async (txhash: string, isLegacy: boolean = true): Promise<string> => {
  const provider = await getProvider();
  const L1BuildDepositContract = await getL1BuildDepositContract(isLegacy);

  // Get a receipt and event for the birth build transaction from the Hub-Layer.
  const receipt = await provider.getTransactionReceipt(txhash);
  if (!receipt) throw Error('Transaction not found');

  const events = (
    await L1BuildDepositContract.queryFilter(L1BuildDepositContract.filters.Build(), receipt.blockHash)
  ).filter((x) => x.transactionHash.toLowerCase() === txhash.toLowerCase());
  if (events.length === 0) throw new Error('Build event is not found');
  if (!events[0].args?.builder) throw new Error('Builder is not found');

  return events[0].args.builder;
};

export const getBuilderFromChainID = async (
  chainId: number,
): Promise<string> => {
  const { builders, chainIds } = await getBuilts();
  const found = builders.find((_, i) => chainIds[i].eq(chainId));
  if (!found) throw new Error('Builder is not found');
  return found;
};

export const getBuilderFromChainIDV2 = async (
  chainId: number,
): Promise<string> => {
  const l1BuildAgent = await getL1BuildAgentContract(false);
  return await l1BuildAgent.getBuilderGlobally(chainId);
};

export const getBuilts = async (isLegacy: boolean = true): Promise<{
  builders: string[];
  chainIds: BigNumber[];
}> => {
  const L1BuildAgentContract = await getL1BuildAgentContract(isLegacy);

  let builders: string[] = [];
  let chainIds: BigNumber[] = [];
  let cursor: BigNumber = BigNumber.from(0);

  while (true) {
    const [_builders, _chainIds, newCursor] =
      await L1BuildAgentContract.getBuilts(cursor, 200);
    if (_builders.length === 0) break;

    builders = builders.concat(_builders);
    chainIds = chainIds.concat(_chainIds);
    cursor = newCursor;
  }

  return {
    builders,
    chainIds,
  };
};

export const getVerseChainId = async (
  builder: string,
): Promise<number | undefined> => {
  const { builders, chainIds } = await getBuilts();

  const chainId = chainIds.filter(
    (_, i) => builders[i].toLowerCase() === builder.toLowerCase(),
  )[0];
  if (!chainId) return undefined;

  return chainId.toNumber();
};
