"use client";

import Link from "next/link";
import type { Notification } from "@/lib/daydrop";
import { useDayDrop } from "@/lib/store";

const notificationLabel: Record<Notification["type"], string> = {
  diary_delivered: "\u65e5\u8a18\u304c\u5c4a\u304d\u307e\u3057\u305f",
  followed: "\u30d5\u30a9\u30ed\u30fc\u3055\u308c\u307e\u3057\u305f",
  impression_received: "\u611f\u60f3\u304c\u5c4a\u304d\u307e\u3057\u305f",
};

export function NotificationsPanel({ compact = false }: { compact?: boolean }) {
  const { currentUser, notifications, markNotificationRead } = useDayDrop();

  if (!currentUser) {
    return null;
  }

  const myNotifications = notifications
    .filter((notification) => notification.userId === currentUser.id)
    .slice(0, compact ? 3 : undefined);
  const unreadCount = myNotifications.filter((notification) => !notification.read)
    .length;

  return (
    <section className="rounded-2xl border border-[#ece7fb] bg-white p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-black">{"\u304a\u77e5\u3089\u305b"}</h2>
        <span className="rounded-full bg-[#f0edff] px-2.5 py-1 text-xs font-black text-[#7c6ee6]">
          {"\u672a\u8aad"} {unreadCount}
        </span>
      </div>
      <div className="grid gap-2">
        {myNotifications.length === 0 ? (
          <p className="text-sm text-[#9b94aa]">
            {"\u65b0\u3057\u3044\u304a\u77e5\u3089\u305b\u306f\u3042\u308a\u307e\u305b\u3093\u3002"}
          </p>
        ) : (
          myNotifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.diaryId ? `/diary/${notification.diaryId}` : "/mypage"}
              onClick={() => markNotificationRead(notification.id)}
              className="block rounded-2xl bg-[#fbfaff] px-3 py-2.5 text-sm leading-6"
            >
              <span className="mb-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-[#7c6ee6]">
                {notificationLabel[notification.type]}
              </span>
              <span
                className={`block ${
                  notification.read ? "text-[#9b94aa]" : "font-bold text-[#363142]"
                }`}
              >
                {notification.message}
              </span>
              <span className="mt-1 block text-[11px] text-[#9b94aa]">
                {new Date(notification.createdAt).toLocaleString("ja-JP")}
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
