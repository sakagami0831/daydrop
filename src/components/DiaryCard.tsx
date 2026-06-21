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
  const {
    currentUser,
    users,
    getUser,
    favoriteDiaryIds,
    toggleLike,
    hideDiary,
    toggleFavoriteDiary,
  } = useDayDrop();
  const author = getUser(diary.authorId);
  const liked = currentUser ? diary.likedBy.includes(currentUser.id) : false;
  const favorited = currentUser
    ? (favoriteDiaryIds[currentUser.id] ?? []).includes(diary.id)
    : false;
  const deliveryLabel = getDeliveryLabel(diary, users);
  const fallbackIndex =
    diary.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    fallbackGradients.length;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#ece7fb] bg-white shadow-[0_10px_20px_rgba(126,112,174,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(126,112,174,0.12)]">
      <Link href={`/diary/${diary.id}`} className="block">
        {diary.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={diary.imageUrl}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div
            className={`flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br ${fallbackGradients[fallbackIndex]}`}
          >
            <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-black text-[#8b7cf6]">
              {"\u914d\u4fe1\u30ec\u30dd\u30fc\u30c8"}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/diary/${diary.id}`} className="block">
          <div className="mb-2 flex items-center justify-between gap-1.5">
            <span className="min-w-0 truncate rounded-full bg-[#f0edff] px-2.5 py-1 text-[11px] font-black text-[#7c6ee6]">
              {author?.name ?? "Unknown"}
              {"\u3055\u3093\u304b\u3089\u5c4a\u3044\u305f"}
            </span>
            <span className="shrink-0 rounded-full bg-[#fff7fb] px-2 py-0.5 text-[10px] font-black text-[#b86f9a]">
              {deliveryLabel}
            </span>
          </div>
          <h3 className="line-clamp-2 min-h-10 text-base font-black leading-5 text-[#2f2b3b]">
            {diary.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 min-h-14 text-xs leading-[18px] text-[#746d82]">
            {diary.body}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f0edff] text-[11px] font-black text-[#8b7cf6]">
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
            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
              liked
                ? "bg-[#f0edff] text-[#7c6ee6]"
                : "border border-[#ece7fb] bg-white text-[#9b94aa]"
            }`}
          >
            {"\u3044\u3044\u306d"} {diary.likedBy.length}
          </button>
        </div>

        <button
          onClick={() => toggleFavoriteDiary(diary.id)}
          className={`mt-2 w-full rounded-full px-3 py-1.5 text-[11px] font-black ${
            favorited
              ? "bg-[#fff8ee] text-[#bd8648]"
              : "border border-[#ece7fb] bg-white text-[#9b94aa]"
          }`}
        >
          {favorited
            ? "\u304a\u6c17\u306b\u5165\u308a\u6e08\u307f"
            : "\u304a\u6c17\u306b\u5165\u308a"}
        </button>

        <Link
          href={`/diary/${diary.id}`}
          className="mt-2 flex items-center justify-between rounded-xl bg-[#fbfaff] px-2.5 py-1.5"
        >
          <span className="text-[11px] font-black text-[#7c6ee6]">
            {"\u611f\u60f3\u3092\u5c4a\u3051\u308b"}
          </span>
          <span className="text-sm font-black text-[#7c6ee6]">
            {diary.impressions.length}
            {"\u4ef6"}
          </span>
        </Link>
        <button
          onClick={() => hideDiary(diary.id)}
          className="mt-2 w-full rounded-full border border-[#ece7fb] bg-white px-3 py-1.5 text-[11px] font-black text-[#9b94aa]"
        >
          {"\u3053\u306e\u65e5\u8a18\u3092\u975e\u8868\u793a"}
        </button>
      </div>
    </article>
  );
}
