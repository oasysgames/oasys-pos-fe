import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { isNotConnectedMsg } from '../const';
import L1BuildAgent from '../contracts/L1BuildAgent.json';
import L1BuildDeposit from '../contracts/L1BuildDeposit.json';
import { L1BuildDepositAddress, L1BuildAgentAddress } from '../config';
import { getProvider, getSigner, isAllowedChain } from '../features';
import { useL1BuildDeposit, useRefreshL1BuildDeposit } from '../hooks';
import { Button, Input, ErrorMsg } from '../components/atoms';

const Verse: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [depositError, setDepositError] = useState('');
  const [amount, setAmount] = useState('');
  const [buildError, setBuildError] = useState('');
  const [sequencerAddress, setSequencerAddress] = useState('');
  const [proposerAddress, setProposerAddress] = useState('');
  const { data, error: depositLoadError } = useL1BuildDeposit();
  const refreshL1BuildDeposit = useRefreshL1BuildDeposit();

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
    } catch (err) {
      if (err instanceof Error) {
        setOwnerError(err.message);
      }
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
      if (err instanceof Error) {
        setOwnerError(err.message);
      }
    }
  };

  const deposit = async () => {
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
      const value = ethers.utils.parseEther(amount);
      const options = { value: value };
      await L1BuildDepositContract.deposit(ownerAddress, options);
      refreshL1BuildDeposit();
      setAmount('');
    } catch (err) {
      if (err instanceof Error) {
        setDepositError(err.message);
      }
    }
  };

  const withdraw = async () => {
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
      const value = ethers.utils.parseEther(amount);
      await L1BuildDepositContract.withdraw(ownerAddress, value);
      refreshL1BuildDeposit();
      setAmount('');
    } catch (err) {
      if (err instanceof Error) {
        setDepositError(err.message);
      }
    }
  };

  const build = async () => {
    const signer = await getSigner();
    const chainId = await signer.getChainId();
    const L1BuildAgentContract = new ethers.Contract(L1BuildAgentAddress, L1BuildAgent.abi, signer);

    try {
      await L1BuildAgentContract.build(chainId, sequencerAddress, proposerAddress);
    } catch (err) {
      if (err instanceof Error) {
        setBuildError(err.message);
      }
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  useEffect(() => {
    refreshL1BuildDeposit();
  }, [ownerAddress, refreshL1BuildDeposit]);

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {ownerError && (
          <ErrorMsg text={ ownerError } className='w-full' />
        )}
        <p>Owner Address:  {ownerAddress}</p>
        <div className="flex items-center space-x-2">
          <Button
            handleClick={setOwner}
          >
            Connect
          </Button>
        </div>
      </div>
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {depositLoadError instanceof Error && (
          <ErrorMsg className='text-center' text={depositLoadError.message} />
        )}
        {depositError && (
          <ErrorMsg className='text-center' text={ depositError } />
        )}
        <p>Deposit amount: {data?.amount ? `${data.amount}$OAS`: ''}</p>
        <Input
          placeholder='set amount($OAS)'
          value={amount}
          handleClick={e => setAmount(e.target.value)}
          className='w-full'
        />
        <div className="flex items-center space-x-2">
          <Button
            handleClick={deposit}
            disabled={!amount}
          >
            Deposit
          </Button>
          <Button
            handleClick={withdraw}
            disabled={!amount}
          >
            Withdraw
          </Button>
        </div>
      </div>
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {buildError && (
          <ErrorMsg className='text-center' text={ buildError } />
        )}
        <p>Build verse</p>
        <Input
          placeholder='set sequencer address'
          value={sequencerAddress}
          handleClick={e => setSequencerAddress(e.target.value)}
          className='w-full'
        />
        <Input
          placeholder='set proposer address'
          value={proposerAddress}
          handleClick={e => setProposerAddress(e.target.value)}
          className='w-full'
        />
        <Button
          handleClick={build}
          disabled={!sequencerAddress || !proposerAddress}
        >
          Build
        </Button>
      </div>
    </div>
  );
};

export default Verse