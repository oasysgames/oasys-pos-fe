export const getAbbreviatedAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}
