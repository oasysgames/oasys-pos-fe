import { ChangeEvent} from "react";

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
      type="text" />
    </div>
  );
};
