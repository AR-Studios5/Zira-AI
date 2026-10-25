import { Chess, type Move } from "chess.js";

const VALUE: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
};

function evaluate(chess: Chess): number {
  if (chess.isCheckmate()) return chess.turn() === "w" ? -100000 : 100000;
  if (chess.isDraw()) return 0;
  let score = 0;
  for (const row of chess.board()) {
    for (const piece of row) {
      if (!piece) continue;
      const value = VALUE[piece.type] ?? 0;
      score += piece.color === "w" ? value : -value;
    }
  }
  return score;
}

function ordered(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => Number(Boolean(b.captured)) - Number(Boolean(a.captured)));
}

function search(chess: Chess, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || chess.isGameOver()) return evaluate(chess);
  const moves = ordered(chess.moves({ verbose: true }));
  const maximizing = chess.turn() === "w";
  if (maximizing) {
    let value = -1_000_000;
    for (const move of moves) {
      chess.move(move);
      value = Math.max(value, search(chess, depth - 1, alpha, beta));
      chess.undo();
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  }
  let value = 1_000_000;
  for (const move of moves) {
    chess.move(move);
    value = Math.min(value, search(chess, depth - 1, alpha, beta));
    chess.undo();
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return value;
}

export function pickBlackMove(chess: Chess): Move | null {
  const moves = ordered(chess.moves({ verbose: true }));
  if (moves.length === 0) return null;
  let best = moves[0]!;
  let bestScore = Infinity;
  for (const move of moves) {
    chess.move(move);
    const score = search(chess, 1, -1_000_000, 1_000_000);
    chess.undo();
    const jitter = (move.san.charCodeAt(0) % 5) - 2;
    const ranked = score + jitter;
    if (ranked < bestScore) {
      bestScore = ranked;
      best = move;
    }
  }
  return best;
}
