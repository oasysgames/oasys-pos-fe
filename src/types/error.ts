export interface ContractError extends Error {
  code: string;
  reason: string;
}
