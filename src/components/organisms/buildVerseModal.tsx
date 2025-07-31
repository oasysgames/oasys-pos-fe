import { ethers } from 'ethers';
import { ChangeEvent, SetStateAction, useState } from 'react';
import {
  L2_GASLIMIT,
  L2_OO_SUBMISSION_INTERVAL,
  FINALIZATION_PERIOD_SECONDS,
  L2BlockTimeRange,
} from '@/consts';
import { getL1BuildAgentContract, handleError, getProvider } from '@/features';
import { ErrorMsg, SuccessMsg, Modal, InputType } from '@/components/atoms';
import { Form, LoadingModal } from '@/components/organisms';
import { IL1BuildAgent } from '@/types/contracts/L1BuildAgent';

type Props = {
  className?: string;
  setModalState: (value: SetStateAction<boolean>) => void;
};

const [L2_BLOCK_TIME_START, L2_BLOCK_TIME_END] = L2BlockTimeRange;

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
  const [messageRelayer, setMessageRelayer] = useState('');
  const [l2BlockTime, setL2BlockTime] = useState<number>();

  const build = async () => {
    const isLegacy = false;
    const L1BuildAgentContract = await getL1BuildAgentContract(isLegacy);

    try {
      setIsBuilding(true);

      if (
        l2BlockTime! < L2_BLOCK_TIME_START ||
        l2BlockTime! > L2_BLOCK_TIME_END
      ) {
        throw new Error(
          `L2 Block Time must be between ${L2_BLOCK_TIME_START} and ${L2_BLOCK_TIME_END}`,
        );
      }

      // At first, set default Values
      // Correct values are expected to be set via another button
      const l2OOStartingBlockNumber = 0;
      const l2OOStartingTimestamp = (await (await getProvider()).getBlock('latest')).timestamp;

      // Create the config object matching the BuildConfigStruct interface
      const buildConfig: IL1BuildAgent.BuildConfigStruct = {
        finalSystemOwner: finalSystemOwner,
        l2OutputOracleProposer: proposerAddress,
        l2OutputOracleChallenger: finalSystemOwner,
        batchSenderAddress: batchSenderAddress,
        p2pSequencerAddress: p2pSequencerAddress,
        messageRelayer: messageRelayer,
        l2BlockTime: l2BlockTime!,
        l2GasLimit: L2_GASLIMIT,
        l2OutputOracleSubmissionInterval: L2_OO_SUBMISSION_INTERVAL,
        finalizationPeriodSeconds: FINALIZATION_PERIOD_SECONDS,
        l2OutputOracleStartingBlockNumber: l2OOStartingBlockNumber,
        l2OutputOracleStartingTimestamp: l2OOStartingTimestamp,
      }

      const tx: ethers.providers.TransactionResponse = await L1BuildAgentContract.build(
        newChainId!,
        buildConfig
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setBuildSuccess(`Verse build is successful. build transaction (${tx.hash})`);
        setNewChainId(undefined);
        setFinalSystemOwner('');
        setProposerAddress('');
        setBatchSenderAddress('');
        setP2PSequencerAddress('');
        setMessageRelayer('');
        setL2BlockTime(undefined);
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
      placeholder: 'set message relayer address',
      value: messageRelayer,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => {setMessageRelayer(e.target.value)},
    },
    {
      placeholder: `set L2 Block Time (range of ${L2_BLOCK_TIME_START} to ${L2_BLOCK_TIME_END})`,
      value: l2BlockTime?.toString() || '',
      inputType: InputType.Number,
      handleClick: (e: ChangeEvent<HTMLInputElement>) => { setL2BlockTime(Number(e.target.value)) },
    },
  ];
  const buildButtons = [
    {
      handleClick: build,
      disabled: !finalSystemOwner || !batchSenderAddress || !p2pSequencerAddress || !proposerAddress || !messageRelayer || !l2BlockTime || isBuilding,
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
