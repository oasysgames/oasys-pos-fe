import { defineChain } from 'viem';

export const oasys = /*#__PURE__*/ defineChain({
  id: 248,
  name: 'Oasys Mainnet',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.mainnet.oasys.games'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasys Mainnet Explorer',
      url: 'https://explorer.oasys.games',
    },
  },
});
