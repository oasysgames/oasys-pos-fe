import { BigNumber } from "ethers";
import { getProvider, getSigner } from "@/features/common/wallet";
import { NamedAddresses } from "@/types/oasysHub/verseBuild";
import { getL1BuildAgentContract, getL1BuildDepositContract } from '@/features/';

export const getNamedAddresses = async (chainId: number) => {
  const L1BuildAgentContract = await getL1BuildAgentContract();

  const namedAddresses: { [name: string]: string } = {
    Lib_AddressManager: await L1BuildAgentContract.getAddressManager(chainId),
  };

  const [names, addresses] = await L1BuildAgentContract.getNamedAddresses(chainId);
  (names as string[]).forEach((name, i) => {
    namedAddresses[name] = addresses[i];
  });

  return namedAddresses as NamedAddresses;
};

export const getBuilderFromTx = async (
  txhash: string
): Promise<string> => {
  const provider = await getProvider();
   const L1BuildDepositContract = await getL1BuildDepositContract();

  // Get a receipt and event for the birth build transaction from the Hub-Layer.
  const receipt = await provider.getTransactionReceipt(txhash);
  if (!receipt) throw Error("Transaction not found");

  const events = (await L1BuildDepositContract.queryFilter("Build", receipt.blockHash)).filter(
    (x) => x.transactionHash.toLowerCase() === txhash.toLowerCase()
  );
  if (events.length === 0) throw new Error("Build event is not found");
  if (!events[0].args?.builder) throw new Error("Builder is  not found");

  return events[0].args.builder;
};

export const getBuilts = async () => {
  const L1BuildAgentContract = await getL1BuildAgentContract();

  let builders: string[] = [];
  let chainIds: BigNumber[] = [];
  let cursor: BigNumber = BigNumber.from(0);

  while (true) {
    const [_builders, _chainIds, newCursor] = await L1BuildAgentContract.getBuilts(
      cursor,
      200
    );
    if (_builders.length === 0) break;

    builders = builders.concat(_builders);
    chainIds = chainIds.concat(_chainIds);
    cursor = newCursor;
  }

  return {
    builders,
    chainIds
  };
};

export const getChainId = async (
  builder: string
) => {
  const { builders, chainIds } = await getBuilts();

  const chainId = chainIds.filter(
    (_, i) => builders[i].toLowerCase() === builder.toLowerCase()
  )[0];
  if (!chainId) return undefined;

  return chainId.toNumber();
};
