"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDeliveryLabel } from "@/lib/delivery";
import { type ReportReason, visibilityLabels } from "@/lib/daydrop";
import { findNgWord } from "@/lib/moderation";
import { useDayDrop } from "@/lib/store";

const reportReasons: { value: ReportReason; label: string }[] = [
  { value: "inappropriate", label: "\u4e0d\u9069\u5207\u306a\u5185\u5bb9" },
  { value: "harassment", label: "\u8ff7\u60d1\u884c\u70ba" },
  { value: "impersonation", label: "\u306a\u308a\u3059\u307e\u3057" },
  { value: "personal_info", label: "\u500b\u4eba\u60c5\u5831" },
  { value: "other", label: "\u305d\u306e\u4ed6" },
];

export function DiaryDetail({ diaryId }: { diaryId: string }) {
  const {
    currentUser,
    users,
    diaries,
    getUser,
    addImpression,
    toggleLike,
    markDiaryRead,
    blockedUserIds,
    mutedUserIds,
    hiddenImpressionIds,
    toggleBlockUser,
    toggleMuteUser,
    reportTarget,
    deleteImpression,
    hideImpression,
  } = useDayDrop();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [diaryReason, setDiaryReason] =
    useState<ReportReason>("inappropriate");
  const [impressionReasons, setImpressionReasons] = useState<
    Record<string, ReportReason>
  >({});
  const diary = diaries.find((item) => item.id === diaryId);

  useEffect(() => {
    if (diary) {
      markDiaryRead(diary.id);
    }
  }, [diary, markDiaryRead]);

  if (!currentUser) {
    return null;
  }

  if (!diary) {
    return (
      <section className="rounded-2xl border border-[#ece7fb] bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-black">
          {"\u65e5\u8a18\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093"}
        </h1>
        <Link className="mt-4 inline-block text-sm font-bold text-[#8b7cf6]" href="/">
          {"\u30db\u30fc\u30e0\u3078\u623b\u308b"}
        </Link>
      </section>
    );
  }

  const author = getUser(diary.authorId);
  const liked = diary.likedBy.includes(currentUser.id);
  const deliveryLabel = getDeliveryLabel(diary, users);
  const coinShortage = error.includes("\u30b3\u30a4\u30f3\u304c\u4e0d\u8db3");
  const blocked = author
    ? (blockedUserIds[currentUser.id] ?? []).includes(author.id)
    : false;
  const muted = author
    ? (mutedUserIds[currentUser.id] ?? []).includes(author.id)
    : false;
  const visibleImpressions = diary.impressions.filter(
    (impression) =>
      !(hiddenImpressionIds[currentUser.id] ?? []).includes(impression.id),
  );

  const submit = () => {
    setError("");
    if (!body.trim()) {
      return;
    }

    const ngWord = findNgWord(body);
    if (ngWord) {
      setError(
        `\u5b89\u5168\u306e\u305f\u3081\u300c${ngWord}\u300d\u3092\u542b\u3080\u611f\u60f3\u306f\u5c4a\u3051\u3089\u308c\u307e\u305b\u3093\u3002`,
      );
      return;
    }

    if (currentUser.coinBalance < 1) {
      setError(
        "\u30b3\u30a4\u30f3\u304c\u4e0d\u8db3\u3057\u3066\u3044\u307e\u3059\u3002\u611f\u60f3\u306b\u306f1\u30b3\u30a4\u30f3\u5fc5\u8981\u3067\u3059\u3002",
      );
      return;
    }
    const created = addImpression(diary.id, body.trim());
    if (!created) {
      setError(
        "\u611f\u60f3\u3092\u9001\u308c\u307e\u305b\u3093\u3067\u3057\u305f\u3002\u76f8\u624b\u306e\u5b89\u5168\u8a2d\u5b9a\u306b\u3088\u308a\u5236\u9650\u3055\u308c\u3066\u3044\u308b\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002",
      );
      return;
    }
    setBody("");
  };

  const reportDiary = () => {
    const ok = reportTarget("diary", diary.id, diaryReason);
    setNotice(
      ok
        ? "\u901a\u5831\u3057\u307e\u3057\u305f\u3002"
        : "\u3059\u3067\u306b\u901a\u5831\u6e08\u307f\u3067\u3059\u3002",
    );
  };

  const reportImpression = (impressionId: string) => {
    const ok = reportTarget(
      "impression",
      impressionId,
      impressionReasons[impressionId] ?? "inappropriate",
    );
    setNotice(
      ok
        ? "\u901a\u5831\u3057\u307e\u3057\u305f\u3002"
        : "\u3059\u3067\u306b\u901a\u5831\u6e08\u307f\u3067\u3059\u3002",
    );
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-4">
      <Link href="/" className="text-sm font-black text-[#8b7cf6]">
        {"\u2190 \u65e5\u8a18\u4e00\u89a7\u3078"}
      </Link>

      <article className="overflow-hidden rounded-2xl border border-[#ece7fb] bg-white shadow-[0_18px_45px_rgba(126,112,174,0.12)]">
        {diary.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={diary.imageUrl} alt="" className="max-h-[420px] w-full object-cover" />
        ) : null}

        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f0edff] font-black text-[#8b7cf6]">
                {author?.avatarImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatarImageUrl}
                    alt=""
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  author?.avatar ?? "?"
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-black">{author?.name ?? "Unknown"}</p>
                <p className="truncate text-xs font-bold text-[#9b94aa]">
                  {author?.title ?? "\u65e5\u8a18\u3092\u66f8\u304f\u4eba"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#f0edff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {deliveryLabel || visibilityLabels[diary.visibility]}
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

          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[#fbfaff] p-3">
            <div className="rounded-2xl bg-[#f0edff] px-4 py-2 text-[#7c6ee6]">
              <p className="text-xs font-black">{"\u5c4a\u3044\u305f\u611f\u60f3"}</p>
              <p className="text-3xl font-black leading-none">
                {visibleImpressions.length}
              </p>
            </div>
            <button
              onClick={() => toggleLike(diary.id)}
              className={`rounded-full px-4 py-2 text-sm font-black ${
                liked ? "bg-[#f0edff] text-[#7c6ee6]" : "bg-white text-[#746d82]"
              }`}
            >
              {"\u3044\u3044\u306d"} {diary.likedBy.length}
            </button>
          </div>

          {notice ? (
            <p className="mt-3 rounded-2xl bg-[#f2efff] px-3 py-2 text-xs font-bold text-[#7c6ee6]">
              {notice}
            </p>
          ) : null}

          {author && author.id !== currentUser.id ? (
            <div className="mt-3 rounded-2xl border border-[#ece7fb] bg-white p-3">
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u5b89\u5168\u64cd\u4f5c"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleMuteUser(author.id)}
                  className="rounded-full bg-[#f2efff] px-3 py-1.5 text-xs font-black text-[#7c6ee6]"
                >
                  {muted ? "\u30df\u30e5\u30fc\u30c8\u89e3\u9664" : "\u30df\u30e5\u30fc\u30c8"}
                </button>
                <button
                  onClick={() => toggleBlockUser(author.id)}
                  className="rounded-full bg-[#fff7fa] px-3 py-1.5 text-xs font-black text-[#b15b77]"
                >
                  {blocked ? "\u30d6\u30ed\u30c3\u30af\u89e3\u9664" : "\u30d6\u30ed\u30c3\u30af"}
                </button>
                <select
                  value={diaryReason}
                  onChange={(event) => setDiaryReason(event.target.value as ReportReason)}
                  className="rounded-full border border-[#ece7fb] bg-white px-3 py-1.5 text-xs font-bold"
                >
                  {reportReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={reportDiary}
                  className="rounded-full border border-[#f5dce8] bg-white px-3 py-1.5 text-xs font-black text-[#b15b77]"
                >
                  {"\u901a\u5831"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </article>

      <section className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_18px_45px_rgba(126,112,174,0.10)]">
        <h2 className="text-xl font-black">{"\u611f\u60f3\u3092\u66f8\u304f"}</h2>
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
          <div className="mt-2 rounded-2xl bg-[#fff7fa] px-3 py-2 text-xs font-bold text-[#b15b77]">
            <p>{error}</p>
            {coinShortage ? (
              <Link href="/shop" className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-[#7c6ee6]">
                {"\u30b3\u30a4\u30f3\u3092\u6e96\u5099\u3059\u308b"}
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="grid gap-3">
        <h2 className="px-1 text-xl font-black">{"\u5c4a\u3044\u305f\u611f\u60f3"}</h2>
        {visibleImpressions.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#9b94aa]">
            {"\u307e\u3060\u611f\u60f3\u306f\u3042\u308a\u307e\u305b\u3093\u3002"}
          </p>
        ) : (
          visibleImpressions.map((impression) => {
            const writer = getUser(impression.authorId);
            const canDelete = impression.authorId === currentUser.id;
            const canHide = diary.authorId === currentUser.id && !canDelete;
            return (
              <article key={impression.id} className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f0edff] text-sm font-black text-[#8b7cf6]">
                    {writer?.avatarImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={writer.avatarImageUrl}
                        alt=""
                        className="size-full rounded-full object-cover"
                      />
                    ) : (
                      writer?.avatar ?? "?"
                    )}
                  </span>
                  <span className="font-bold">{writer?.name ?? "Unknown"}</span>
                </div>
                <p className="text-sm leading-7 text-[#5f586d]">{impression.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {canDelete ? (
                    <button
                      onClick={() => {
                        if (window.confirm("\u3053\u306e\u611f\u60f3\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f")) {
                          deleteImpression(diary.id, impression.id);
                        }
                      }}
                      className="rounded-full bg-[#fff7fa] px-3 py-1 text-[11px] font-black text-[#b15b77]"
                    >
                      {"\u524a\u9664"}
                    </button>
                  ) : null}
                  {canHide ? (
                    <button
                      onClick={() => hideImpression(impression.id)}
                      className="rounded-full bg-[#f2efff] px-3 py-1 text-[11px] font-black text-[#7c6ee6]"
                    >
                      {"\u975e\u8868\u793a"}
                    </button>
                  ) : null}
                  <select
                    value={impressionReasons[impression.id] ?? "inappropriate"}
                    onChange={(event) =>
                      setImpressionReasons((current) => ({
                        ...current,
                        [impression.id]: event.target.value as ReportReason,
                      }))
                    }
                    className="rounded-full border border-[#ece7fb] bg-white px-2 py-1 text-[11px] font-bold"
                  >
                    {reportReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => reportImpression(impression.id)}
                    className="rounded-full border border-[#f5dce8] bg-white px-3 py-1 text-[11px] font-black text-[#b15b77]"
                  >
                    {"\u901a\u5831"}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
