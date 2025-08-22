import { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  disabled?: boolean;
  children: ReactNode;
  handleClick: () => void;
  className?: string;
};

export const Button = (props: Props) => {
  const { disabled, children, handleClick, className } = props;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        'bg-green-500',
        'hover:bg-green-700',
        'text-white',
        'rounded-full',
        'font-bold',
        'py-2 px-4',
        className,
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  );
};
