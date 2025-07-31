import '@/styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Layout } from '@/components/templates';
import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { customChains } from '@/config/chains';

// Initialize AppKit with Ethers v5 adapter
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? '';
const metadata = {
  name: 'Tools-fe',
  description: 'Oasys Tools-fe',
  url: process.env.NEXT_PUBLIC_URL ? 'https://' + process.env.NEXT_PUBLIC_URL : 'http://localhost:3000',
  icons: [],
};

createAppKit({
  adapters: [new Ethers5Adapter()],
  projectId,
  metadata,
  networks: customChains,
	featuredWalletIds: [
		// Oasys Passport
		'37aacf1e6bf6793c892e42c3f7623a61d9ffcb4337010804cc3193c4d596cf5c',
		// MetaMask
		'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
	],
	allWallets: 'SHOW',
	enableWalletConnect: true,
	features: {
		email: false,
		socials: [],
	},
	themeMode: 'light',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Oasys Tools</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp
