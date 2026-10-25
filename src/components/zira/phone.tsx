import type { ReactNode } from "react";

export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="phone-stage">
      <div className="phone-frame">{children}</div>
    </div>
  );
}
