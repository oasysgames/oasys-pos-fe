import { ChangeEvent } from "react";
import clsx from 'clsx';

type Props = {
  text: string;
  className?: string;
};

export const PageTitle = (props: Props) =>  {
  const {
    text,
    className,
  } = props;

  return (
    <h1
      className={clsx(
        className,
        'text-4xl'
      )}
    >
      {text}
    </h1>
  );
};
