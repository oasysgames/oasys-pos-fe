export const isValidTxHash = (s: string) => {
  if (!/^0x[a-fA-F0-9]{64}$/.test(s))
    throw new Error("Invalid transaction format");
}