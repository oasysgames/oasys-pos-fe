import clsx from 'clsx';
import { Button, ErrorMsg } from '@/components/atoms';

type Props = {
  className?: string;
  ownerError: string;
  ownerAddress: string;
  setOwner: () => Promise<void>;
};

export const WalletConnect = (props: Props) => {
  const {
    className,
    ownerError,
    ownerAddress,
    setOwner,
  } = props;

  return (
    <div className={clsx(
      className,
    )}>
      {ownerError && (
        <ErrorMsg text={ ownerError } className='w-full' />
      )}
      <p>Address:  {ownerAddress}</p>
      <div className="flex items-center space-x-2">
        <Button
          handleClick={setOwner}
        >
          Connect
        </Button>
      </div>
    </div>
  );
};
