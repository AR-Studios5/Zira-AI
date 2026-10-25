import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, X as require_react, b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { a as hasGateSessionMarker } from "./server-86QV-P-f.mjs";
import { a as Square, c as Send, d as Mic, f as MessageCircle, h as Gamepad2, i as Star, l as RotateCcw, m as Lock, o as Sparkles, r as Trash2, s as Share2, t as X, u as Phone, v as BadgeCheck } from "../_libs/lucide-react.mjs";
import { t as Phone$1 } from "./phone-Dex8dHC7.mjs";
import { t as useCurrentUserState } from "./use-current-user-c6QUdvAT.mjs";
import { t as authMiddleware } from "./middleware-BGiyJ7Vn.mjs";
import { t as Chess } from "../_libs/chess.js.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-AJFFu-ea.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("671a4ecbb452f8aff5a1faff9faccda8f64509aa145ae23f0f53aa42d60147f9"));
var acceptTerms = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ fullName: string().trim().max(80).optional() }).parse(input ?? {})).handler(createSsrRpc("ab2b4f7170aeb5146bc4e39da5202826b17143535945c58e174c4f1d201b56ee"));
var sendSchema = object({
	text: string().trim().max(2e3).optional(),
	audioBase64: string().max(22e5).optional(),
	mimeType: string().max(100).optional(),
	replyWithAudio: boolean().optional(),
	context: _enum([
		"chat",
		"chess",
		"call"
	]).optional()
});
var sendChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => sendSchema.parse(input)).handler(createSsrRpc("0bde810119574218f9e9d6bbff9a02f10b28de6ce97b3666716da14500de97eb"));
var clearChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("a52fda0b6ca3b115fa1ec425e8507502bff71e4de1261d270a89103657117c44"));
var saveRating = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ stars: number().int().min(1).max(5) }).parse(input)).handler(createSsrRpc("7724401981090dd53b20bffb492201d10c750bb07eaabf0173975d21503e52bf"));
var saveSupport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ body: string().trim().min(2).max(2e3) }).parse(input)).handler(createSsrRpc("80f33f4407c0ea7b84021c5a3e970f01ff81cc9da250f6644209fc89d0a4eb40"));
var saveStoryReply = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ body: string().trim().min(1).max(400) }).parse(input)).handler(createSsrRpc("c677089b453c5961f2eaa9d4dd45149995dca95ae07648e879484bc0faaeb82e"));
var previewUnlock = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("a013ed70efb62a639f606d35cb3e802f647b73af280a021e7778b2d876d41a12"));
var VALUE = {
	p: 100,
	n: 320,
	b: 330,
	r: 500,
	q: 900,
	k: 0
};
function evaluate(chess) {
	if (chess.isCheckmate()) return chess.turn() === "w" ? -1e5 : 1e5;
	if (chess.isDraw()) return 0;
	let score = 0;
	for (const row of chess.board()) for (const piece of row) {
		if (!piece) continue;
		const value = VALUE[piece.type] ?? 0;
		score += piece.color === "w" ? value : -value;
	}
	return score;
}
function ordered(moves) {
	return [...moves].sort((a, b) => Number(Boolean(b.captured)) - Number(Boolean(a.captured)));
}
function search(chess, depth, alpha, beta) {
	if (depth === 0 || chess.isGameOver()) return evaluate(chess);
	const moves = ordered(chess.moves({ verbose: true }));
	if (chess.turn() === "w") {
		let value = -1e6;
		for (const move of moves) {
			chess.move(move);
			value = Math.max(value, search(chess, depth - 1, alpha, beta));
			chess.undo();
			alpha = Math.max(alpha, value);
			if (alpha >= beta) break;
		}
		return value;
	}
	let value = 1e6;
	for (const move of moves) {
		chess.move(move);
		value = Math.min(value, search(chess, depth - 1, alpha, beta));
		chess.undo();
		beta = Math.min(beta, value);
		if (alpha >= beta) break;
	}
	return value;
}
function pickBlackMove(chess) {
	const moves = ordered(chess.moves({ verbose: true }));
	if (moves.length === 0) return null;
	let best = moves[0];
	let bestScore = Infinity;
	for (const move of moves) {
		chess.move(move);
		const score = search(chess, 1, -1e6, 1e6);
		chess.undo();
		const ranked = score + (move.san.charCodeAt(0) % 5 - 2);
		if (ranked < bestScore) {
			bestScore = ranked;
			best = move;
		}
	}
	return best;
}
var GLYPH = {
	wk: "♔",
	wq: "♕",
	wr: "♖",
	wb: "♗",
	wn: "♘",
	wp: "♙",
	bk: "♚",
	bq: "♛",
	br: "♜",
	bb: "♝",
	bn: "♞",
	bp: "♟"
};
function lineFor(san) {
	if (san.includes("#")) return "Checkmate. Main haar gayi… ya tu. Dekh lena.";
	if (san.includes("+")) return "Check. Saans lo, phir socho.";
	if (san.includes("x")) return "Oho, piece gaya. Tension mat le.";
	const lines = [
		"Achha. Ab meri baari.",
		"Soch samajh ke chalna.",
		"Theek hai, main yahin se khelti hoon.",
		"Hmm. Interesting scene."
	];
	return lines[san.charCodeAt(0) % lines.length] ?? lines[0];
}
function ChessBoard({ userId, onSpeak, speaking, remoteLine }) {
	const storageKey = `zira-fen:${userId}`;
	const [chess] = (0, import_react.useState)(() => {
		const game = new Chess();
		if (typeof window !== "undefined") {
			const saved = window.localStorage.getItem(storageKey);
			if (saved) game.load(saved);
		}
		return game;
	});
	const [fen, setFen] = (0, import_react.useState)(chess.fen());
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [thinking, setThinking] = (0, import_react.useState)(false);
	const [banter, setBanter] = (0, import_react.useState)("Chal, safed teri hai. Soch samajh ke.");
	const [last, setLast] = (0, import_react.useState)(null);
	const legal = (0, import_react.useMemo)(() => {
		if (!selected) return /* @__PURE__ */ new Set();
		return new Set(chess.moves({
			square: selected,
			verbose: true
		}).map((move) => move.to));
	}, [
		chess,
		selected,
		fen
	]);
	(0, import_react.useEffect)(() => {
		window.localStorage.setItem(storageKey, fen);
	}, [fen, storageKey]);
	(0, import_react.useEffect)(() => {
		if (remoteLine) setBanter(remoteLine);
	}, [remoteLine]);
	function commit(nextBanter) {
		setFen(chess.fen());
		setSelected(null);
		if (nextBanter) setBanter(nextBanter);
	}
	function ziraMove() {
		setThinking(true);
		window.setTimeout(() => {
			const move = pickBlackMove(chess);
			if (!move) {
				setThinking(false);
				commit(chess.isCheckmate() ? "Bas. Game khatam." : "Draw. Dono thak gaye.");
				return;
			}
			chess.move(move);
			setLast(move.to);
			setThinking(false);
			commit(lineFor(move.san));
		}, 280);
	}
	function onSquare(square) {
		if (thinking || chess.turn() !== "w" || chess.isGameOver()) return;
		const piece = chess.get(square);
		if (selected && legal.has(square)) {
			if (!chess.move({
				from: selected,
				to: square,
				promotion: "q"
			})) return;
			setLast(square);
			commit();
			if (!chess.isGameOver()) ziraMove();
			else setBanter(chess.isCheckmate() ? "Shaabaash. Checkmate." : "Draw. Clean game.");
			return;
		}
		if (piece?.color === "w") {
			setSelected(square);
			return;
		}
		setSelected(null);
	}
	function reset() {
		chess.reset();
		setLast(null);
		setThinking(false);
		commit("Naya game. Safed phir teri hai.");
	}
	const board = chess.board();
	const status = chess.isCheckmate() ? chess.turn() === "w" ? "Zira wins" : "You win" : chess.isDraw() ? "Draw" : thinking ? "Zira is thinking" : chess.inCheck() ? "Check — your move" : "Your move";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-3xl border border-line bg-foam p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/zira/portrait.jpg",
					alt: "",
					className: "h-11 w-11 rounded-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-snug font-medium text-ink",
					children: [
						"“",
						banter,
						"”"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-8 overflow-hidden rounded-2xl border border-line",
				children: board.map((row, rank) => row.map((piece, file) => {
					const square = `${"abcdefgh"[file]}${8 - rank}`;
					const dark = (rank + file) % 2 === 1;
					const glyph = piece ? GLYPH[`${piece.color}${piece.type}`] : "";
					const isSelected = selected === square;
					const isLegal = legal.has(square);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-label": square,
						onClick: (event) => {
							event.stopPropagation();
							onSquare(square);
						},
						className: `relative flex aspect-square items-center justify-center ${isSelected ? "bg-clay/30" : last === square ? "bg-paper" : dark ? "bg-line" : "bg-foam"}`,
						children: [glyph ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `chess-glyph ${piece?.color === "w" ? "text-clay-deep" : "text-ink"}`,
							children: glyph
						}) : null, isLegal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-2.5 w-2.5 rounded-full bg-clay/80" }) : null]
					}, square);
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-mist",
					children: status
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "tap flex h-11 items-center gap-1.5 rounded-full border border-line bg-foam px-3 text-sm font-semibold",
						onClick: (event) => {
							event.stopPropagation();
							onSpeak();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: `size-4 ${speaking ? "text-clay" : ""}` }), speaking ? "Listening" : "Speak"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "tap flex h-11 items-center gap-1.5 rounded-full border border-line bg-foam px-3 text-sm font-semibold",
						onClick: (event) => {
							event.stopPropagation();
							reset();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Reset"]
					})]
				})]
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var SEED_REPLIES = [
	{
		name: "aarav",
		body: "yeh cafe kahan hai, itna shaant",
		time: "1h"
	},
	{
		name: "priya",
		body: "Zira you never take me with you",
		time: "45m"
	},
	{
		name: "rohit",
		body: "light is actually unfair",
		time: "20m"
	}
];
var REVIEWS = [
	{
		text: "Boredom actually packed its bags.",
		author: "aman"
	},
	{
		text: "She texts like she was already in the group chat.",
		author: "priyanka"
	},
	{
		text: "Less character sheet, more yaar.",
		author: "rohit"
	}
];
var subscribeNothing = () => () => {};
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that recording."));
		reader.onload = () => {
			resolve({
				data: String(reader.result || "").split(",")[1] || "",
				mime: blob.type || "audio/webm"
			});
		};
		reader.readAsDataURL(blob);
	});
}
function ZiraApp({ user }) {
	const [home, setHome] = (0, import_react.useState)(null);
	const [loadError, setLoadError] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("chat");
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [toasts, setToasts] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [voiceBlob, setVoiceBlob] = (0, import_react.useState)(null);
	const [audioById, setAudioById] = (0, import_react.useState)({});
	const [callOpen, setCallOpen] = (0, import_react.useState)(false);
	const [callLive, setCallLive] = (0, import_react.useState)(false);
	const [callLine, setCallLine] = (0, import_react.useState)("Tap speak when you want her on the line.");
	const [rateOpen, setRateOpen] = (0, import_react.useState)(false);
	const [hoverStar, setHoverStar] = (0, import_react.useState)(0);
	const [supportOpen, setSupportOpen] = (0, import_react.useState)(false);
	const [supportText, setSupportText] = (0, import_react.useState)("");
	const [ageName, setAgeName] = (0, import_react.useState)(user.displayName || "");
	const [ageBusy, setAgeBusy] = (0, import_react.useState)(false);
	const [storyOpen, setStoryOpen] = (0, import_react.useState)(false);
	const [storyProgress, setStoryProgress] = (0, import_react.useState)(0);
	const [storyPaused, setStoryPaused] = (0, import_react.useState)(false);
	const [sheet, setSheet] = (0, import_react.useState)(false);
	const [storyDraft, setStoryDraft] = (0, import_react.useState)("");
	const [payNote, setPayNote] = (0, import_react.useState)(false);
	const [unlocking, setUnlocking] = (0, import_react.useState)(false);
	const [reviewIndex, setReviewIndex] = (0, import_react.useState)(0);
	const [game, setGame] = (0, import_react.useState)("hub");
	const [chessListen, setChessListen] = (0, import_react.useState)(false);
	const [chessLine, setChessLine] = (0, import_react.useState)(null);
	const [rated, setRated] = (0, import_react.useState)(null);
	const scroller = (0, import_react.useRef)(null);
	const recorder = (0, import_react.useRef)(null);
	const chunks = (0, import_react.useRef)([]);
	const timer = (0, import_react.useRef)(null);
	const recordMode = (0, import_react.useRef)("note");
	const dragY = (0, import_react.useRef)(0);
	const gate = (0, import_react.useSyncExternalStore)(subscribeNothing, hasGateSessionMarker, () => false);
	function toast(text, tone = "info") {
		const id = Date.now() + Math.random();
		setToasts((list) => [...list, {
			id,
			text,
			tone
		}]);
		window.setTimeout(() => {
			setToasts((list) => list.filter((item) => item.id !== id));
		}, 4200);
	}
	async function refresh() {
		const data = await loadHome();
		setHome(data);
		setRated(data.rating);
		return data;
	}
	(0, import_react.useEffect)(() => {
		let gone = false;
		loadHome().then((data) => {
			if (gone) return;
			setHome(data);
			setRated(data.rating);
			if (user.displayName) setAgeName(user.displayName);
		}).catch((err) => {
			if (!gone) setLoadError(err instanceof Error ? err.message : "Could not open Zira.");
		});
		return () => {
			gone = true;
		};
	}, [user.id, user.displayName]);
	(0, import_react.useEffect)(() => {
		const node = scroller.current;
		if (!node || view !== "chat") return;
		node.scrollTo({
			top: node.scrollHeight,
			behavior: "smooth"
		});
	}, [
		home?.messages.length,
		home?.profile.sent,
		sending,
		view
	]);
	(0, import_react.useEffect)(() => {
		if (view !== "paywall") return;
		const id = window.setInterval(() => {
			setReviewIndex((index) => (index + 1) % REVIEWS.length);
		}, 3200);
		return () => window.clearInterval(id);
	}, [view]);
	(0, import_react.useEffect)(() => {
		if (view !== "story") return;
		setStoryProgress(0);
		setStoryPaused(false);
		setSheet(false);
	}, [view]);
	(0, import_react.useEffect)(() => {
		if (view !== "story" || storyPaused || sheet) return;
		const id = window.setInterval(() => {
			setStoryProgress((value) => {
				if (value >= 100) return 100;
				return value + .5;
			});
		}, 40);
		return () => window.clearInterval(id);
	}, [
		view,
		storyPaused,
		sheet
	]);
	(0, import_react.useEffect)(() => {
		if (storyProgress >= 100 && view === "story") setView("chat");
	}, [storyProgress, view]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (timer.current) window.clearInterval(timer.current);
			recorder.current?.stream.getTracks().forEach((track) => track.stop());
		};
	}, []);
	const quota = home?.profile ?? {
		sent: 0,
		limit: 20,
		unlimited: false
	};
	const locked = Boolean(home && !quota.unlimited && quota.sent >= quota.limit);
	const messages = home?.messages ?? [];
	function applyQuota(next) {
		setHome((current) => current ? {
			...current,
			profile: {
				...current.profile,
				...next
			}
		} : current);
	}
	async function onSendText() {
		const text = draft.trim();
		if (!text || sending || locked) {
			if (locked) setView("paywall");
			return;
		}
		setDraft("");
		setSending(true);
		const tempId = -Date.now();
		const optimistic = {
			id: tempId,
			sender: "user",
			body: text,
			kind: "text",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		setHome((current) => current ? {
			...current,
			messages: [...current.messages, optimistic]
		} : current);
		try {
			const res = await sendChat({ data: {
				text,
				context: "chat"
			} });
			if (!res.ok) {
				setHome((current) => current ? {
					...current,
					messages: current.messages.filter((item) => item.id !== tempId)
				} : current);
				if (res.code === "quota") {
					if (res.quota) applyQuota(res.quota);
					setView("paywall");
				}
				toast(res.error, "bad");
				return;
			}
			applyQuota(res.quota);
			setHome((current) => {
				if (!current) return current;
				const next = [...current.messages.filter((item) => item.id > 0)];
				if (res.userMessage) next.push(res.userMessage);
				if (res.reply) next.push(res.reply);
				return {
					...current,
					messages: next
				};
			});
			if (res.audioBase64 && res.reply) setAudioById((map) => ({
				...map,
				[res.reply.id]: res.audioBase64
			}));
		} catch (err) {
			setHome((current) => current ? {
				...current,
				messages: current.messages.filter((item) => item.id !== tempId)
			} : current);
			toast(err instanceof Error ? err.message : "Message didn't send.", "bad");
		} finally {
			setSending(false);
		}
	}
	async function deliverAudio(blob, context) {
		setSending(true);
		try {
			const encoded = await blobToBase64(blob);
			const res = await sendChat({ data: {
				audioBase64: encoded.data,
				mimeType: encoded.mime,
				replyWithAudio: context !== "chess",
				context: context === "chess" ? "chess" : context === "call" ? "call" : "chat"
			} });
			if (!res.ok) {
				if (res.code === "quota" || res.code === "premium") setView("paywall");
				toast(res.error, "bad");
				if (res.quota) applyQuota(res.quota);
				return null;
			}
			applyQuota(res.quota);
			if (context === "chat") {
				setHome((current) => {
					if (!current) return current;
					const next = [...current.messages];
					if (res.userMessage) next.push(res.userMessage);
					if (res.reply) next.push(res.reply);
					return {
						...current,
						messages: next
					};
				});
				if (res.audioBase64 && res.reply) {
					setAudioById((map) => ({
						...map,
						[res.reply.id]: res.audioBase64
					}));
					playAudio(res.audioBase64);
				}
			}
			if (res.audioBase64 && context !== "chat") playAudio(res.audioBase64);
			return res.text;
		} catch (err) {
			toast(err instanceof Error ? err.message : "Voice didn't send.", "bad");
			return null;
		} finally {
			setSending(false);
			setChessListen(false);
		}
	}
	function playAudio(base64) {
		new Audio(`data:audio/mpeg;base64,${base64}`).play().catch(() => toast("Couldn't play that clip.", "bad"));
	}
	function stopTimer() {
		if (timer.current) {
			window.clearInterval(timer.current);
			timer.current = null;
		}
	}
	function stopTracks() {
		recorder.current?.stream.getTracks().forEach((track) => track.stop());
		recorder.current = null;
	}
	function finishRecorder() {
		const rec = recorder.current;
		if (!rec || rec.state === "inactive") {
			stopTracks();
			return Promise.resolve(null);
		}
		return new Promise((resolve) => {
			rec.onstop = () => {
				const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
				stopTracks();
				resolve(blob.size > 0 ? blob : null);
			};
			rec.stop();
		});
	}
	async function startRecorder(mode) {
		if (locked && mode !== "call") {
			setView("paywall");
			return;
		}
		if (mode === "call" && !quota.unlimited) {
			setCallOpen(false);
			setView("paywall");
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const rec = new MediaRecorder(stream);
			chunks.current = [];
			rec.ondataavailable = (event) => {
				if (event.data.size > 0) chunks.current.push(event.data);
			};
			rec.start();
			recorder.current = rec;
			recordMode.current = mode;
			setSeconds(0);
			stopTimer();
			timer.current = window.setInterval(() => {
				setSeconds((value) => {
					if (value >= 29) {
						haltRecording();
						return value;
					}
					return value + 1;
				});
			}, 1e3);
			if (mode === "note") setPhase("recording");
			if (mode === "call") setCallLive(true);
			if (mode === "chess") setChessListen(true);
		} catch {
			toast("Microphone is blocked. Allow it and try again.", "bad");
		}
	}
	async function haltRecording() {
		stopTimer();
		const mode = recordMode.current;
		const blob = await finishRecorder();
		if (mode === "note") {
			setPhase(blob ? "review" : "idle");
			setVoiceBlob(blob);
			return;
		}
		setCallLive(false);
		setChessListen(false);
		if (!blob) return;
		const text = await deliverAudio(blob, mode === "chess" ? "chess" : "call");
		if (text && mode === "call") setCallLine(text);
		if (text && mode === "chess") setChessLine(text);
	}
	async function sendVoiceNote() {
		if (!voiceBlob || sending) return;
		const blob = voiceBlob;
		setVoiceBlob(null);
		setPhase("idle");
		await deliverAudio(blob, "chat");
	}
	async function onAcceptAge() {
		setAgeBusy(true);
		try {
			await acceptTerms({ data: { fullName: ageName.trim() || user.displayName || "Friend" } });
			await refresh();
			toast("You're in.", "ok");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Couldn't save that.", "bad");
		} finally {
			setAgeBusy(false);
		}
	}
	async function onClear() {
		setMenu(false);
		try {
			await clearChat();
			await refresh();
			toast("Chat cleared.");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Couldn't clear the chat.", "bad");
		}
	}
	async function onRate(stars) {
		try {
			await saveRating({ data: { stars } });
			setRated(stars);
		} catch (err) {
			toast(err instanceof Error ? err.message : "Rating didn't save.", "bad");
		}
	}
	async function onSupport() {
		const body = supportText.trim();
		if (body.length < 2) return;
		try {
			await saveSupport({ data: { body } });
			setSupportText("");
			setSupportOpen(false);
			toast("Sent to Vellox Labs.", "ok");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Couldn't send that.", "bad");
		}
	}
	async function onStoryReply() {
		const body = storyDraft.trim();
		if (!body) return;
		setStoryDraft("");
		try {
			const res = await saveStoryReply({ data: { body } });
			setHome((current) => current ? {
				...current,
				replies: [res.reply, ...current.replies]
			} : current);
			window.setTimeout(() => setSheet(false), 500);
			setStoryPaused(false);
		} catch (err) {
			toast(err instanceof Error ? err.message : "Reply didn't send.", "bad");
		}
	}
	async function onUnlock() {
		setUnlocking(true);
		try {
			await previewUnlock();
			await refresh();
			setPayNote(false);
			setView("chat");
			toast("Zira+ is on for 30 days. Nothing was charged.", "ok");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Couldn't unlock.", "bad");
		} finally {
			setUnlocking(false);
		}
	}
	async function onShare() {
		setMenu(false);
		const url = window.location.origin;
		const payload = {
			title: "Zira",
			text: "meet Zira — your everyday companion.",
			url
		};
		try {
			if (navigator.share) {
				await navigator.share(payload);
				return;
			}
			await navigator.clipboard.writeText(url);
			toast("Link copied.");
		} catch {
			toast("Share closed.");
		}
	}
	const replyCount = SEED_REPLIES.length + (home?.replies.length ?? 0);
	const remaining = Math.max(quota.limit - quota.sent, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "phone-stage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "phone-frame",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute top-3 left-1/2 z-50 flex w-[90%] -translate-x-1/2 flex-col gap-2",
					children: toasts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("glass pointer-events-auto flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium shadow-lg", item.tone === "bad" ? "border-clay" : item.tone === "ok" ? "border-leaf" : "border-line"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink",
							children: item.text
						})
					}, item.id))
				}),
				!home && !loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/zira/portrait.jpg",
						alt: "",
						className: "h-16 w-16 animate-pulse rounded-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: "Opening Zira…"
					})]
				}) : null,
				loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl",
							children: "She didn't pick up."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mist",
							children: loadError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "tap h-11 rounded-full bg-ink px-5 text-sm font-semibold text-foam",
							onClick: () => {
								setLoadError("");
								refresh().catch((err) => setLoadError(err instanceof Error ? err.message : "Still down."));
							},
							children: "Try again"
						})
					]
				}) : null,
				home ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "view-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "view-pane",
							"data-open": view === "chat",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
									className: "glass relative z-20 flex items-center gap-3 border-b border-line px-4 py-3 pt-[max(12px,env(safe-area-inset-top))]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "relative h-11 w-11 shrink-0",
											"aria-label": "Open story",
											onClick: (event) => {
												event.stopPropagation();
												setMenu(false);
												setStoryProgress(0);
												setStoryPaused(false);
												setSheet(false);
												setView("story");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/zira/portrait.jpg",
												alt: "",
												className: "h-11 w-11 rounded-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-foam bg-leaf" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1 text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
												className: "flex items-center gap-1 text-base font-semibold",
												children: ["Zira ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4 text-clay" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-leaf",
												children: sending ? "typing…" : "here"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex h-11 w-11 items-center justify-center",
											"aria-label": "Games",
											onClick: (event) => {
												event.stopPropagation();
												setMenu(false);
												setGame("hub");
												setView("games");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, { className: "size-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex h-11 w-11 items-center justify-center",
											"aria-label": "Call Zira",
											onClick: (event) => {
												event.stopPropagation();
												setMenu(false);
												if (quota.unlimited) setCallOpen(true);
												else setView("paywall");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex h-11 w-11 items-center justify-center",
											"aria-label": "Menu",
											onClick: (event) => {
												event.stopPropagation();
												setMenu((open) => !open);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex flex-col gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-ink" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-ink" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-ink" })
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("absolute top-16 right-3 z-30 w-56 origin-top-right rounded-3xl border border-line bg-foam p-1.5 shadow-xl transition duration-200", menu ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"),
											onPointerDown: (event) => event.stopPropagation(),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, { className: "size-4" }),
													label: "Play games",
													onClick: () => {
														setMenu(false);
														setGame("hub");
														setView("games");
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }),
													label: "Share",
													onClick: () => void onShare()
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4" }),
													label: "Rate us",
													onClick: () => {
														setMenu(false);
														setRateOpen(true);
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }),
													label: "Contact",
													onClick: () => {
														setMenu(false);
														setSupportOpen(true);
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
													label: "Zira+",
													onClick: () => {
														setMenu(false);
														setView("paywall");
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }),
													label: "Clear chat",
													onClick: () => void onClear()
												}),
												gate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "px-3 py-2 text-xs text-mist",
													children: "Signed in with your Grok account."
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }),
													label: "Log out",
													danger: true,
													onClick: () => {
														signOut("/login").catch(() => toast("Couldn't log out.", "bad"));
													}
												})
											]
										})
									]
								}),
								menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Close menu",
									className: "absolute inset-0 z-10",
									onClick: () => setMenu(false)
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									ref: scroller,
									className: "hide-scroll flex flex-1 flex-col gap-3 overflow-y-auto bg-wash px-4 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mx-auto rounded-full bg-foam px-3 py-1 text-xs font-medium text-mist",
											children: "You waved hi"
										}),
										messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: cn("bubble-in max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed", message.sender === "user" ? "self-end rounded-br-md bg-line text-ink" : "self-start rounded-bl-md border border-line bg-foam"),
											children: [message.kind === "voice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2 flex items-center gap-2",
												children: [audioById[message.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "flex h-8 w-8 items-center justify-center rounded-full bg-clay text-foam",
													"aria-label": "Play voice note",
													onClick: (event) => {
														event.stopPropagation();
														const clip = audioById[message.id];
														if (clip) playAudio(clip);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" })
												}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "wave flex h-4 items-end gap-0.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
													]
												})]
											}) : null, message.body]
										}, message.id)),
										sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex w-fit gap-1 rounded-full border border-line bg-foam px-3 py-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-mist" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-mist" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-mist" })
											]
										}) : null,
										locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "bubble-in relative mx-auto mt-2 w-[88%] rounded-3xl border border-clay bg-foam px-5 pt-7 pb-5 text-center",
											onClick: (event) => {
												event.stopPropagation();
												setView("paywall");
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-lg bg-clay px-3 py-1 text-xs font-semibold text-foam",
													children: "Zira+"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-display text-2xl",
													children: "continue talking"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm text-mist",
													children: "20 free messages are used for today."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-4 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-foam",
													children: "See ₹599 / month"
												})
											]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
									className: "border-t border-line bg-foam px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]",
									children: [!quota.unlimited ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mb-2 text-center text-xs text-mist",
										children: [
											remaining,
											" of ",
											quota.limit,
											" free left today"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-center text-xs text-leaf",
										children: "Zira+ · unlimited"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ink",
												"aria-label": "Voice note",
												onClick: (event) => {
													event.stopPropagation();
													if (locked) {
														setView("paywall");
														return;
													}
													startRecorder("note");
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "dock-stack",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														"data-open": phase === "idle",
														className: "relative",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															value: draft,
															disabled: locked || sending,
															onChange: (event) => setDraft(event.target.value),
															onKeyDown: (event) => {
																if (event.key === "Enter") onSendText();
															},
															placeholder: locked ? "Daily limit reached" : "type your message",
															className: "h-12 w-full rounded-full border border-line bg-wash px-4 text-base outline-none focus:border-clay disabled:text-mist"
														}), locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															className: "absolute inset-0 rounded-full",
															"aria-label": "Open Zira+",
															onClick: (event) => {
																event.stopPropagation();
																setView("paywall");
															}
														}) : null]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														"data-open": phase === "recording",
														className: "flex h-12 items-center gap-3 rounded-full border border-line bg-wash px-4",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rec-dot" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex-1 text-sm font-semibold",
																children: [
																	Math.floor(seconds / 60),
																	":",
																	String(seconds % 60).padStart(2, "0")
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "flex h-8 w-8 items-center justify-center rounded-full bg-clay text-foam",
																"aria-label": "Stop recording",
																onClick: (event) => {
																	event.stopPropagation();
																	haltRecording();
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" })
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														"data-open": phase === "review",
														className: "flex h-12 items-center gap-2 rounded-full border border-line bg-wash px-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "flex h-10 w-10 items-center justify-center text-mist",
																"aria-label": "Delete voice note",
																onClick: (event) => {
																	event.stopPropagation();
																	setVoiceBlob(null);
																	setPhase("idle");
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "wave flex h-4 flex-1 items-end justify-center gap-0.5",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs font-semibold text-mist",
																children: "Ready"
															})
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "tap flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clay text-foam disabled:opacity-50",
												"aria-label": "Send",
												disabled: sending,
												onClick: (event) => {
													event.stopPropagation();
													if (phase === "review") sendVoiceNote();
													else onSendText();
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
											})
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "view-pane hide-scroll relative overflow-y-auto bg-foam",
							"data-open": view === "paywall",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "absolute top-[max(12px,env(safe-area-inset-top))] right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foam",
									"aria-label": "Close",
									onClick: (event) => {
										event.stopPropagation();
										setView("chat");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center bg-paper px-6 pt-16 pb-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/zira/portrait.jpg",
										alt: "",
										className: "h-24 w-24 rounded-full object-cover ring-4 ring-foam"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 rounded-full bg-foam px-3 py-1 text-xs font-semibold tracking-wide text-clay",
										children: "YOUR EVERYDAY COMPANION"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-line px-6 py-6 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-3 flex justify-center gap-1 text-clay",
										children: Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-clay" }, index))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex transition-transform duration-500",
											style: { transform: `translateX(-${reviewIndex * 100}%)` },
											children: REVIEWS.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
												className: "w-full shrink-0 px-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
													className: "font-display text-xl leading-snug",
													children: [
														"“",
														review.text,
														"”"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
													className: "mt-2 text-sm font-semibold text-mist",
													children: review.author
												})]
											}, review.author))
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-6 py-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-xl bg-paper px-3 py-1 text-xs font-semibold",
												children: "ZIRA+"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-xl bg-paper px-3 py-1 text-xs font-semibold text-leaf",
												children: "Unlimited"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display mt-4 text-5xl",
											children: "₹599"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-mist",
											children: "per month · cancel anytime"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "mt-6 flex flex-col gap-3 text-sm font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "20 free messages a day, or no cap" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Calls and voice notes included" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Chess with Zira while she talks" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "tap mt-8 h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam",
											onClick: (event) => {
												event.stopPropagation();
												setPayNote(true);
											},
											children: "Continue with Zira+"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-4 text-center text-xs leading-relaxed text-mist",
											children: [
												"Razorpay is not connected yet, so this button does not charge you.",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/legal/$page",
													params: { page: "terms" },
													className: "underline",
													children: "Terms"
												}),
												" · ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/legal/$page",
													params: { page: "privacy" },
													className: "underline",
													children: "Privacy"
												}),
												" · ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/legal/$page",
													params: { page: "refund" },
													className: "underline",
													children: "Refunds"
												})
											]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "view-pane relative overflow-hidden bg-ink",
							"data-open": view === "story",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/zira/story.jpg",
									alt: "",
									className: "absolute inset-0 h-full w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-x-0 top-0 z-10 px-3 pt-[max(12px,env(safe-area-inset-top))]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1 overflow-hidden rounded-full bg-foam/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-foam",
											style: { width: `${storyProgress}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-2 text-foam",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/zira/portrait.jpg",
												alt: "",
												className: "h-9 w-9 rounded-full object-cover"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold",
												children: "Zira"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-foam/80",
												children: "2h"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-foam text-ink",
												"aria-label": "Close story",
												onClick: (event) => {
													event.stopPropagation();
													setView("chat");
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "absolute inset-0",
									"aria-label": "Hold to pause",
									onPointerDown: () => setStoryPaused(true),
									onPointerUp: () => {
										if (!sheet) setStoryPaused(false);
									},
									onPointerLeave: () => {
										if (!sheet) setStoryPaused(false);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-[max(16px,env(safe-area-inset-bottom))] transition-transform", sheet ? "translate-y-full" : "translate-y-0"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "mx-auto h-9 rounded-full bg-foam/20 px-4 text-xs font-semibold text-foam",
										onClick: (event) => {
											event.stopPropagation();
											setSheet(true);
											setStoryPaused(true);
										},
										children: [
											"View replies (",
											replyCount,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 rounded-full border border-foam/40 bg-ink/40 px-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: storyDraft,
											onChange: (event) => setStoryDraft(event.target.value),
											onFocus: () => setStoryPaused(true),
											onBlur: () => {
												if (!sheet) setStoryPaused(false);
											},
											placeholder: "Reply to Zira",
											className: "h-12 min-w-0 flex-1 bg-transparent text-base text-foam outline-none placeholder:text-foam/70"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex h-9 w-9 items-center justify-center rounded-full bg-clay text-foam",
											"aria-label": "Send reply",
											onClick: (event) => {
												event.stopPropagation();
												onStoryReply();
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "story-sheet z-20 flex flex-col rounded-t-3xl bg-foam px-5 pt-3",
									"data-open": sheet,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "mx-auto mb-3 h-8 w-16",
											"aria-label": "Close replies",
											onPointerDown: (event) => {
												dragY.current = event.clientY;
											},
											onPointerUp: (event) => {
												if (event.clientY - dragY.current > 40) {
													setSheet(false);
													setStoryPaused(false);
												}
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-auto block h-1.5 w-10 rounded-full bg-line" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "text-base font-semibold",
												children: "Story replies"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "text-sm font-semibold text-clay",
												onClick: (event) => {
													event.stopPropagation();
													setSheet(false);
													setStoryPaused(false);
												},
												children: "Done"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "hide-scroll flex flex-1 flex-col gap-4 overflow-y-auto pb-6",
											children: [home.replies.map((reply) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReplyRow, {
												name: "You",
												body: reply.body,
												time: "now"
											}, reply.id)), SEED_REPLIES.map((reply) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReplyRow, {
												name: reply.name,
												body: reply.body,
												time: reply.time
											}, reply.name))]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "view-pane bg-wash",
							"data-open": view === "games",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
								className: "flex items-center justify-between border-b border-line bg-foam px-4 py-3 pt-[max(12px,env(safe-area-inset-top))]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl",
									children: "Games with Zira"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "flex h-10 w-10 items-center justify-center rounded-full bg-wash",
									"aria-label": "Close games",
									onClick: (event) => {
										event.stopPropagation();
										if (game === "chess") setGame("hub");
										else setView("chat");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hide-scroll flex-1 overflow-y-auto p-4",
								children: game === "hub" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-3xl bg-ink p-5 text-foam",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-3xl",
											children: "Unlock your mind"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-foam/80",
											children: "Short games. She talks while you play."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "tap mt-4 w-full rounded-3xl border border-line bg-foam p-5 text-left",
										onClick: (event) => {
											event.stopPropagation();
											setGame("chess");
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-leaf",
												children: "Live"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-2 text-lg font-semibold",
												children: "Chess"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm text-mist",
												children: "You play white. She answers, then she comments."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 rounded-3xl border border-line bg-foam p-5 opacity-70",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-mist",
												children: "Soon"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-2 text-lg font-semibold",
												children: "20 questions"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm text-mist",
												children: "Think of anything. She has twenty tries."
											})
										]
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChessBoard, {
									userId: user.id,
									speaking: chessListen,
									remoteLine: chessLine,
									onSpeak: () => {
										if (chessListen) haltRecording();
										else startRecorder("chess");
									}
								})
							})]
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "veil",
					"data-open": Boolean(home && !home.profile.ageOk),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet w-full rounded-3xl bg-foam p-6",
						onPointerDown: (event) => event.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl",
								children: "One last step"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-mist",
								children: "Zira is for people 13 and older. Confirm that, and the terms, before the first message."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: ageName,
								onChange: (event) => setAgeName(event.target.value),
								placeholder: "Your name",
								className: "mt-4 h-12 w-full rounded-2xl border border-line bg-wash px-4 outline-none focus:border-clay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: ageBusy,
								className: "tap mt-4 h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam disabled:opacity-60",
								onClick: (event) => {
									event.stopPropagation();
									onAcceptAge();
								},
								children: ageBusy ? "Saving…" : "I'm 13+ and I agree"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-center text-xs text-mist",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/legal/$page",
										params: { page: "terms" },
										className: "underline",
										children: "Terms"
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/legal/$page",
										params: { page: "privacy" },
										className: "underline",
										children: "Privacy"
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "veil",
					"data-open": callOpen,
					onClick: () => setCallOpen(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet mb-2 w-full max-w-sm rounded-3xl bg-foam p-6 text-center",
						onClick: (event) => event.stopPropagation(),
						onPointerDown: (event) => event.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/zira/portrait.jpg",
								alt: "",
								className: "mx-auto h-16 w-16 rounded-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display mt-3 text-3xl",
								children: "Call Zira"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-mist",
								children: callLine
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "tap mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-foam",
								onClick: (event) => {
									event.stopPropagation();
									if (callLive) haltRecording();
									else startRecorder("call");
								},
								children: [callLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }), callLive ? "Stop and send" : sending ? "She's answering…" : "Speak"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 h-11 w-full text-sm font-semibold text-mist",
								onClick: (event) => {
									event.stopPropagation();
									setCallOpen(false);
								},
								children: "Hang up"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "veil",
					"data-open": rateOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet relative w-full rounded-3xl bg-foam p-6 text-center",
						onPointerDown: (event) => event.stopPropagation(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-wash",
							"aria-label": "Close rating",
							onClick: (event) => {
								event.stopPropagation();
								setRateOpen(false);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "fade-swap mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-open": rated == null,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper text-clay",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display mt-3 text-3xl",
										children: "Enjoying Zira?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-mist",
										children: "Tap a star. It stays with Vellox Labs."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex justify-center gap-1",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex h-11 w-11 items-center justify-center",
											"aria-label": `${star} stars`,
											onPointerEnter: () => setHoverStar(star),
											onPointerLeave: () => setHoverStar(0),
											onClick: (event) => {
												event.stopPropagation();
												onRate(star);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-7", (hoverStar || 0) >= star ? "fill-clay text-clay" : "text-line") })
										}, star))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-open": rated != null,
								className: "py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper text-leaf",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-7" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display mt-3 text-3xl text-leaf",
										children: "Saved"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-mist",
										children: [
											"Thank you — ",
											rated,
											" stars."
										]
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "veil",
					"data-open": supportOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet w-full rounded-3xl bg-foam p-6",
						onPointerDown: (event) => event.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl",
									children: "Need us?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "flex h-9 w-9 items-center justify-center rounded-full bg-wash",
									"aria-label": "Close contact",
									onClick: (event) => {
										event.stopPropagation();
										setSupportOpen(false);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-mist",
								children: "This goes straight to the Vellox Labs inbox for this app."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: supportText,
								onChange: (event) => setSupportText(event.target.value),
								placeholder: "What's wrong, or what should change?",
								className: "mt-4 h-28 w-full resize-none rounded-2xl border border-line bg-wash p-3 text-base outline-none focus:border-clay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "tap mt-3 h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam",
								onClick: (event) => {
									event.stopPropagation();
									onSupport();
								},
								children: "Send"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "veil",
					"data-open": payNote,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet w-full rounded-3xl bg-foam p-6",
						onPointerDown: (event) => event.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-paper text-clay",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display mt-3 text-3xl",
								children: "No charge yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-mist",
								children: "Razorpay isn't connected, so ₹599 cannot be collected. Test unlock turns on Zira+ for 30 days on this account only. Remove it before you take real payments."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-12 flex-1 rounded-full bg-wash text-sm font-semibold",
									onClick: (event) => {
										event.stopPropagation();
										setPayNote(false);
									},
									children: "Not now"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: unlocking,
									className: "tap h-12 flex-1 rounded-full bg-ink text-sm font-semibold text-foam disabled:opacity-60",
									onClick: (event) => {
										event.stopPropagation();
										onUnlock();
									},
									children: unlocking ? "Unlocking…" : "Test unlock"
								})]
							})
						]
					})
				})
			]
		})
	});
}
function MenuButton({ icon, label, onClick, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cn("flex h-11 w-full items-center gap-2 rounded-2xl px-3 text-left text-sm font-semibold", danger ? "text-clay-deep" : "text-ink"),
		onClick: (event) => {
			event.stopPropagation();
			onClick();
		},
		children: [icon, label]
	});
}
function ReplyRow({ name, body, time }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-semibold text-clay",
			children: name.slice(0, 1).toUpperCase()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mist",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-mist",
				children: time
			})
		] })]
	});
}
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
function Home() {
	const { user, isPending } = useCurrentUserState();
	if (isPending || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-1 flex-col items-center justify-center gap-3",
		children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 w-16 animate-pulse rounded-full bg-line" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-mist",
			children: "Opening Zira…"
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {})
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZiraApp, { user });
}
//#endregion
export { Home as component };
