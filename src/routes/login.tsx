import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { Phone } from "@/components/zira/phone";

// Directly render the screen without checking if the user is already logged in
export const Route = createFileRoute("/login")({
  component: LoginScreen,
});

function LoginScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded providers to keep the UI looking perfect
  const GROK_PROVIDERS = [
    { providerId: "google", label: "Google" },
    { providerId: "x", label: "X" }
  ];

  // This is our fake gateway. It ignores passwords and instantly lets you in.
  function bypassToChat() {
    setBusy(true);
    window.location.assign("/");
  }

  return (
    <Phone>
      <div className="hide-scroll flex flex-1 flex-col overflow-y-auto px-6 pt-12 pb-8">
        <div className="mt-6 flex items-center gap-3">
          <img
            src="/zira/portrait.jpg"
            alt=""
            className="h-14 w-14 rounded-full object-cover ring-2 ring-foam shadow-md"
          />
          <div>
            <h1 className="font-display text-4xl leading-none text-ink">meet Zira</h1>
            <p className="mt-1 text-sm text-mist">your everyday companion.</p>
          </div>
        </div>

        <div className="glass mt-8 rounded-3xl border border-line p-4 shadow-sm">
          <div className="relative mb-4 flex rounded-full bg-wash p-1">
            <span
              className="mode-pill"
              style={{ transform: mode === "signup" ? "translateX(100%)" : "translateX(0)" }}
            />
            <button
              type="button"
              className="relative z-10 h-11 flex-1 text-sm font-semibold"
              onClick={(event) => {
                event.stopPropagation();
                setMode("login");
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className="relative z-10 h-11 flex-1 text-sm font-semibold"
              onClick={(event) => {
                event.stopPropagation();
                setMode("signup");
              }}
            >
              Sign up
            </button>
          </div>

          <div className="name-collapse" data-open={mode === "signup"}>
            <div>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="What should she call you?"
                autoComplete="name"
                className="h-12 w-full rounded-2xl border border-transparent bg-wash px-4 text-base text-ink outline-none focus:border-clay"
              />
            </div>
          </div>

          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            autoComplete="email"
            className="mb-3 h-12 w-full rounded-2xl border border-transparent bg-wash px-4 text-base text-ink outline-none focus:border-clay"
          />
          <div className="relative mb-4">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password, 8+ characters"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="h-12 w-full rounded-2xl border border-transparent bg-wash px-4 pr-12 text-base text-ink outline-none focus:border-clay"
              onKeyDown={(event) => {
                if (event.key === "Enter") bypassToChat();
              }}
            />
            <button
              type="button"
              className="absolute top-0 right-1 flex h-12 w-11 items-center justify-center text-mist"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={(event) => {
                event.stopPropagation();
                setShowPassword((value) => !value);
              }}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          {error ? <p className="mb-3 text-sm text-clay-deep">{error}</p> : null}

          <button
            type="button"
            disabled={busy}
            onClick={(event) => {
              event.stopPropagation();
              bypassToChat(); // Bypasses auth
            }}
            className="tap h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </button>

          <div className="my-4 flex items-center gap-3 text-xs font-semibold tracking-wider text-mist">
            <span className="h-px flex-1 bg-line" />
            OR
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col gap-2">
            {GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                className="tap flex h-12 items-center justify-center rounded-full border border-line bg-foam text-sm font-semibold text-ink"
                onClick={(event) => {
                  event.stopPropagation();
                  setError("");
                  bypassToChat(); // Bypasses auth for Google/X
                }}
              >
                Continue with {provider.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-mist">
          <MapPin className="size-3.5" />
          Tuned for India · IST
        </p>
        <p className="mt-auto pt-6 text-center text-xs leading-relaxed text-mist">
          By continuing you confirm you are 13 or older and agree to the{" "}
          <Link to="/legal/$page" params={{ page: "terms" }} className="font-semibold text-ink">
            Terms
          </Link>
          ,{" "}
          <Link to="/legal/$page" params={{ page: "privacy" }} className="font-semibold text-ink">
            Privacy
          </Link>{" "}
          and{" "}
          <Link to="/legal/$page" params={{ page: "refund" }} className="font-semibold text-ink">
            Refunds
          </Link>
          .
        </p>
        <p className="mt-3 text-center text-xs text-mist">Vellox Labs</p>
      </div>
    </Phone>
  );
}
