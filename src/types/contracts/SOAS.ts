/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface SOASInterface extends utils.Interface {
  functions: {
    "allow(address,address[])": FunctionFragment;
    "allow(address,address)": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "allowedAddresses(uint256)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "claim(uint256)": FunctionFragment;
    "claimInfo(address)": FunctionFragment;
    "decimals()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "getClaimableOAS(address)": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "mint(address,uint64,uint64)": FunctionFragment;
    "name()": FunctionFragment;
    "originalClaimer(address)": FunctionFragment;
    "renounce(uint256)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transfer(address[],uint256[])": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferFrom(address[],address[],uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "allow(address,address[])"
      | "allow(address,address)"
      | "allowance"
      | "allowedAddresses"
      | "approve"
      | "balanceOf"
      | "claim"
      | "claimInfo"
      | "decimals"
      | "decreaseAllowance"
      | "getClaimableOAS"
      | "increaseAllowance"
      | "mint"
      | "name"
      | "originalClaimer"
      | "renounce"
      | "symbol"
      | "totalSupply"
      | "transfer(address,uint256)"
      | "transfer(address[],uint256[])"
      | "transferFrom(address,address,uint256)"
      | "transferFrom(address[],address[],uint256[])"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "allow(address,address[])",
    values: [string, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "allow(address,address)",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowedAddresses",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "claim", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "claimInfo", values: [string]): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getClaimableOAS",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "originalClaimer",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounce",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer(address,uint256)",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transfer(address[],uint256[])",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom(address,address,uint256)",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom(address[],address[],uint256[])",
    values: [string[], string[], BigNumberish[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "allow(address,address[])",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "allow(address,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "allowedAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClaimableOAS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "originalClaimer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "renounce", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transfer(address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transfer(address[],uint256[])",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom(address[],address[],uint256[])",
    data: BytesLike
  ): Result;

  events: {
    "Allow(address,address)": EventFragment;
    "Approval(address,address,uint256)": EventFragment;
    "Claim(address,uint256)": EventFragment;
    "Mint(address,uint256,uint256,uint256)": EventFragment;
    "Renounce(address,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Allow"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Claim"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Mint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Renounce"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export interface AllowEventObject {
  original: string;
  transferable: string;
}
export type AllowEvent = TypedEvent<[string, string], AllowEventObject>;

export type AllowEventFilter = TypedEventFilter<AllowEvent>;

export interface ApprovalEventObject {
  owner: string;
  spender: string;
  value: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface ClaimEventObject {
  holder: string;
  amount: BigNumber;
}
export type ClaimEvent = TypedEvent<[string, BigNumber], ClaimEventObject>;

export type ClaimEventFilter = TypedEventFilter<ClaimEvent>;

export interface MintEventObject {
  to: string;
  amount: BigNumber;
  since: BigNumber;
  until: BigNumber;
}
export type MintEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  MintEventObject
>;

export type MintEventFilter = TypedEventFilter<MintEvent>;

export interface RenounceEventObject {
  holder: string;
  amount: BigNumber;
}
export type RenounceEvent = TypedEvent<
  [string, BigNumber],
  RenounceEventObject
>;

export type RenounceEventFilter = TypedEventFilter<RenounceEvent>;

export interface TransferEventObject {
  from: string;
  to: string;
  value: BigNumber;
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface SOAS extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SOASInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    "allow(address,address[])"(
      original: string,
      alloweds: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "allow(address,address)"(
      original: string,
      allowed: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    allowedAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    claim(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    claimInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, string] & {
        amount: BigNumber;
        claimed: BigNumber;
        since: BigNumber;
        until: BigNumber;
        from: string;
      }
    >;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    getClaimableOAS(
      original: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    mint(
      to: string,
      since: BigNumberish,
      until: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

    originalClaimer(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    renounce(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    "transfer(address,uint256)"(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "transfer(address[],uint256[])"(
      tos: string[],
      amounts: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "transferFrom(address[],address[],uint256[])"(
      froms: string[],
      tos: string[],
      amounts: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  "allow(address,address[])"(
    original: string,
    alloweds: string[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "allow(address,address)"(
    original: string,
    allowed: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  allowance(
    owner: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  allowedAddresses(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  claim(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  claimInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, string] & {
      amount: BigNumber;
      claimed: BigNumber;
      since: BigNumber;
      until: BigNumber;
      from: string;
    }
  >;

  decimals(overrides?: CallOverrides): Promise<number>;

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  getClaimableOAS(
    original: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  mint(
    to: string,
    since: BigNumberish,
    until: BigNumberish,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

  originalClaimer(arg0: string, overrides?: CallOverrides): Promise<string>;

  renounce(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  "transfer(address,uint256)"(
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "transfer(address[],uint256[])"(
    tos: string[],
    amounts: BigNumberish[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "transferFrom(address,address,uint256)"(
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "transferFrom(address[],address[],uint256[])"(
    froms: string[],
    tos: string[],
    amounts: BigNumberish[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    "allow(address,address[])"(
      original: string,
      alloweds: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    "allow(address,address)"(
      original: string,
      allowed: string,
      overrides?: CallOverrides
    ): Promise<void>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowedAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    claim(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claimInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, string] & {
        amount: BigNumber;
        claimed: BigNumber;
        since: BigNumber;
        until: BigNumber;
        from: string;
      }
    >;

    decimals(overrides?: CallOverrides): Promise<number>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getClaimableOAS(
      original: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    mint(
      to: string,
      since: BigNumberish,
      until: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    name(overrides?: CallOverrides): Promise<string>;

    originalClaimer(arg0: string, overrides?: CallOverrides): Promise<string>;

    renounce(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "transfer(address,uint256)"(
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "transfer(address[],uint256[])"(
      tos: string[],
      amounts: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "transferFrom(address[],address[],uint256[])"(
      froms: string[],
      tos: string[],
      amounts: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "Allow(address,address)"(
      original?: string | null,
      transferable?: string | null
    ): AllowEventFilter;
    Allow(
      original?: string | null,
      transferable?: string | null
    ): AllowEventFilter;

    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;

    "Claim(address,uint256)"(
      holder?: string | null,
      amount?: null
    ): ClaimEventFilter;
    Claim(holder?: string | null, amount?: null): ClaimEventFilter;

    "Mint(address,uint256,uint256,uint256)"(
      to?: string | null,
      amount?: null,
      since?: null,
      until?: null
    ): MintEventFilter;
    Mint(
      to?: string | null,
      amount?: null,
      since?: null,
      until?: null
    ): MintEventFilter;

    "Renounce(address,uint256)"(
      holder?: string | null,
      amount?: null
    ): RenounceEventFilter;
    Renounce(holder?: string | null, amount?: null): RenounceEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;
  };

  estimateGas: {
    "allow(address,address[])"(
      original: string,
      alloweds: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "allow(address,address)"(
      original: string,
      allowed: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowedAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    claim(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    claimInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    getClaimableOAS(
      original: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    mint(
      to: string,
      since: BigNumberish,
      until: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    originalClaimer(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounce(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "transfer(address,uint256)"(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "transfer(address[],uint256[])"(
      tos: string[],
      amounts: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "transferFrom(address[],address[],uint256[])"(
      froms: string[],
      tos: string[],
      amounts: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    "allow(address,address[])"(
      original: string,
      alloweds: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "allow(address,address)"(
      original: string,
      allowed: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allowedAddresses(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claim(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    claimInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    getClaimableOAS(
      original: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    mint(
      to: string,
      since: BigNumberish,
      until: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    originalClaimer(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounce(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "transfer(address,uint256)"(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "transfer(address[],uint256[])"(
      tos: string[],
      amounts: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "transferFrom(address[],address[],uint256[])"(
      froms: string[],
      tos: string[],
      amounts: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}