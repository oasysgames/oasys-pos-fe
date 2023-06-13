import type { NextPage } from 'next';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { isNotConnectedMsg } from '@/consts';
import { getL1ERC721BridgeProxyContract, getL1StandardBridgeProxyContract, getProvider, getSigner, handleError, isAllowedChain } from '@/features';
import { WalletConnect, LoadingModal } from '@/components/organisms';
import { UpdateBridgeContract } from '@/components/templates';
import { useVerseInfo, useRefreshVerseInfo } from '@/hooks';
import { ErrorMsg } from '@/components/atoms';
import L1StandardBridgeV1 from '@/contracts/oasysHub/bridge/version1/L1StandardBridge.json';
import L1ERC721BridgeV1 from '@/contracts/oasysHub/bridge/version1/L1ERC721Bridge.json';
import L1ERC721BridgeV2 from '@/contracts/oasysHub/bridge/version2/L1ERC721Bridge.json';

const UpdateBridge: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [preERC20BridgeBytecode, setPreERC20BridgeBytecode] = useState('');
  const [preERC721BridgeBytecode, setPreERC721BridgeBytecode] = useState('');
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

  const setPreERC20BridgeContractBytecode = async (l1StandardBridgeProxyAddress: string) => {
    const l1StandardBridgeProxy = await getL1StandardBridgeProxyContract(l1StandardBridgeProxyAddress);
    const bridgeContractAddress = await l1StandardBridgeProxy.callStatic.getImplementation();

    const provider = await getProvider();
    const bytecode = await provider.send('eth_getCode', [bridgeContractAddress, 'latest']);
    setPreERC20BridgeBytecode(bytecode);
  }

  const setPreERC721BridgeContractBytecode = async (l1ERC721BridgeProxyAddress: string,) => {
    const l1ERC721BridgeProxy = await getL1ERC721BridgeProxyContract(l1ERC721BridgeProxyAddress);
    const bridgeContractAddress = await l1ERC721BridgeProxy.callStatic.getImplementation();

    const provider = await getProvider();
    const bytecode = await provider.send('eth_getCode', [bridgeContractAddress, 'latest']);
    setPreERC721BridgeBytecode(bytecode);
  }

  const setPreBridgeContractBytecode = async (l1StandardBridgeProxyAddress: string, l1ERC721BridgeProxyAddress: string) => {
    await setPreERC20BridgeContractBytecode(l1StandardBridgeProxyAddress);
    await setPreERC721BridgeContractBytecode(l1ERC721BridgeProxyAddress);
  }

  useEffect(() => {
    handleAccountsChanged();
    if (verseInfo?.namedAddresses) {
      setPreBridgeContractBytecode(verseInfo.namedAddresses.Proxy__OVM_L1StandardBridge, verseInfo.namedAddresses.Proxy__OVM_L1ERC721Bridge);
    }
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

  const updateERC20BridgeTitle = 'Update ERC20 Bridge Contract';
  const updateERC721BridgeTitle = 'Update ERC721 Bridge Contract';

  const deployedStatus = (preDeployedBytecode: string, bytecode: string) => {
    return preDeployedBytecode === bytecode ? ' (currently deployed)' : '';
  }

  const preERC20BridgeBytecodeOptions = useMemo(() => {
    return [
      { label: `Version 1${deployedStatus(preERC20BridgeBytecode, L1StandardBridgeV1.deployedBytecode)}`, value: L1StandardBridgeV1.deployedBytecode },
    ];
  }, [preERC20BridgeBytecode]);
  const preERC721BridgeBytecodeOptions = useMemo(() => {
    return [
      { label: `Version 1${deployedStatus(preERC721BridgeBytecode, L1ERC721BridgeV1.deployedBytecode)}`, value: L1ERC721BridgeV1.deployedBytecode },
      { label: `Version 2${deployedStatus(preERC721BridgeBytecode, L1ERC721BridgeV2.deployedBytecode)}`,  value: L1ERC721BridgeV2.deployedBytecode },
    ];
  }, [preERC721BridgeBytecode]);

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
          <div className='space-y-8'>
            <UpdateBridgeContract
              title={updateERC20BridgeTitle}
              bridgeProxyAddress={verseInfo.namedAddresses.Proxy__OVM_L1StandardBridge}
              updateBridgeContractMethod={updateERC20BridgeContract}
              bytecodeOptions={preERC20BridgeBytecodeOptions}
              buttonText={updateERC20BridgeTitle}
            />
            <UpdateBridgeContract
              title={updateERC721BridgeTitle}
              bridgeProxyAddress={verseInfo.namedAddresses.Proxy__OVM_L1ERC721Bridge}
              updateBridgeContractMethod={updateERC721BridgeContract}
              bytecodeOptions={preERC721BridgeBytecodeOptions}
              buttonText={updateERC721BridgeTitle}
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