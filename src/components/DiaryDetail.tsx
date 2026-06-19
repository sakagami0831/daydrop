"use client";

import Link from "next/link";
import { useState } from "react";
import { visibilityLabels } from "@/lib/daydrop";
import { useDayDrop } from "@/lib/store";

export function DiaryDetail({ diaryId }: { diaryId: string }) {
  const { currentUser, diaries, getUser, addImpression, toggleLike } =
    useDayDrop();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const diary = diaries.find((item) => item.id === diaryId);

  if (!currentUser) {
    return null;
  }

  if (!diary) {
    return (
      <section className="rounded-2xl border border-[#ece7fb] bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-black">
          {"\u65e5\u8a18\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093"}
        </h1>
        <Link
          className="mt-4 inline-block text-sm font-bold text-[#8b7cf6]"
          href="/"
        >
          {"\u30db\u30fc\u30e0\u3078\u623b\u308b"}
        </Link>
      </section>
    );
  }

  const author = getUser(diary.authorId);
  const liked = diary.likedBy.includes(currentUser.id);

  const submit = () => {
    setError("");
    if (!body.trim()) {
      return;
    }
    if (currentUser.coinBalance < 1) {
      setError("\u30b3\u30a4\u30f3\u304c\u4e0d\u8db3\u3057\u3066\u3044\u307e\u3059\u3002\u611f\u60f3\u306b\u306f1\u30b3\u30a4\u30f3\u5fc5\u8981\u3067\u3059\u3002");
      return;
    }
    const created = addImpression(diary.id, body.trim());
    if (!created) {
      setError("\u611f\u60f3\u3092\u9001\u308c\u307e\u305b\u3093\u3067\u3057\u305f\u3002");
      return;
    }
    setBody("");
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-4">
      <Link href="/" className="text-sm font-black text-[#8b7cf6]">
        {"\u2190 \u65e5\u8a18\u4e00\u89a7\u3078"}
      </Link>

      <article className="overflow-hidden rounded-2xl border border-[#ece7fb] bg-white shadow-[0_18px_45px_rgba(126,112,174,0.12)]">
        {diary.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={diary.imageUrl}
            alt=""
            className="max-h-[420px] w-full object-cover"
          />
        ) : null}

        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f0edff] font-black text-[#8b7cf6]">
                {author?.avatar ?? "?"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-black">{author?.name ?? "Unknown"}</p>
                <p className="truncate text-xs font-bold text-[#9b94aa]">
                  {author?.title ?? "\u65e5\u8a18\u3092\u66f8\u304f\u4eba"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#f0edff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {visibilityLabels[diary.visibility]}
            </span>
          </div>

          <p className="mb-2 text-xs font-bold text-[#9b94aa]">
            {new Date(diary.createdAt).toLocaleString("ja-JP")}
          </p>
          <h1 className="text-3xl font-black leading-tight text-[#2f2b3b]">
            {diary.title}
          </h1>
          <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-[#5f586d]">
            {diary.body}
          </p>

          {diary.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {diary.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#fbfaff] px-3 py-1 text-xs font-bold text-[#7c6ee6]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[#fbfaff] p-3">
            <div className="rounded-2xl bg-[#f0edff] px-4 py-2 text-[#7c6ee6]">
              <p className="text-xs font-black">{"\u5c4a\u3044\u305f\u611f\u60f3"}</p>
              <p className="text-3xl font-black leading-none">
                {diary.impressions.length}
              </p>
            </div>
            <button
              onClick={() => toggleLike(diary.id)}
              className={`rounded-full px-4 py-2 text-sm font-black ${
                liked
                  ? "bg-[#f0edff] text-[#7c6ee6]"
                  : "bg-white text-[#746d82]"
              }`}
            >
              {"\u3044\u3044\u306d"} {diary.likedBy.length}
            </button>
          </div>
        </div>
      </article>

      <section className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_18px_45px_rgba(126,112,174,0.10)]">
        <h2 className="text-xl font-black">{"\u611f\u60f3\u3092\u66f8\u304f"}</h2>
        <p className="mt-1 text-sm text-[#9b94aa]">
          {"\u8aad\u3093\u3067\u611f\u3058\u305f\u3053\u3068\u3092\u9001\u308a\u307e\u3059\u3002"}
        </p>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={"\u8aad\u3093\u3067\u611f\u3058\u305f\u3053\u3068"}
          className="mt-3 min-h-28 w-full rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-4 py-3 leading-7 outline-none focus:border-[#9b8be8]"
        />
        <button
          onClick={submit}
          disabled={!body.trim()}
          className="mt-3 w-full rounded-full bg-[#8b7cf6] px-5 py-3 font-black text-white disabled:bg-[#cfc8f8]"
        >
          {"\u611f\u60f3\u3092\u5c4a\u3051\u308b"}
        </button>
        {error ? (
          <p className="mt-2 rounded-2xl bg-[#fff7fa] px-3 py-2 text-xs font-bold text-[#b15b77]">
            {error}
          </p>
        ) : null}
      </section>

      <section className="grid gap-3">
        <h2 className="px-1 text-xl font-black">{"\u5c4a\u3044\u305f\u611f\u60f3"}</h2>
        {diary.impressions.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#9b94aa]">
            {"\u307e\u3060\u611f\u60f3\u306f\u3042\u308a\u307e\u305b\u3093\u3002"}
          </p>
        ) : (
          diary.impressions.map((impression) => {
            const writer = getUser(impression.authorId);
            return (
              <article
                key={impression.id}
                className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f0edff] text-sm font-black text-[#8b7cf6]">
                    {writer?.avatar ?? "?"}
                  </span>
                  <span className="font-bold">{writer?.name ?? "Unknown"}</span>
                </div>
                <p className="text-sm leading-7 text-[#5f586d]">
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
