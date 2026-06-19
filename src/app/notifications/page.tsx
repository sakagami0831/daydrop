"use client";

import { AppShell } from "@/components/AppShell";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <AppShell>
      <div className="mx-auto grid max-w-3xl gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u304a\u77e5\u3089\u305b"}
          </p>
          <h1 className="mt-1 text-2xl font-black">
            {"\u5c4a\u3044\u305f\u3053\u3068"}
          </h1>
          <p className="mt-1 text-sm leading-6 text-[#746d82]">
            {"\u65e5\u8a18\u3001\u611f\u60f3\u3001\u30d5\u30a9\u30ed\u30fc\u306e\u901a\u77e5\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002"}
          </p>
        </header>
        <NotificationsPanel />
      </div>
    </AppShell>
  );
}
