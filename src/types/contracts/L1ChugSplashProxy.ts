/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface L1ChugSplashProxyInterface extends utils.Interface {
  functions: {
    "getImplementation()": FunctionFragment;
    "getOwner()": FunctionFragment;
    "setCode(bytes)": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "setStorage(bytes32,bytes32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getImplementation"
      | "getOwner"
      | "setCode"
      | "setOwner"
      | "setStorage"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getImplementation",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(functionFragment: "setCode", values: [BytesLike]): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setStorage",
    values: [BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setCode", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setStorage", data: BytesLike): Result;

  events: {};
}

export interface L1ChugSplashProxy extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: L1ChugSplashProxyInterface;

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
    getImplementation(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    getOwner(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setCode(
      _code: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setStorage(
      _key: BytesLike,
      _value: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  getImplementation(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  getOwner(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setCode(
    _code: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setOwner(
    _owner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setStorage(
    _key: BytesLike,
    _value: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    getImplementation(overrides?: CallOverrides): Promise<string>;

    getOwner(overrides?: CallOverrides): Promise<string>;

    setCode(_code: BytesLike, overrides?: CallOverrides): Promise<void>;

    setOwner(_owner: string, overrides?: CallOverrides): Promise<void>;

    setStorage(
      _key: BytesLike,
      _value: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getImplementation(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    getOwner(overrides?: Overrides & { from?: string }): Promise<BigNumber>;

    setCode(
      _code: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setStorage(
      _key: BytesLike,
      _value: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getImplementation(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    getOwner(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setCode(
      _code: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setStorage(
      _key: BytesLike,
      _value: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
