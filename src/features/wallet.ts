import { ethers } from 'ethers';

export const getProvider = async () => {
  if (!window.ethereum) {
    throw new Error('Make sure you have MetaMask!');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
};

export const getSigner = async () => {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return signer;
}
