"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DiaryCard } from "@/components/DiaryCard";
import { ProfilePanel } from "@/components/ProfilePanel";
import { useDayDrop } from "@/lib/store";

const toDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const achievementItems = [
  {
    id: "first-diary",
    label: "\u306f\u3058\u3081\u3066\u306e\u65e5\u8a18",
    title: "\u306f\u3058\u3081\u3066\u306e\u914d\u4fe1\u8005",
    check: (stats: ProfileStats) => stats.diaryCount >= 1,
  },
  {
    id: "diary-10",
    label: "\u65e5\u8a1810\u4ef6\u9054\u6210",
    title: "\u65e5\u8a18\u597d\u304d",
    check: (stats: ProfileStats) => stats.diaryCount >= 10,
  },
  {
    id: "impression-10",
    label: "\u611f\u60f310\u4ef6\u9054\u6210",
    title: "\u611f\u60f3\u8077\u4eba",
    check: (stats: ProfileStats) => stats.impressionCount >= 10,
  },
  {
    id: "like-10",
    label: "\u3044\u3044\u306d10\u4ef6\u9054\u6210",
    title: "\u5fdc\u63f4\u3042\u308a\u304c\u3068\u3046",
    check: (stats: ProfileStats) => stats.likeCount >= 10,
  },
  {
    id: "followers-5",
    label: "\u30d5\u30a9\u30ed\u30ef\u30fc5\u4eba\u9054\u6210",
    title: "\u6df1\u591c\u96d1\u8ac7\u30de\u30b9\u30bf\u30fc",
    check: (stats: ProfileStats) => stats.followerCount >= 5,
  },
  {
    id: "login-7",
    label: "7\u65e5\u9023\u7d9a\u30ed\u30b0\u30a4\u30f3",
    title: "\u6bce\u65e5\u5c4a\u3051\u308b\u4eba",
    check: (stats: ProfileStats) => stats.loginStreak >= 7,
  },
  {
    id: "daily-first",
    label: "\u30c7\u30a4\u30ea\u30fc\u521d\u9054\u6210",
    title: "\u3067\u3044\u3069\u308d\u5e38\u9023",
    check: (stats: ProfileStats) => stats.dailyClaimCount >= 1,
  },
  {
    id: "shop-first",
    label: "\u30b7\u30e7\u30c3\u30d7\u521d\u8cfc\u5165",
    title: "\u98fe\u308a\u4ed8\u3051\u4e0a\u624b",
    check: (stats: ProfileStats) => stats.shopPurchaseCount >= 1,
  },
];

type ProfileStats = {
  diaryCount: number;
  impressionCount: number;
  likeCount: number;
  followerCount: number;
  followingCount: number;
  loginStreak: number;
  dailyClaimCount: number;
  shopPurchaseCount: number;
};

function getLoginStreak(userId: string, dailyClaims: Record<string, string[]>) {
  let streak = 0;
  const cursor = new Date();

  while (streak < 365) {
    const key = `${userId}:${toDayKey(cursor)}`;
    if (!(dailyClaims[key] ?? []).includes("login")) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function MyPage() {
  const {
    currentUser,
    diaries,
    dailyClaims,
    purchasedShopItemIds,
    equippedShopItemIds,
    updateProfile,
  } = useDayDrop();
  const [notice, setNotice] = useState("");
  const myDiaries = useMemo(
    () =>
      currentUser
        ? diaries.filter((diary) => diary.authorId === currentUser.id)
        : [],
    [currentUser, diaries],
  );
  const myImpressions = useMemo(
    () =>
      currentUser
        ? diaries
            .flatMap((diary) => diary.impressions)
            .filter((impression) => impression.authorId === currentUser.id)
        : [],
    [currentUser, diaries],
  );
  const stats = useMemo<ProfileStats>(() => {
    if (!currentUser) {
      return {
        diaryCount: 0,
        impressionCount: 0,
        likeCount: 0,
        followerCount: 0,
        followingCount: 0,
        loginStreak: 0,
        dailyClaimCount: 0,
        shopPurchaseCount: 0,
      };
    }
    const dailyClaimCount = Object.entries(dailyClaims)
      .filter(([key]) => key.startsWith(`${currentUser.id}:`))
      .reduce((sum, [, ids]) => sum + ids.length, 0);

    return {
      diaryCount: myDiaries.length,
      impressionCount: myImpressions.length,
      likeCount: myDiaries.reduce((sum, diary) => sum + diary.likedBy.length, 0),
      followerCount: currentUser.followers.length,
      followingCount: currentUser.following.length,
      loginStreak: getLoginStreak(currentUser.id, dailyClaims),
      dailyClaimCount,
      shopPurchaseCount: (purchasedShopItemIds[currentUser.id] ?? []).length,
    };
  }, [currentUser, dailyClaims, myDiaries, myImpressions, purchasedShopItemIds]);

  if (!currentUser) {
    return null;
  }

  const achievements = achievementItems.map((achievement) => ({
    ...achievement,
    unlocked: achievement.check(stats),
  }));
  const unlockedTitles = achievements
    .filter((achievement) => achievement.unlocked)
    .map((achievement) => achievement.title);
  const equipped = equippedShopItemIds[currentUser.id] ?? {};
  const itemLabel = (itemId: string | undefined) => {
    if (!itemId) {
      return "\u672a\u88c5\u5099";
    }
    return itemId
      .replace("theme-", "")
      .replace("header-", "")
      .replace("card-", "")
      .replace("bg-", "");
  };

  const selectTitle = (title: string) => {
    if (!unlockedTitles.includes(title)) {
      return;
    }
    updateProfile({
      name: currentUser.name,
      handle: currentUser.handle,
      title,
      bio: currentUser.bio,
    });
    setNotice(`\u4e8c\u3064\u540d\u3092\u300c${title}\u300d\u306b\u5909\u66f4\u3057\u307e\u3057\u305f\u3002`);
  };

  return (
    <AppShell>
      <div className="grid gap-3 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="min-w-0">
          <ProfilePanel />
        </div>

        <div className="grid min-w-0 gap-3">
          <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u30de\u30a4\u30da\u30fc\u30b8"}
                </p>
                <h1 className="text-2xl font-black">
                  {"\u914d\u4fe1\u8005\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb"}
                </h1>
              </div>
              <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
                {"\u6240\u6301\u30b3\u30a4\u30f3"} C {currentUser.coinBalance}
              </span>
              <Link
                href="/settings"
                className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
              >
                {"\u5b89\u5168\u8a2d\u5b9a"}
              </Link>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <ProfileMetric label={"\u7dcf\u65e5\u8a18\u6570"} value={stats.diaryCount} />
              <ProfileMetric label={"\u7dcf\u611f\u60f3\u6570"} value={stats.impressionCount} />
              <ProfileMetric label={"\u7dcf\u3044\u3044\u306d\u6570"} value={stats.likeCount} />
              <ProfileMetric label={"\u9023\u7d9a\u30ed\u30b0\u30a4\u30f3"} value={`${stats.loginStreak}\u65e5`} />
              <ProfileMetric label={"\u30d5\u30a9\u30ed\u30ef\u30fc"} value={stats.followerCount} />
              <ProfileMetric label={"\u30d5\u30a9\u30ed\u30fc"} value={stats.followingCount} />
              <ProfileMetric label={"\u79f0\u53f7\u89e3\u653e"} value={unlockedTitles.length} />
              <ProfileMetric label={"\u73fe\u5728\u306e\u79f0\u53f7"} value={currentUser.title} />
              <ProfileMetric label={"\u73fe\u5728\u306e\u30c6\u30fc\u30de"} value={itemLabel(equipped.theme)} />
              <ProfileMetric label={"\u73fe\u5728\u306e\u30d8\u30c3\u30c0\u30fc"} value={itemLabel(equipped.header)} />
            </div>
          </section>

          <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u5b9f\u7e3e"}
                </p>
                <h2 className="text-xl font-black">
                  {"\u80b2\u3063\u3066\u3044\u304f\u79f0\u53f7"}
                </h2>
              </div>
              {notice ? (
                <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
                  {notice}
                </span>
              ) : null}
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {achievements.map((achievement) => (
                <article
                  key={achievement.id}
                  className={`rounded-2xl border p-3 ${
                    achievement.unlocked
                      ? "border-[#ded7fb] bg-[#fbfaff]"
                      : "border-[#ece7fb] bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black">{achievement.label}</h3>
                      <p className="mt-1 text-xs font-bold text-[#8b7cf6]">
                        {achievement.title}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                        achievement.unlocked
                          ? "bg-[#edf8f0] text-[#4d9a62]"
                          : "bg-[#f2efff] text-[#7c6ee6]"
                      }`}
                    >
                      {achievement.unlocked
                        ? "\u9054\u6210\u6e08\u307f"
                        : "\u672a\u9054\u6210"}
                    </span>
                  </div>
                  <button
                    onClick={() => selectTitle(achievement.title)}
                    disabled={!achievement.unlocked}
                    className="mt-3 w-full rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white disabled:bg-[#d6cff8]"
                  >
                    {currentUser.title === achievement.title
                      ? "\u9078\u629e\u4e2d"
                      : "\u4e8c\u3064\u540d\u306b\u3059\u308b"}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="min-w-0 rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u30de\u30a4\u30da\u30fc\u30b8"}
              </p>
              <h1 className="text-xl font-black">{"\u81ea\u5206\u306e\u65e5\u8a18"}</h1>
            </div>
            <span className="rounded-full bg-[#f0edff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {myDiaries.length}
              {"\u4ef6"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {myDiaries.length === 0 ? (
              <p className="rounded-2xl bg-[#fbfaff] p-4 text-sm text-[#9b94aa] md:col-span-2">
                {"\u307e\u3060\u65e5\u8a18\u3092\u66f8\u3044\u3066\u3044\u307e\u305b\u3093\u3002"}
              </p>
            ) : (
              myDiaries.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
            )}
          </div>
        </section>
        </div>
      </div>
    </AppShell>
  );
}

function ProfileMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl bg-[#fbfaff] p-3">
      <p className="text-[11px] font-black text-[#9b94aa]">{label}</p>
      <p className="mt-1 truncate text-lg font-black text-[#2f2b3b]">{value}</p>
    </div>
  );
}
