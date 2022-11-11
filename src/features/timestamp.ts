export const formattedDate = (date: Date) => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
