import { ethers, BigNumber } from "ethers";
import { getSigner } from "@/features/common/wallet";
import { L1BuildAgentAddress } from '@/config';
import L1BuildAgent from '@/contracts/oasysHub/L1BuildAgent.json';
import { NamedAddresses } from "@/types/oasysHub/verseBuild";

export const getNamedAddresses = async (chainId: number) => {
  const signer = await getSigner();
  const L1BuildAgentContract = new ethers.Contract(L1BuildAgentAddress, L1BuildAgent.abi, signer);

  const namedAddresses: { [name: string]: string } = {
    Lib_AddressManager: await L1BuildAgentContract.getAddressManager(chainId),
  };

  const [names, addresses] = await L1BuildAgentContract.getNamedAddresses(chainId);
  (names as string[]).forEach((name, i) => {
    namedAddresses[name] = addresses[i];
  });

  return namedAddresses as NamedAddresses;
};

export const getBuilts = async () => {
  const signer = await getSigner();
  const L1BuildAgentContract = new ethers.Contract(L1BuildAgentAddress, L1BuildAgent.abi, signer);

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
  const signer = await getSigner();
  const { builders, chainIds } = await getBuilts();

  const chainId = chainIds.filter(
    (_, i) => builders[i].toLowerCase() === builder.toLowerCase()
  )[0];
  if (!chainId) return undefined;

  return chainId.toNumber();
};
