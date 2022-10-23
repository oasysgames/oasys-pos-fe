import { ethers } from 'ethers';

export const getProvider = async () => {
  if (!window.ethereum) {
    throw new Error('connect to metamask');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  return provider;
};

export const getSigner = async () => {
  const provider = await getProvider();
  const signer = provider.getSigner();
  return signer;
}
