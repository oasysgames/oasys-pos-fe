import { ChangeEvent } from 'react';
import clsx from 'clsx';

type TextareaProps = {
  value: string;
  placeholder: string;
  disabled?: boolean;
  handleClick: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export const Textarea: React.FC<TextareaProps> = ({
  value,
  placeholder,
  disabled,
  handleClick,
  className,
}) => {
  // const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
  //   onChange(event);
  // };

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={handleClick}
      disabled={disabled}
      className={clsx(
        className,
        'border',
        'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-4 focus:outline-green-500 focus:shadow-outline',
      )}
    />
  );
};
