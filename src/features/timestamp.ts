export const formattedDate = (date: Date) => {
  const formattedDate = `
    ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()},
    ${date.getHours()}:${formattedMinutes(date.getMinutes())}
  `;
  return formattedDate;
};

const formattedMinutes = (minutes: number) => {
  return String(minutes).padStart(2, '0');
};
