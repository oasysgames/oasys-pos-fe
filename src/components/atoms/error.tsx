import clsx from 'clsx';

type Props = {
  text: string;
  className?: string;
};

export const ErrorMsg = (props: Props) =>  {
  const {
    text,
    className,
  } = props;

  return (
    <p className={clsx(
      className,
      'text-red-600'
    )}>{ text }</p>
  );
};
