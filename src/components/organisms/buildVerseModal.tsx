import { ethers } from 'ethers';
import { ChangeEvent, SetStateAction, useState } from 'react';
import { ZERO_ADDRESS, L2_GASLIMIT, L2_OO_SUBMISSION_INTERVAL, FINALIZATION_PERIOD_SECONDS } from '@/consts';
import { getL1BuildAgentContract, handleError } from '@/features';
import { ErrorMsg, SuccessMsg, Modal, InputType } from '@/components/atoms';
import { Form, LoadingModal } from '@/components/organisms';

type Props = {
  className?: string;
  setModalState: (value: SetStateAction<boolean>) => void;
};

export const BuildVerseModal = (props: Props) => {
  const {
    className,
    setModalState,
  } = props;

  const [buildSuccess, setBuildSuccess] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState('');
  const [newChainId, setNewChainId] = useState<number>();
  const [finalSystemOwner, setFinalSystemOwner] = useState('');
  const [proposerAddress, setProposerAddress] = useState('');
  const [batchSenderAddress, setBatchSenderAddress] = useState('');
  const [p2pSequencerAddress, setP2PSequencerAddress] = useState('');
  const [l2BlockTime, setL2BlockTime] = useState<number>();
  const [l2OOStartingBlockNumber, setL2OOStartingBlockNumber] = useState<number>();
  const [l2OOStartingTimestamp, setL2OOStartingTimestamp] = useState<number>();

  const build = async () => {
    const isLegacy = false;
    const L1BuildAgentContract = await getL1BuildAgentContract(isLegacy);

    try {
      setIsBuilding(true);

      if (l2BlockTime! < 1 || l2BlockTime! > 7) {
        throw new Error('L2 Block Time must be between 1 and 7');
      }

      const tx: ethers.providers.TransactionResponse = await L1BuildAgentContract.build(
        newChainId!,
        [finalSystemOwner, proposerAddress, finalSystemOwner, batchSenderAddress, p2pSequencerAddress, l2BlockTime!, L2_GASLIMIT, L2_OO_SUBMISSION_INTERVAL, FINALIZATION_PERIOD_SECONDS, l2OOStartingBlockNumber!, l2OOStartingTimestamp!]
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setBuildSuccess(`Verse build is successful. build transaction (${tx.hash})`);
        setNewChainId(undefined);
        setFinalSystemOwner('');
        setProposerAddress('');
        setBatchSenderAddress('');
        setP2PSequencerAddress('');
        setL2BlockTime(undefined);
        setL2OOStartingBlockNumber(undefined);
        setL2OOStartingTimestamp(undefined);
        setBuildError('');
        setIsBuilding(false);
      }
    } catch (err) {
      setIsBuilding(false);
      handleError(err, setBuildError);
    }
  };

  const buildInputs = [
    {
      placeholder: 'set verse chain_id',
      value: newChainId?.toString() || '',
      inputType: InputType.Number,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setNewChainId(Number(e.target.value))},
    },
    {
      placeholder: 'set final system owner',
      value: finalSystemOwner,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setFinalSystemOwner(e.target.value)},
    },
    {
      placeholder: 'set proposer address',
      value: proposerAddress,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setProposerAddress(e.target.value)},
    },
    {
      placeholder: 'set batch sender address',
      value: batchSenderAddress,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setBatchSenderAddress(e.target.value)},
    },
    {
      placeholder: 'set p2p sequencer address',
      value: p2pSequencerAddress,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setP2PSequencerAddress(e.target.value)},
    },
    {
      placeholder: 'set L2 Block Time (range of 1 to 7)',
      value: l2BlockTime?.toString() || '',
      inputType: InputType.Number,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setL2BlockTime(Number(e.target.value))},
    },
    {
      placeholder: 'set L2 Output Oracle Starting Block Number',
      value: l2OOStartingBlockNumber?.toString() || '',
      inputType: InputType.Number,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setL2OOStartingBlockNumber(Number(e.target.value))},
    },
    {
      placeholder: 'set L2 Output Oracle Starting Block Timestamp (sec)',
      value: l2OOStartingTimestamp?.toString() || '',
      inputType: InputType.Number,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setL2OOStartingTimestamp(Number(e.target.value))},
    },
  ];
  const buildButtons = [
    {
      handleClick: build,
      disabled: !finalSystemOwner || !batchSenderAddress || !p2pSequencerAddress || !proposerAddress || !l2BlockTime || !(l2OOStartingBlockNumber || l2OOStartingBlockNumber === 0) || !(l2OOStartingTimestamp || l2OOStartingTimestamp === 0) || isBuilding,
      value: 'Build',
    }
  ];

  return (
    <>
      {isBuilding &&
        <LoadingModal />
      }
      {!isBuilding &&
        <Modal
          setModalState={setModalState}
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
      }
    </>
  )
};
