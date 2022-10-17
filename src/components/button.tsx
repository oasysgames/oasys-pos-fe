import { ReactNode } from "react";

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
      >
        { children }
      </button>
    </div>
  );
};
