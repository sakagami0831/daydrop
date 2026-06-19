"use client";

import Link from "next/link";
import { useDayDrop } from "@/lib/store";
import { AuthPanel } from "./AuthPanel";
import { NotificationsPanel } from "./NotificationsPanel";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser } = useDayDrop();

  if (!currentUser) {
    return <AuthPanel />;
  }

  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#3d332b]">
      <header className="sticky top-0 z-20 border-b border-[#f2e4d6] bg-[#fffdf9]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#ffdfe8] text-lg font-bold text-[#9b4c64]">
              D
            </span>
            <span>
              <span className="block text-lg font-bold leading-5">DayDrop</span>
              <span className="block text-xs text-[#9f8574]">でいどろ</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-[#f2e4d6] bg-white px-3 py-2 text-sm shadow-sm">
            <span className="grid size-7 place-items-center rounded-full bg-[#fff1c6] font-bold text-[#9b6b20]">
              {currentUser.avatar}
            </span>
            <span className="max-w-24 truncate font-semibold">
              {currentUser.name}
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-4 pb-24 md:grid-cols-[1fr_320px] md:items-start">
        <div className="min-w-0">{children}</div>
        <aside className="hidden md:block">
          <NotificationsPanel />
        </aside>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#f2e4d6] bg-white/95 p-3 backdrop-blur md:hidden">
        <NotificationsPanel compact />
      </div>
    </div>
  );
}

