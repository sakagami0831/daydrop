"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useDayDrop } from "@/lib/store";

const coinPacks = [
  { coins: 100, price: "160\u5186" },
  { coins: 300, price: "480\u5186" },
  { coins: 700, price: "980\u5186" },
  { coins: 1500, price: "1980\u5186" },
];

const coinUses = [
  "\u65e5\u8a18\u6295\u7a3f: 30\u30b3\u30a4\u30f3",
  "\u611f\u60f3: 1\u30b3\u30a4\u30f3",
  "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u88c5\u98fe\u8cfc\u5165",
  "\u30d8\u30c3\u30c0\u30fc\u88c5\u98fe\u8cfc\u5165",
  "\u65e5\u8a18\u30ab\u30fc\u30c9\u88c5\u98fe\u8cfc\u5165",
  "\u304a\u3059\u3059\u3081\u63b2\u8f09\u7533\u8acb: 1000\u30b3\u30a4\u30f3",
];

const shopItems = [
  {
    id: "theme-lavender",
    name: "\u30e9\u30d9\u30f3\u30c0\u30fc\u30c6\u30fc\u30de",
    price: 80,
    kind: "\u30c6\u30fc\u30de",
    slot: "theme",
    tone: "bg-[#f2efff]",
  },
  {
    id: "theme-sakura",
    name: "\u685c\u30c6\u30fc\u30de",
    price: 120,
    kind: "\u30c6\u30fc\u30de",
    slot: "theme",
    tone: "bg-[#fff1f6]",
  },
  {
    id: "theme-cloud",
    name: "\u96f2\u30c6\u30fc\u30de",
    price: 100,
    kind: "\u30c6\u30fc\u30de",
    slot: "theme",
    tone: "bg-[#f2f8ff]",
  },
  {
    id: "theme-notebook",
    name: "\u65e5\u8a18\u5e33\u30c6\u30fc\u30de",
    price: 100,
    kind: "\u30c6\u30fc\u30de",
    slot: "theme",
    tone: "bg-[#fff9ed]",
  },
  {
    id: "header-streamer",
    name: "\u914d\u4fe1\u8005\u5411\u3051\u30d8\u30c3\u30c0\u30fc",
    price: 150,
    kind: "\u30d8\u30c3\u30c0\u30fc",
    slot: "header",
    tone: "bg-[#eef7ff]",
  },
  {
    id: "header-event",
    name: "\u30a4\u30d9\u30f3\u30c8\u544a\u77e5\u30d8\u30c3\u30c0\u30fc",
    price: 200,
    kind: "\u30d8\u30c3\u30c0\u30fc",
    slot: "header",
    tone: "bg-[#f4fff5]",
  },
  {
    id: "header-thanks",
    name: "\u914d\u4fe1\u3042\u308a\u304c\u3068\u3046\u30d8\u30c3\u30c0\u30fc",
    price: 150,
    kind: "\u30d8\u30c3\u30c0\u30fc",
    slot: "header",
    tone: "bg-[#fff7fb]",
  },
  {
    id: "card-announcement",
    name: "\u544a\u77e5\u65e5\u8a18\u30ab\u30fc\u30c9\u67a0",
    price: 200,
    kind: "\u30ab\u30fc\u30c9\u67a0",
    slot: "card",
    tone: "bg-[#f7f3ff]",
  },
  {
    id: "bg-oshi-color",
    name: "\u63a8\u3057\u30ab\u30e9\u30fc\u80cc\u666f",
    price: 120,
    kind: "\u80cc\u666f",
    slot: "background",
    tone: "bg-[#f1f7ff]",
  },
  {
    id: "theme-fanletter",
    name: "\u30d5\u30a1\u30f3\u30ec\u30bf\u30fc\u98a8\u30c6\u30fc\u30de",
    price: 180,
    kind: "\u30c6\u30fc\u30de",
    slot: "theme",
    tone: "bg-[#fff8ee]",
  },
  {
    id: "card-event-eve",
    name: "\u30a4\u30d9\u30f3\u30c8\u524d\u65e5\u544a\u77e5\u67a0",
    price: 300,
    kind: "\u30ab\u30fc\u30c9\u67a0",
    slot: "card",
    tone: "bg-[#f4fff5]",
  },
];

export default function ShopPage() {
  const {
    currentUser,
    purchasedShopItemIds,
    equippedShopItemIds,
    recommendationApplications,
    purchaseShopItem,
    equipShopItem,
    applyRecommendation,
  } = useDayDrop();
  const [message, setMessage] = useState("");

  if (!currentUser) {
    return null;
  }

  const purchased = purchasedShopItemIds[currentUser.id] ?? [];
  const equipped = equippedShopItemIds[currentUser.id] ?? {};
  const today = new Date().toISOString().slice(0, 10);
  const appliedToday =
    recommendationApplications[currentUser.id]?.includes(today) ?? false;

  const buy = (itemId: string, price: number) => {
    const ok = purchaseShopItem(itemId, price);
    setMessage(
      ok
        ? "\u88c5\u98fe\u3092\u53d7\u3051\u53d6\u308a\u307e\u3057\u305f\u3002\u8cfc\u5165\u72b6\u614b\u3092localStorage\u306b\u4fdd\u5b58\u3057\u307e\u3059\u3002"
        : "\u53d7\u3051\u53d6\u308c\u307e\u305b\u3093\u3067\u3057\u305f\u3002\u30b3\u30a4\u30f3\u6b8b\u9ad8\u304b\u8cfc\u5165\u6e08\u307f\u72b6\u614b\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    );
  };

  const apply = () => {
    const ok = applyRecommendation();
    setMessage(
      ok
        ? "\u304a\u3059\u3059\u3081\u63b2\u8f09\u3092\u7533\u8acb\u3057\u307e\u3057\u305f\u3002\u5be9\u67fb\u30d5\u30ed\u30fc\u306f\u4eca\u5f8c\u8ffd\u52a0\u4e88\u5b9a\u3067\u3059\u3002"
        : "\u7533\u8acb\u3067\u304d\u307e\u305b\u3093\u3002\u30b3\u30a4\u30f3\u4e0d\u8db3\u304b\u3001\u672c\u65e5\u306f\u7533\u8acb\u6e08\u307f\u3067\u3059\u3002",
    );
  };

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30b7\u30e7\u30c3\u30d7"}
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black">
                {"\u30b3\u30a4\u30f3\u3067\u88c5\u98fe\u3092\u96c6\u3081\u308b"}
              </h1>
              <p className="mt-1 text-sm leading-6 text-[#746d82]">
                {"\u914d\u4fe1\u8005\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3084\u65e5\u8a18\u3092\u5c11\u3057\u305a\u3064\u80b2\u3066\u308b\u5834\u6240\u3067\u3059\u3002"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
                {"\u6240\u6301\u30b3\u30a4\u30f3"} C {currentUser.coinBalance}
              </span>
              <Link
                href="/premium"
                className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
              >
                {"\u30d7\u30ec\u30df\u30a2\u30e0\u6848\u5185"}
              </Link>
            </div>
          </div>
        </header>

        {message ? (
          <p className="rounded-2xl border border-[#ece7fb] bg-white px-4 py-3 text-sm font-bold text-[#7c6ee6]">
            {message}
          </p>
        ) : null}

        <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_24px_rgba(126,112,174,0.07)]">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u30b3\u30a4\u30f3\u8cfc\u5165"}
              </p>
              <h2 className="text-xl font-black">
                {"\u5fc5\u8981\u306a\u3068\u304d\u306b\u88dc\u5145"}
              </h2>
            </div>
            <span className="rounded-full bg-[#fff8ee] px-3 py-1 text-xs font-black text-[#bd8648]">
              {"\u6c7a\u6e08\u6a5f\u80fd\u306f\u6e96\u5099\u4e2d"}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {coinPacks.map((pack) => (
              <article key={pack.coins} className="rounded-2xl bg-[#fbfaff] p-3">
                <p className="text-lg font-black">{pack.coins} C</p>
                <p className="mt-1 text-xs font-bold text-[#9b94aa]">
                  {pack.price}
                </p>
                <button
                  onClick={() =>
                    setMessage("\u6c7a\u6e08\u6a5f\u80fd\u306f\u6e96\u5099\u4e2d\u3067\u3059\u3002")
                  }
                  className="mt-3 w-full rounded-full bg-[#8b7cf6] px-4 py-2 text-xs font-black text-white"
                >
                  {"\u8cfc\u5165\u6e96\u5099\u4e2d"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_24px_rgba(126,112,174,0.07)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30b3\u30a4\u30f3\u306e\u4f7f\u3044\u9053"}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {coinUses.map((item) => (
              <p
                key={item}
                className="rounded-2xl bg-[#fbfaff] px-3 py-2 text-xs font-black text-[#746d82]"
              >
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_24px_rgba(126,112,174,0.07)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black text-[#8b7cf6]">
                {"\u304a\u3059\u3059\u3081\u63b2\u8f09\u7533\u8acb"}
              </p>
              <h2 className="text-xl font-black">
                {"\u65e5\u8a18\u3092\u898b\u3064\u3051\u3066\u3082\u3089\u3046"}
              </h2>
              <p className="mt-1 text-sm text-[#746d82]">
                {"\u8cfc\u5165\u3067\u306f\u306a\u304f\u3001\u63b2\u8f09\u5be9\u67fb\u3078\u306e\u7533\u8acb\u3067\u3059\u30021000\u30b3\u30a4\u30f3\u3092\u6d88\u8cbb\u3057\u307e\u3059\u3002"}
              </p>
            </div>
            <button
              onClick={apply}
              disabled={currentUser.coinBalance < 1000 || appliedToday}
              className="rounded-full bg-[#8b7cf6] px-5 py-2.5 text-sm font-black text-white disabled:bg-[#d6cff8]"
            >
              {appliedToday
                ? "\u672c\u65e5\u7533\u8acb\u6e08\u307f"
                : currentUser.coinBalance < 1000
                  ? "\u30b3\u30a4\u30f3\u4e0d\u8db3"
                  : "\u7533\u8acb\u3059\u308b"}
            </button>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shopItems.map((item) => {
            const owned = purchased.includes(item.id);
            const equippedItem = equipped[item.slot] === item.id;
            const affordable = currentUser.coinBalance >= item.price;
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-[#ece7fb] bg-white p-3 shadow-[0_10px_24px_rgba(126,112,174,0.07)]"
              >
                <div className={`aspect-[16/9] rounded-2xl ${item.tone}`} />
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-black">{item.name}</h2>
                    <p className="mt-1 text-xs font-bold text-[#9b94aa]">
                      C {item.price}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fbfaff] px-2 py-1 text-[11px] font-black text-[#7c6ee6]">
                    {item.kind}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (owned) {
                      const ok = equipShopItem(item.id, item.slot);
                      setMessage(
                        ok
                          ? "\u88c5\u5099\u3057\u307e\u3057\u305f\u3002\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u306b\u7c21\u6613\u53cd\u6620\u3055\u308c\u307e\u3059\u3002"
                          : "\u88c5\u5099\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
                      );
                    } else {
                      buy(item.id, item.price);
                    }
                  }}
                  disabled={equippedItem || (!owned && !affordable)}
                  className="mt-3 w-full rounded-full bg-[#8b7cf6] px-4 py-2 text-sm font-black text-white disabled:bg-[#d6cff8]"
                >
                  {equippedItem
                    ? "\u88c5\u5099\u4e2d"
                    : owned
                      ? "\u88c5\u5099\u3059\u308b"
                      : affordable
                        ? "\u53d7\u3051\u53d6\u308b"
                        : "\u30b3\u30a4\u30f3\u4e0d\u8db3"}
                </button>
                {owned ? (
                  <p className="mt-2 text-center text-[11px] font-black text-[#7c6ee6]">
                    {"\u8cfc\u5165\u6e08\u307f"}
                  </p>
                ) : null}
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
