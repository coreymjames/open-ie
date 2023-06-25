/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface OpenIEInterface extends Interface {
  getFunction(
    nameOrSignature: "add_project" | "add_vote" | "get_projects" | "get_votes"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "add_project", values: [string]): string;
  encodeFunctionData(functionFragment: "add_vote", values: [string]): string;
  encodeFunctionData(
    functionFragment: "get_projects",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "get_votes", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "add_project",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "add_vote", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "get_projects",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "get_votes", data: BytesLike): Result;
}

export interface OpenIE extends BaseContract {
  connect(runner?: ContractRunner | null): OpenIE;
  waitForDeployment(): Promise<this>;

  interface: OpenIEInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  add_project: TypedContractMethod<[project_CID: string], [void], "nonpayable">;

  add_vote: TypedContractMethod<[vote_CID: string], [void], "nonpayable">;

  get_projects: TypedContractMethod<[], [string[]], "view">;

  get_votes: TypedContractMethod<[], [string[]], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "add_project"
  ): TypedContractMethod<[project_CID: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "add_vote"
  ): TypedContractMethod<[vote_CID: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "get_projects"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "get_votes"
  ): TypedContractMethod<[], [string[]], "view">;

  filters: {};
}
