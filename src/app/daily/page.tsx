"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useDayDrop } from "@/lib/store";

const toDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

type Mission = {
  id: string;
  title: string;
  detail: string;
  reward: number;
  progress: number;
  required: number;
  href?: string;
};

function StatusBadge({
  achieved,
  claimed,
}: {
  achieved: boolean;
  claimed: boolean;
}) {
  const label = claimed
    ? "\u53d7\u3051\u53d6\u308a\u6e08\u307f"
    : achieved
      ? "\u672a\u53d7\u3051\u53d6\u308a"
      : "\u672a\u9054\u6210";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        claimed
          ? "bg-[#edf8f0] text-[#4d9a62]"
          : achieved
            ? "bg-[#fff8ee] text-[#bd8648]"
            : "bg-[#f2efff] text-[#7c6ee6]"
      }`}
    >
      {label}
    </span>
  );
}

export default function DailyPage() {
  const {
    currentUser,
    diaries,
    dailyReads,
    dailyClaims,
    claimDailyMission,
  } = useDayDrop();
  const [notice, setNotice] = useState("");

  if (!currentUser) {
    return null;
  }

  const today = toDayKey();
  const claimKey = `${currentUser.id}:${today}`;
  const claimedMissionIds = dailyClaims[claimKey] ?? [];
  const readCount = dailyReads[claimKey]?.length ?? 0;
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

  const missions: Mission[] = [
    {
      id: "login",
      title: "\u30ed\u30b0\u30a4\u30f3\u30dc\u30fc\u30ca\u30b9",
      detail: "\u4eca\u65e5\u3082DayDrop\u3092\u958b\u3044\u305f\u8a18\u5ff5\u3067\u3059\u3002",
      reward: 10,
      progress: 1,
      required: 1,
    },
    {
      id: "write-diary",
      title: "\u4eca\u65e5\u306e\u65e5\u8a18\u3092\u66f8\u304f",
      detail: "\u914d\u4fe1\u30ec\u30dd\u30fc\u30c8\u3084\u611f\u8b1d\u306e\u6c17\u6301\u3061\u3092\u5c4a\u3051\u307e\u3057\u3087\u3046\u3002",
      reward: 10,
      progress: wroteToday ? 1 : 0,
      required: 1,
      href: "/compose",
    },
    {
      id: "read-three",
      title: "\u4eca\u65e53\u4ef6\u8aad\u3080",
      detail: "\u63a8\u3057\u3084\u4ef2\u9593\u304b\u3089\u5c4a\u3044\u305f\u65e5\u8a18\u3092\u8aad\u307f\u307e\u3059\u3002",
      reward: 5,
      progress: Math.min(readCount, 3),
      required: 3,
      href: "/",
    },
    {
      id: "write-impression",
      title: "\u4eca\u65e51\u4ef6\u611f\u60f3\u3092\u66f8\u304f",
      detail: "\u8aad\u3093\u3060\u6c17\u6301\u3061\u3092\u77ed\u304f\u3066\u3082\u5c4a\u3051\u307e\u3059\u3002",
      reward: 5,
      progress: Math.min(impressionCount, 1),
      required: 1,
      href: "/",
    },
  ];

  const claim = (mission: Mission) => {
    const achieved = mission.progress >= mission.required;
    const claimed = claimedMissionIds.includes(mission.id);
    if (!achieved || claimed) {
      return;
    }

    const ok = claimDailyMission(mission.id, mission.reward);
    setNotice(
      ok
        ? `+${mission.reward}\u30b3\u30a4\u30f3\u3092\u53d7\u3051\u53d6\u308a\u307e\u3057\u305f\u3002`
        : "\u3059\u3067\u306b\u53d7\u3051\u53d6\u308a\u6e08\u307f\u3067\u3059\u3002",
    );
  };

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
                {"\u4eca\u65e5\u306e\u30df\u30c3\u30b7\u30e7\u30f3"}
              </h1>
              <p className="mt-1 text-sm leading-6 text-[#746d82]">
                {"\u6bce\u65e5\u306e\u65e5\u8a18\u4ea4\u63db\u3067\u3001\u5c11\u3057\u305a\u3064\u88c5\u98fe\u30b3\u30a4\u30f3\u3092\u96c6\u3081\u307e\u3059\u3002"}
              </p>
            </div>
            <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {"\u6240\u6301\u30b3\u30a4\u30f3"} C {currentUser.coinBalance}
            </span>
          </div>
        </header>

        {notice ? (
          <p className="rounded-2xl border border-[#ece7fb] bg-white px-4 py-3 text-sm font-bold text-[#7c6ee6]">
            {notice}
          </p>
        ) : null}

        <section className="grid gap-2">
          {missions.map((mission) => {
            const achieved = mission.progress >= mission.required;
            const claimed = claimedMissionIds.includes(mission.id);
            return (
              <article
                key={mission.id}
                className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_10px_24px_rgba(126,112,174,0.07)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black">{mission.title}</h2>
                      <StatusBadge achieved={achieved} claimed={claimed} />
                      <span className="rounded-full bg-[#fff8ee] px-2.5 py-1 text-xs font-black text-[#bd8648]">
                        +{mission.reward}
                        {"\u30b3\u30a4\u30f3"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#746d82]">
                      {mission.detail}
                    </p>
                    <p className="mt-2 text-xs font-black text-[#9b94aa]">
                      {Math.min(mission.progress, mission.required)} /{" "}
                      {mission.required}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {mission.href && !achieved ? (
                      <Link
                        href={mission.href}
                        className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
                      >
                        {"\u9032\u3081\u308b"}
                      </Link>
                    ) : null}
                    <button
                      onClick={() => claim(mission)}
                      disabled={!achieved || claimed}
                      className="rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white disabled:bg-[#d6cff8]"
                    >
                      {claimed
                        ? "\u53d7\u3051\u53d6\u308a\u6e08\u307f"
                        : "\u5831\u916c\u3092\u53d7\u3051\u53d6\u308b"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
