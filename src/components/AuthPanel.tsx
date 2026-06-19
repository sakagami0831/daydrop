"use client";

import { useDayDrop } from "@/lib/store";

export function AuthPanel() {
  const { users, login } = useDayDrop();

  return (
    <main className="min-h-screen bg-[#fffdf9] px-4 py-8 text-[#3d332b]">
      <section className="mx-auto flex max-w-md flex-col gap-6">
        <div className="rounded-[2rem] border border-[#f2e4d6] bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-[#d1708e]">
            日記が届くSNS
          </p>
          <h1 className="text-4xl font-black tracking-tight">DayDrop</h1>
          <p className="mt-3 text-sm leading-7 text-[#7d6a5c]">
            タイムラインを流し見るのではなく、書いた日記を届けたい相手に届けて、感想を受け取るためのMVPです。
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#f2e4d6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">ログイン</h2>
          <p className="mt-1 text-sm text-[#9f8574]">
            MVP用のユーザーを選んで入ります。
          </p>
          <div className="mt-4 grid gap-3">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => login(user.id)}
                className="flex items-center gap-3 rounded-3xl border border-[#f2e4d6] bg-[#fffaf2] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#efc7d4] hover:bg-[#fff4f7]"
              >
                <span className="grid size-11 place-items-center rounded-full bg-[#ffdfe8] font-bold text-[#9b4c64]">
                  {user.avatar}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{user.name}</span>
                  <span className="block truncate text-sm text-[#9f8574]">
                    @{user.handle}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

