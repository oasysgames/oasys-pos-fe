import clsx from 'clsx';
import { useRouter } from 'next/router';
import { LinkTab, LinkTitle } from '@/components/atoms';

type LinkData = {
  text: string;
  url: string;
};

type Props = {
  linkTitle: string;
  links: LinkData[];
  className?: string;
};

export const SidebarNavigation = (props: Props) => {
  const router = useRouter();
  const { linkTitle, links, className } = props;

  return (
    <div className={clsx(className, 'space-y-1')}>
      <LinkTitle title={linkTitle} />
      <div className='space-y-2'>
        {links.map(({ text, url }, index) => {
          const isChosen = url === router.pathname;
          return (
            <LinkTab text={text} url={url} isChosen={isChosen} key={index} />
          );
        })}
      </div>
    </div>
  );
};
