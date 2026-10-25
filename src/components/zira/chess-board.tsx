import { useEffect, useMemo, useState } from "react";
import { Chess, type Square } from "chess.js";
import { Mic, RotateCcw } from "lucide-react";
import { pickBlackMove } from "@/lib/chess-brain";

const GLYPH: Record<string, string> = {
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
  bp: "♟",
};

function lineFor(san: string): string {
  if (san.includes("#")) return "Checkmate. Main haar gayi… ya tu. Dekh lena.";
  if (san.includes("+")) return "Check. Saans lo, phir socho.";
  if (san.includes("x")) return "Oho, piece gaya. Tension mat le.";
  const lines = [
    "Achha. Ab meri baari.",
    "Soch samajh ke chalna.",
    "Theek hai, main yahin se khelti hoon.",
    "Hmm. Interesting scene.",
  ];
  return lines[san.charCodeAt(0) % lines.length] ?? lines[0]!;
}

export function ChessBoard({
  userId,
  onSpeak,
  speaking,
  remoteLine,
}: {
  userId: string;
  onSpeak: () => void;
  speaking: boolean;
  remoteLine: string | null;
}) {
  const storageKey = `zira-fen:${userId}`;
  const [chess] = useState(() => {
    const game = new Chess();
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) game.load(saved);
    }
    return game;
  });
  const [fen, setFen] = useState(chess.fen());
  const [selected, setSelected] = useState<Square | null>(null);
  const [thinking, setThinking] = useState(false);
  const [banter, setBanter] = useState("Chal, safed teri hai. Soch samajh ke.");
  const [last, setLast] = useState<string | null>(null);

  const legal = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set(chess.moves({ square: selected, verbose: true }).map((move) => move.to));
  }, [chess, selected, fen]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, fen);
  }, [fen, storageKey]);

  useEffect(() => {
    if (remoteLine) setBanter(remoteLine);
  }, [remoteLine]);

  function commit(nextBanter?: string) {
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

  function onSquare(square: Square) {
    if (thinking || chess.turn() !== "w" || chess.isGameOver()) return;
    const piece = chess.get(square);
    if (selected && legal.has(square)) {
      const played = chess.move({ from: selected, to: square, promotion: "q" });
      if (!played) return;
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
  const status = chess.isCheckmate()
    ? chess.turn() === "w"
      ? "Zira wins"
      : "You win"
    : chess.isDraw()
      ? "Draw"
      : thinking
        ? "Zira is thinking"
        : chess.inCheck()
          ? "Check — your move"
          : "Your move";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-3xl border border-line bg-foam p-3">
        <img src="/zira/portrait.jpg" alt="" className="h-11 w-11 rounded-full object-cover" />
        <p className="text-sm leading-snug font-medium text-ink">“{banter}”</p>
      </div>
      <div className="grid grid-cols-8 overflow-hidden rounded-2xl border border-line">
        {board.map((row, rank) =>
          row.map((piece, file) => {
            const square = `${"abcdefgh"[file]}${8 - rank}` as Square;
            const dark = (rank + file) % 2 === 1;
            const glyph = piece ? GLYPH[`${piece.color}${piece.type}`] : "";
            const isSelected = selected === square;
            const isLegal = legal.has(square);
            const isLast = last === square;
            return (
              <button
                key={square}
                type="button"
                aria-label={square}
                onClick={(event) => {
                  event.stopPropagation();
                  onSquare(square);
                }}
                className={`relative flex aspect-square items-center justify-center ${
                  isSelected ? "bg-clay/30" : isLast ? "bg-paper" : dark ? "bg-line" : "bg-foam"
                }`}
              >
                {glyph ? (
                  <span
                    className={`chess-glyph ${piece?.color === "w" ? "text-clay-deep" : "text-ink"}`}
                  >
                    {glyph}
                  </span>
                ) : null}
                {isLegal ? (
                  <span className="absolute h-2.5 w-2.5 rounded-full bg-clay/80" />
                ) : null}
              </button>
            );
          }),
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-mist">{status}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="tap flex h-11 items-center gap-1.5 rounded-full border border-line bg-foam px-3 text-sm font-semibold"
            onClick={(event) => {
              event.stopPropagation();
              onSpeak();
            }}
          >
            <Mic className={`size-4 ${speaking ? "text-clay" : ""}`} />
            {speaking ? "Listening" : "Speak"}
          </button>
          <button
            type="button"
            className="tap flex h-11 items-center gap-1.5 rounded-full border border-line bg-foam px-3 text-sm font-semibold"
            onClick={(event) => {
              event.stopPropagation();
              reset();
            }}
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
