"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useDayDrop } from "@/lib/store";

const toDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

function StatusBadge({ done }: { done: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        done
          ? "bg-[#edf8f0] text-[#4d9a62]"
          : "bg-[#f2efff] text-[#7c6ee6]"
      }`}
    >
      {done ? "\u9054\u6210" : "\u3053\u308c\u304b\u3089"}
    </span>
  );
}

export default function DailyPage() {
  const {
    currentUser,
    diaries,
    dailyReads,
    coinTransactions,
    claimDailyBonus,
  } = useDayDrop();

  if (!currentUser) {
    return null;
  }

  const today = toDayKey();
  const readCount = dailyReads[`${currentUser.id}:${today}`]?.length ?? 0;
  const wroteToday = diaries.some(
    (diary) =>
      diary.authorId === currentUser.id &&
      toDayKey(new Date(diary.createdAt)) === today,
  );
  const impressionCount = diaries.flatMap((diary) => diary.impressions).filter(
    (impression) =>
      impression.authorId === currentUser.id &&
      toDayKey(new Date(impression.createdAt)) === today,
  ).length;
  const bonusClaimed = coinTransactions.some(
    (transaction) =>
      transaction.userId === currentUser.id &&
      transaction.reason === "daily_reward" &&
      toDayKey(new Date(transaction.createdAt)) === today,
  );

  const tasks = [
    {
      title: "\u30ed\u30b0\u30a4\u30f3\u30dc\u30fc\u30ca\u30b9",
      detail: bonusClaimed
        ? "\u4eca\u65e5\u306e10\u30b3\u30a4\u30f3\u3092\u53d7\u3051\u53d6\u308a\u6e08\u307f\u3067\u3059\u3002"
        : "\u4eca\u65e5\u306e10\u30b3\u30a4\u30f3\u3092\u53d7\u3051\u53d6\u308c\u307e\u3059\u3002",
      reward: "+10",
      done: bonusClaimed,
      action: (
        <button
          onClick={claimDailyBonus}
          disabled={bonusClaimed}
          className="rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white disabled:bg-[#d6cff8]"
        >
          {bonusClaimed
            ? "\u53d7\u3051\u53d6\u308a\u6e08\u307f"
            : "\u53d7\u3051\u53d6\u308b"}
        </button>
      ),
    },
    {
      title: "\u4eca\u65e5\u306e\u65e5\u8a18\u3092\u66f8\u304f",
      detail: wroteToday
        ? "\u4eca\u65e5\u306e\u914d\u4fe1\u30ec\u30dd\u30fc\u30c8\u3092\u5c4a\u3051\u307e\u3057\u305f\u3002"
        : "\u4eca\u65e5\u306e\u914d\u4fe1\u30ec\u30dd\u30fc\u30c8\u3084\u544a\u77e5\u3092\u5c4a\u3051\u307e\u3057\u3087\u3046\u3002",
      reward: "0",
      done: wroteToday,
      action: (
        <Link
          href="/compose"
          className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
        >
          {"\u65e5\u8a18\u3092\u66f8\u304f"}
        </Link>
      ),
    },
    {
      title: "\u4eca\u65e53\u4ef6\u8aad\u3080",
      detail: `${Math.min(readCount, 3)} / 3\u4ef6 \u8aad\u307f\u307e\u3057\u305f\u3002`,
      reward: "0",
      done: readCount >= 3,
      action: (
        <Link
          href="/"
          className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
        >
          {"\u8aad\u307f\u306b\u884c\u304f"}
        </Link>
      ),
    },
    {
      title: "\u4eca\u65e51\u4ef6\u611f\u60f3\u3092\u66f8\u304f",
      detail: `${Math.min(impressionCount, 1)} / 1\u4ef6 \u611f\u60f3\u3092\u5c4a\u3051\u307e\u3057\u305f\u3002`,
      reward: "0",
      done: impressionCount >= 1,
      action: (
        <Link
          href="/"
          className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
        >
          {"\u611f\u60f3\u3092\u66f8\u304f"}
        </Link>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto grid max-w-3xl gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30c7\u30a4\u30ea\u30fc"}
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black">
                {"\u4eca\u65e5\u306e\u914d\u4fe1\u65e5\u8ab2"}
              </h1>
              <p className="mt-1 text-sm leading-6 text-[#746d82]">
                {"\u914d\u4fe1\u30ec\u30dd\u30fc\u30c8\u3092\u66f8\u304f\u3001\u8aad\u3080\u3001\u611f\u60f3\u3092\u5c4a\u3051\u308b\u6d41\u308c\u3092\u5c11\u3057\u305a\u3064\u9032\u3081\u307e\u3059\u3002"}
              </p>
            </div>
            <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {"\u6240\u6301\u30b3\u30a4\u30f3"} C {currentUser.coinBalance}
            </span>
          </div>
        </header>

        <section className="grid gap-2">
          {tasks.map((task) => (
            <article
              key={task.title}
              className="flex flex-col gap-3 rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_10px_24px_rgba(126,112,174,0.07)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-black">{task.title}</h2>
                  <StatusBadge done={task.done} />
                  <span className="rounded-full bg-[#fff8ee] px-2.5 py-1 text-xs font-black text-[#bd8648]">
                    {"\u7372\u5f97\u30b3\u30a4\u30f3"} {task.reward}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#746d82]">{task.detail}</p>
              </div>
              <div className="shrink-0">{task.action}</div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
