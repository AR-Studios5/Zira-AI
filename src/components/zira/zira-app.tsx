import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Gamepad2,
  Lock,
  MessageCircle,
  Mic,
  Phone,
  Send,
  Share2,
  Sparkles,
  Square,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import type { AppUser } from "@/lib/auth/use-current-user";
import {
  acceptTerms,
  clearChat,
  loadHome,
  previewUnlock,
  saveRating,
  saveStoryReply,
  saveSupport,
  sendChat,
  type HomeData,
  type Quota,
  type ZiraMessage,
} from "@/lib/zira.functions";
import { ChessBoard } from "@/components/zira/chess-board";
import { cn } from "@/lib/cn";

type View = "chat" | "paywall" | "story" | "games";
type Toast = { id: number; text: string; tone: "info" | "ok" | "bad" };
type Phase = "idle" | "recording" | "review";

const SEED_REPLIES = [
  { name: "aarav", body: "yeh cafe kahan hai, itna shaant", time: "1h" },
  { name: "priya", body: "Zira you never take me with you", time: "45m" },
  { name: "rohit", body: "light is actually unfair", time: "20m" },
];

const REVIEWS = [
  { text: "Boredom actually packed its bags.", author: "aman" },
  { text: "She texts like she was already in the group chat.", author: "priyanka" },
  { text: "Less character sheet, more yaar.", author: "rohit" },
];

const subscribeNothing = () => () => {};

function blobToBase64(blob: Blob): Promise<{ data: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that recording."));
    reader.onload = () => {
      const raw = String(reader.result || "");
      const data = raw.split(",")[1] || "";
      resolve({ data, mime: blob.type || "audio/webm" });
    };
    reader.readAsDataURL(blob);
  });
}

export function ZiraApp({ user }: { user: AppUser }) {
  const [home, setHome] = useState<HomeData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [view, setView] = useState<View>("chat");
  const [menu, setMenu] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [audioById, setAudioById] = useState<Record<number, string>>({});
  const [callOpen, setCallOpen] = useState(false);
  const [callLive, setCallLive] = useState(false);
  const [callLine, setCallLine] = useState("Tap speak when you want her on the line.");
  const [rateOpen, setRateOpen] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportText, setSupportText] = useState("");
  const [ageName, setAgeName] = useState(user.displayName || "");
  const [ageBusy, setAgeBusy] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyPaused, setStoryPaused] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [storyDraft, setStoryDraft] = useState("");
  const [payNote, setPayNote] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [game, setGame] = useState<"hub" | "chess">("hub");
  const [chessListen, setChessListen] = useState(false);
  const [chessLine, setChessLine] = useState<string | null>(null);
  const [rated, setRated] = useState<number | null>(null);

  const scroller = useRef<HTMLDivElement>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<number | null>(null);
  const recordMode = useRef<"note" | "call" | "chess">("note");
  const dragY = useRef(0);

  const gate = useSyncExternalStore(subscribeNothing, hasGateSessionMarker, () => false);

  function toast(text: string, tone: Toast["tone"] = "info") {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, text, tone }]);
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

  useEffect(() => {
    let gone = false;
    loadHome()
      .then((data) => {
        if (gone) return;
        setHome(data);
        setRated(data.rating);
        if (user.displayName) setAgeName(user.displayName);
      })
      .catch((err: unknown) => {
        if (!gone) setLoadError(err instanceof Error ? err.message : "Could not open Zira.");
      });
    return () => {
      gone = true;
    };
  }, [user.id, user.displayName]);

  useEffect(() => {
    const node = scroller.current;
    if (!node || view !== "chat") return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [home?.messages.length, home?.profile.sent, sending, view]);

  useEffect(() => {
    if (view !== "paywall") return;
    const id = window.setInterval(() => {
      setReviewIndex((index) => (index + 1) % REVIEWS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [view]);

  useEffect(() => {
    if (view !== "story") return;
    setStoryProgress(0);
    setStoryPaused(false);
    setSheet(false);
  }, [view]);

  useEffect(() => {
    if (view !== "story" || storyPaused || sheet) return;
    const id = window.setInterval(() => {
      setStoryProgress((value) => {
        if (value >= 100) return 100;
        return value + 0.5;
      });
    }, 40);
    return () => window.clearInterval(id);
  }, [view, storyPaused, sheet]);

  useEffect(() => {
    if (storyProgress >= 100 && view === "story") setView("chat");
  }, [storyProgress, view]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      recorder.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const quota: Quota = home?.profile ?? { sent: 0, limit: 20, unlimited: false };
  const locked = Boolean(home && !quota.unlimited && quota.sent >= quota.limit);
  const messages = home?.messages ?? [];

  function applyQuota(next: Quota) {
    setHome((current) =>
      current ? { ...current, profile: { ...current.profile, ...next } } : current,
    );
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
    const optimistic: ZiraMessage = {
      id: tempId,
      sender: "user",
      body: text,
      kind: "text",
      createdAt: new Date().toISOString(),
    };
    setHome((current) =>
      current ? { ...current, messages: [...current.messages, optimistic] } : current,
    );
    try {
      const res = await sendChat({ data: { text, context: "chat" } });
      if (!res.ok) {
        setHome((current) =>
          current
            ? { ...current, messages: current.messages.filter((item) => item.id !== tempId) }
            : current,
        );
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
        const stable = current.messages.filter((item) => item.id > 0);
        const next = [...stable];
        if (res.userMessage) next.push(res.userMessage);
        if (res.reply) next.push(res.reply);
        return { ...current, messages: next };
      });
      if (res.audioBase64 && res.reply) {
        setAudioById((map) => ({ ...map, [res.reply!.id]: res.audioBase64! }));
      }
    } catch (err) {
      setHome((current) =>
        current
          ? { ...current, messages: current.messages.filter((item) => item.id !== tempId) }
          : current,
      );
      toast(err instanceof Error ? err.message : "Message didn't send.", "bad");
    } finally {
      setSending(false);
    }
  }

  async function deliverAudio(blob: Blob, context: "chat" | "call" | "chess") {
    setSending(true);
    try {
      const encoded = await blobToBase64(blob);
      const res = await sendChat({
        data: {
          audioBase64: encoded.data,
          mimeType: encoded.mime,
          replyWithAudio: context !== "chess",
          context: context === "chess" ? "chess" : context === "call" ? "call" : "chat",
        },
      });
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
          return { ...current, messages: next };
        });
        if (res.audioBase64 && res.reply) {
          setAudioById((map) => ({ ...map, [res.reply!.id]: res.audioBase64! }));
          void playAudio(res.audioBase64);
        }
      }
      if (res.audioBase64 && context !== "chat") void playAudio(res.audioBase64);
      return res.text;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Voice didn't send.", "bad");
      return null;
    } finally {
      setSending(false);
      setChessListen(false);
    }
  }

  function playAudio(base64: string) {
    const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
    void audio.play().catch(() => toast("Couldn't play that clip.", "bad"));
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

  function finishRecorder(): Promise<Blob | null> {
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

  async function startRecorder(mode: "note" | "call" | "chess") {
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
            void haltRecording();
            return value;
          }
          return value + 1;
        });
      }, 1000);
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

  async function onRate(stars: number) {
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
      setHome((current) =>
        current ? { ...current, replies: [res.reply, ...current.replies] } : current,
      );
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
    const payload = { title: "Zira", text: "meet Zira — your everyday companion.", url };
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

  return (
    <div className="phone-stage">
      <div className="phone-frame">
        <div className="pointer-events-none absolute top-3 left-1/2 z-50 flex w-[90%] -translate-x-1/2 flex-col gap-2">
          {toasts.map((item) => (
            <div
              key={item.id}
              className={cn(
                "glass pointer-events-auto flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium shadow-lg",
                item.tone === "bad" ? "border-clay" : item.tone === "ok" ? "border-leaf" : "border-line",
              )}
            >
              <span className="text-ink">{item.text}</span>
            </div>
          ))}
        </div>

        {!home && !loadError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <img src="/zira/portrait.jpg" alt="" className="h-16 w-16 animate-pulse rounded-full object-cover" />
            <p className="text-sm text-mist">Opening Zira…</p>
          </div>
        ) : null}

        {loadError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="font-display text-3xl">She didn't pick up.</p>
            <p className="text-sm text-mist">{loadError}</p>
            <button
              type="button"
              className="tap h-11 rounded-full bg-ink px-5 text-sm font-semibold text-foam"
              onClick={() => {
                setLoadError("");
                void refresh().catch((err: unknown) =>
                  setLoadError(err instanceof Error ? err.message : "Still down."),
                );
              }}
            >
              Try again
            </button>
          </div>
        ) : null}

        {home ? (
          <div className="view-stack">
            <section className="view-pane" data-open={view === "chat"}>
              <header className="glass relative z-20 flex items-center gap-3 border-b border-line px-4 py-3 pt-[max(12px,env(safe-area-inset-top))]">
                <button
                  type="button"
                  className="relative h-11 w-11 shrink-0"
                  aria-label="Open story"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenu(false);
                    setStoryProgress(0);
                    setStoryPaused(false);
                    setSheet(false);
                    setView("story");
                  }}
                >
                  <img src="/zira/portrait.jpg" alt="" className="h-11 w-11 rounded-full object-cover" />
                  <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-foam bg-leaf" />
                </button>
                <div className="min-w-0 flex-1 text-left">
                  <h1 className="flex items-center gap-1 text-base font-semibold">
                    Zira <BadgeCheck className="size-4 text-clay" />
                  </h1>
                  <p className="text-xs font-medium text-leaf">{sending ? "typing…" : "here"}</p>
                </div>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Games"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenu(false);
                    setGame("hub");
                    setView("games");
                  }}
                >
                  <Gamepad2 className="size-5" />
                </button>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Call Zira"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenu(false);
                    if (quota.unlimited) setCallOpen(true);
                    else setView("paywall");
                  }}
                >
                  <Phone className="size-5" />
                </button>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Menu"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenu((open) => !open);
                  }}
                >
                  <span className="flex flex-col gap-1">
                    <span className="h-1 w-1 rounded-full bg-ink" />
                    <span className="h-1 w-1 rounded-full bg-ink" />
                    <span className="h-1 w-1 rounded-full bg-ink" />
                  </span>
                </button>
                <div
                  className={cn(
                    "absolute top-16 right-3 z-30 w-56 origin-top-right rounded-3xl border border-line bg-foam p-1.5 shadow-xl transition duration-200",
                    menu ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
                  )}
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <MenuButton
                    icon={<Gamepad2 className="size-4" />}
                    label="Play games"
                    onClick={() => {
                      setMenu(false);
                      setGame("hub");
                      setView("games");
                    }}
                  />
                  <MenuButton icon={<Share2 className="size-4" />} label="Share" onClick={() => void onShare()} />
                  <MenuButton
                    icon={<Star className="size-4" />}
                    label="Rate us"
                    onClick={() => {
                      setMenu(false);
                      setRateOpen(true);
                    }}
                  />
                  <MenuButton
                    icon={<MessageCircle className="size-4" />}
                    label="Contact"
                    onClick={() => {
                      setMenu(false);
                      setSupportOpen(true);
                    }}
                  />
                  <MenuButton
                    icon={<Sparkles className="size-4" />}
                    label="Zira+"
                    onClick={() => {
                      setMenu(false);
                      setView("paywall");
                    }}
                  />
                  <MenuButton icon={<Trash2 className="size-4" />} label="Clear chat" onClick={() => void onClear()} />
                  {gate ? (
                    <p className="px-3 py-2 text-xs text-mist">Signed in with your Grok account.</p>
                  ) : (
                    <MenuButton
                      icon={<X className="size-4" />}
                      label="Log out"
                      danger
                      onClick={() => {
                        void signOut("/login").catch(() => toast("Couldn't log out.", "bad"));
                      }}
                    />
                  )}
                </div>
              </header>
              {menu ? (
                <button
                  type="button"
                  aria-label="Close menu"
                  className="absolute inset-0 z-10"
                  onClick={() => setMenu(false)}
                />
              ) : null}

              <div ref={scroller} className="hide-scroll flex flex-1 flex-col gap-3 overflow-y-auto bg-wash px-4 py-4">
                <p className="mx-auto rounded-full bg-foam px-3 py-1 text-xs font-medium text-mist">You waved hi</p>
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={cn(
                      "bubble-in max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                      message.sender === "user"
                        ? "self-end rounded-br-md bg-line text-ink"
                        : "self-start rounded-bl-md border border-line bg-foam",
                    )}
                  >
                    {message.kind === "voice" ? (
                      <div className="mb-2 flex items-center gap-2">
                        {audioById[message.id] ? (
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-foam"
                            aria-label="Play voice note"
                            onClick={(event) => {
                              event.stopPropagation();
                              const clip = audioById[message.id];
                              if (clip) playAudio(clip);
                            }}
                          >
                            <Send className="size-3.5" />
                          </button>
                        ) : null}
                        <span className="wave flex h-4 items-end gap-0.5">
                          <span /><span /><span /><span /><span />
                        </span>
                      </div>
                    ) : null}
                    {message.body}
                  </article>
                ))}
                {sending ? (
                  <div className="flex w-fit gap-1 rounded-full border border-line bg-foam px-3 py-3">
                    <i className="typing-dot h-1.5 w-1.5 rounded-full bg-mist" />
                    <i className="typing-dot h-1.5 w-1.5 rounded-full bg-mist" />
                    <i className="typing-dot h-1.5 w-1.5 rounded-full bg-mist" />
                  </div>
                ) : null}
                {locked ? (
                  <button
                    type="button"
                    className="bubble-in relative mx-auto mt-2 w-[88%] rounded-3xl border border-clay bg-foam px-5 pt-7 pb-5 text-center"
                    onClick={(event) => {
                      event.stopPropagation();
                      setView("paywall");
                    }}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-lg bg-clay px-3 py-1 text-xs font-semibold text-foam">
                      Zira+
                    </span>
                    <p className="font-display text-2xl">continue talking</p>
                    <p className="mt-1 text-sm text-mist">20 free messages are used for today.</p>
                    <span className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-foam">
                      See ₹599 / month
                    </span>
                  </button>
                ) : null}
              </div>

              <footer className="border-t border-line bg-foam px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
                {!quota.unlimited ? (
                  <p className="mb-2 text-center text-xs text-mist">
                    {remaining} of {quota.limit} free left today
                  </p>
                ) : (
                  <p className="mb-2 text-center text-xs text-leaf">Zira+ · unlimited</p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ink"
                    aria-label="Voice note"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (locked) {
                        setView("paywall");
                        return;
                      }
                      void startRecorder("note");
                    }}
                  >
                    <Mic className="size-5" />
                  </button>
                  <div className="dock-stack">
                    <div data-open={phase === "idle"} className="relative">
                      <input
                        value={draft}
                        disabled={locked || sending}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") void onSendText();
                        }}
                        placeholder={locked ? "Daily limit reached" : "type your message"}
                        className="h-12 w-full rounded-full border border-line bg-wash px-4 text-base outline-none focus:border-clay disabled:text-mist"
                      />
                      {locked ? (
                        <button
                          type="button"
                          className="absolute inset-0 rounded-full"
                          aria-label="Open Zira+"
                          onClick={(event) => {
                            event.stopPropagation();
                            setView("paywall");
                          }}
                        />
                      ) : null}
                    </div>
                    <div
                      data-open={phase === "recording"}
                      className="flex h-12 items-center gap-3 rounded-full border border-line bg-wash px-4"
                    >
                      <span className="rec-dot" />
                      <span className="flex-1 text-sm font-semibold">
                        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-foam"
                        aria-label="Stop recording"
                        onClick={(event) => {
                          event.stopPropagation();
                          void haltRecording();
                        }}
                      >
                        <Square className="size-3.5 fill-current" />
                      </button>
                    </div>
                    <div
                      data-open={phase === "review"}
                      className="flex h-12 items-center gap-2 rounded-full border border-line bg-wash px-3"
                    >
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center text-mist"
                        aria-label="Delete voice note"
                        onClick={(event) => {
                          event.stopPropagation();
                          setVoiceBlob(null);
                          setPhase("idle");
                        }}
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <span className="wave flex h-4 flex-1 items-end justify-center gap-0.5">
                        <span /><span /><span /><span /><span />
                      </span>
                      <span className="text-xs font-semibold text-mist">Ready</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="tap flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clay text-foam disabled:opacity-50"
                    aria-label="Send"
                    disabled={sending}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (phase === "review") void sendVoiceNote();
                      else void onSendText();
                    }}
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </footer>
            </section>

            <section className="view-pane hide-scroll relative overflow-y-auto bg-foam" data-open={view === "paywall"}>
              <button
                type="button"
                className="absolute top-[max(12px,env(safe-area-inset-top))] right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foam"
                aria-label="Close"
                onClick={(event) => {
                  event.stopPropagation();
                  setView("chat");
                }}
              >
                <X className="size-4" />
              </button>
              <div className="flex flex-col items-center bg-paper px-6 pt-16 pb-8">
                <img
                  src="/zira/portrait.jpg"
                  alt=""
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-foam"
                />
                <p className="mt-4 rounded-full bg-foam px-3 py-1 text-xs font-semibold tracking-wide text-clay">
                  YOUR EVERYDAY COMPANION
                </p>
              </div>
              <div className="border-b border-line px-6 py-6 text-center">
                <div className="mb-3 flex justify-center gap-1 text-clay">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 fill-clay" />
                  ))}
                </div>
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${reviewIndex * 100}%)` }}
                  >
                    {REVIEWS.map((review) => (
                      <figure key={review.author} className="w-full shrink-0 px-4">
                        <blockquote className="font-display text-xl leading-snug">“{review.text}”</blockquote>
                        <figcaption className="mt-2 text-sm font-semibold text-mist">{review.author}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-paper px-3 py-1 text-xs font-semibold">ZIRA+</span>
                  <span className="rounded-xl bg-paper px-3 py-1 text-xs font-semibold text-leaf">Unlimited</span>
                </div>
                <p className="font-display mt-4 text-5xl">₹599</p>
                <p className="text-sm text-mist">per month · cancel anytime</p>
                <ul className="mt-6 flex flex-col gap-3 text-sm font-medium">
                  <li>20 free messages a day, or no cap</li>
                  <li>Calls and voice notes included</li>
                  <li>Chess with Zira while she talks</li>
                </ul>
                <button
                  type="button"
                  className="tap mt-8 h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam"
                  onClick={(event) => {
                    event.stopPropagation();
                    setPayNote(true);
                  }}
                >
                  Continue with Zira+
                </button>
                <p className="mt-4 text-center text-xs leading-relaxed text-mist">
                  Razorpay is not connected yet, so this button does not charge you.{" "}
                  <Link to="/legal/$page" params={{ page: "terms" }} className="underline">
                    Terms
                  </Link>
                  {" · "}
                  <Link to="/legal/$page" params={{ page: "privacy" }} className="underline">
                    Privacy
                  </Link>
                  {" · "}
                  <Link to="/legal/$page" params={{ page: "refund" }} className="underline">
                    Refunds
                  </Link>
                </p>
              </div>
            </section>

            <section className="view-pane relative overflow-hidden bg-ink" data-open={view === "story"}>
              <img src="/zira/story.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 top-0 z-10 px-3 pt-[max(12px,env(safe-area-inset-top))]">
                <div className="h-1 overflow-hidden rounded-full bg-foam/40">
                  <div className="h-full bg-foam" style={{ width: `${storyProgress}%` }} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-foam">
                  <img src="/zira/portrait.jpg" alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="text-sm font-semibold">Zira</span>
                  <span className="text-xs text-foam/80">2h</span>
                  <button
                    type="button"
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-foam text-ink"
                    aria-label="Close story"
                    onClick={(event) => {
                      event.stopPropagation();
                      setView("chat");
                    }}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="absolute inset-0"
                aria-label="Hold to pause"
                onPointerDown={() => setStoryPaused(true)}
                onPointerUp={() => {
                  if (!sheet) setStoryPaused(false);
                }}
                onPointerLeave={() => {
                  if (!sheet) setStoryPaused(false);
                }}
              />
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-[max(16px,env(safe-area-inset-bottom))] transition-transform",
                  sheet ? "translate-y-full" : "translate-y-0",
                )}
              >
                <button
                  type="button"
                  className="mx-auto h-9 rounded-full bg-foam/20 px-4 text-xs font-semibold text-foam"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSheet(true);
                    setStoryPaused(true);
                  }}
                >
                  View replies ({replyCount})
                </button>
                <div className="flex items-center gap-2 rounded-full border border-foam/40 bg-ink/40 px-4">
                  <input
                    value={storyDraft}
                    onChange={(event) => setStoryDraft(event.target.value)}
                    onFocus={() => setStoryPaused(true)}
                    onBlur={() => {
                      if (!sheet) setStoryPaused(false);
                    }}
                    placeholder="Reply to Zira"
                    className="h-12 min-w-0 flex-1 bg-transparent text-base text-foam outline-none placeholder:text-foam/70"
                  />
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-clay text-foam"
                    aria-label="Send reply"
                    onClick={(event) => {
                      event.stopPropagation();
                      void onStoryReply();
                    }}
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
              <div className="story-sheet z-20 flex flex-col rounded-t-3xl bg-foam px-5 pt-3" data-open={sheet}>
                <button
                  type="button"
                  className="mx-auto mb-3 h-8 w-16"
                  aria-label="Close replies"
                  onPointerDown={(event) => {
                    dragY.current = event.clientY;
                  }}
                  onPointerUp={(event) => {
                    if (event.clientY - dragY.current > 40) {
                      setSheet(false);
                      setStoryPaused(false);
                    }
                  }}
                >
                  <span className="mx-auto block h-1.5 w-10 rounded-full bg-line" />
                </button>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold">Story replies</h2>
                  <button
                    type="button"
                    className="text-sm font-semibold text-clay"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSheet(false);
                      setStoryPaused(false);
                    }}
                  >
                    Done
                  </button>
                </div>
                <div className="hide-scroll flex flex-1 flex-col gap-4 overflow-y-auto pb-6">
                  {home.replies.map((reply) => (
                    <ReplyRow key={reply.id} name="You" body={reply.body} time="now" />
                  ))}
                  {SEED_REPLIES.map((reply) => (
                    <ReplyRow key={reply.name} name={reply.name} body={reply.body} time={reply.time} />
                  ))}
                </div>
              </div>
            </section>

            <section className="view-pane bg-wash" data-open={view === "games"}>
              <header className="flex items-center justify-between border-b border-line bg-foam px-4 py-3 pt-[max(12px,env(safe-area-inset-top))]">
                <h2 className="font-display text-2xl">Games with Zira</h2>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-wash"
                  aria-label="Close games"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (game === "chess") setGame("hub");
                    else setView("chat");
                  }}
                >
                  <X className="size-4" />
                </button>
              </header>
              <div className="hide-scroll flex-1 overflow-y-auto p-4">
                {game === "hub" ? (
                  <>
                    <div className="rounded-3xl bg-ink p-5 text-foam">
                      <p className="font-display text-3xl">Unlock your mind</p>
                      <p className="mt-1 text-sm text-foam/80">Short games. She talks while you play.</p>
                    </div>
                    <button
                      type="button"
                      className="tap mt-4 w-full rounded-3xl border border-line bg-foam p-5 text-left"
                      onClick={(event) => {
                        event.stopPropagation();
                        setGame("chess");
                      }}
                    >
                      <p className="text-xs font-semibold text-leaf">Live</p>
                      <h3 className="mt-2 text-lg font-semibold">Chess</h3>
                      <p className="mt-1 text-sm text-mist">You play white. She answers, then she comments.</p>
                    </button>
                    <div className="mt-3 rounded-3xl border border-line bg-foam p-5 opacity-70">
                      <p className="text-xs font-semibold text-mist">Soon</p>
                      <h3 className="mt-2 text-lg font-semibold">20 questions</h3>
                      <p className="mt-1 text-sm text-mist">Think of anything. She has twenty tries.</p>
                    </div>
                  </>
                ) : (
                  <ChessBoard
                    userId={user.id}
                    speaking={chessListen}
                    remoteLine={chessLine}
                    onSpeak={() => {
                      if (chessListen) void haltRecording();
                      else void startRecorder("chess");
                    }}
                  />
                )}
              </div>
            </section>
          </div>
        ) : null}

        <div className="veil" data-open={Boolean(home && !home.profile.ageOk)}>
          <div className="sheet w-full rounded-3xl bg-foam p-6" onPointerDown={(event) => event.stopPropagation()}>
            <h2 className="font-display text-3xl">One last step</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              Zira is for people 13 and older. Confirm that, and the terms, before the first message.
            </p>
            <input
              value={ageName}
              onChange={(event) => setAgeName(event.target.value)}
              placeholder="Your name"
              className="mt-4 h-12 w-full rounded-2xl border border-line bg-wash px-4 outline-none focus:border-clay"
            />
            <button
              type="button"
              disabled={ageBusy}
              className="tap mt-4 h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam disabled:opacity-60"
              onClick={(event) => {
                event.stopPropagation();
                void onAcceptAge();
              }}
            >
              {ageBusy ? "Saving…" : "I'm 13+ and I agree"}
            </button>
            <p className="mt-3 text-center text-xs text-mist">
              <Link to="/legal/$page" params={{ page: "terms" }} className="underline">
                Terms
              </Link>
              {" · "}
              <Link to="/legal/$page" params={{ page: "privacy" }} className="underline">
                Privacy
              </Link>
            </p>
          </div>
        </div>

        <div className="veil" data-open={callOpen} onClick={() => setCallOpen(false)}>
          <div
            className="sheet mb-2 w-full max-w-sm rounded-3xl bg-foam p-6 text-center"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <img src="/zira/portrait.jpg" alt="" className="mx-auto h-16 w-16 rounded-full object-cover" />
            <h2 className="font-display mt-3 text-3xl">Call Zira</h2>
            <p className="mt-2 text-sm text-mist">{callLine}</p>
            <button
              type="button"
              className="tap mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-foam"
              onClick={(event) => {
                event.stopPropagation();
                if (callLive) void haltRecording();
                else void startRecorder("call");
              }}
            >
              {callLive ? <Square className="size-4" /> : <Mic className="size-4" />}
              {callLive ? "Stop and send" : sending ? "She's answering…" : "Speak"}
            </button>
            <button
              type="button"
              className="mt-2 h-11 w-full text-sm font-semibold text-mist"
              onClick={(event) => {
                event.stopPropagation();
                setCallOpen(false);
              }}
            >
              Hang up
            </button>
          </div>
        </div>

        <div className="veil" data-open={rateOpen}>
          <div className="sheet relative w-full rounded-3xl bg-foam p-6 text-center" onPointerDown={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-wash"
              aria-label="Close rating"
              onClick={(event) => {
                event.stopPropagation();
                setRateOpen(false);
              }}
            >
              <X className="size-4" />
            </button>
            <div className="fade-swap mt-4">
              <div data-open={rated == null}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper text-clay">
                  <Star className="size-6" />
                </div>
                <h2 className="font-display mt-3 text-3xl">Enjoying Zira?</h2>
                <p className="mt-1 text-sm text-mist">Tap a star. It stays with Vellox Labs.</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="flex h-11 w-11 items-center justify-center"
                      aria-label={`${star} stars`}
                      onPointerEnter={() => setHoverStar(star)}
                      onPointerLeave={() => setHoverStar(0)}
                      onClick={(event) => {
                        event.stopPropagation();
                        void onRate(star);
                      }}
                    >
                      <Star className={cn("size-7", (hoverStar || 0) >= star ? "fill-clay text-clay" : "text-line")} />
                    </button>
                  ))}
                </div>
              </div>
              <div data-open={rated != null} className="py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper text-leaf">
                  <BadgeCheck className="size-7" />
                </div>
                <h2 className="font-display mt-3 text-3xl text-leaf">Saved</h2>
                <p className="mt-1 text-sm text-mist">Thank you — {rated} stars.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="veil" data-open={supportOpen}>
          <div className="sheet w-full rounded-3xl bg-foam p-6" onPointerDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="font-display text-3xl">Need us?</h2>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-wash"
                aria-label="Close contact"
                onClick={(event) => {
                  event.stopPropagation();
                  setSupportOpen(false);
                }}
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-mist">This goes straight to the Vellox Labs inbox for this app.</p>
            <textarea
              value={supportText}
              onChange={(event) => setSupportText(event.target.value)}
              placeholder="What's wrong, or what should change?"
              className="mt-4 h-28 w-full resize-none rounded-2xl border border-line bg-wash p-3 text-base outline-none focus:border-clay"
            />
            <button
              type="button"
              className="tap mt-3 h-12 w-full rounded-full bg-ink text-sm font-semibold text-foam"
              onClick={(event) => {
                event.stopPropagation();
                void onSupport();
              }}
            >
              Send
            </button>
          </div>
        </div>

        <div className="veil" data-open={payNote}>
          <div className="sheet w-full rounded-3xl bg-foam p-6" onPointerDown={(event) => event.stopPropagation()}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-paper text-clay">
              <Lock className="size-5" />
            </div>
            <h2 className="font-display mt-3 text-3xl">No charge yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              Razorpay isn't connected, so ₹599 cannot be collected. Test unlock turns on Zira+ for 30 days on
              this account only. Remove it before you take real payments.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="h-12 flex-1 rounded-full bg-wash text-sm font-semibold"
                onClick={(event) => {
                  event.stopPropagation();
                  setPayNote(false);
                }}
              >
                Not now
              </button>
              <button
                type="button"
                disabled={unlocking}
                className="tap h-12 flex-1 rounded-full bg-ink text-sm font-semibold text-foam disabled:opacity-60"
                onClick={(event) => {
                  event.stopPropagation();
                  void onUnlock();
                }}
              >
                {unlocking ? "Unlocking…" : "Test unlock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-full items-center gap-2 rounded-2xl px-3 text-left text-sm font-semibold",
        danger ? "text-clay-deep" : "text-ink",
      )}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function ReplyRow({ name, body, time }: { name: string; body: string; time: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-semibold text-clay">
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-sm text-mist">{body}</p>
        <p className="text-xs text-mist">{time}</p>
      </div>
    </div>
  );
}
