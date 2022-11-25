import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Layout } from '../components/templates';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Oasys Web Page</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp
