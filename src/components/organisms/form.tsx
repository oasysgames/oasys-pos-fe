import clsx from 'clsx';
import { ChangeEvent } from 'react';
import { Button, Input, InputType } from '@/components/atoms';

type InputProps = {
  placeholder: string;
  value: string;
  inputType?: InputType;
  handleClick: (e: ChangeEvent<HTMLInputElement>) => void;
};

type ButtonProps = {
  handleClick: () => void;
  disabled: boolean;
  value: string;
};

type Props = {
  className?: string;
  inputs: InputProps[];
  buttons: ButtonProps[];
};

export const Form = (props: Props) => {
  const { className, inputs, buttons } = props;

  return (
    <div className={clsx(className, 'space-y-1')}>
      <div className='space-y-0.5'>
        {inputs.map(({ placeholder, value, inputType, handleClick }, index) => {
          return (
            <Input
              key={index}
              placeholder={placeholder}
              value={value}
              handleClick={handleClick}
              inputType={inputType}
              className='w-full'
            />
          );
        })}
      </div>
      <div className='flex items-center space-x-2'>
        {buttons.map(({ handleClick, disabled, value }, index) => {
          return (
            <Button key={index} handleClick={handleClick} disabled={disabled}>
              {value}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
