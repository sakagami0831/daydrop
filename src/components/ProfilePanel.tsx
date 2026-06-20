"use client";

import Link from "next/link";
import { useState } from "react";
import { useDayDrop } from "@/lib/store";

export function ProfilePanel() {
  const {
    currentUser,
    users,
    purchasedShopItemIds,
    equippedShopItemIds,
    updateProfile,
    toggleFollow,
    getDiaryCount,
  } = useDayDrop();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? "");
  const [handle, setHandle] = useState(currentUser?.handle ?? "");
  const [title, setTitle] = useState(currentUser?.title ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [notice, setNotice] = useState("");

  if (!currentUser) {
    return null;
  }

  const otherUsers = users.filter((user) => user.id !== currentUser.id);
  const purchased = purchasedShopItemIds[currentUser.id] ?? [];
  const equipped = equippedShopItemIds[currentUser.id] ?? {};
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
      : activeDecorations.includes("theme-fanletter")
        ? "bg-[linear-gradient(135deg,#fff8ee,#ffffff_50%,#fff1f6)]"
      : activeDecorations.includes("bg-oshi-color")
        ? "bg-[linear-gradient(135deg,#f2efff,#eef7ff_45%,#fff7fb)]"
      : activeDecorations.includes("theme-sakura")
        ? "bg-[linear-gradient(135deg,#fff1f6,#fff8fb_55%,#f2efff)]"
        : activeDecorations.includes("theme-cloud")
          ? "bg-[linear-gradient(135deg,#eef7ff,#fbfaff_55%,#ffffff)]"
          : activeDecorations.includes("theme-notebook")
            ? "bg-[linear-gradient(135deg,#fff9ed,#ffffff_55%,#f2efff)]"
            : "bg-[linear-gradient(135deg,#f0edff,#fff3f8_55%,#eef7ff)]";

  const save = () => {
    updateProfile({
      name: name.trim() || currentUser.name,
      handle: handle.trim() || currentUser.handle,
      title: title.trim() || "\u65e5\u8a18\u3092\u66f8\u304f\u4eba",
      bio: bio.trim(),
    });
    setEditing(false);
  };

  const showPreparing = () => {
    setNotice("\u3053\u306e\u6a5f\u80fd\u306f\u6e96\u5099\u4e2d\u3067\u3059\u3002");
  };

  return (
    <div className="grid gap-3">
      <section className="overflow-hidden rounded-2xl border border-[#ece7fb] bg-white shadow-[0_10px_28px_rgba(126,112,174,0.10)]">
        <div className={`h-14 ${headerClass}`} />
        <div className="-mt-7 px-4 pb-4">
          <div className="flex items-end justify-between gap-2">
            <div className="grid size-14 place-items-center rounded-full border-4 border-white bg-[#f4efff] text-xl font-black text-[#8b7cf6] shadow-sm">
              {currentUser.avatar}
            </div>
            <button
              onClick={() => setEditing((value) => !value)}
              className="rounded-full border border-[#e8e1fb] bg-white px-2.5 py-1.5 text-[11px] font-black text-[#8b7cf6]"
            >
              {"\u7de8\u96c6"}
            </button>
          </div>

          {editing ? (
            <div className="mt-3 grid gap-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl border border-[#ece7fb] px-3 py-1.5 text-sm outline-none focus:border-[#9b8be8]"
                aria-label={"\u540d\u524d"}
              />
              <input
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                className="rounded-xl border border-[#ece7fb] px-3 py-1.5 text-sm outline-none focus:border-[#9b8be8]"
                aria-label={"\u30cf\u30f3\u30c9\u30eb"}
              />
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-xl border border-[#ece7fb] px-3 py-1.5 text-sm outline-none focus:border-[#9b8be8]"
                aria-label={"\u4e8c\u3064\u540d"}
                placeholder={"\u4e8c\u3064\u540d"}
              />
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="min-h-16 rounded-xl border border-[#ece7fb] px-3 py-1.5 text-sm outline-none focus:border-[#9b8be8]"
                aria-label={"\u81ea\u5df1\u7d39\u4ecb"}
              />
              <button
                onClick={save}
                className="rounded-full bg-[#8b7cf6] px-4 py-2 text-sm font-black text-white"
              >
                {"\u4fdd\u5b58"}
              </button>
            </div>
          ) : (
            <>
              <h2 className="mt-2 truncate text-xl font-black">{currentUser.name}</h2>
              <p className="truncate text-xs font-bold text-[#8b7cf6]">
                {`\u300c${currentUser.title}\u300d`}
              </p>
              <p className="mt-1 inline-flex rounded-full bg-[#f0edff] px-2.5 py-1 text-[11px] font-black text-[#7c6ee6]">
                {"\u521d\u671f\u958b\u62d3\u8005"}
              </p>
              <p className="mt-2 line-clamp-2 rounded-xl bg-[#fff7fa] p-3 text-xs leading-5 text-[#746d82]">
                {currentUser.bio}
              </p>
              <div className="mt-3 grid grid-cols-3 divide-x divide-[#ece7fb] text-center">
                <ProfileStat label={"\u65e5\u8a18"} value={getDiaryCount(currentUser.id)} />
                <ProfileStat label={"\u30d5\u30a9\u30ed\u30ef\u30fc"} value={currentUser.followers.length} />
                <ProfileStat label={"\u30d5\u30a9\u30ed\u30fc\u4e2d"} value={currentUser.following.length} />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#ece7fb] bg-white p-3 shadow-[0_10px_28px_rgba(126,112,174,0.08)]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-black">{"\u3042\u306a\u305f\u306e\u79f0\u53f7"}</h3>
          <button onClick={showPreparing} className="text-[11px] font-bold text-[#8b7cf6]">
            {"\u4e00\u89a7"}
          </button>
        </div>
        <div className="flex justify-between text-sm font-black text-[#8b7cf6]">
          <span>Starter</span>
          <span>Reader</span>
          <span>Writer</span>
        </div>
      </section>

      <section className="rounded-2xl border border-[#ece7fb] bg-white p-3 shadow-[0_10px_28px_rgba(126,112,174,0.08)]">
        <h3 className="text-sm font-black">{"\u4eca\u65e5\u306e\u3072\u3068\u3053\u3068"}</h3>
        <p className="mt-1 text-xs leading-5 text-[#746d82]">
          {"\u5c0f\u3055\u306a\u4e00\u6b69\u3067\u3082\u3001\u3061\u3083\u3093\u3068\u9032\u3093\u3067\u308b\u3088\u3002"}
        </p>
      </section>

      <section className="rounded-2xl border border-[#f5dce8] bg-[linear-gradient(135deg,#fff7fb,#f2efff)] p-3 shadow-[0_10px_28px_rgba(126,112,174,0.08)]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black">{"\u9650\u5b9a\u30d8\u30c3\u30c0\u30fc"}</h3>
            <p className="mt-1 text-xs leading-5 text-[#746d82]">
              {purchased.length > 0
                ? "\u8cfc\u5165\u6e08\u307f\u306e\u88c5\u98fe\u3092\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u306b\u7c21\u6613\u53cd\u6620\u4e2d\u3067\u3059\u3002"
                : "\u30b7\u30e7\u30c3\u30d7\u3067\u30d8\u30c3\u30c0\u30fc\u3084\u30c6\u30fc\u30de\u3092\u96c6\u3081\u3089\u308c\u307e\u3059\u3002"}
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 rounded-full bg-[#8b7cf6] px-3 py-1.5 text-[11px] font-black text-white"
          >
            {"\u30b7\u30e7\u30c3\u30d7"}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-[#ece7fb] bg-white p-3 shadow-[0_10px_28px_rgba(126,112,174,0.08)]">
        <h3 className="text-sm font-black">{"\u5c4a\u3051\u308b\u76f8\u624b"}</h3>
        <div className="mt-2 grid gap-1.5">
          {otherUsers.map((user) => {
            const following = currentUser.following.includes(user.id);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#fbfaff] p-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f0edff] text-xs font-black text-[#8b7cf6]">
                    {user.avatar}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black">{user.name}</p>
                    <p className="truncate text-[11px] text-[#9b94aa]">
                      {user.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${
                    following
                      ? "border border-[#e8e1fb] bg-white text-[#746d82]"
                      : "bg-[#8b7cf6] text-white"
                  }`}
                >
                  {following ? "\u89e3\u9664" : "\u30d5\u30a9\u30ed\u30fc"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {notice ? (
        <p className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-[#7c6ee6] shadow-sm">
          {notice}
        </p>
      ) : null}
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-1">
      <b className="block text-base">{value}</b>
      <span className="block text-[11px] font-bold text-[#9b94aa]">{label}</span>
    </div>
  );
}
