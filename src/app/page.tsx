"use client";

import { AppShell } from "@/components/AppShell";
import { Composer } from "@/components/Composer";
import { DiaryCard } from "@/components/DiaryCard";
import { ProfilePanel } from "@/components/ProfilePanel";
import { useDayDrop } from "@/lib/store";

export default function Home() {
  const { getVisibleDiaries } = useDayDrop();
  const diaries = getVisibleDiaries();

  return (
    <AppShell>
      <div className="grid gap-4">
        <ProfilePanel />
        <Composer />
        <section className="grid gap-3">
          <div className="flex items-end justify-between px-1">
            <div>
              <p className="text-sm font-bold text-[#d1708e]">
                届いた日記
              </p>
              <h1 className="text-2xl font-black">ブログカード</h1>
            </div>
            <p className="text-sm font-bold text-[#9f8574]">{diaries.length}件</p>
          </div>
          {diaries.length === 0 ? (
            <p className="rounded-[1.75rem] border border-[#f2e4d6] bg-white p-5 text-sm text-[#9f8574] shadow-sm">
              まだ届いている日記はありません。
            </p>
          ) : (
            diaries.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
          )}
        </section>
      </div>
    </AppShell>
  );
}

