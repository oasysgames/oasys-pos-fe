export interface GenesisParams {
  chainId: number;
  ovmWhitelistOwner: string;
  ovmGasPriceOracleOwner: string;
  ovmFeeWalletAddress: string;
  ovmBlockSignerAddress: string;
  gasPriceOracleL2GasPrice: number;
  gasPriceOracleL1BaseFee: number;
  gasPriceOracleOverhead: number;
  gasPriceOracleScalar: number;
  gasPriceOracleDecimals: number;
  hfBerlinBlock: number;
  l2BlockGasLimit: number;
}