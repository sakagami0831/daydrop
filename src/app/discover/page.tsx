"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DiaryCard } from "@/components/DiaryCard";
import { useDayDrop } from "@/lib/store";

const tags = [
  "\u65e5\u5e38",
  "\u6563\u6b69",
  "\u5199\u771f",
  "\u591c\u306e\u65e5\u8a18",
  "\u3042\u308a\u304c\u3068\u3046",
  "\u77ed\u6587",
];

export default function DiscoverPage() {
  const { searchDiaries, searchUsers } = useDayDrop();
  const [diaryQuery, setDiaryQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const diaryResults = searchDiaries(diaryQuery, activeTag);
  const userResults = searchUsers(userQuery);
  const randomDiary = useMemo(() => {
    if (diaryResults.length === 0) {
      return undefined;
    }
    const seed = diaryQuery.length + activeTag.length + diaryResults.length;
    return diaryResults[seed % diaryResults.length];
  }, [activeTag, diaryQuery, diaryResults]);

  return (
    <AppShell>
      <div className="grid gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">{"\u898b\u3064\u3051\u308b"}</p>
          <h1 className="mt-1 text-2xl font-black">
            {"\u8aad\u307f\u305f\u3044\u65e5\u8a18\u3092\u63a2\u3059"}
          </h1>
        </header>

        <section className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
            <h2 className="font-black">{"\u30ad\u30fc\u30ef\u30fc\u30c9\u691c\u7d22"}</h2>
            <input
              value={diaryQuery}
              onChange={(event) => setDiaryQuery(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-3 py-2 text-sm outline-none focus:border-[#9b8be8]"
              placeholder={"\u30bf\u30a4\u30c8\u30eb\u3084\u672c\u6587"}
            />
            <p className="mt-2 text-xs font-bold text-[#9b94aa]">
              {diaryResults.length}
              {"\u4ef6\u306e\u65e5\u8a18"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
            <h2 className="font-black">{"\u30e6\u30fc\u30b6\u30fc\u691c\u7d22"}</h2>
            <input
              value={userQuery}
              onChange={(event) => setUserQuery(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-3 py-2 text-sm outline-none focus:border-[#9b8be8]"
              placeholder={"\u540d\u524d\u30fb\u30cf\u30f3\u30c9\u30eb"}
            />
            <div className="mt-3 grid gap-2">
              {userResults.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 rounded-xl bg-[#fbfaff] p-2"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-[#f0edff] text-xs font-black text-[#8b7cf6]">
                    {user.avatar}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">{user.name}</p>
                    <p className="truncate text-xs text-[#9b94aa]">
                      {user.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
            <h2 className="font-black">{"\u30bf\u30b0\u691c\u7d22"}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag("")}
                className={`rounded-full px-3 py-1.5 text-xs font-black ${
                  activeTag === ""
                    ? "bg-[#8b7cf6] text-white"
                    : "bg-[#f0edff] text-[#7c6ee6]"
                }`}
              >
                all
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${
                    activeTag === tag
                      ? "bg-[#8b7cf6] text-white"
                      : "bg-[#f0edff] text-[#7c6ee6]"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u30e9\u30f3\u30c0\u30e0\u65e5\u8a18"}
              </p>
              <h2 className="text-xl font-black">{"\u5076\u7136\u8aad\u3080\u4e00\u679a"}</h2>
            </div>
            {randomDiary ? (
              <Link
                href={`/diary/${randomDiary.id}`}
                className="rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white"
              >
                {"\u958b\u304f"}
              </Link>
            ) : null}
          </div>
          {randomDiary ? (
            <div className="max-w-sm">
              <DiaryCard diary={randomDiary} />
            </div>
          ) : (
            <p className="text-sm text-[#9b94aa]">
              {"\u6761\u4ef6\u306b\u5408\u3046\u65e5\u8a18\u304c\u3042\u308a\u307e\u305b\u3093\u3002"}
            </p>
          )}
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {diaryResults.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
