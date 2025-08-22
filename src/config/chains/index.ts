import { AppKitNetwork } from '@reown/appkit/networks';
import { oasys } from './definitions/oasys';
import { oasysTestnet } from './definitions/oasysTestnet';
import { privateL1 } from './definitions/privateL1';

export type CustomChainInfo = (typeof customChains)[number];

export const customChains: [AppKitNetwork, ...AppKitNetwork[]] = [
  oasys,
  oasysTestnet,
  privateL1,
];

export const getChainInfo = (chainId: number) => {
  return customChains.find((chain) => {
    return chain.id === chainId;
  });
};
