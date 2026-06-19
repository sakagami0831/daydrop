"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDayDrop } from "@/lib/store";
import { AuthPanel } from "./AuthPanel";

const navItems = [
  { label: "\u30db\u30fc\u30e0", href: "/", icon: "H" },
  { label: "\u898b\u3064\u3051\u308b", href: "/discover", icon: "S" },
  { label: "\u304a\u6c17\u306b\u5165\u308a", href: "#", icon: "*", pending: true },
  { label: "\u304a\u77e5\u3089\u305b", href: "/notifications", icon: "N" },
  { label: "\u30b3\u30a4\u30f3\u30b7\u30e7\u30c3\u30d7", href: "#", icon: "C", pending: true },
  { label: "\u79f0\u53f7\u30fb\u5b9f\u7e3e", href: "/mypage", icon: "T" },
];

const bottomNavItems = [
  { label: "\u30db\u30fc\u30e0", href: "/", icon: "H" },
  { label: "\u898b\u3064\u3051\u308b", href: "/discover", icon: "S" },
  {
    label: "\u65e5\u8a18\u3092\u66f8\u304f",
    href: "/compose",
    icon: "W",
    primary: true,
  },
  { label: "\u304a\u77e5\u3089\u305b", href: "/notifications", icon: "N" },
  { label: "\u30de\u30a4\u30da\u30fc\u30b8", href: "/mypage", icon: "M" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useDayDrop();
  const [notice, setNotice] = useState("");

  if (!currentUser) {
    return <AuthPanel />;
  }

  return (
    <div className="min-h-screen bg-[#fbfaff] text-[#363142]">
      <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-3 px-3 pb-24 pt-3 lg:grid-cols-[205px_minmax(0,1fr)] lg:px-4">
        <aside className="hidden lg:sticky lg:top-3 lg:block lg:h-[calc(100vh-1.5rem)]">
          <div className="flex h-full flex-col rounded-2xl border border-[#ece7fb] bg-white/90 p-3 shadow-[0_10px_28px_rgba(126,112,174,0.10)]">
            <Link href="/" className="mb-3 block px-1">
              <p className="font-serif text-3xl font-black tracking-wide text-[#9b8be8]">
                DayDrop
              </p>
              <p className="text-xs font-bold text-[#b9addd]">
                {"\u3067\u3044\u3069\u308d"}
              </p>
            </Link>

            <nav className="grid gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href && !item.pending;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(event) => {
                      if (item.pending) {
                        event.preventDefault();
                        setNotice("\u3053\u306e\u6a5f\u80fd\u306f\u6e96\u5099\u4e2d\u3067\u3059\u3002");
                      }
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                      active
                        ? "bg-[#f0edff] text-[#7c6ee6]"
                        : "text-[#6f6a7e] hover:bg-[#faf8ff] hover:text-[#7c6ee6]"
                    }`}
                  >
                    <span className="grid size-6 place-items-center rounded-lg border border-[#e7e1fb] text-[11px] font-black leading-none">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto grid gap-2">
              <div className="rounded-xl border border-[#f0eafb] bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#a6a0b7]">
                    {"\u6240\u6301\u30b3\u30a4\u30f3"}
                  </p>
                  <p className="font-black">C {currentUser.coinBalance}</p>
                </div>
                <button
                  onClick={() => setNotice("\u30b3\u30a4\u30f3\u8ffd\u52a0\u306f\u6e96\u5099\u4e2d\u3067\u3059\u3002")}
                  className="mt-2 w-full rounded-full bg-[#f2efff] px-3 py-1.5 text-xs font-black text-[#7c6ee6]"
                >
                  {"\u30b3\u30a4\u30f3\u3092\u8ffd\u52a0"}
                </button>
              </div>

              <Link
                href="/compose"
                className="rounded-full bg-[#8b7cf6] px-4 py-2.5 text-center text-sm font-black text-white shadow-[0_10px_20px_rgba(139,124,246,0.24)]"
              >
                {"\u65e5\u8a18\u3092\u66f8\u304f"}
              </Link>

              <div className="rounded-xl border border-[#f0eafb] bg-white p-3 text-xs leading-5 shadow-sm">
                <p className="font-black text-[#7c6ee6]">
                  {"\u4f7f\u3044\u65b9\u30ac\u30a4\u30c9"}
                </p>
                <p className="mt-1 text-[#7b748c]">
                  {"\u30db\u30fc\u30e0\u3067\u65e5\u8a18\u3092\u8aad\u307f\u3001\u611f\u60f3\u3092\u5c4a\u3051\u3088\u3046\u3002"}
                </p>
              </div>
              {notice ? (
                <p className="rounded-xl bg-[#fbfaff] px-3 py-2 text-xs font-bold text-[#7c6ee6]">
                  {notice}
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-4xl rounded-2xl border border-[#ece7fb] bg-white/95 px-3 py-2 shadow-[0_12px_28px_rgba(126,112,174,0.16)] backdrop-blur">
        <div className="grid grid-cols-5 items-center gap-1">
          {bottomNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-bold ${
                  item.primary
                    ? "scale-105 bg-[#8b7cf6] text-white shadow-[0_8px_18px_rgba(139,124,246,0.24)]"
                    : active
                      ? "bg-[#f0edff] text-[#7c6ee6]"
                      : "text-[#80798f]"
                }`}
              >
                <span className="text-sm leading-none">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
