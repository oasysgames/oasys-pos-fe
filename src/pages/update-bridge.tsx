import type { NextPage } from 'next';
import { useEffect, useState, useCallback } from 'react';
import { isNotConnectedMsg } from '@/consts';
import { getL1ERC721BridgeProxyContract, getL1StandardBridgeProxyContract, getProvider, getSigner, handleError, isAllowedChain } from '@/features';
import { WalletConnect, LoadingModal } from '@/components/organisms';
import { UpdateBridgeContract } from '@/components/templates';
import { useVerseInfo, useRefreshVerseInfo } from '@/hooks';
import { ErrorMsg } from '@/components/atoms';
import L1StandardBridge from '@/contracts/oasysHub/L1StandardBridge.json';
import L1ERC721Bridge from '@/contracts/oasysHub/L1ERC721Bridge.json';

const UpdateBridge: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const { verseInfo, isVerseInfoLoading, verseInfoError } = useVerseInfo(ownerAddress);
  const refreshVerseInfo = useRefreshVerseInfo();

  const handleAccountsChanged = async () => {
    const provider = await getProvider();
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length === 0) {
      setOwnerAddress('');
      setOwnerError(isNotConnectedMsg);
      return;
    };
    setOwner();
  };

  const handleChainChanged = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    try {
      isAllowedChain(chainId);
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
      isAllowedChain(chainId);
      setOwnerError('');
    } catch (err) {
      handleError(err, setOwnerError);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshVerseInfo();
  }, [ownerAddress, refreshVerseInfo]);

  const updateERC20BridgeContract = useCallback(async (l1StandardBridgeProxyAddress: string, bytecode: string, handleUpdateSuccess: (successMsg: string) => void) => {
    const l1StandardBridgeProxy = await getL1StandardBridgeProxyContract(l1StandardBridgeProxyAddress);
    const tx = await l1StandardBridgeProxy.setCode(bytecode);
    await tx.wait();
    handleUpdateSuccess('Successfully updated the ERC20 bridge contract!');
  }, [])

  const updateERC721BridgeContract = useCallback(async (l1ERC721BridgeProxyAddress: string, bytecode: string, handleUpdateSuccess: (successMsg: string) => void) => {
    const l1ERC721BridgeProxy = await getL1ERC721BridgeProxyContract(l1ERC721BridgeProxyAddress);
    const tx = await l1ERC721BridgeProxy.setCode(bytecode);
    await tx.wait();
    handleUpdateSuccess('Successfully updated the ERC721 bridge contract!');
  }, [])

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        className='space-y-0.5 col-span-6 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        setOwner={setOwner}
      />
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {(ownerAddress && isVerseInfoLoading) && <LoadingModal />}
        {verseInfoError instanceof Error && (
          <ErrorMsg className='w-full' text={verseInfoError.message} />
        )}
        {verseInfo?.namedAddresses ?
        (
          <div>
            <UpdateBridgeContract
              title='Update ERC20 Bridge Contract'
              bridgeProxyAddress={verseInfo.namedAddresses.Proxy__OVM_L1StandardBridge}
              updateBridgeContractMethod={updateERC20BridgeContract}
              bytecodeOptions={[
                { label: 'Version 1', value: L1StandardBridge.deployedBytecode },
              ]}
            />
            <UpdateBridgeContract
              title='Update ERC721 Bridge Contract'
              bridgeProxyAddress={verseInfo.namedAddresses.Proxy__OVM_L1ERC721Bridge}
              updateBridgeContractMethod={updateERC721BridgeContract}
              bytecodeOptions={[
                { label: 'Version 1', value: L1ERC721Bridge.deployedBytecode },
              ]}
            />
          </div>
        ) :
        (
          <p>You have to build verse.</p>
        )}
      </div>
    </div>
  );
};

export default UpdateBridge