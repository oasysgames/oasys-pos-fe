import { BigNumber, ethers } from "ethers";

export const formatWeiAmount = (weiAmount: BigNumber) => {
  const amount = ethers.utils.formatEther(weiAmount);

  const decimalIndex = amount.indexOf(".");
  let integerPart = amount;
  let decimalPart = "";

  if (decimalIndex !== -1) {
    integerPart = amount.slice(0, decimalIndex);
    decimalPart = amount.slice(decimalIndex + 1, decimalIndex + 4); // Display only 3 decimal places
  }

  // If the decimal part has less than 3 digits, pad it with zeros
  while (decimalPart.length < 3) {
    decimalPart += '0';
  }

  // Add commas to the integer part every 3 digits
  const numberWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Concatenate the integer and decimal parts with a dot
  const formattedNumber = decimalPart.length > 0 ? `${numberWithCommas}.${decimalPart}` : numberWithCommas;

  return formattedNumber;
}
