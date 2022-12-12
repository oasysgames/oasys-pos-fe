import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { isNotConnectedMsg, ZERO_ADDRESS } from '@/const';
import L1BuildAgent from '@/contracts/oasysHub/L1BuildAgent.json';
import L1BuildDeposit from '@/contracts/oasysHub/L1BuildDeposit.json';
import { L1BuildDepositAddress, L1BuildAgentAddress } from '@/config';
import { download, getProvider, getSigner, handleError, isAllowedChain } from '@/features';
import { useL1BuildDeposit, useRefreshL1BuildDeposit, useVerseInfo, useRefreshVerseInfo } from '@/hooks';
import { Button, Input, ErrorMsg, SuccessMsg } from '@/components/atoms';

const Verse: NextPage = () => {
  const { data, error: depositLoadError } = useL1BuildDeposit();
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [depositSuccess, setDepositSuccess] = useState('');
  const [idDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState('');
  const [amount, setAmount] = useState('');
  const [buildSuccess, setBuildSuccess] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState('');
  const [newChainId, setNewChainId] = useState('');
  const [sequencerAddress, setSequencerAddress] = useState('');
  const [proposerAddress, setProposerAddress] = useState('');
  const [downloadError, setDownloadError] = useState('');
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

  const deposit = async () => {
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
      const value = ethers.utils.parseEther(amount);
      const options = { value: value };
      setIsDepositLoading(true);
      await L1BuildDepositContract.deposit(ownerAddress, options);

      const filter = L1BuildDepositContract.filters.Deposit(ownerAddress, null, null);
      L1BuildDepositContract.once(filter, (builder: string, depositer: string, token: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}OAS deposit is successful`);
        setAmount('');
        setIsDepositLoading(false);
        refreshL1BuildDeposit();
      });
    } catch (err) {
      setIsDepositLoading(false);
      handleError(err, setDepositError);
    }
  };

  const withdraw = async () => {
    const signer = await getSigner();
    const L1BuildDepositContract = new ethers.Contract(L1BuildDepositAddress, L1BuildDeposit.abi, signer);

    try {
      const value = ethers.utils.parseEther(amount);
      setIsDepositLoading(true);
      await L1BuildDepositContract.withdraw(ownerAddress, value);

      const filter = L1BuildDepositContract.filters.Withdrawal(ownerAddress, null, null);
      L1BuildDepositContract.once(filter,  (builder: string, depositer: string, token: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setDepositSuccess(`${oasAmount}OAS withdraw is successful`);
        setAmount('');
        setIsDepositLoading(false);
        refreshL1BuildDeposit();
      });
    } catch (err) {
      setIsDepositLoading(false);
      handleError(err, setDepositError);
    }
  };

  const build = async () => {
    const signer = await getSigner();
    const L1BuildAgentContract = new ethers.Contract(L1BuildAgentAddress, L1BuildAgent.abi, signer);

    try {
      setIsBuilding(true);
      const verseChainId = ethers.BigNumber.from(newChainId).toNumber();
      const addressManager = await L1BuildAgentContract.getAddressManager(verseChainId);
      if (addressManager !== ZERO_ADDRESS) throw new Error(`Chain_id ${verseChainId} is already used`);

      const tx: ethers.providers.TransactionResponse = await L1BuildAgentContract.build(verseChainId, sequencerAddress, proposerAddress);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setBuildSuccess(`verse build is successful`);
        setIsBuilding(false);
        refreshL1BuildDeposit();
        refreshVerseInfo();
      }
    } catch (err) {
      setIsBuilding(false);
      handleError(err, setBuildError);
    }
  };

  const downloadAddresses = async () => {
    try {
      if (!verseInfo?.namedAddresses) throw new Error('You have to build verse');
      download(verseInfo.namedAddresses, 'addresses.json');
    } catch (err) {
      handleError(err, setDownloadError);
    }
  };

  const downloadGenesis = async () => {
    try {
      if (!verseInfo?.genesis) throw new Error('You have to build verse');
      download(verseInfo.genesis, 'genesis.json');
    } catch (err) {
      handleError(err, setDownloadError);
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
        {depositSuccess && (
          <SuccessMsg className='text-center' text={depositSuccess} />
        )}
        {depositLoadError instanceof Error && (
          <ErrorMsg className='text-center' text={depositLoadError.message} />
        )}
        {depositError && (
          <ErrorMsg className='text-center' text={ depositError } />
        )}
        <p>Deposit amount: {data?.amount ? `${ethers.utils.formatEther(data.amount)}$OAS`: ''}</p>
        <Input
          placeholder='set amount($OAS)'
          value={amount}
          handleClick={e => setAmount(e.target.value)}
          className='w-full'
        />
        <div className="flex items-center space-x-2">
          <Button
            handleClick={deposit}
            disabled={!amount || idDepositLoading}
          >
            Deposit
          </Button>
          <Button
            handleClick={withdraw}
            disabled={!amount || idDepositLoading}
          >
            Withdraw
          </Button>
        </div>
      </div>
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {buildSuccess && (
          <SuccessMsg className='text-center' text={buildSuccess} />
        )}
        {verseInfoError instanceof Error && (
          <ErrorMsg className='text-center' text={verseInfoError.message} />
        )}
        {buildError && (
          <ErrorMsg className='text-center' text={ buildError } />
        )}
        <p>Build verse</p>
        <Input
          placeholder='set verse chain_id'
          value={newChainId}
          handleClick={e => setNewChainId(e.target.value)}
          className='w-full'
        />
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
          disabled={!sequencerAddress || !proposerAddress || isBuilding}
        >
          Build
        </Button>
      </div>
      { verseInfo && 
        <div className='space-y-4 col-span-4 col-start-3'>
          {downloadError && (
            <ErrorMsg text={ downloadError } className='w-full' />
          )}
          <p>Download verse config</p>
          <div>
            <p>Chain_id : { verseInfo.chainId }</p>
            <p>Builder: { ownerAddress }</p>
            <p>Sequencer: { verseInfo.namedAddresses.OVM_Sequencer }</p>
            <p>Proposer: { verseInfo.namedAddresses.OVM_Proposer }</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              handleClick={downloadAddresses}
              disabled={ !verseInfo?.namedAddresses }
            >
              Download Address.json
            </Button>
            <Button
              handleClick={downloadGenesis}
              disabled={ !verseInfo?.genesis }
            >
              Download genesis.json
            </Button>
          </div>
        </div>
      }
    </div>
  );
};

export default Verse