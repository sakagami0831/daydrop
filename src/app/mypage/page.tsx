"use client";

import { AppShell } from "@/components/AppShell";
import { DiaryCard } from "@/components/DiaryCard";
import { ProfilePanel } from "@/components/ProfilePanel";
import { useDayDrop } from "@/lib/store";

export default function MyPage() {
  const { currentUser, diaries } = useDayDrop();
  const myDiaries = currentUser
    ? diaries.filter((diary) => diary.authorId === currentUser.id)
    : [];

  return (
    <AppShell>
      <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="min-w-0">
          <ProfilePanel />
        </div>

        <section className="min-w-0 rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u30de\u30a4\u30da\u30fc\u30b8"}
              </p>
              <h1 className="text-xl font-black">{"\u81ea\u5206\u306e\u65e5\u8a18"}</h1>
            </div>
            <span className="rounded-full bg-[#f0edff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {myDiaries.length}
              {"\u4ef6"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {myDiaries.length === 0 ? (
              <p className="rounded-2xl bg-[#fbfaff] p-4 text-sm text-[#9b94aa] md:col-span-2">
                {"\u307e\u3060\u65e5\u8a18\u3092\u66f8\u3044\u3066\u3044\u307e\u305b\u3093\u3002"}
              </p>
            ) : (
              myDiaries.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
