import { NamedAddresses } from "../oasysHub/verseBuild";
import { Genesis } from "./genesis";

export type VerseInfo = {
  chainId: number;
  namedAddresses: NamedAddresses;
  geneses: Genesis[];
}