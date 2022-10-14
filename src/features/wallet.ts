import { ethers } from 'ethers';

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('connect to metamask');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
};

export const getSigner = () => {
  const provider = getProvider();
  const signer = provider.getSigner();
  return signer;
}
