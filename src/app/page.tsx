"use client";

import { AppShell } from "@/components/AppShell";
import { DiaryCard } from "@/components/DiaryCard";
import { getDeliveredDiariesForUser } from "@/lib/delivery";
import { useDayDrop } from "@/lib/store";
import { useState } from "react";

const tabs = [
  "\u304a\u3059\u3059\u3081",
  "\u6025\u4e0a\u6607",
  "\u65b0\u7740",
  "\u304a\u77e5\u3089\u305b\u65e5\u8a18",
];

const toDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const coinReasonLabels: Record<string, string> = {
  initial_bonus: "\u521d\u56de\u30dc\u30fc\u30ca\u30b9",
  diary_post: "\u65e5\u8a18\u3092\u5c4a\u3051\u305f",
  impression_post: "\u611f\u60f3\u3092\u5c4a\u3051\u305f",
  daily_reward: "\u30c7\u30a4\u30ea\u30fc\u5831\u916c",
  like_received: "\u3044\u3044\u306d\u7372\u5f97",
  shop_purchase: "\u88c5\u98fe\u3092\u53d7\u3051\u53d6\u3063\u305f",
  recommendation_application: "\u304a\u3059\u3059\u3081\u63b2\u8f09\u7533\u8acb",
};

export default function Home() {
  const {
    currentUser,
    diaries: allDiaries,
    searchDiaries,
    notifications,
    getUser,
    mutedUserIds,
    blockedUserIds,
    hiddenDiaryIds,
    dailyReads,
    dailyClaims,
    coinTransactions,
  } = useDayDrop();
  const [query, setQuery] = useState("");
  const hidden = currentUser ? hiddenDiaryIds[currentUser.id] ?? [] : [];
  const muted = currentUser ? mutedUserIds[currentUser.id] ?? [] : [];
  const blocked = currentUser ? blockedUserIds[currentUser.id] ?? [] : [];
  const diaries = searchDiaries(query).filter(
    (diary) => !muted.includes(diary.authorId),
  );
  const deliveredDiaries = currentUser
    ? getDeliveredDiariesForUser(allDiaries, currentUser.id).filter(
        (diary) =>
          !hidden.includes(diary.id) &&
          !blocked.includes(diary.authorId) &&
          !muted.includes(diary.authorId),
      )
    : [];
  const todayDelivered = deliveredDiaries.filter((diary) => {
    const created = new Date(diary.createdAt);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  });
  const deliveryCount = todayDelivered.length;
  const deliveredPreview = (todayDelivered.length > 0
    ? todayDelivered
    : deliveredDiaries
  ).slice(0, 8);
  const unreadCount = currentUser
    ? notifications.filter(
        (notification) => notification.userId === currentUser.id && !notification.read,
      ).length
    : 0;
  const todayKey = currentUser ? `${currentUser.id}:${toDayKey()}` : "";
  const todayReads = todayKey ? dailyReads[todayKey]?.length ?? 0 : 0;
  const todayClaims = todayKey ? dailyClaims[todayKey] ?? [] : [];
  const wroteToday = currentUser
    ? allDiaries.some(
        (diary) =>
          diary.authorId === currentUser.id &&
          toDayKey(new Date(diary.createdAt)) === toDayKey(),
      )
    : false;
  const impressionToday = currentUser
    ? allDiaries
        .flatMap((diary) => diary.impressions)
        .some(
          (impression) =>
            impression.authorId === currentUser.id &&
            toDayKey(new Date(impression.createdAt)) === toDayKey(),
        )
    : false;
  const missionProgress = [
    todayClaims.includes("login"),
    wroteToday,
    todayReads >= 3,
    impressionToday,
  ].filter(Boolean).length;
  const recentCoins = currentUser
    ? coinTransactions
        .filter((transaction) => transaction.userId === currentUser.id)
        .slice(-3)
        .reverse()
    : [];

  return (
    <AppShell>
      <div className="grid gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-2.5 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black tracking-[0.22em] text-[#9b94aa]">
                {"\u8aad\u3093\u3067\u304f\u308c\u3066\u3001\u3042\u308a\u304c\u3068\u3046\u3002"}
              </p>
              <h1 className="mt-1 truncate text-xl font-black tracking-[0.06em] text-[#363142] md:text-2xl">
                {"\u4eca\u65e5\u306e\u914d\u4fe1\u30ec\u30dd\u30fc\u30c8\u3092\u8aad\u3093\u3067\u3001"}
                <span className="text-[#8b7cf6]">{"\u611f\u60f3"}</span>
                {"\u3092\u5c4a\u3051\u3088\u3046"}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <span className="rounded-full border border-[#ece7fb] bg-white px-2.5 py-1 text-xs font-black">
                coin {currentUser?.coinBalance ?? 0}
              </span>
              <span className="rounded-full border border-[#ece7fb] bg-white px-2.5 py-1 text-xs font-black">
                {"\u901a\u77e5"} {unreadCount}
              </span>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#ece7fb] bg-white/90 p-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u4eca\u65e5\u5c4a\u3044\u305f\u65e5\u8a18"}
              </p>
              <h2 className="text-lg font-black">
                {deliveryCount > 0
                  ? `${deliveryCount}\u4ef6\u306e\u65e5\u8a18\u304c\u5c4a\u3044\u3066\u3044\u307e\u3059`
                  : "\u63a8\u3057\u304b\u3089\u5c4a\u3044\u305f\u65e5\u8a18\u3092\u8aad\u3082\u3046"}
              </h2>
            </div>
            <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {"\u672a\u8aad"} {unreadCount}
            </span>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {(deliveredPreview.length > 0 ? deliveredPreview : allDiaries.slice(0, 4)).map(
              (diary) => {
                const author = getUser(diary.authorId);
                const unread = notifications.some(
                  (notification) =>
                    notification.userId === currentUser?.id &&
                    notification.diaryId === diary.id &&
                    !notification.read,
                );

                return (
                  <a
                    key={diary.id}
                    href={`/diary/${diary.id}`}
                    className="min-w-[210px] rounded-2xl border border-[#ece7fb] bg-[#fbfaff] p-3 transition hover:bg-white"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-black text-[#7c6ee6]">
                        {author?.name ?? "Unknown"}
                        {"\u3055\u3093\u304b\u3089"}
                      </span>
                      {unread ? (
                        <span className="rounded-full bg-[#ffedf5] px-2 py-0.5 text-[10px] font-black text-[#c05a86]">
                          {"\u672a\u8aad"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[#9b94aa]">
                          {"\u65e5\u8a18"}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm font-black leading-5 text-[#2f2b3b]">
                      {diary.title}
                    </p>
                  </a>
                );
              },
            )}
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[#ece7fb] bg-white/90 p-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u4eca\u65e5\u306e\u9054\u6210\u72b6\u6cc1"}
                </p>
                <h2 className="text-lg font-black">
                  {missionProgress} / 4
                  {"\u30df\u30c3\u30b7\u30e7\u30f3"}
                </h2>
              </div>
              <a
                href="/daily"
                className="rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white"
              >
                {"\u30c7\u30a4\u30ea\u30fc\u3078"}
              </a>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MissionChip done={todayClaims.includes("login")} label={"\u30ed\u30b0\u30a4\u30f3"} />
              <MissionChip done={wroteToday} label={"\u65e5\u8a18"} />
              <MissionChip done={todayReads >= 3} label={`${Math.min(todayReads, 3)}/3\u8aad\u3080`} />
              <MissionChip done={impressionToday} label={"\u611f\u60f3"} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#ece7fb] bg-white/90 p-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u6700\u8fd1\u306e\u30b3\u30a4\u30f3"}
              </p>
              <span className="rounded-full bg-[#f2efff] px-2.5 py-1 text-xs font-black text-[#7c6ee6]">
                C {currentUser?.coinBalance ?? 0}
              </span>
            </div>
            <div className="mt-2 grid gap-1.5">
              {recentCoins.length === 0 ? (
                <p className="text-xs text-[#9b94aa]">
                  {"\u30c7\u30a4\u30ea\u30fc\u3084\u3044\u3044\u306d\u3067\u30b3\u30a4\u30f3\u3092\u96c6\u3081\u3088\u3046\u3002"}
                </p>
              ) : (
                recentCoins.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-xl bg-[#fbfaff] px-2.5 py-1.5 text-xs"
                  >
                    <span className="font-bold text-[#746d82]">
                      {coinReasonLabels[transaction.reason] ?? transaction.reason}
                    </span>
                    <span
                      className={`font-black ${
                        transaction.amount > 0 ? "text-[#4d9a62]" : "text-[#b15b77]"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-2.5 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-4 gap-1.5">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                    index === 0
                      ? "border-[#ded7fb] bg-[#f0edff] text-[#7c6ee6]"
                      : "border-transparent bg-white text-[#6f6a7e]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <label className="flex min-w-0 items-center gap-2 rounded-full border border-[#ece7fb] bg-white px-3 py-1.5 text-xs text-[#9b94aa] xl:w-60">
              <span>{"\u691c\u7d22"}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent outline-none"
                placeholder={"\u30ad\u30fc\u30ef\u30fc\u30c9"}
              />
            </label>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {diaries.length === 0 ? (
            <p className="rounded-2xl border border-[#ece7fb] bg-white p-4 text-sm text-[#9b94aa] shadow-sm sm:col-span-2 xl:col-span-3">
              {"\u307e\u3060\u5c4a\u3044\u3066\u3044\u308b\u65e5\u8a18\u306f\u3042\u308a\u307e\u305b\u3093\u3002"}
            </p>
          ) : (
            diaries.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
          )}
        </section>

        <button className="mx-auto rounded-full bg-white px-7 py-2 text-xs font-black text-[#9b94aa] shadow-sm">
          {"\u3082\u3063\u3068\u898b\u308b"}
        </button>
      </div>
    </AppShell>
  );
}

function MissionChip({ done, label }: { done: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-center text-xs font-black ${
        done ? "bg-[#edf8f0] text-[#4d9a62]" : "bg-[#f2efff] text-[#7c6ee6]"
      }`}
    >
      {done ? "\u9054\u6210 " : ""}
      {label}
    </span>
  );
}
