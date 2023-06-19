import clsx from 'clsx';
import { Button, ErrorMsg } from '@/components/atoms';
import { getNetworkName, getAbbreviatedAddress } from '@/features';

type Props = {
  className?: string;
  ownerError: string;
  ownerAddress?: string;
  chainId?: number;
  setOwner: () => Promise<void>;
};

export const WalletConnect = (props: Props) => {
  const { className, ownerError, ownerAddress, chainId, setOwner } = props;

  return (
    <div className={clsx(className)}>
      {ownerError && <ErrorMsg text={ownerError} className='w-full' />}
      {(!ownerAddress || !chainId) && 
        <div className='flex items-center space-x-2'>
          <Button handleClick={setOwner}>Connect</Button>
        </div>
      }
      {(ownerAddress && chainId) && 
        <div className='flex justify-start'>
          <div
            className={clsx(
              'bg-green-500',
              'text-white',
              'rounded-full',
              'font-bold',
              'py-2 px-4',
              'flex flex-col items-center'
            )}
          >
            <p>Connected: {getAbbreviatedAddress(ownerAddress)}</p>
            <p>Network: {getNetworkName(chainId)}</p>
          </div>
        </div>
      }
    </div>
  );
};
