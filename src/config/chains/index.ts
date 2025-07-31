import { AppKitNetwork } from '@reown/appkit/networks';
import { oasys } from './definitions/oasys';
import { oasysTestnet } from './definitions/oasysTestnet';

export type CustomChainInfo = (typeof customChains)[number];

export const customChains: [AppKitNetwork, ...AppKitNetwork[]] = [
  oasys,
  oasysTestnet,
];

export const getChainInfo = (chainId: number) => {
  return customChains.find((chain) => {
    return chain.id === chainId;
  });
};
