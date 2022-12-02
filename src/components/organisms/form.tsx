import clsx from 'clsx';
import { ChangeEvent } from 'react';
import { Button, Input } from '@/components/atoms';

type InputProps = {
  placeholder: string;
  value: string;
  handleClick: (e: ChangeEvent<HTMLInputElement>) => void;
}

type ButtonProps = {
  handleClick: () => void;
  disabled: boolean;
  value: string;
}

type Props = {
  className?: string;
  inputs: InputProps[];
  buttons: ButtonProps[];
};

export const Form = (props: Props) => {
  const {
    className,
    inputs,
    buttons,
  } = props;

  return (
    <div className={clsx(
      className,
    )}>
      {inputs.map(({ placeholder, value, handleClick }, index) => {
        return (
          <Input
            key={index}
            placeholder={placeholder}
            value={value}
            handleClick={handleClick}
            className='w-full'
          />
        )
      })}
      <div className="flex items-center space-x-2">
        {buttons.map(({ handleClick, disabled, value}, index) => {
          return (
            <Button
              key={index}
              handleClick={handleClick}
              disabled={ disabled }
            >
              {value}
            </Button>
          )
        })}
      </div>
    </div>
  );
};
