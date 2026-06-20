"use client";

import Link from "next/link";
import type { Diary } from "@/lib/daydrop";
import { getDeliveryLabel } from "@/lib/delivery";
import { useDayDrop } from "@/lib/store";

const fallbackGradients = [
  "from-[#f0edff] via-[#fff3f8] to-[#eef7ff]",
  "from-[#fff1f6] via-[#f7f3ff] to-[#eef9f4]",
  "from-[#fff5df] via-[#fff8fb] to-[#edeaff]",
];

export function DiaryCard({ diary }: { diary: Diary }) {
  const { currentUser, users, getUser, toggleLike } = useDayDrop();
  const author = getUser(diary.authorId);
  const liked = currentUser ? diary.likedBy.includes(currentUser.id) : false;
  const deliveryLabel = getDeliveryLabel(diary, users);
  const fallbackIndex =
    diary.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    fallbackGradients.length;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#ece7fb] bg-white shadow-[0_10px_24px_rgba(126,112,174,0.09)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(126,112,174,0.13)]">
      <Link href={`/diary/${diary.id}`} className="block">
        {diary.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={diary.imageUrl}
            alt=""
            className="h-28 w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-28 items-center justify-center bg-gradient-to-br ${fallbackGradients[fallbackIndex]}`}
          >
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#8b7cf6]">
              DayDrop
            </span>
          </div>
        )}
      </Link>

      <div className="p-3">
        <Link href={`/diary/${diary.id}`} className="block">
          <span className="mb-2 inline-flex rounded-full bg-[#f0edff] px-2.5 py-1 text-[11px] font-black text-[#7c6ee6]">
            {deliveryLabel}
          </span>
          <h3 className="line-clamp-2 min-h-11 text-base font-black leading-5 text-[#2f2b3b]">
            {diary.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-[#746d82]">
            {diary.body}
          </p>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f0edff] text-xs font-black text-[#8b7cf6]">
              {author?.avatar ?? "?"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-black">
                {author?.name ?? "Unknown"}
              </p>
              <p className="truncate text-[11px] font-bold text-[#9b94aa]">
                {author?.title ?? "\u65e5\u8a18\u3092\u66f8\u304f\u4eba"}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleLike(diary.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
              liked
                ? "bg-[#f0edff] text-[#7c6ee6]"
                : "border border-[#ece7fb] bg-white text-[#9b94aa]"
            }`}
          >
            {"\u3044\u3044\u306d"} {diary.likedBy.length}
          </button>
        </div>

        <Link
          href={`/diary/${diary.id}`}
          className="mt-3 flex items-center justify-between rounded-xl bg-[#fbfaff] px-3 py-2"
        >
          <span className="text-xs font-black text-[#7c6ee6]">{"\u611f\u60f3"}</span>
          <span className="text-sm font-black text-[#7c6ee6]">
            {diary.impressions.length}
            {"\u4ef6"}
          </span>
        </Link>
      </div>
    </article>
  );
}
