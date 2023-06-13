import clsx from 'clsx';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { LinkTab } from '@/components/atoms';

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
  },
  {
    text: 'Build verse',
    url: '/',
  },
  {
    text: 'Check verse',
    url: '/check-verse',
  },
  {
    text: 'Update bridge contract',
    url: '/update-bridge',
  }
];

export const Sidebar = (props: Props) => {
  const router = useRouter();
  const { className } = props;

  return (
    <div className={clsx(className, 'bg-green-500')}>
      <div className='mt-2 md:mt-4 space-y-10'>
        <Image
          src='/images/oasys.png'
          alt='Oasys logo'
          width={250}
          height={250}
        />
        <div>
          {Links.map(({ text, url }, index) => {
            const isChosen = url === router.pathname;
            return (
              <LinkTab text={text} url={url} isChosen={isChosen} key={index} />
            );
          })}
        </div>
      </div>
    </div>
  );
};
