import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  student_credentials(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { gpa: bigint,
                                                                                    income: bigint,
                                                                                    student_id: Uint8Array
                                                                                  }];
  admin_secret_key(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  update_criteria(context: __compactRuntime.CircuitContext<PS>,
                  new_min_gpa_0: bigint,
                  new_max_income_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  update_criteria(context: __compactRuntime.CircuitContext<PS>,
                  new_min_gpa_0: bigint,
                  new_max_income_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  update_criteria(context: __compactRuntime.CircuitContext<PS>,
                  new_min_gpa_0: bigint,
                  new_max_income_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly min_gpa: bigint;
  readonly max_income: bigint;
  readonly admin: Uint8Array;
  nullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initial_min_gpa_0: bigint,
               initial_max_income_0: bigint,
               initial_admin_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
