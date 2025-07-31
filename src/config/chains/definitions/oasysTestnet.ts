import { defineChain } from 'viem'

export const oasysTestnet = /*#__PURE__*/ defineChain({
  id: 9372,
  name: 'Oasys Testnet',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.oasys.games'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasys Testnet Explorer',
      url: 'https://explorer.testnet.oasys.games',
    },
  },
  testnet: true,
})
