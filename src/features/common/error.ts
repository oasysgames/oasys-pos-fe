import { ContractError } from "@/types/error";

export function isContractError(err: any): err is ContractError {
  if (typeof err.code !== 'string') return false;
  if (typeof err.reason !== 'string') return false;
  return true;
}

export const handleError = (err: any, callback: (message: string) => void) => {
  if (isContractError(err)) {
    callback(err.reason);
    return;
  }
  if (err instanceof Error) {
    callback(err.message);
  }
};