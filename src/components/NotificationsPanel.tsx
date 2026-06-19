"use client";

import Link from "next/link";
import { useDayDrop } from "@/lib/store";

export function NotificationsPanel({ compact = false }: { compact?: boolean }) {
  const { currentUser, notifications, markNotificationRead } = useDayDrop();

  if (!currentUser) {
    return null;
  }

  const myNotifications = notifications
    .filter((notification) => notification.userId === currentUser.id)
    .slice(0, compact ? 1 : 5);
  const unreadCount = myNotifications.filter((notification) => !notification.read)
    .length;

  return (
    <section className="rounded-[1.5rem] border border-[#f2e4d6] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-black">通知</h2>
        <span className="rounded-full bg-[#fff1c6] px-2 py-1 text-xs font-bold text-[#9b6b20]">
          未読 {unreadCount}
        </span>
      </div>
      <div className="grid gap-2">
        {myNotifications.length === 0 ? (
          <p className="text-sm text-[#9f8574]">新しい通知はありません。</p>
        ) : (
          myNotifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.diaryId ? `/diary/${notification.diaryId}` : "/"}
              onClick={() => markNotificationRead(notification.id)}
              className="block rounded-2xl bg-[#fffaf2] px-3 py-2 text-sm leading-6"
            >
              <span className={notification.read ? "text-[#9f8574]" : "font-bold"}>
                {notification.message}
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

