import { ethers } from "ethers";

export interface ClaimInfo {
  amount: ethers.BigNumber;
  claimed: ethers.BigNumber;
  claimable: ethers.BigNumber;
  renounceable: ethers.BigNumber;
  since: Date;
  until: Date;
  from: string;
}
