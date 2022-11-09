import { ChangeEvent } from "react";
import clsx from 'clsx';

type Props = {
  text: string;
};

export const PageTitle = (props: Props) =>  {
  const {
    text,
  } = props;

  return (
    <div>
      <h1
        className={clsx(
          'text-4xl'
        )}
      >
        {text}
      </h1>
    </div>
  );
};
