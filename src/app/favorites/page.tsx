"use client";

import { AppShell } from "@/components/AppShell";
import { DiaryCard } from "@/components/DiaryCard";
import type { Diary } from "@/lib/daydrop";
import { useDayDrop } from "@/lib/store";

export default function FavoritesPage() {
  const { currentUser, diaries, favoriteDiaryIds, getVisibleDiaries } =
    useDayDrop();

  if (!currentUser) {
    return null;
  }

  const visibleIds = new Set(getVisibleDiaries().map((diary) => diary.id));
  const favorites = (favoriteDiaryIds[currentUser.id] ?? [])
    .map((id) => diaries.find((diary) => diary.id === id))
    .filter(
      (diary): diary is Diary => Boolean(diary && visibleIds.has(diary.id)),
    );

  return (
    <AppShell>
      <div className="grid gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u304a\u6c17\u306b\u5165\u308a"}
          </p>
          <h1 className="mt-1 text-2xl font-black">
            {"\u307e\u305f\u8aad\u307f\u305f\u3044\u65e5\u8a18"}
          </h1>
          <p className="mt-1 text-sm text-[#746d82]">
            {"\u5fc3\u306b\u6b8b\u3063\u305f\u65e5\u8a18\u3092\u3068\u3063\u3066\u304a\u3051\u307e\u3059\u3002"}
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {favorites.length === 0 ? (
            <p className="rounded-2xl border border-[#ece7fb] bg-white p-4 text-sm text-[#9b94aa] shadow-sm sm:col-span-2 lg:col-span-3">
              {"\u307e\u3060\u304a\u6c17\u306b\u5165\u308a\u306e\u65e5\u8a18\u306f\u3042\u308a\u307e\u305b\u3093\u3002"}
            </p>
          ) : (
            favorites.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
          )}
        </section>
      </div>
    </AppShell>
  );
}
