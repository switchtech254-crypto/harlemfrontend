"use client";

import { useEffect, useState } from "react";

/** Counts down to `endsAt` using the server's clock, so a wrong device clock can't skew it. */
export function Countdown({ endsAt, serverTime }: { endsAt: string; serverTime: string }) {
  const [left, setLeft] = useState("--:--:--");

  useEffect(() => {
    const offset = new Date(serverTime).getTime() - Date.now();
    const end = new Date(endsAt).getTime();
    const pad = (n: number) => String(n).padStart(2, "0");

    const tick = () => {
      const s = Math.max(0, Math.floor((end - (Date.now() + offset)) / 1000));
      const d = Math.floor(s / 86400);
      setLeft(
        `${d > 0 ? `${d}d ` : ""}${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`,
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, serverTime]);

  return <>{left}</>;
}