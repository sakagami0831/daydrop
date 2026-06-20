"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const benefits = [
  "\u5e83\u544a\u306a\u3057",
  "\u30d8\u30c3\u30c0\u30fc\u4fdd\u5b58\u67a0\u8ffd\u52a0",
  "\u65e5\u8a18\u4e0b\u66f8\u304d\u4fdd\u5b58\u6570\u8ffd\u52a0",
  "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u88c5\u98fe\u67a0\u8ffd\u52a0",
];

const plans = [
  { name: "\u6708\u984d\u30d7\u30e9\u30f3", price: "480\u5186" },
  { name: "\u5e74\u984d\u30d7\u30e9\u30f3", price: "4800\u5186" },
];

export default function PremiumPage() {
  return (
    <AppShell>
      <div className="mx-auto grid max-w-4xl gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30d7\u30ec\u30df\u30a2\u30e0"}
          </p>
          <h1 className="mt-1 text-2xl font-black">
            {"DayDrop\u3092\u3082\u3063\u3068\u80b2\u3066\u308b\u6e96\u5099\u4e2d\u30d7\u30e9\u30f3"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#746d82]">
            {"\u5b9f\u6c7a\u6e08\u306f\u307e\u3060\u5165\u308c\u305a\u3001\u5c06\u6765\u306e\u6708\u984d\u30d7\u30e9\u30f3\u3067\u63d0\u4f9b\u3057\u305f\u3044\u4fa1\u5024\u3092\u5148\u306b\u898b\u305b\u3066\u3044\u307e\u3059\u3002"}
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_10px_24px_rgba(126,112,174,0.07)]"
            >
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u6e96\u5099\u4e2d"}
              </p>
              <h2 className="mt-1 text-xl font-black">{plan.name}</h2>
              <p className="mt-2 text-3xl font-black text-[#7c6ee6]">
                {plan.price}
              </p>
              <button
                onClick={() => alert("\u6708\u984d\u30d7\u30e9\u30f3\u306f\u6e96\u5099\u4e2d\u3067\u3059\u3002")}
                className="mt-4 w-full rounded-full bg-[#8b7cf6] px-4 py-2 text-sm font-black text-white"
              >
                {"\u30d7\u30e9\u30f3\u6e96\u5099\u4e2d"}
              </button>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_24px_rgba(126,112,174,0.07)]">
          <h2 className="text-xl font-black">{"\u4e88\u5b9a\u3057\u3066\u3044\u308b\u7279\u5178"}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <p
                key={benefit}
                className="rounded-2xl bg-[#fbfaff] px-3 py-2 text-sm font-black text-[#746d82]"
              >
                {benefit}
              </p>
            ))}
          </div>
        </section>

        <Link
          href="/shop"
          className="mx-auto rounded-full bg-white px-5 py-2 text-sm font-black text-[#7c6ee6] shadow-sm ring-1 ring-[#ece7fb]"
        >
          {"\u30b7\u30e7\u30c3\u30d7\u306b\u623b\u308b"}
        </Link>
      </div>
    </AppShell>
  );
}
