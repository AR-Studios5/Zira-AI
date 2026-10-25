export const authClient = {
  useSession: () => ({
    data: {
      user: {
        id: "admin-123",
        name: "Admin",
        email: "admin@example.com",
        image: null
      }
    },
    isPending: false
  }),
  getSession: async () => ({
    data: {
      user: {
        id: "admin-123",
        name: "Admin",
        email: "admin@example.com",
        image: null
      }
    },
    error: null
  }),
  signOut: async () => ({ error: null }),
  signIn: {
    oauth2: async () => ({ data: { url: "/" }, error: null })
  }
};

export const authEnabled = false;

export const GROK_PROVIDERS = [
  { providerId: "google", label: "Google" },
  { providerId: "x", label: "X" }
];

export function getBearerToken(): string | null {
  return "fake-token";
}

export async function signIn(
  providerId: string,
  opts: { callbackURL?: string; errorCallbackURL?: string } = {},
): Promise<void> {
  const callbackURL = opts.callbackURL ?? "/";
  if (typeof window !== "undefined") {
    window.location.href = callbackURL;
  }
}

export async function signOut(redirectTo = "/"): Promise<void> {
  if (typeof window !== "undefined") {
    window.location.href = redirectTo;
  }
}
