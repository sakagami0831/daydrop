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
    check: (stats: ProfileStats) => stats.diaryCount >= 1,
  },
  {
    id: "diary-10",
    label: "\u65e5\u8a1810\u4ef6\u9054\u6210",
    check: (stats: ProfileStats) => stats.diaryCount >= 10,
  },
  {
    id: "impression-10",
    label: "\u611f\u60f310\u4ef6\u9054\u6210",
    check: (stats: ProfileStats) => stats.impressionCount >= 10,
  },
  {
    id: "like-10",
    label: "\u3044\u3044\u306d10\u4ef6\u9054\u6210",
    check: (stats: ProfileStats) => stats.likeCount >= 10,
  },
  {
    id: "followers-5",
    label: "\u30d5\u30a9\u30ed\u30ef\u30fc5\u4eba\u9054\u6210",
    check: (stats: ProfileStats) => stats.followerCount >= 5,
  },
  {
    id: "login-7",
    label: "7\u65e5\u9023\u7d9a\u30ed\u30b0\u30a4\u30f3",
    check: (stats: ProfileStats) => stats.loginStreak >= 7,
  },
  {
    id: "daily-first",
    label: "\u30c7\u30a4\u30ea\u30fc\u521d\u9054\u6210",
    check: (stats: ProfileStats) => stats.dailyClaimCount >= 1,
  },
  {
    id: "shop-first",
    label: "\u30b7\u30e7\u30c3\u30d7\u521d\u8cfc\u5165",
    check: (stats: ProfileStats) => stats.shopPurchaseCount >= 1,
  },
];

const decorationItems = [
  { id: "theme-lavender", name: "\u30e9\u30d9\u30f3\u30c0\u30fc", slot: "theme", tone: "bg-[#f2efff]" },
  { id: "theme-sakura", name: "\u685c", slot: "theme", tone: "bg-[#fff1f6]" },
  { id: "theme-cloud", name: "\u96f2", slot: "theme", tone: "bg-[#f2f8ff]" },
  { id: "theme-notebook", name: "\u65e5\u8a18\u5e33", slot: "theme", tone: "bg-[#fff9ed]" },
  { id: "theme-fanletter", name: "\u30d5\u30a1\u30f3\u30ec\u30bf\u30fc", slot: "theme", tone: "bg-[#fff8ee]" },
  { id: "header-streamer", name: "\u914d\u4fe1\u8005\u30d8\u30c3\u30c0\u30fc", slot: "header", tone: "bg-[#eef7ff]" },
  { id: "header-event", name: "\u544a\u77e5\u30d8\u30c3\u30c0\u30fc", slot: "header", tone: "bg-[#f4fff5]" },
  { id: "header-thanks", name: "\u3042\u308a\u304c\u3068\u3046\u30d8\u30c3\u30c0\u30fc", slot: "header", tone: "bg-[#fff7fb]" },
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
  const [editOpen, setEditOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [name, setName] = useState(currentUser?.name ?? "");
  const [handle, setHandle] = useState(currentUser?.handle ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");
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
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;
  const purchased = purchasedShopItemIds[currentUser.id] ?? [];
  const equipped = equippedShopItemIds[currentUser.id] ?? {};
  const ownedDecorations = decorationItems.filter((item) =>
    purchased.includes(item.id),
  );
  const themeItems = ownedDecorations.filter((item) => item.slot === "theme");
  const headerItems = ownedDecorations.filter((item) => item.slot === "header");
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
  const pageClass = activeDecorations.includes("theme-fanletter")
    ? "bg-[linear-gradient(135deg,#fff8ee,#ffffff_52%,#fff1f6)]"
    : activeDecorations.includes("theme-sakura")
      ? "bg-[linear-gradient(135deg,#fff1f6,#ffffff_55%,#f2efff)]"
      : activeDecorations.includes("theme-cloud")
        ? "bg-[linear-gradient(135deg,#eef7ff,#ffffff_55%,#fbfaff)]"
        : activeDecorations.includes("theme-notebook")
          ? "bg-[linear-gradient(135deg,#fff9ed,#ffffff_55%,#f2efff)]"
          : "bg-white";
  const titlePreview = `${titlePrefix} ${titleSuffix}`;

  const saveProfile = () => {
    updateProfile({
      name: name.trim() || currentUser.name,
      handle: handle.trim() || currentUser.handle,
      title: titlePreview,
      bio: bio.trim(),
    });
    setEditOpen(false);
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
        <section className={`overflow-hidden rounded-3xl border border-[#ece7fb] ${pageClass} shadow-[0_18px_42px_rgba(126,112,174,0.12)]`}>
          <div className={`h-40 overflow-hidden ${headerClass}`}>
            {currentUser.headerImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.headerImageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : null}
          </div>

          <div className="-mt-12 px-5 pb-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="grid size-24 place-items-center overflow-hidden rounded-full border-4 border-white bg-[#f4efff] text-4xl font-black text-[#8b7cf6] shadow-[0_12px_24px_rgba(126,112,174,0.16)]">
                {currentUser.avatarImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatarImageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  currentUser.avatar
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setEditOpen(true)}
                  className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7c6ee6] shadow-sm ring-1 ring-[#ece7fb]"
                >
                  {"\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u7de8\u96c6"}
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

            <div className="mt-4">
              <p className="text-xs font-black tracking-[0.2em] text-[#9b94aa]">
                {"\u308f\u305f\u3057\u306e\u30da\u30fc\u30b8"}
              </p>
              <h1 className="mt-1 text-3xl font-black text-[#2f2b3b]">
                {currentUser.name}
              </h1>
              <p className="mt-1 text-sm font-bold text-[#9b94aa]">
                @{currentUser.handle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ProfileBadge label={currentUser.title} />
                <ProfileBadge label={`${stats.followerCount}\u30d5\u30a9\u30ed\u30ef\u30fc`} />
                <ProfileBadge label={`${stats.followingCount}\u30d5\u30a9\u30ed\u30fc`} />
                <ProfileBadge label={`${unlockedCount}\u79f0\u53f7`} />
              </div>
              <p className="mt-4 max-w-3xl rounded-3xl bg-white/75 p-4 text-sm leading-7 text-[#6f6a7e]">
                {currentUser.bio ||
                  "\u81ea\u5df1\u7d39\u4ecb\u3092\u66f8\u3044\u3066\u3001\u30da\u30fc\u30b8\u3092\u80b2\u3066\u3088\u3046\u3002"}
              </p>
              {notice ? (
                <p className="mt-3 inline-flex rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
                  {notice}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-[#ece7fb] bg-white/90 p-5 shadow-[0_14px_34px_rgba(126,112,174,0.09)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u5c4a\u3051\u305f\u65e5\u8a18"}
              </p>
              <h2 className="text-xl font-black">{"\u81ea\u5206\u306e\u65e5\u8a18"}</h2>
            </div>
            <span className="rounded-full bg-[#f0edff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {myDiaries.length}
              {"\u4ef6"}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myDiaries.length === 0 ? (
              <div className="rounded-3xl bg-[#fbfaff] p-6 text-sm text-[#9b94aa] md:col-span-2 xl:col-span-3">
                <p>{"\u307e\u3060\u65e5\u8a18\u3092\u66f8\u3044\u3066\u3044\u307e\u305b\u3093\u3002"}</p>
                <Link
                  href="/compose"
                  className="mt-4 inline-flex rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white"
                >
                  {"\u65e5\u8a18\u3092\u66f8\u304f"}
                </Link>
              </div>
            ) : (
              myDiaries.map((diary) => <DiaryCard key={diary.id} diary={diary} />)
            )}
          </div>
        </section>

        <details className="rounded-3xl border border-[#ece7fb] bg-white/90 p-5 shadow-[0_14px_34px_rgba(126,112,174,0.09)]">
          <summary className="cursor-pointer list-none">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-black text-[#8b7cf6]">
                  {"\u79f0\u53f7\u30fb\u5b9f\u7e3e"}
                </p>
                <h2 className="text-lg font-black">
                  {"\u89e3\u653e\u3057\u305f\u3082\u306e\u3092\u898b\u308b"}
                </h2>
              </div>
              <span className="rounded-full bg-[#fff8ee] px-3 py-1 text-xs font-black text-[#bd8648]">
                {unlockedCount}
                {"\u4ef6"}
              </span>
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

        {editOpen ? (
          <ProfileEditModal
            bio={bio}
            currentUserTitle={currentUser.title}
            equipDecoration={equipDecoration}
            equipped={equipped}
            handle={handle}
            headerItems={headerItems}
            name={name}
            onClose={() => setEditOpen(false)}
            onHeaderImage={(file) => updateImage(file, "headerImageUrl")}
            onIconImage={(file) => updateImage(file, "avatarImageUrl")}
            onSave={saveProfile}
            setBio={setBio}
            setHandle={setHandle}
            setName={setName}
            setTitlePrefix={setTitlePrefix}
            setTitleSuffix={setTitleSuffix}
            themeItems={themeItems}
            titlePrefix={titlePrefix}
            titleSuffix={titleSuffix}
          />
        ) : null}
      </div>
    </AppShell>
  );
}

function ProfileBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-[#ece7fb] bg-white/80 px-3 py-1.5 text-xs font-black text-[#7c6ee6] shadow-[0_8px_18px_rgba(126,112,174,0.06)]">
      {label}
    </span>
  );
}

function ProfileEditModal({
  bio,
  currentUserTitle,
  equipDecoration,
  equipped,
  handle,
  headerItems,
  name,
  onClose,
  onHeaderImage,
  onIconImage,
  onSave,
  setBio,
  setHandle,
  setName,
  setTitlePrefix,
  setTitleSuffix,
  themeItems,
  titlePrefix,
  titleSuffix,
}: {
  bio: string;
  currentUserTitle: string;
  equipDecoration: (itemId: string, slot: string) => void;
  equipped: Record<string, string>;
  handle: string;
  headerItems: typeof decorationItems;
  name: string;
  onClose: () => void;
  onHeaderImage: (file: File | undefined) => void;
  onIconImage: (file: File | undefined) => void;
  onSave: () => void;
  setBio: (value: string) => void;
  setHandle: (value: string) => void;
  setName: (value: string) => void;
  setTitlePrefix: (value: string) => void;
  setTitleSuffix: (value: string) => void;
  themeItems: typeof decorationItems;
  titlePrefix: string;
  titleSuffix: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#2f2b3b]/30 px-3 py-6 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#ece7fb] bg-white p-5 shadow-[0_24px_60px_rgba(47,43,59,0.22)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#8b7cf6]">
              {"\u7de8\u96c6"}
            </p>
            <h2 className="text-2xl font-black">
              {"\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u7de8\u96c6"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-[#fbfaff] px-3 py-1 text-xs font-black text-[#9b94aa]"
          >
            {"\u9589\u3058\u308b"}
          </button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="rounded-3xl bg-[#fbfaff] p-4 text-sm font-black text-[#7c6ee6]">
              {"\u30a2\u30a4\u30b3\u30f3\u3092\u5909\u66f4"}
              <input
                type="file"
                accept="image/*"
                className="mt-3 block w-full text-xs text-[#746d82]"
                onChange={(event) => onIconImage(event.target.files?.[0])}
              />
            </label>
            <label className="rounded-3xl bg-[#fbfaff] p-4 text-sm font-black text-[#7c6ee6]">
              {"\u30d8\u30c3\u30c0\u30fc\u3092\u5909\u66f4"}
              <input
                type="file"
                accept="image/*"
                className="mt-3 block w-full text-xs text-[#746d82]"
                onChange={(event) => onHeaderImage(event.target.files?.[0])}
              />
            </label>
          </div>

          <label className="grid gap-1.5 text-sm font-black text-[#746d82]">
            {"\u540d\u524d"}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-[#ece7fb] px-4 py-2 text-sm outline-none focus:border-[#9b8be8]"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-black text-[#746d82]">
            {"\u30cf\u30f3\u30c9\u30eb"}
            <input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              className="rounded-2xl border border-[#ece7fb] px-4 py-2 text-sm outline-none focus:border-[#9b8be8]"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-black text-[#746d82]">
            {"\u81ea\u5df1\u7d39\u4ecb"}
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="min-h-24 rounded-2xl border border-[#ece7fb] px-4 py-2 text-sm outline-none focus:border-[#9b8be8]"
            />
          </label>

          <div className="rounded-3xl bg-[#fbfaff] p-4">
            <p className="text-xs font-black text-[#8b7cf6]">
              {"\u4e8c\u3064\u540d"}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                value={titlePrefix}
                onChange={(event) => setTitlePrefix(event.target.value)}
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
                onChange={(event) => setTitleSuffix(event.target.value)}
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
            <p className="mt-1 text-center text-[11px] font-bold text-[#9b94aa]">
              {"\u73fe\u5728: "}
              {currentUserTitle}
            </p>
          </div>

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
        </div>

        <button
          onClick={onSave}
          className="mt-5 w-full rounded-full bg-[#8b7cf6] px-5 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(139,124,246,0.22)]"
        >
          {"\u4fdd\u5b58"}
        </button>
      </section>
    </div>
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
    <section className="rounded-3xl bg-[#fbfaff] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30ab\u30b9\u30bf\u30e0"}
          </p>
          <h3 className="text-base font-black">{title}</h3>
        </div>
        <Link
          href="/shop"
          className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
        >
          {"\u30b7\u30e7\u30c3\u30d7"}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-white p-3 text-xs font-bold text-[#9b94aa]">
          {emptyText}
        </p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            const active = equipped[item.slot] === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onEquip(item.id, item.slot)}
                disabled={active}
                className={`flex items-center justify-between gap-3 rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-[#ded7fb] bg-white"
                    : "border-[#ece7fb] bg-white/70 hover:bg-white"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`size-9 shrink-0 rounded-2xl ${item.tone}`} />
                  <span className="truncate text-sm font-black">{item.name}</span>
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
