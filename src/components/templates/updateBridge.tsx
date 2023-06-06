import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { Button, ErrorMsg, Select, Textarea } from '@/components/atoms';
import { BuildVerseModal } from '../organisms';
import { handleError } from '@/features';

type BytecodeOption = {
  label: string;
  value: string;
}

type Props = {
  className?: string;
  title: string;
  bridgeProxyAddress: string;
  updateBridgeContractMethod: (bridgeProxyAddress: string, bytecode: string) => Promise<void>;
  bytecodeOptions: BytecodeOption[];
};

export const UpdateBridgeContract = ({ className, title, bridgeProxyAddress, updateBridgeContractMethod, bytecodeOptions }: Props) => {
  const bytecodeSettingOptionValues = {
    selectBytecode: 'selectBytecode',
    inputBytecode: 'inputBytecode',
  }
  const bytecodeSettingOptions = [
    { value: bytecodeSettingOptionValues.selectBytecode, label: 'Select bridge contract bytecode' },
    { value: bytecodeSettingOptionValues.inputBytecode, label: 'Input your bridge contract bytecode' },
  ];
  const selectedBytecodeDefault = bytecodeOptions[0].value;

  const [selectedBytecodeSetting, setSelectedBytecodeSetting] = useState(bytecodeSettingOptionValues.selectBytecode);
  const [selectedBytecode, setSelectedBytecode] = useState(selectedBytecodeDefault);
  const [inputBytecode, setInputBytecode] = useState('');
  const [newBridgeContractBytecode, setNewBridgeContractBytecode] = useState(selectedBytecodeDefault);
  const [updateBridgeError, setUpdateBridgeError] = useState('');
  
  const handleClick = async () => {
    try {
      console.log('newBridgeContractBytecode', newBridgeContractBytecode);
      await updateBridgeContractMethod(bridgeProxyAddress, newBridgeContractBytecode);
    } catch (err) {
      handleError(err, setUpdateBridgeError);
    }
  };

  const handleSelectBytecodeSetting = (e: ChangeEvent<HTMLSelectElement>) => {
    const setting = e.target.value;
    setSelectedBytecodeSetting(setting);
    setNewBridgeContractBytecode(
      setting === bytecodeSettingOptionValues.selectBytecode
        ? selectedBytecode
        : inputBytecode
    );
  }

  const handleSelectBytecode = (e: ChangeEvent<HTMLSelectElement>) => {
    const bytecode = e.target.value;
    setSelectedBytecode(bytecode);
    setNewBridgeContractBytecode(bytecode);
  }

  const handleInputBytecode = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const bytecode = e.target.value;
    setInputBytecode(bytecode);
    setNewBridgeContractBytecode(bytecode);
  }

  return (
    <div className={clsx(
      className,
    )}>
      <p>{title}</p>
      { updateBridgeError && (
        <ErrorMsg text={ updateBridgeError } className='w-full' />
      )}
      <div>
        <Select options={bytecodeSettingOptions} value={selectedBytecodeSetting} handleClick={handleSelectBytecodeSetting} />
      </div>
      {selectedBytecodeSetting === bytecodeSettingOptionValues.selectBytecode &&
        <div>
          <Select options={bytecodeOptions} value={selectedBytecode} handleClick={handleSelectBytecode} />
          <Textarea
            value={selectedBytecode}
            placeholder={''}
            disabled={true}
            handleClick={() => {}}
          />
        </div>
      }
      {selectedBytecodeSetting === bytecodeSettingOptionValues.inputBytecode &&
        <div>
          <Textarea
            value={inputBytecode}
            placeholder={''}
            handleClick={handleInputBytecode}
          />
        </div>
      }
      <Button
        handleClick={handleClick}
      >
        Update Bridge Contract
      </Button>
    </div>
  )
};
