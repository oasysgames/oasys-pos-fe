import clsx from 'clsx';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { SidebarNavigation } from '@/components/organisms';

type Props = {
  className?: string;
};

const validatorLinks = [
  {
    text: 'Check Validator',
    url: '/check-validator',
  },
  {
    text: 'Join Validator',
    url: '/join-validator',
  },
  {
    text: 'Claim Commissions',
    url: '/claim-commissions',
  },
];

const verseBuilderLinks = [
  {
    text: 'Deposit OAS',
    url: '/',
  },
  {
    text: 'Build Verse',
    url: '/build-verse',
  },
  {
    text: 'Check Verse',
    url: '/check-verse',
  },
  // Remove the /update-bridge link from the sidebar
  // Although allowed to access to via direct link
  // {
  //   text: 'Update bridge contract',
  //   url: '/update-bridge',
  // }
];

const soasLinks = [
  {
    text: 'Claim SOAS',
    url: '/sOAS',
  },
  {
    text: 'Renounce SOAS',
    url: '/sOAS-renounce',
  },
];

const loasLinks = [
  {
    text: 'Claim LOAS',
    url: '/lOAS',
  },
  {
    text: 'Renounce LOAS',
    url: '/lOAS-renounce',
  },
];

export const Sidebar = (props: Props) => {
  const router = useRouter();
  const { className } = props;

  return (
    <div className={clsx(className, 'bg-green-500')}>
      <div className='mt-2 mb-2 md:mt-4 md:mb-4 space-y-10'>
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
            linkTitle='SOAS'
            links={soasLinks}
          />
          <SidebarNavigation
            linkTitle='LOAS'
            links={loasLinks}
          />
        </div>
      </div>
    </div>
  );
};
