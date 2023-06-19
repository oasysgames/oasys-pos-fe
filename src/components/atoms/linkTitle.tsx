import clsx from 'clsx';

type Props = {
  title: string;
};

export const LinkTitle = (props: Props) => {
  const { title } = props;

  return (
    <div
      className={clsx(
        'text-gray-500',
        'leading-8',
        'pl-1 pr-1',
        'text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg',
        'flex',
        'items-center',
        'font-bold',
        'bg-green-500',
      )}
    >
      {title}
    </div>
  );
};
