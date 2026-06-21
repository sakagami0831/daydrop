"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DiaryCard } from "@/components/DiaryCard";
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

const decorationItems = [
  {
    id: "theme-lavender",
    name: "\u30e9\u30d9\u30f3\u30c0\u30fc",
    slot: "theme",
    tone: "bg-[#f2efff]",
  },
  {
    id: "theme-sakura",
    name: "\u685c",
    slot: "theme",
    tone: "bg-[#fff1f6]",
  },
  {
    id: "theme-cloud",
    name: "\u96f2",
    slot: "theme",
    tone: "bg-[#f2f8ff]",
  },
  {
    id: "theme-notebook",
    name: "\u65e5\u8a18\u5e33",
    slot: "theme",
    tone: "bg-[#fff9ed]",
  },
  {
    id: "theme-fanletter",
    name: "\u30d5\u30a1\u30f3\u30ec\u30bf\u30fc",
    slot: "theme",
    tone: "bg-[#fff8ee]",
  },
  {
    id: "header-streamer",
    name: "\u914d\u4fe1\u8005\u30d8\u30c3\u30c0\u30fc",
    slot: "header",
    tone: "bg-[#eef7ff]",
  },
  {
    id: "header-event",
    name: "\u544a\u77e5\u30d8\u30c3\u30c0\u30fc",
    slot: "header",
    tone: "bg-[#f4fff5]",
  },
  {
    id: "header-thanks",
    name: "\u3042\u308a\u304c\u3068\u3046\u30d8\u30c3\u30c0\u30fc",
    slot: "header",
    tone: "bg-[#fff7fb]",
  },
];

const titlePrefixOptions = [
  "\u6df1\u591c\u306e",
  "\u3075\u308f\u3075\u308f",
  "\u6c17\u307e\u3050\u308c",
  "\u5922\u898b\u308b",
  "\u307e\u3063\u305f\u308a",
];

const titleSuffixOptions = [
  "\u65e5\u8a18\u5c4b\u3055\u3093",
  "\u914d\u4fe1\u8005",
  "\u611f\u60f3\u8077\u4eba",
  "\u304a\u8fd4\u4e8b\u4fc2",
  "\u3067\u3044\u3069\u308d\u6c11",
];

const avatarOptions = ["S", "M", "H", "Y", "D", "\u2606", "\u2661", "\u25cb"];

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
    equipShopItem,
    logout,
  } = useDayDrop();
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? "");
  const [handle, setHandle] = useState(currentUser?.handle ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [avatar, setAvatar] = useState(currentUser?.avatar ?? "D");
  const [titlePrefix, setTitlePrefix] = useState(() => {
    const prefix = currentUser?.title.split(" ")[0];
    return prefix && titlePrefixOptions.includes(prefix)
      ? prefix
      : titlePrefixOptions[0];
  });
  const [titleSuffix, setTitleSuffix] = useState(() => {
    const suffix = currentUser?.title.split(" ").slice(1).join(" ");
    return suffix && titleSuffixOptions.includes(suffix)
      ? suffix
      : titleSuffixOptions[1];
  });
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>(() => {
    if (typeof window === "undefined" || !currentUser) {
      return [];
    }

    const saved = window.localStorage.getItem(
      `daydrop-profile-display-${currentUser.id}`,
    );
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as string[];
    } catch {
      return [];
    }
  });
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
  const metricOptions = [
    { id: "diaryCount", label: "\u65e5\u8a18", value: stats.diaryCount },
    { id: "impressionCount", label: "\u611f\u60f3", value: stats.impressionCount },
    { id: "likeCount", label: "\u3044\u3044\u306d", value: stats.likeCount },
    { id: "loginStreak", label: "\u9023\u7d9a", value: `${stats.loginStreak}\u65e5` },
    { id: "followerCount", label: "\u30d5\u30a9\u30ed\u30ef\u30fc", value: stats.followerCount },
    { id: "followingCount", label: "\u30d5\u30a9\u30ed\u30fc", value: stats.followingCount },
  ];
  const visibleMetrics = metricOptions.filter((metric) =>
    selectedBadgeIds.includes(metric.id),
  );
  const purchased = purchasedShopItemIds[currentUser.id] ?? [];
  const equipped = equippedShopItemIds[currentUser.id] ?? {};
  const ownedDecorations = decorationItems.filter((item) =>
    purchased.includes(item.id),
  );
  const themeItems = ownedDecorations.filter((item) => item.slot === "theme");
  const headerItems = ownedDecorations.filter((item) => item.slot === "header");
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
  const activeDecorations = [
    equipped.header,
    equipped.theme,
    equipped.background,
    ...purchased,
  ].filter(Boolean);
  const headerClass = activeDecorations.includes("header-event")
    ? "bg-[linear-gradient(135deg,#fff1f6,#f2efff_45%,#f4fff5)]"
    : activeDecorations.includes("header-thanks")
      ? "bg-[linear-gradient(135deg,#fff7fb,#fff8ee_48%,#f2efff)]"
      : activeDecorations.includes("header-streamer")
        ? "bg-[linear-gradient(135deg,#eef7ff,#f2efff_55%,#fff7fb)]"
        : "bg-[linear-gradient(135deg,#f0edff,#fff3f8_55%,#eef7ff)]";
  const previewClass = activeDecorations.includes("theme-fanletter")
    ? "bg-[linear-gradient(135deg,#fff8ee,#ffffff_52%,#fff1f6)]"
    : activeDecorations.includes("theme-sakura")
      ? "bg-[linear-gradient(135deg,#fff1f6,#ffffff_55%,#f2efff)]"
      : activeDecorations.includes("theme-cloud")
        ? "bg-[linear-gradient(135deg,#eef7ff,#ffffff_55%,#fbfaff)]"
        : activeDecorations.includes("theme-notebook")
          ? "bg-[linear-gradient(135deg,#fff9ed,#ffffff_55%,#f2efff)]"
          : "bg-white";
  const avatarImageUrl = currentUser.avatarImageUrl ?? "";
  const headerImageUrl = currentUser.headerImageUrl ?? "";

  const applyTitleCombo = (prefix = titlePrefix, suffix = titleSuffix) => {
    const title = `${prefix} ${suffix}`;
    updateProfile({
      name: currentUser.name,
      handle: currentUser.handle,
      title,
      bio: currentUser.bio,
      avatar: currentUser.avatar,
    });
    setNotice(`\u4e8c\u3064\u540d\u3092\u300c${title}\u300d\u306b\u5909\u66f4\u3057\u307e\u3057\u305f\u3002`);
  };

  const saveProfile = () => {
    updateProfile({
      name: name.trim() || currentUser.name,
      handle: handle.trim() || currentUser.handle,
      title: currentUser.title,
      bio: bio.trim(),
      avatar,
    });
    setEditing(false);
    setNotice("\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002");
  };

  const equipDecoration = (itemId: string, slot: string) => {
    const ok = equipShopItem(itemId, slot);
    setNotice(
      ok
        ? "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u306b\u88c5\u5099\u3057\u307e\u3057\u305f\u3002"
        : "\u88c5\u5099\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
    );
  };

  const toggleDisplayBadge = (badgeId: string) => {
    const next = selectedBadgeIds.includes(badgeId)
      ? selectedBadgeIds.filter((id) => id !== badgeId)
      : [...selectedBadgeIds, badgeId];
    setSelectedBadgeIds(next);
    window.localStorage.setItem(
      `daydrop-profile-display-${currentUser.id}`,
      JSON.stringify(next),
    );
  };

  const updateImage = (
    file: File | undefined,
    field: "avatarImageUrl" | "headerImageUrl",
  ) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }
      updateProfile({ [field]: reader.result });
      setNotice(
        field === "avatarImageUrl"
          ? "\u30a2\u30a4\u30b3\u30f3\u3092\u5909\u66f4\u3057\u307e\u3057\u305f\u3002"
          : "\u30d8\u30c3\u30c0\u30fc\u3092\u5909\u66f4\u3057\u307e\u3057\u305f\u3002",
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-4">
          <section className={`overflow-hidden rounded-3xl border border-[#ece7fb] ${previewClass} shadow-[0_18px_42px_rgba(126,112,174,0.12)]`}>
            <label
              className={`group relative block h-36 cursor-pointer overflow-hidden ${headerClass}`}
            >
              {headerImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={headerImageUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : null}
              <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-[#7c6ee6] opacity-95 shadow-sm transition group-hover:bg-[#f2efff]">
                {"\u30d8\u30c3\u30c0\u30fc\u3092\u5909\u66f4"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  updateImage(event.target.files?.[0], "headerImageUrl")
                }
              />
            </label>
            <div className="-mt-12 grid gap-5 px-5 pb-5 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label className="group relative grid size-24 cursor-pointer place-items-center overflow-hidden rounded-full border-4 border-white bg-[#f4efff] text-4xl font-black text-[#8b7cf6] shadow-[0_12px_24px_rgba(126,112,174,0.16)]">
                    {avatarImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarImageUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      avatar
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-white/90 py-1 text-center text-[10px] font-black text-[#7c6ee6] opacity-95">
                      {"\u5909\u66f4"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        updateImage(event.target.files?.[0], "avatarImageUrl")
                      }
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditing((value) => !value)}
                      className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7c6ee6] shadow-sm ring-1 ring-[#ece7fb]"
                    >
                      {editing ? "\u9589\u3058\u308b" : "\u7de8\u96c6"}
                    </button>
                    <Link
                      href="/shop"
                      className="rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white shadow-[0_10px_20px_rgba(139,124,246,0.2)]"
                    >
                      {"\u3082\u3063\u3068\u98fe\u308b"}
                    </Link>
                    <button
                      onClick={logout}
                      className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#9b94aa] shadow-sm ring-1 ring-[#ece7fb]"
                    >
                      {"\u30ed\u30b0\u30a2\u30a6\u30c8"}
                    </button>
                  </div>
                </div>

                {editing ? (
                  <div className="mt-4 grid max-w-xl gap-2 rounded-3xl bg-white/80 p-4">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="rounded-2xl border border-[#ece7fb] px-4 py-2 text-sm outline-none focus:border-[#9b8be8]"
                      aria-label={"\u540d\u524d"}
                    />
                    <input
                      value={handle}
                      onChange={(event) => setHandle(event.target.value)}
                      className="rounded-2xl border border-[#ece7fb] px-4 py-2 text-sm outline-none focus:border-[#9b8be8]"
                      aria-label={"\u30cf\u30f3\u30c9\u30eb"}
                    />
                    <textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      className="min-h-24 rounded-2xl border border-[#ece7fb] px-4 py-2 text-sm outline-none focus:border-[#9b8be8]"
                      aria-label={"\u81ea\u5df1\u7d39\u4ecb"}
                    />
                    <button
                      onClick={saveProfile}
                      className="rounded-full bg-[#8b7cf6] px-4 py-2 text-sm font-black text-white"
                    >
                      {"\u4fdd\u5b58"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-xs font-black tracking-[0.2em] text-[#9b94aa]">
                      {"\u308f\u305f\u3057\u306e\u30da\u30fc\u30b8"}
                    </p>
                    <h1 className="mt-1 text-3xl font-black text-[#2f2b3b]">
                      {currentUser.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
                        {`\u300c${currentUser.title}\u300d`}
                      </span>
                      <span className="rounded-full bg-[#fff8ee] px-3 py-1 text-xs font-black text-[#bd8648]">
                        {itemLabel(equipped.theme)}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#8b7cf6] ring-1 ring-[#ece7fb]">
                        {itemLabel(equipped.header)}
                      </span>
                    </div>
                    <p className="mt-4 max-w-2xl rounded-3xl bg-white/75 p-4 text-sm leading-7 text-[#6f6a7e]">
                      {currentUser.bio || "\u81ea\u5df1\u7d39\u4ecb\u3092\u66f8\u3044\u3066\u3001\u30da\u30fc\u30b8\u3092\u80b2\u3066\u3088\u3046\u3002"}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid content-end gap-2 rounded-3xl bg-white/75 p-4">
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u8868\u793a\u4e2d\u306e\u30d0\u30c3\u30b8"}
                </p>
                {visibleMetrics.length === 0 ? (
                  <p className="rounded-3xl bg-white px-3 py-2 text-xs font-bold text-[#9b94aa]">
                    {"\u8868\u793a\u3059\u308b\u8a18\u9332\u3092\u9078\u3076\u3068\u3001\u3053\u3053\u306b\u5c0f\u3055\u304f\u51fa\u307e\u3059\u3002"}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {visibleMetrics.map((metric) => (
                      <ProfileBadge
                        key={metric.id}
                        label={metric.label}
                        value={metric.value}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#ece7fb] bg-white/90 p-5 shadow-[0_14px_34px_rgba(126,112,174,0.09)]">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u30ab\u30b9\u30bf\u30e0"}
                </p>
                <h1 className="text-2xl font-black">
                  {"\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u306b\u51fa\u3059\u3082\u306e"}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fff8ee] px-3 py-1 text-xs font-black text-[#bd8648]">
                  {"\u6240\u6301\u30b3\u30a4\u30f3"} C {currentUser.coinBalance}
                </span>
                <Link
                  href="/settings"
                  className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
                >
                  {"\u5b89\u5168\u8a2d\u5b9a"}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-3xl bg-[#fbfaff] p-4">
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u30a2\u30a4\u30b3\u30f3"}
                </p>
                <p className="mt-1 text-xs font-bold text-[#9b94aa]">
                  {"\u753b\u50cf\u304c\u3042\u308b\u5834\u5408\u306f\u753b\u50cf\u3092\u512a\u5148\u3057\u307e\u3059\u3002"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {avatarOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setAvatar(option);
                        updateProfile({ avatar: option });
                      }}
                      className={`grid size-10 place-items-center rounded-full text-sm font-black ${
                        avatar === option
                          ? "bg-[#8b7cf6] text-white shadow-[0_8px_18px_rgba(139,124,246,0.2)]"
                          : "bg-white text-[#8b7cf6] ring-1 ring-[#ece7fb]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#fbfaff] p-4">
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u4e8c\u3064\u540d"}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <select
                    value={titlePrefix}
                    onChange={(event) => {
                      setTitlePrefix(event.target.value);
                      applyTitleCombo(event.target.value, titleSuffix);
                    }}
                    className="rounded-2xl border border-[#ece7fb] bg-white px-3 py-2 text-xs font-black outline-none"
                  >
                    {titlePrefixOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    value={titleSuffix}
                    onChange={(event) => {
                      setTitleSuffix(event.target.value);
                      applyTitleCombo(titlePrefix, event.target.value);
                    }}
                    className="rounded-2xl border border-[#ece7fb] bg-white px-3 py-2 text-xs font-black outline-none"
                  >
                    {titleSuffixOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 rounded-full bg-white px-3 py-1.5 text-center text-xs font-black text-[#7c6ee6]">
                  {titlePrefix} {titleSuffix}
                </p>
              </div>

              <div className="rounded-3xl bg-[#fbfaff] p-4">
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u8868\u793a\u30d0\u30c3\u30b8"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {metricOptions.map((metric) => {
                    const selected = selectedBadgeIds.includes(metric.id);
                    return (
                      <button
                        key={metric.id}
                        onClick={() => toggleDisplayBadge(metric.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-black ${
                          selected
                            ? "bg-[#8b7cf6] text-white"
                            : "bg-white text-[#7c6ee6] ring-1 ring-[#ece7fb]"
                        }`}
                      >
                        {metric.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <DecorationPicker
              title={"\u30c6\u30fc\u30de\u3092\u9078\u3076"}
              items={themeItems}
              emptyText={"\u307e\u3060\u8cfc\u5165\u6e08\u307f\u30c6\u30fc\u30de\u304c\u3042\u308a\u307e\u305b\u3093\u3002"}
              equipped={equipped}
              onEquip={equipDecoration}
            />
            <DecorationPicker
              title={"\u30d8\u30c3\u30c0\u30fc\u3092\u9078\u3076"}
              items={headerItems}
              emptyText={"\u307e\u3060\u8cfc\u5165\u6e08\u307f\u30d8\u30c3\u30c0\u30fc\u304c\u3042\u308a\u307e\u305b\u3093\u3002"}
              equipped={equipped}
              onEquip={equipDecoration}
            />
          </section>

          <details className="rounded-3xl border border-[#ece7fb] bg-white/90 p-5 shadow-[0_14px_34px_rgba(126,112,174,0.09)]">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-black text-[#8b7cf6]">
                    {"\u79f0\u53f7\u30fb\u5b9f\u7e3e"}
                  </p>
                  <h2 className="text-lg font-black">
                    {"\u80b2\u3063\u3066\u3044\u304f\u79f0\u53f7"}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#fff8ee] px-3 py-1 text-xs font-black text-[#bd8648]">
                    {unlockedTitles.length}
                    {"\u4ef6\u89e3\u653e"}
                  </span>
                  {notice ? (
                    <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
                      {notice}
                    </span>
                  ) : null}
                </div>
              </div>
            </summary>

            <div className="mt-4 flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <span
                  key={achievement.id}
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${
                    achievement.unlocked
                      ? "bg-[#fff8ee] text-[#bd8648] ring-1 ring-[#f2dfc3]"
                      : "bg-[#fbfaff] text-[#aaa2bd] ring-1 ring-[#ece7fb]"
                  }`}
                >
                  {achievement.unlocked ? "\u2726 " : ""}
                  {achievement.label}
                </span>
              ))}
            </div>
          </details>

          <section className="min-w-0 rounded-3xl border border-[#ece7fb] bg-white/90 p-5 shadow-[0_14px_34px_rgba(126,112,174,0.09)]">
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
                <p className="rounded-3xl bg-[#fbfaff] p-4 text-sm text-[#9b94aa] md:col-span-2">
                  {"\u307e\u3060\u65e5\u8a18\u3092\u66f8\u3044\u3066\u3044\u307e\u305b\u3093\u3002"}
                </p>
              ) : (
                myDiaries.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
              )}
            </div>
          </section>
      </div>
    </AppShell>
  );
}

function ProfileBadge({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#ece7fb] bg-white px-3 py-1.5 text-xs shadow-[0_8px_18px_rgba(126,112,174,0.08)]">
      <span className="shrink-0 text-[#aaa2bd]">{label}</span>
      <span className="truncate font-black text-[#7c6ee6]">{value}</span>
    </span>
  );
}

function DecorationPicker({
  title,
  items,
  emptyText,
  equipped,
  onEquip,
}: {
  title: string;
  items: typeof decorationItems;
  emptyText: string;
  equipped: Record<string, string>;
  onEquip: (itemId: string, slot: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-[#ece7fb] bg-white/90 p-5 shadow-[0_14px_34px_rgba(126,112,174,0.09)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30ab\u30b9\u30bf\u30e0"}
          </p>
          <h2 className="text-xl font-black">{title}</h2>
        </div>
        <Link
          href="/shop"
          className="rounded-full bg-[#f2efff] px-3 py-1.5 text-xs font-black text-[#7c6ee6]"
        >
          {"\u30b7\u30e7\u30c3\u30d7\u3078"}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-[#fbfaff] p-4 text-sm text-[#746d82]">
          <p>{emptyText}</p>
          <Link
            href="/shop"
            className="mt-3 inline-flex rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white"
          >
            {"\u3082\u3063\u3068\u98fe\u308b"}
          </Link>
        </div>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            const active = equipped[item.slot] === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onEquip(item.id, item.slot)}
                disabled={active}
                className={`flex items-center justify-between gap-3 rounded-3xl border p-3 text-left transition ${
                  active
                    ? "border-[#ded7fb] bg-[#fbfaff]"
                    : "border-[#ece7fb] bg-white hover:bg-[#fbfaff]"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`size-10 shrink-0 rounded-2xl ${item.tone}`} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-[#9b94aa]">
                      {active ? "\u88c5\u5099\u4e2d" : "\u88c5\u5099\u3067\u304d\u307e\u3059"}
                    </span>
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                    active
                      ? "bg-[#fff8ee] text-[#bd8648]"
                      : "bg-[#f2efff] text-[#7c6ee6]"
                  }`}
                >
                  {active ? "\u88c5\u5099\u4e2d" : "\u9078\u3076"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
