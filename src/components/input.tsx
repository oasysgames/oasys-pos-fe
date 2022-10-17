import { ChangeEvent } from "react";
import clsx from 'clsx';

type Props = {
  value: string;
  placeholder: string;
  disabled?: boolean;
  handleClick: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Input = (props: Props) =>  {
  const {
    value,
    placeholder,
    disabled,
    handleClick,
  } = props;

  return (
    <div>
      <input
      placeholder={placeholder}
      value={value}
      onChange={handleClick}
        disabled={disabled}
        className={clsx(
          'border',
        )}
      type="text" />
    </div>
  );
};
