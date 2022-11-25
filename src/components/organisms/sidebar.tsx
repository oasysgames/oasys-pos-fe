import clsx from 'clsx';
import { useRouter } from 'next/router';
import { LinkTab } from '../atoms';

type Props = {
  className?: string;
};

const Links = [
  {
    text: 'Claim sOAS',
    url: '/sOAS',
  },
  {
    text: 'Claim lOAS',
    url: '/lOAS',
  },
  {
    text: 'Join validator',
    url: '/validator',
  }
];

export const Sidebar = (props: Props) => {
  const router = useRouter();
  const {
    className,
  } = props;

  return (
    <div className={clsx(
      className,
      'bg-green-500',
    )}>
      <div className='mt-16 md:mt-32'>
        {Links.map(({ text, url }, index) => {
          const isChosen = url === router.pathname;
          return (
            <LinkTab text={text} url={url} isChosen={isChosen} key={index} />
          );
        })}
      </div>
    </div>
  );
};
