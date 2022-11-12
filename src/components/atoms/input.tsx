import { ChangeEvent } from "react";
import clsx from 'clsx';

type Props = {
  value: string;
  placeholder: string;
  disabled?: boolean;
  handleClick: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export const Input = (props: Props) =>  {
  const {
    value,
    placeholder,
    disabled,
    handleClick,
    className,
  } = props;

  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={handleClick}
      disabled={disabled}
      className={clsx(
        className,
        'border',
      )}
      type="text"
    />
  );
};
