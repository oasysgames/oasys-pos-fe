/**
 * @defi-wonderland/smock
 * https://github.com/defi-wonderland/smock/blob/9cffea640c4bd5ddc09a638505f6bb0a0cebdbad/src/utils/hex-utils.ts
 */

import { Buffer } from 'buffer';
import { BigNumber } from 'ethers';

const remove0x = (str: string): string => {
  if (str === undefined) {
    return str;
  }
  return str.startsWith('0x') ? str.slice(2) : str;
};

const bigNumberToHex = (bn: BigNumber) => {
  let bi = BigInt(bn.toBigInt());

  var pos = true;
  if (bi < 0) {
    pos = false;
    bi = bitnot(bi);
  }

  var hex = bi.toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  if (pos && 0x80 & parseInt(hex.slice(0, 2), 16)) {
    hex = '00' + hex;
  }

  return hex;
};

const bitnot = (bi: BigInt) => {
  var bin = (-bi).toString(2);
  var prefix = '';
  while (bin.length % 8) {
    bin = '0' + bin;
  }
  if ('1' === bin[0] && -1 !== bin.slice(1).indexOf('1')) {
    prefix = '11111111';
  }
  bin = bin
    .split('')
    .map((i) => {
      return '0' === i ? '1' : '0';
    })
    .join('');
  return BigInt('0b' + prefix + bin) + BigInt(1);
};

const fromHexString = (inp: Buffer | string): Buffer => {
  if (typeof inp === 'string' && inp.startsWith('0x')) {
    return Buffer.from(inp.slice(2), 'hex');
  }

  return Buffer.from(inp);
};

export { remove0x, bigNumberToHex, bitnot, fromHexString };
