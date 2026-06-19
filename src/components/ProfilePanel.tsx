"use client";

import { useState } from "react";
import { useDayDrop } from "@/lib/store";

export function ProfilePanel() {
  const { currentUser, updateProfile } = useDayDrop();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? "");
  const [handle, setHandle] = useState(currentUser?.handle ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");

  if (!currentUser) {
    return null;
  }

  const save = () => {
    updateProfile({ name, handle, bio });
    setEditing(false);
  };

  return (
    <section className="rounded-[1.75rem] border border-[#f2e4d6] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-[#ffdfe8] text-2xl font-black text-[#9b4c64]">
          {currentUser.avatar}
        </div>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="grid gap-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-2xl border border-[#f2e4d6] px-3 py-2 font-bold outline-none focus:border-[#d1708e]"
                aria-label="名前"
              />
              <input
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                className="rounded-2xl border border-[#f2e4d6] px-3 py-2 text-sm outline-none focus:border-[#d1708e]"
                aria-label="ハンドル"
              />
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="min-h-20 rounded-2xl border border-[#f2e4d6] px-3 py-2 text-sm outline-none focus:border-[#d1708e]"
                aria-label="自己紹介"
              />
              <button
                onClick={save}
                className="rounded-full bg-[#d1708e] px-4 py-2 text-sm font-bold text-white"
              >
                保存
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black">
                    {currentUser.name}
                  </h2>
                  <p className="text-sm text-[#9f8574]">@{currentUser.handle}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="shrink-0 rounded-full border border-[#f2e4d6] px-3 py-1.5 text-xs font-bold text-[#9b4c64]"
                >
                  編集
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#6f5e52]">
                {currentUser.bio}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-2xl bg-[#fffaf2] p-3">
                  <b>{currentUser.followers.length}</b>
                  <span className="block text-xs text-[#9f8574]">
                    フォロワー
                  </span>
                </div>
                <div className="rounded-2xl bg-[#fffaf2] p-3">
                  <b>{currentUser.following.length}</b>
                  <span className="block text-xs text-[#9f8574]">
                    フォロー
                  </span>
                </div>
                <div className="rounded-2xl bg-[#fffaf2] p-3">
                  <b>{currentUser.coinBalance}</b>
                  <span className="block text-xs text-[#9f8574]">コイン</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

