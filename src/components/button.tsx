import { ReactNode } from "react";
import clsx from 'clsx';

type Props = {
  disabled?: boolean;
  children: ReactNode
  handleClick: () => void;
  className?: string;
};

export const Button = (props: Props) =>  {
  const {
    disabled,
    children,
    handleClick,
    className,
  } = props;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        className,
        'bg-blue-500',
        'hover:bg-blue-700',
        'text-white',
        'rounded',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      { children }
    </button>
  );
};
