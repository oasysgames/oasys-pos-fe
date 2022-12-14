import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { isNotConnectedMsg, ZERO_ADDRESS } from '@/consts';
import { getL1BuildAgentContract, getProvider, getSigner, handleError, isAllowedChain } from '@/features';
import { useRefreshL1BuildDeposit, useVerseInfo, useRefreshVerseInfo } from '@/hooks';
import { ErrorMsg, SuccessMsg } from '@/components/atoms';
import { WalletConnect, Form, VerseInfo } from '@/components/organisms';
import { BuildDeposit } from '@/components/templates';

const Verse: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [buildSuccess, setBuildSuccess] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState('');
  const [newChainId, setNewChainId] = useState('');
  const [sequencerAddress, setSequencerAddress] = useState('');
  const [proposerAddress, setProposerAddress] = useState('');
  const { verseInfo, verseInfoError } = useVerseInfo(ownerAddress);
  const refreshL1BuildDeposit = useRefreshL1BuildDeposit();
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
      refreshL1BuildDeposit();
      refreshVerseInfo();
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

  const build = async () => {
    const L1BuildAgentContract = await getL1BuildAgentContract();

    try {
      setIsBuilding(true);
      const verseChainId = ethers.BigNumber.from(newChainId).toNumber();
      const addressManager = await L1BuildAgentContract.getAddressManager(verseChainId);
      if (addressManager !== ZERO_ADDRESS) throw new Error(`Chain_id ${verseChainId} is already used`);

      const tx: ethers.providers.TransactionResponse = await L1BuildAgentContract.build(verseChainId, sequencerAddress, proposerAddress);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setBuildSuccess(`Verse build is successful. Please memo build_transaction (${tx.hash}) to check VerseInfo at check-verse-page by non_verse_builder`);
        setNewChainId('');
        setSequencerAddress('');
        setProposerAddress('');
        setIsBuilding(false);
        refreshL1BuildDeposit();
        refreshVerseInfo();
      }
    } catch (err) {
      setIsBuilding(false);
      handleError(err, setBuildError);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshL1BuildDeposit();
  }, [ownerAddress, refreshL1BuildDeposit]);

  useEffect(() => {
    refreshVerseInfo();
  }, [ownerAddress, refreshVerseInfo]);

  const buildInputs = [
    {
      placeholder: 'set verse chain_id',
      value: newChainId,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setNewChainId(e.target.value)},
    },
    {
      placeholder: 'set sequencer address',
      value: sequencerAddress,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setSequencerAddress(e.target.value)},
    },
    {
      placeholder: 'set proposer address',
      value: proposerAddress,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setProposerAddress(e.target.value)},
    },
  ];

  const buildButtons = [
    {
      handleClick: build,
      disabled: !sequencerAddress || !proposerAddress || isBuilding,
      value: 'Build',
    }
  ];

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        setOwner={setOwner}
      />
      <BuildDeposit
        className='space-y-4 col-span-4 col-start-3'
        ownerAddress={ownerAddress}
      />
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {buildSuccess && (
          <SuccessMsg className='w-full' text={buildSuccess} />
        )}
        {verseInfoError instanceof Error && (
          <ErrorMsg className='w-full' text={verseInfoError.message} />
        )}
        {buildError && (
          <ErrorMsg className='w-full' text={ buildError } />
        )}
        <p>Build verse</p>
        <Form
          inputs={buildInputs}
          buttons={buildButtons}
        />
      </div>
      { verseInfo && 
        <VerseInfo 
          className='space-y-4 col-span-4 col-start-3'
          ownerAddress={ownerAddress}
          verseInfo={verseInfo}
        />
      }
    </div>
  );
};

export default Verse