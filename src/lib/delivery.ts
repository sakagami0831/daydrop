import type { Diary, User } from "./daydrop";
import { visibilityLabels } from "./daydrop";

export function getDeliveryLabel(diary: Diary, users: User[]) {
  if (diary.visibility !== "specified") {
    return visibilityLabels[diary.visibility];
  }

  const names = diary.recipientIds
    .map((id) => users.find((user) => user.id === id)?.name)
    .filter(Boolean);

  if (names.length === 0) {
    return "\u6307\u5b9a\u30e6\u30fc\u30b6\u30fc\u3078\u9001\u4fe1";
  }

  return `${names.map((name) => `${name}\u3055\u3093`).join("\u3001")}\u3078\u9001\u4fe1`;
}

export function getDeliveredDiariesForUser(diaries: Diary[], userId: string) {
  return diaries.filter((diary) => {
    if (diary.authorId === userId) {
      return false;
    }

    return diary.recipientIds.includes(userId);
  });
}
