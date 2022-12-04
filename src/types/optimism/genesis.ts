import { ethers } from "ethers";

export interface GenesisParams {
  chainId: ethers.BigNumber;
  ovmWhitelistOwner: string;
  ovmGasPriceOracleOwner: string;
  ovmFeeWalletAddress: string;
  ovmBlockSignerAddress: string;
  gasPriceOracleL2GasPrice: number;
  gasPriceOracleL1BaseFee: number;
  gasPriceOracleOverhead: number;
  gasPriceOracleScalar: number;
  gasPriceOracleDecimals: number;
  l2BlockGasLimit: number;
  homesteadBlock: number;
  eip150Block: number;
  eip155Block: number;
  eip158Block: number;
  byzantiumBlock: number;
  constantinopleBlock: number;
  petersburgBlock: number;
  istanbulBlock: number;
  muirGlacierBlock: number;
  berlinBlock: number;
  period: number;
  epoch: number;
}