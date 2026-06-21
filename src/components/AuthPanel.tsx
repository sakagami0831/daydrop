"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { useDayDrop } from "@/lib/store";

export function AuthPanel() {
  const router = useRouter();
  const { emailLogin, users, login } = useDayDrop();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = emailLogin(email);
    if (!user) {
      setError("\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002");
      return;
    }
    setError("");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fffdf9,#f4f0ff_55%,#fff7fb)] px-4 py-8 text-[#363142]">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl border border-[#ece7fb] bg-white/80 p-7 shadow-[0_18px_42px_rgba(126,112,174,0.12)]">
          <p className="text-xs font-black tracking-[0.24em] text-[#9b8be8]">
            DayDrop
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            {"\u65e5\u8a18\u304c\u5c4a\u304f\u3001"}
            <br />
            {"\u3084\u3055\u3057\u3044SNS"}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#746d82]">
            {"\u4eca\u65e5\u306e\u914d\u4fe1\u30ec\u30dd\u30fc\u30c8\u3084\u611f\u8b1d\u3092\u65e5\u8a18\u306b\u3057\u3066\u5c4a\u3051\u308bMVP\u3067\u3059\u3002\u672c\u756a\u8a8d\u8a3c\u306f\u307e\u3060\u306a\u304f\u3001\u30e1\u30fc\u30eb\u5165\u529b\u3060\u3051\u3067\u4f7f\u3048\u307e\u3059\u3002"}
          </p>
        </div>

        <div className="rounded-3xl border border-[#ece7fb] bg-white p-6 shadow-[0_18px_42px_rgba(126,112,174,0.12)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30ed\u30b0\u30a4\u30f3"}
          </p>
          <h2 className="mt-1 text-2xl font-black">
            {"\u30e1\u30fc\u30eb\u3067\u306f\u3058\u3081\u308b"}
          </h2>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <label className="grid gap-1.5 text-sm font-bold text-[#746d82]">
              {"\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9"}
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                className="rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-4 py-3 text-base outline-none focus:border-[#9b8be8]"
              />
            </label>
            {error ? (
              <p className="rounded-2xl bg-[#fff7fb] px-3 py-2 text-xs font-bold text-[#b15b77]">
                {error}
              </p>
            ) : null}
            <button className="rounded-full bg-[#8b7cf6] px-5 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(139,124,246,0.24)]">
              {"\u30ed\u30b0\u30a4\u30f3"}
            </button>
          </form>

          <div className="mt-5 border-t border-[#f0eafb] pt-4">
            <p className="text-xs font-black text-[#9b94aa]">
              {"\u30b5\u30f3\u30d7\u30eb\u30e6\u30fc\u30b6\u30fc\u3067\u8a66\u3059"}
            </p>
            <div className="mt-2 grid gap-2">
              {users.slice(0, 3).map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    login(user.id);
                    router.push("/");
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-[#fbfaff] p-2 text-left transition hover:bg-[#f2efff]"
                >
                  <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[#f0edff] text-xs font-black text-[#8b7cf6]">
                    {user.avatarImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarImageUrl} alt="" className="size-full object-cover" />
                    ) : (
                      user.avatar
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs text-[#9b94aa]">
                      @{user.handle}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
