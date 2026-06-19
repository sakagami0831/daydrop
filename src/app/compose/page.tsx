"use client";

import { AppShell } from "@/components/AppShell";
import { Composer } from "@/components/Composer";

export default function ComposePage() {
  return (
    <AppShell>
      <div className="mx-auto grid max-w-3xl gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u65e5\u8a18\u3092\u66f8\u304f"}
          </p>
          <h1 className="mt-1 text-2xl font-black">
            {"\u4eca\u65e5\u306e\u65e5\u8a18\u3092\u5c4a\u3051\u308b"}
          </h1>
          <p className="mt-1 text-sm leading-6 text-[#746d82]">
            {"\u66f8\u3044\u305f\u65e5\u8a18\u306f\u3001\u9078\u3093\u3060\u516c\u958b\u7bc4\u56f2\u306e\u76f8\u624b\u306b\u5c4a\u304d\u307e\u3059\u3002"}
          </p>
        </header>
        <Composer />
      </div>
    </AppShell>
  );
}
