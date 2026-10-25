import { useMemo } from "react";
import { authClient, authEnabled } from "./client";

export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Admin User",
  primaryEmail: "admin@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

export type CurrentUserState = {
  user: AppUser | null;
  isPending: boolean;
};

const DEV_STATE: CurrentUserState = { user: DEV_USER, isPending: false };

export function useCurrentUserState(): CurrentUserState {
  // This forces the app to ALWAYS skip authentication and use the Dev User
  return DEV_STATE;
}

export function useCurrentUser(): AppUser | null {
  return DEV_STATE.user;
}
