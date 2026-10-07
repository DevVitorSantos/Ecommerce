"use client";

import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [left, setLeft] = useState(9 * 3600 + 42 * 60 + 18);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 24 * 3600)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  const box = "flex min-w-[52px] flex-col items-center rounded-lg bg-slate-100 px-3 py-1.5";

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-bold uppercase text-slate-500 sm:inline">Termina em:</span>
      <div className={box}>
        <span className="font-bold text-indigo-600">{pad(h)}</span>
        <span className="text-[10px] font-normal text-slate-500">HORAS</span>
      </div>
      <span className="font-bold text-indigo-600">:</span>
      <div className={box}>
        <span className="font-bold text-indigo-600">{pad(m)}</span>
        <span className="text-[10px] font-normal text-slate-500">MIN</span>
      </div>
      <span className="font-bold text-indigo-600">:</span>
      <div className={box}>
        <span className="font-bold text-red-600">{pad(s)}</span>
        <span className="text-[10px] font-normal text-slate-500">SEG</span>
      </div>
    </div>
  );
}
