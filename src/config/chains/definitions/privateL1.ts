import { defineChain } from 'viem';

export const privateL1 = /*#__PURE__*/ defineChain({
  id: 12345,
  name: 'Private L1',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Private L1 Explorer',
      url: 'http://127.0.0.1:4000',
    },
  },
  testnet: true,
});
