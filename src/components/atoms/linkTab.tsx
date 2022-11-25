import Link from 'next/link';
import clsx from 'clsx';

type Props = {
  text: string;
  url: string;
  isChosen: boolean;
};

export const LinkTab = (props: Props) => {
  const {
    text,
    url,
    isChosen,
  } = props;

  return (
      <Link href={url}>
        <a
          className={clsx(
            'text-white',
            'h-12',
            'text-sm md:text-base lg:text-lg xl:text-xl lg:text-lg',
            'flex',
            'items-center',
            isChosen ? 'bg-green-200' : 'bg-green-500',
          )}
        >
          {text}
        </a>
      </Link>
  );
};
