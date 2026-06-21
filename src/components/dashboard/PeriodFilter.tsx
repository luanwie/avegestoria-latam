"use client";

import { useRouter, useSearchParams } from "next/navigation";

const periods = [
  { value: "7", label: "7 días" },
  { value: "30", label: "30 días" },
  { value: "60", label: "60 días" },
];

export default function PeriodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("periodo") || "7";

  function setPeriod(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("periodo", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="inline-flex bg-emerald-900/40 border border-emerald-800/40 rounded-lg p-0.5">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => setPeriod(p.value)}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
            current === p.value
              ? "bg-emerald-700/50 text-stone-100"
              : "text-stone-400 hover:text-stone-300"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
