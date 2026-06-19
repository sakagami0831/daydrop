"use client";

import Link from "next/link";
import type { Diary } from "@/lib/daydrop";
import { visibilityLabels } from "@/lib/daydrop";
import { useDayDrop } from "@/lib/store";

export function DiaryCard({ diary }: { diary: Diary }) {
  const { currentUser, getUser, toggleLike } = useDayDrop();
  const author = getUser(diary.authorId);
  const liked = currentUser ? diary.likedBy.includes(currentUser.id) : false;

  return (
    <article className="rounded-[1.75rem] border border-[#f2e4d6] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#ffdfe8] font-bold text-[#9b4c64]">
            {author?.avatar ?? "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold">{author?.name ?? "Unknown"}</p>
            <p className="text-xs text-[#9f8574]">
              {new Date(diary.createdAt).toLocaleString("ja-JP", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#fffaf2] px-3 py-1 text-xs font-bold text-[#9b6b20]">
          {visibilityLabels[diary.visibility]}
        </span>
      </div>

      <Link href={`/diary/${diary.id}`} className="mt-4 block">
        {diary.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={diary.imageUrl}
            alt=""
            className="mb-4 max-h-72 w-full rounded-3xl object-cover"
          />
        ) : null}
        <h3 className="text-xl font-black leading-7">{diary.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-[#6f5e52]">
          {diary.body}
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Link
          href={`/diary/${diary.id}`}
          className="rounded-full bg-[#fff1c6] px-4 py-2 text-sm font-black text-[#9b6b20]"
        >
          感想 {diary.impressions.length}
        </Link>
        <button
          onClick={() => toggleLike(diary.id)}
          className={`rounded-full px-4 py-2 text-sm font-black ${
            liked
              ? "bg-[#ffdfe8] text-[#9b4c64]"
              : "border border-[#f2e4d6] bg-white text-[#7d6a5c]"
          }`}
        >
          いいね {diary.likedBy.length}
        </button>
      </div>
    </article>
  );
}

