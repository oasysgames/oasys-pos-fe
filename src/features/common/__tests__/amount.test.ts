import { ethers } from "ethers";
import { formatWeiAmount } from "../amount";

describe('formatWeiAmount', () => {
  it('should correctly format a number with no decimal part and no comma', () => {
    const weiAmount = ethers.utils.parseEther('1');
    const formattedAmount = formatWeiAmount(weiAmount);
    expect(formattedAmount).toBe('1.000');
  });

  it('should correctly format a number with no decimal part', () => {
    const weiAmount = ethers.utils.parseEther('1234567');
    const formattedAmount = formatWeiAmount(weiAmount);
    expect(formattedAmount).toBe('1,234,567.000');
  });

  it('should correctly format a number with decimal part', () => {
    const weiAmount = ethers.utils.parseEther('1234567.89');
    const formattedAmount = formatWeiAmount(weiAmount);
    expect(formattedAmount).toBe('1,234,567.890');
  });

  it('should correctly format a number with more than three decimal places', () => {
    const weiAmount = ethers.utils.parseEther('1234567.89123');
    const formattedAmount = formatWeiAmount(weiAmount);
    expect(formattedAmount).toBe('1,234,567.891');
  });
});