import { ethers } from "ethers";
import type { Provider as AppKitProvider } from "@reown/appkit/react";
import type { ExternalProvider } from "@ethersproject/providers";
import { isNotConnectedMsg } from "@/consts";

// Extend the Window interface to store the AppKit walletProvider
declare global {
  interface Window {
    _appKitWalletProvider?: AppKitProvider;
  }
}

/**
 * Register the AppKit walletProvider for global access.
 * Call this once with the provider obtained from AppKit.
 */
export function registerAppKitProvider(provider?: AppKitProvider) {
  window._appKitWalletProvider = provider;
}

/**
 * Get the ethers.js Web3Provider using the registered AppKit provider.
 * Throws an error if the provider has not been registered.
 */
export async function getProvider(): Promise<ethers.providers.Web3Provider> {
  const appKitProvider = window._appKitWalletProvider;
  if (!appKitProvider) {
    throw new Error(isNotConnectedMsg);
  }
  return new ethers.providers.Web3Provider(
    appKitProvider as ExternalProvider,
    "any"
  );
}

/**
 * Get the ethers.js Signer after requesting account access.
 * Throws an error if the provider has not been registered.
 */
export async function getSigner(): Promise<ethers.Signer> {
  const provider = await getProvider();
  const accounts: Array<string> = await provider.listAccounts();
  if (accounts.length === 0)  {
    throw new Error(isNotConnectedMsg);
  }
  return provider.getSigner();
}
