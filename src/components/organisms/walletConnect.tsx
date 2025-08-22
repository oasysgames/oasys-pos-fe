import { useEffect } from 'react';
import { Button } from '@/components/atoms';
import {
  getNetworkName,
  getAbbreviatedAddress,
  registerAppKitProvider,
} from '@/features';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
  useDisconnect,
} from '@reown/appkit/react';
import type { Provider as AppKitProvider } from '@reown/appkit/react';

type Props = {
  handleAccountsChanged?: () => Promise<void>;
  handleChainChanged?: () => Promise<void>;
};

export const WalletConnect = (props: Props) => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount({ namespace: 'eip155' });
  const { walletProvider } = useAppKitProvider<AppKitProvider>('eip155');
  const { chainId } = useAppKitNetwork();
  const { disconnect } = useDisconnect();

  // Register or unregister the AppKit provider when connection state changes
  useEffect(() => {
    registerAppKitProvider(isConnected ? walletProvider : undefined);
  }, [isConnected, walletProvider]);

  // Attach event listeners directly to the wallet provider
  useEffect(() => {
    if (!walletProvider) return;

    // Register event listener for account changes
    if (props.handleAccountsChanged) {
      walletProvider.on('accountsChanged', props.handleAccountsChanged);
    }
    // Register event listener for chain changes
    if (props.handleChainChanged) {
      walletProvider.on('chainChanged', props.handleChainChanged);
    }

    // Cleanup listeners on unmount or provider change
    return () => {
      if (props.handleAccountsChanged) {
        walletProvider.removeListener(
          'accountsChanged',
          props.handleAccountsChanged,
        );
      }
      if (props.handleChainChanged) {
        walletProvider.removeListener('chainChanged', props.handleChainChanged);
      }
    };
  }, [walletProvider, props.handleAccountsChanged, props.handleChainChanged]);

  return (
    <div className='space-y-0.5 col-span-4 col-start-3'>
      {!isConnected && (
        <div className='flex items-center space-x-2'>
          <Button
            handleClick={() => open({ view: 'Connect', namespace: 'eip155' })}
          >
            Connect
          </Button>
        </div>
      )}
      {isConnected && (
        <div className='flex justify-start'>
          <Button handleClick={() => disconnect({ namespace: 'eip155' })}>
            <p>Connected: {getAbbreviatedAddress(address!)}</p>
            <p>Network: {getNetworkName(Number(chainId))}</p>
          </Button>
        </div>
      )}
    </div>
  );
};
