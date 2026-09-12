"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({
  initialValue = "",
  size = "lg",
}: {
  initialValue?: string;
  size?: "lg" | "md";
}) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const inputClass =
    size === "lg"
      ? "px-5 py-4 text-base sm:text-lg"
      : "px-4 py-3 text-sm sm:text-base";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="팰리세이드 / GV80 / 쏘나타 2022"
          className={`flex-1 rounded-xl border border-gray-300 shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none ${inputClass}`}
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-4 transition-colors shrink-0"
        >
          🔍 리콜 조회
        </button>
      </div>
    </form>
  );
}
