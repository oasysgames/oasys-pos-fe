import { ethers } from 'ethers';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { Modal } from './modal';
import { ZERO_ADDRESS } from '@/consts';
import { getL1BuildAgentContract, handleError } from '@/features';
import { ErrorMsg, SuccessMsg, Button } from '@/components/atoms';
import { Form } from '@/components/organisms';

type Props = {
  className?: string;
};

export const BuildVerse = (props: Props) => {
  const {
    className,
  } = props;

  const [buildSuccess, setBuildSuccess] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState('');
  const [newChainId, setNewChainId] = useState('');
  const [sequencerAddress, setSequencerAddress] = useState('');
  const [proposerAddress, setProposerAddress] = useState('');
  const [buildModalOpen, setBuildModalOpen] = useState(false);

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
        // refreshL1BuildDeposit();
        // refreshVerseInfo();
      }
    } catch (err) {
      setIsBuilding(false);
      handleError(err, setBuildError);
    }
  };

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

  const BuildModal = () => {
    return (
      <Modal
        setModalState={setBuildModalOpen}
        isLoading={isBuilding}
      >
        <div className='space-y-4'>
          {buildSuccess && (
          <SuccessMsg className='w-full' text={buildSuccess} />
          )}
          {buildError && (
            <ErrorMsg className='w-full' text={ buildError } />
          )}
          <Form
            inputs={buildInputs}
            buttons={buildButtons}
          />
        </div>
      </Modal>
    )
  }

  return (
    <div className={clsx(
      className,
    )}>
      {buildModalOpen && <BuildModal />}
      <p>Build Verse</p>
      <Button
        handleClick={() => {
          setBuildSuccess('');
          setBuildError('');
          setBuildModalOpen(true);
        }}
      >
        Build
      </Button>
    </div>
  )
};
