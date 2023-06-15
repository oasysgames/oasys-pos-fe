import clsx from 'clsx';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { SidebarNavigation } from '@/components/organisms';

type Props = {
  className?: string;
};

const validatorLinks = [
  {
    text: 'Join validator',
    url: '/validator',
  },
];

const verseBuilderLinks = [
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

const otherLinks = [
  {
    text: 'Claim sOAS',
    url: '/sOAS',
  },
  {
    text: 'Claim lOAS',
    url: '/lOAS',
  },
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
        <div className='space-y-8'>
          <SidebarNavigation
            linkTitle='Validators'
            links={validatorLinks}
          />
          <SidebarNavigation
            linkTitle='Verse Builders'
            links={verseBuilderLinks}
          />
          <SidebarNavigation
            linkTitle='Others'
            links={otherLinks}
          />
        </div>
      </div>
    </div>
  );
};
