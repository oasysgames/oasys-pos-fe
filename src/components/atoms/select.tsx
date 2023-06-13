import { ChangeEvent } from "react";
import clsx from 'clsx';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  value: string;
  handleClick: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
};

export const Select = (props: SelectProps) => {
  const { options, value, handleClick, className } = props;

  return (
    <select
      value={value}
      onChange={handleClick}
      className={clsx(
        className
      )}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
