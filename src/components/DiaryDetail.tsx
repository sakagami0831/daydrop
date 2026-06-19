"use client";

import Link from "next/link";
import { useState } from "react";
import { visibilityLabels } from "@/lib/daydrop";
import { useDayDrop } from "@/lib/store";

export function DiaryDetail({ diaryId }: { diaryId: string }) {
  const { currentUser, diaries, getUser, addImpression, toggleLike } =
    useDayDrop();
  const [body, setBody] = useState("");
  const diary = diaries.find((item) => item.id === diaryId);

  if (!currentUser) {
    return null;
  }

  if (!diary) {
    return (
      <section className="rounded-[1.75rem] border border-[#f2e4d6] bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-black">日記が見つかりません</h1>
        <Link className="mt-4 inline-block text-sm font-bold text-[#d1708e]" href="/">
          ホームへ戻る
        </Link>
      </section>
    );
  }

  const author = getUser(diary.authorId);
  const liked = diary.likedBy.includes(currentUser.id);

  const submit = () => {
    if (!body.trim()) {
      return;
    }
    addImpression(diary.id, body.trim());
    setBody("");
  };

  return (
    <div className="grid gap-4">
      <Link href="/" className="text-sm font-bold text-[#d1708e]">
        ← 日記一覧へ
      </Link>
      <article className="rounded-[1.75rem] border border-[#f2e4d6] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#ffdfe8] font-bold text-[#9b4c64]">
              {author?.avatar ?? "?"}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold">{author?.name ?? "Unknown"}</p>
              <p className="text-xs text-[#9f8574]">
                {new Date(diary.createdAt).toLocaleString("ja-JP")}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#fffaf2] px-3 py-1 text-xs font-bold text-[#9b6b20]">
            {visibilityLabels[diary.visibility]}
          </span>
        </div>

        {diary.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={diary.imageUrl}
            alt=""
            className="mb-5 max-h-[520px] w-full rounded-3xl object-cover"
          />
        ) : null}

        <h1 className="text-3xl font-black leading-tight">{diary.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-[#5f5148]">
          {diary.body}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3 rounded-3xl bg-[#fffaf2] p-3">
          <div>
            <p className="text-xs font-bold text-[#9f8574]">届いた感想</p>
            <p className="text-3xl font-black text-[#9b6b20]">
              {diary.impressions.length}
            </p>
          </div>
          <button
            onClick={() => toggleLike(diary.id)}
            className={`rounded-full px-4 py-2 text-sm font-black ${
              liked
                ? "bg-[#ffdfe8] text-[#9b4c64]"
                : "bg-white text-[#7d6a5c]"
            }`}
          >
            いいね {diary.likedBy.length}
          </button>
        </div>
      </article>

      <section className="rounded-[1.75rem] border border-[#f2e4d6] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">感想を書く</h2>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="読んで感じたことを送る"
          className="mt-3 min-h-28 w-full rounded-3xl border border-[#f2e4d6] bg-[#fffdf9] px-4 py-3 leading-7 outline-none focus:border-[#d1708e]"
        />
        <button
          onClick={submit}
          disabled={!body.trim()}
          className="mt-3 w-full rounded-full bg-[#d1708e] px-5 py-3 font-black text-white disabled:bg-[#e5c4cf]"
        >
          感想を届ける
        </button>
      </section>

      <section className="grid gap-3">
        <h2 className="px-1 text-xl font-black">届いた感想</h2>
        {diary.impressions.length === 0 ? (
          <p className="rounded-3xl bg-white p-5 text-sm text-[#9f8574]">
            まだ感想はありません。
          </p>
        ) : (
          diary.impressions.map((impression) => {
            const writer = getUser(impression.authorId);
            return (
              <article
                key={impression.id}
                className="rounded-3xl border border-[#f2e4d6] bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-[#ffdfe8] text-sm font-bold text-[#9b4c64]">
                    {writer?.avatar ?? "?"}
                  </span>
                  <span className="font-bold">{writer?.name ?? "Unknown"}</span>
                </div>
                <p className="text-sm leading-7 text-[#5f5148]">
                  {impression.body}
                </p>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

