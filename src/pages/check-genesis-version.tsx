import type { NextPage } from 'next';
import { useEffect, useState, ChangeEvent } from 'react';
import { isNotConnectedMsg } from '@/consts';
import {
  getProvider,
  getSigner,
  handleError,
} from '@/features';
import { ErrorMsg } from '@/components/atoms';
import {
  WalletConnect,
  Form,
} from '@/components/organisms';
import { ethers, providers } from 'ethers';
import L2StandardBridgeV1 from '@/contracts/optimism/c724bfe6e3/L2StandardBridge.json';
import L2ERC721BridgeV1 from '@/contracts/optimism/c724bfe6e3/L2ERC721Bridge.json';
import L2StandardBridgeV2 from '@/contracts/optimism/5186190c32/L2StandardBridge.json';
import L2ERC721BridgeV2 from '@/contracts/optimism/5186190c32/L2ERC721Bridge.json';
import { getGenesisVersion } from '@/features/optimism';

const CheckGenesisVersion: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const [genesisVersionError, setGenesisVersionError] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [genesisVersion, setGenesisVersion] = useState<string>();

  const handleAccountsChanged = async () => {
    const provider = await getProvider();
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length === 0) {
      setOwnerAddress('');
      setOwnerError(isNotConnectedMsg);
      return;
    }
    setOwner();
  };

  const handleChainChanged = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    try {
      setConnectedChainId(chainId);
      setOwner();
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  const setOwner = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();

      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      setOwnerAddress(address);
      setConnectedChainId(chainId);
      setOwnerError('');
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  const checkGenesisVersion = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const version = await getGenesisVersion(provider);
  
      setGenesisVersion(version);
      setGenesisVersionError('');
    } catch (err) {
      handleError(err, setGenesisVersionError);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  const inputs = [
    {
      placeholder: 'Verse RPC URL (e.g. https://rpc.verse.example.com/)',
      value: rpcUrl,
      handleClick: (e: ChangeEvent<HTMLInputElement>) =>
        setRpcUrl(e.target.value.trim()),
    },
  ];

  const buttons = [
    {
      handleClick: checkGenesisVersion,
      disabled: !rpcUrl,
      value: 'Check genesis version',
    },
  ];

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
      />

      <div className='space-y-0.5 col-span-4 col-start-3'>
        {genesisVersionError && <ErrorMsg text={genesisVersionError} className='w-full' />}
        <Form inputs={inputs} buttons={buttons} />
        <p>Version{genesisVersion}</p>
      </div>
    </div>
  );
};

export default CheckGenesisVersion;
