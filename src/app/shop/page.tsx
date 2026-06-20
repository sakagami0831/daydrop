"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useDayDrop } from "@/lib/store";

const shopItems = [
  {
    id: "theme-lavender",
    name: "\u30e9\u30d9\u30f3\u30c0\u30fc\u30c6\u30fc\u30de",
    price: 80,
    kind: "\u30c6\u30fc\u30de",
    tone: "bg-[#f2efff]",
  },
  {
    id: "theme-sakura",
    name: "\u685c\u30c6\u30fc\u30de",
    price: 120,
    kind: "\u30c6\u30fc\u30de",
    tone: "bg-[#fff1f6]",
  },
  {
    id: "theme-cloud",
    name: "\u96f2\u30c6\u30fc\u30de",
    price: 100,
    kind: "\u30c6\u30fc\u30de",
    tone: "bg-[#f2f8ff]",
  },
  {
    id: "theme-notebook",
    name: "\u65e5\u8a18\u5e33\u30c6\u30fc\u30de",
    price: 100,
    kind: "\u30c6\u30fc\u30de",
    tone: "bg-[#fff9ed]",
  },
  {
    id: "header-streamer",
    name: "\u914d\u4fe1\u8005\u5411\u3051\u30d8\u30c3\u30c0\u30fc",
    price: 150,
    kind: "\u30d8\u30c3\u30c0\u30fc",
    tone: "bg-[#eef7ff]",
  },
  {
    id: "header-event",
    name: "\u30a4\u30d9\u30f3\u30c8\u544a\u77e5\u30d8\u30c3\u30c0\u30fc",
    price: 200,
    kind: "\u30d8\u30c3\u30c0\u30fc",
    tone: "bg-[#f4fff5]",
  },
];

export default function ShopPage() {
  const { currentUser, purchasedShopItemIds, purchaseShopItem } = useDayDrop();
  const [message, setMessage] = useState("");

  if (!currentUser) {
    return null;
  }

  const purchased = purchasedShopItemIds[currentUser.id] ?? [];

  const buy = (itemId: string, price: number) => {
    const ok = purchaseShopItem(itemId, price);
    setMessage(
      ok
        ? "\u88c5\u98fe\u3092\u53d7\u3051\u53d6\u308a\u307e\u3057\u305f\u3002\u8cfc\u5165\u72b6\u614b\u3092localStorage\u306b\u4fdd\u5b58\u3057\u307e\u3059\u3002"
        : "\u53d7\u3051\u53d6\u308c\u307e\u305b\u3093\u3067\u3057\u305f\u3002\u30b3\u30a4\u30f3\u6b8b\u9ad8\u304b\u8cfc\u5165\u6e08\u307f\u72b6\u614b\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    );
  };

  return (
    <AppShell>
      <div className="mx-auto grid max-w-5xl gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-3 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u30b7\u30e7\u30c3\u30d7"}
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black">
                {"\u30b3\u30a4\u30f3\u3067\u88c5\u98fe\u3092\u53d7\u3051\u53d6\u308b"}
              </h1>
              <p className="mt-1 text-sm leading-6 text-[#746d82]">
                {"MVP\u6bb5\u968e\u3067\u306f\u6240\u6301\u30b3\u30a4\u30f3\u3060\u3051\u3067\u88c5\u98fe\u3092\u96c6\u3081\u3089\u308c\u307e\u3059\u3002"}
              </p>
            </div>
            <span className="rounded-full bg-[#f2efff] px-3 py-1 text-xs font-black text-[#7c6ee6]">
              {"\u6240\u6301\u30b3\u30a4\u30f3"} C {currentUser.coinBalance}
            </span>
          </div>
        </header>

        {message ? (
          <p className="rounded-2xl border border-[#ece7fb] bg-white px-4 py-3 text-sm font-bold text-[#7c6ee6]">
            {message}
          </p>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shopItems.map((item) => {
            const owned = purchased.includes(item.id);
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
                  onClick={() => buy(item.id, item.price)}
                  disabled={owned || !affordable}
                  className="mt-3 w-full rounded-full bg-[#8b7cf6] px-4 py-2 text-sm font-black text-white disabled:bg-[#d6cff8]"
                >
                  {owned
                    ? "\u8cfc\u5165\u6e08\u307f"
                    : affordable
                      ? "\u53d7\u3051\u53d6\u308b"
                      : "\u30b3\u30a4\u30f3\u4e0d\u8db3"}
                </button>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
