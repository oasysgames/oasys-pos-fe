import { ReactNode } from "react";
import clsx from 'clsx';

type Props = {
  disabled?: boolean;
  children: ReactNode
  handleClick: () => void;
};

export const Button = (props: Props) =>  {
  const {
    disabled,
    children,
    handleClick
  } = props;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={clsx(
          'bg-blue-500',
          'hover:bg-blue-700',
          'text-white',
          'rounded',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        { children }
      </button>
    </div>
  );
};
