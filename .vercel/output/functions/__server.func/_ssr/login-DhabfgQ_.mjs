import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, X as require_react, b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-86QV-P-f.mjs";
import { _ as EyeOff, g as Eye, p as MapPin } from "../_libs/lucide-react.mjs";
import { t as Phone } from "./phone-Dex8dHC7.mjs";
import { t as useCurrentUserState } from "./use-current-user-c6QUdvAT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DhabfgQ_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginRoute() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-1 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-12 animate-pulse rounded-full bg-line" })
	}) });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, {});
}
function LoginScreen() {
	const [mode, setMode] = (0, import_react.useState)("login");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function submitEmail() {
		setError("");
		if (!email.includes("@") || password.length < 8) {
			setError("Use a real email and a password of at least 8 characters.");
			return;
		}
		if (mode === "signup" && name.trim().length < 2) {
			setError("What should Zira call you?");
			return;
		}
		setBusy(true);
		try {
			if (mode === "signup") {
				const res = await authClient.signUp.email({
					email: email.trim(),
					password,
					name: name.trim()
				});
				if (res.error) throw new Error(res.error.message || "Could not create the account.");
			} else {
				const res = await authClient.signIn.email({
					email: email.trim(),
					password
				});
				if (res.error) throw new Error(res.error.message || "Those details didn't match.");
			}
			window.location.assign("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hide-scroll flex flex-1 flex-col overflow-y-auto px-6 pt-12 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/zira/portrait.jpg",
					alt: "",
					className: "h-14 w-14 rounded-full object-cover ring-2 ring-foam shadow-md"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl leading-none text-ink",
					children: "meet Zira"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-mist",
					children: "your everyday companion."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass mt-8 rounded-3xl border border-line p-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mb-4 flex rounded-full bg-wash p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mode-pill",
								style: { transform: mode === "signup" ? "translateX(100%)" : "translateX(0)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "relative z-10 h-11 flex-1 text-sm font-semibold",
								onClick: (event) => {
									event.stopPropagation();
									setMode("login");
								},
								children: "Log in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "relative z-10 h-11 flex-1 text-sm font-semibold",
								onClick: (event) => {
									event.stopPropagation();
									setMode("signup");
								},
								children: "Sign up"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "name-collapse",
						"data-open": mode === "signup",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (event) => setName(event.target.value),
							placeholder: "What should she call you?",
							autoComplete: "name",
							className: "h-12 w-full rounded-2xl border border-transparent bg-wash px-4 text-base text-ink outline-none focus:border-clay"
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: email,
						onChange: (event) => setEmail(event.target.value),
						placeholder: "Email",
						type: "email",
						autoComplete: "email",
						className: "mb-3 h-12 w-full rounded-2xl border border-transparent bg-wash px-4 text-base text-ink outline-none focus:border-clay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: password,
							onChange: (event) => setPassword(event.target.value),
							placeholder: "Password, 8+ characters",
							type: showPassword ? "text" : "password",
							autoComplete: mode === "signup" ? "new-password" : "current-password",
							className: "h-12 w-full rounded-2xl border border-transparent bg-wash px-4 pr-12 text-base text-ink outline-none focus:border-clay",
							onKeyDown: (event) => {
								if (event.key === "Enter") submitEmail();
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute top-0 right-1 flex h-12 w-11 items-center justify-center text-mist",
							"aria-label": showPassword ? "Hide password" : "Show password",
							onClick: (event) => {
								event.stopPropagation();
								setShowPassword((value) => !value);
							},
							children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-clay-deep",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: (event) => {
							event.stopPropagation();
							submitEmail();
						},
						className: "tap h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam disabled:opacity-60",
						children: busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-4 flex items-center gap-3 text-xs font-semibold tracking-wider text-mist",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
							"OR",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "tap flex h-12 items-center justify-center rounded-full border border-line bg-foam text-sm font-semibold text-ink",
							onClick: (event) => {
								event.stopPropagation();
								setError("");
								signIn(provider.providerId, { callbackURL: "/" }).catch((err) => {
									setError(err instanceof Error ? err.message : "Sign-in failed.");
								});
							},
							children: ["Continue with ", provider.label]
						}, provider.providerId))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 flex items-center justify-center gap-1.5 text-xs text-mist",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), "Tuned for India · IST"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-auto pt-6 text-center text-xs leading-relaxed text-mist",
				children: [
					"By continuing you confirm you are 13 or older and agree to the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/legal/$page",
						params: { page: "terms" },
						className: "font-semibold text-ink",
						children: "Terms"
					}),
					",",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/legal/$page",
						params: { page: "privacy" },
						className: "font-semibold text-ink",
						children: "Privacy"
					}),
					" ",
					"and",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/legal/$page",
						params: { page: "refund" },
						className: "font-semibold text-ink",
						children: "Refunds"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-xs text-mist",
				children: "Vellox Labs"
			})
		]
	}) });
}
//#endregion
export { LoginRoute as component };
