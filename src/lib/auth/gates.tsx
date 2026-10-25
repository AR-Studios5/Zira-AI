import type { ReactNode } from "react";

export const SIGN_IN_PATH = "/login";

// Always act as if the user is signed in
export function SignedIn({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Never show signed-out content
export function SignedOut({ children }: { children: ReactNode }) {
  return null;
}

// This completely destroys the redirect loop
export function RedirectToSignIn() {
  return null; 
}

// Always let the user through the gate without showing buttons
export function SignInGate({ children }: { children: ReactNode; fallback?: ReactNode }) {
  return <>{children}</>;
}

export function SignInButtons() {
  return null;
}

export function UserButton() {
  return null;
}
