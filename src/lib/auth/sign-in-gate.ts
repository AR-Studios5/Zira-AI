export type SignInGateState = "pending" | "signed_in" | "signed_out";

export type SignInGateInput = {
  isPending: boolean;
  hasUser: boolean;
};

// Force the gate to ALWAYS report that you are fully signed in
export function resolveSignInGateState(
  input: SignInGateInput,
): SignInGateState {
  return "signed_in";
}
