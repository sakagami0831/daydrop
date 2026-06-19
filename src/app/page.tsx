"use client";

import { AppShell } from "@/components/AppShell";
import { DiaryCard } from "@/components/DiaryCard";
import { useDayDrop } from "@/lib/store";
import { useState } from "react";

const tabs = [
  "\u304a\u3059\u3059\u3081",
  "\u6025\u4e0a\u6607",
  "\u65b0\u7740",
  "\u307f\u3093\u306a\u306e\u6295\u7a3f",
];

export default function Home() {
  const { currentUser, searchDiaries, notifications } = useDayDrop();
  const [query, setQuery] = useState("");
  const diaries = searchDiaries(query);
  const unreadCount = currentUser
    ? notifications.filter(
        (notification) => notification.userId === currentUser.id && !notification.read,
      ).length
    : 0;

  return (
    <AppShell>
      <div className="grid gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-2.5 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black tracking-[0.22em] text-[#9b94aa]">
                {"\u8aad\u3093\u3067\u304f\u308c\u3066\u3001\u3042\u308a\u304c\u3068\u3046\u3002"}
              </p>
              <h1 className="mt-1 truncate text-xl font-black tracking-[0.06em] text-[#363142] md:text-2xl">
                {"\u307f\u3093\u306a\u306e\u65e5\u8a18\u3092\u8aad\u3093\u3067\u3001"}
                <span className="text-[#8b7cf6]">{"\u611f\u60f3"}</span>
                {"\u3092\u5c4a\u3051\u3088\u3046"}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <span className="rounded-full border border-[#ece7fb] bg-white px-2.5 py-1 text-xs font-black">
                coin {currentUser?.coinBalance ?? 0}
              </span>
              <span className="rounded-full border border-[#ece7fb] bg-white px-2.5 py-1 text-xs font-black">
                {"\u901a\u77e5"} {unreadCount}
              </span>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-2.5 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-4 gap-1.5">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                    index === 0
                      ? "border-[#ded7fb] bg-[#f0edff] text-[#7c6ee6]"
                      : "border-transparent bg-white text-[#6f6a7e]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <label className="flex min-w-0 items-center gap-2 rounded-full border border-[#ece7fb] bg-white px-3 py-1.5 text-xs text-[#9b94aa] xl:w-60">
              <span>{"\u691c\u7d22"}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent outline-none"
                placeholder={"\u30ad\u30fc\u30ef\u30fc\u30c9"}
              />
            </label>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {diaries.length === 0 ? (
            <p className="rounded-2xl border border-[#ece7fb] bg-white p-4 text-sm text-[#9b94aa] shadow-sm sm:col-span-2 xl:col-span-3">
              {"\u307e\u3060\u5c4a\u3044\u3066\u3044\u308b\u65e5\u8a18\u306f\u3042\u308a\u307e\u305b\u3093\u3002"}
            </p>
          ) : (
            diaries.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
          )}
        </section>

        <button className="mx-auto rounded-full bg-white px-7 py-2 text-xs font-black text-[#9b94aa] shadow-sm">
          {"\u3082\u3063\u3068\u898b\u308b"}
        </button>
      </div>
    </AppShell>
  );
}
