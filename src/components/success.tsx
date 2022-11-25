import clsx from 'clsx';

type Props = {
  text: string;
  className?: string;
};

export const SuccessMsg = (props: Props) =>  {
  const {
    text,
    className
  } = props;

  return (
    <p className={clsx(
      className,
      "text-green-600"
    )}>{text}</p>
  );
};
