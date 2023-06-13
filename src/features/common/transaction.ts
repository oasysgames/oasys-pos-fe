export const isTxHash = (s: string): boolean => /^0x[a-fA-F0-9]{64}$/.test(s);

export const isAddress = (s: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(s);
