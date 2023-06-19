import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getProvider, getSigner, isAllowedChain, handleError, getStakeManagerContract } from '@/features';
import { Button, ErrorMsg, SuccessMsg } from '@/components/atoms';
import { LoadingModal, WalletConnect, ValidatorInfo } from '@/components/organisms';
import { isNotConnectedMsg, ZERO_ADDRESS } from '@/consts';

const ClaimCommissions: NextPage = () => {
  const [ownerError, setOwnerError] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [operatorAddress, setOperatorAddress] = useState('');
  const [connectedChainId, setConnectedChainId] = useState<number>();
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');
  const [claimErrorMsg, setClaimErrorMsg] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const refreshError = () => {
    setOwnerError('');
    setClaimErrorMsg('');
  };

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
      setConnectedChainId(chainId);
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

      const stakeManagerContract = await getStakeManagerContract();

      setOwnerAddress(address);
      setConnectedChainId(chainId);
      isAllowedChain(chainId);
      const result = await stakeManagerContract.getValidatorInfo(address, 0);
      if (result.operator !== ZERO_ADDRESS) {
        setOperatorAddress(result.operator);
      }
      setOwnerError('');
    } catch (err) {
      handleError(err, setOwnerError);
    }
  }

  const claimCommissions = async () => {
    try {
      const stakeManagerContract = await getStakeManagerContract();
      refreshError();
      setIsClaiming(true);
      await stakeManagerContract.claimCommissions(ownerAddress, 0);
      const filter = stakeManagerContract.filters.ClaimedCommissions(ownerAddress, null);
      stakeManagerContract.once(filter, (owner: string, amount: ethers.BigNumber) => {
        const oasAmount = ethers.utils.formatEther(amount.toString());
        setClaimSuccessMsg(`claim commissions is successful(${oasAmount}OAS)`);
        setIsClaiming(false);
      });
    } catch (err) {
      setClaimSuccessMsg('');
      setIsClaiming(false);
      handleError(err, setClaimErrorMsg);
    }
  };

  useEffect(() => {
    handleAccountsChanged();
  });

  const heads = [
    'Address',
    'Value'
  ];

  const records = [
    [
      'Validator Owner',
      ownerAddress,
    ],
    [
      'Validator Operator',
      operatorAddress,
    ]
  ]

  return (
    <div className='space-y-10 grid grid-cols-8 text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg'>
      {(isClaiming) && <LoadingModal/>}
      <WalletConnect
        className='space-y-0.5 col-span-4 col-start-3'
        ownerError={ownerError}
        ownerAddress={ownerAddress}
        chainId={connectedChainId}
        setOwner={setOwner}
      />
      <div className='space-y-0.5 col-span-4 col-start-3'>
        {(!ownerAddress || !operatorAddress) &&
        <p>You have to join validator.</p>
        }
        {(ownerAddress && operatorAddress)  &&
          <div className='space-y-4'>
            {claimErrorMsg && (
              <ErrorMsg text={ claimErrorMsg } className='w-full' />
            )}
            {claimSuccessMsg && (
              <SuccessMsg text={claimSuccessMsg} className='w-full' />
            )}
            <ValidatorInfo
              ownerAddress={ownerAddress}
              operatorAddress={operatorAddress}
            />
            <div className="flex items-center space-x-2">
              <Button
                handleClick={claimCommissions}
              >
                Claim Commissions
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default ClaimCommissions
