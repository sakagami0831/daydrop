"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  CoinTransaction,
  Diary,
  Impression,
  Notification,
  User,
  Visibility,
} from "./daydrop";
import {
  seedCoinTransactions,
  seedDiaries,
  seedNotifications,
  seedUsers,
} from "./seed";

type DraftDiary = {
  title: string;
  body: string;
  imageUrl?: string;
  visibility: Visibility;
  recipientIds: string[];
  tags?: string[];
};

type ProfileInput = Pick<User, "name" | "handle" | "title" | "bio">;

type DayDropState = {
  users: User[];
  diaries: Diary[];
  notifications: Notification[];
  coinTransactions: CoinTransaction[];
  currentUser: User | null;
};

type DayDropContextValue = DayDropState & {
  login: (userId: string) => void;
  updateProfile: (input: ProfileInput) => void;
  createDiary: (draft: DraftDiary) => Diary | null;
  addImpression: (diaryId: string, body: string) => boolean;
  toggleLike: (diaryId: string) => void;
  toggleFollow: (targetUserId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  getUser: (userId: string) => User | undefined;
  getVisibleDiaries: () => Diary[];
  getDiaryCount: (userId: string) => number;
  searchDiaries: (query: string, tag?: string) => Diary[];
  searchUsers: (query: string) => User[];
};

const storageKey = "daydrop-mvp-audit-state";
const DayDropContext = createContext<DayDropContextValue | null>(null);

const initialState: DayDropState = {
  users: seedUsers,
  diaries: seedDiaries,
  notifications: seedNotifications,
  coinTransactions: seedCoinTransactions,
  currentUser: seedUsers[0],
};

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeState = (state: DayDropState): DayDropState => ({
  ...state,
  diaries: state.diaries.map((diary) => ({
    ...diary,
    tags: diary.tags ?? [],
  })),
  notifications: state.notifications.map((notification) => ({
    ...notification,
    type: notification.type ?? "diary_delivered",
  })),
});

const loadInitialState = () => {
  if (typeof window === "undefined") {
    return initialState;
  }

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return initialState;
  }

  try {
    return normalizeState(JSON.parse(saved) as DayDropState);
  } catch {
    window.localStorage.removeItem(storageKey);
    return initialState;
  }
};

export function DayDropProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DayDropState>(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const getUser = useCallback(
    (userId: string) => state.users.find((user) => user.id === userId),
    [state.users],
  );

  const getDiaryCount = useCallback(
    (userId: string) =>
      state.diaries.filter((diary) => diary.authorId === userId).length,
    [state.diaries],
  );

  const login = useCallback((userId: string) => {
    setState((current) => ({
      ...current,
      currentUser: current.users.find((user) => user.id === userId) ?? null,
    }));
  }, []);

  const updateProfile = useCallback((input: ProfileInput) => {
    setState((current) => {
      if (!current.currentUser) {
        return current;
      }

      const users = current.users.map((user) =>
        user.id === current.currentUser?.id ? { ...user, ...input } : user,
      );

      return {
        ...current,
        users,
        currentUser:
          users.find((user) => user.id === current.currentUser?.id) ?? null,
      };
    });
  }, []);

  const toggleFollow = useCallback((targetUserId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer || viewer.id === targetUserId) {
        return current;
      }

      const target = current.users.find((user) => user.id === targetUserId);
      if (!target) {
        return current;
      }

      const alreadyFollowing = viewer.following.includes(targetUserId);
      const users = current.users.map((user) => {
        if (user.id === viewer.id) {
          return {
            ...user,
            following: alreadyFollowing
              ? user.following.filter((id) => id !== targetUserId)
              : [...user.following, targetUserId],
          };
        }

        if (user.id === targetUserId) {
          return {
            ...user,
            followers: alreadyFollowing
              ? user.followers.filter((id) => id !== viewer.id)
              : [...user.followers, viewer.id],
          };
        }

        return user;
      });

      const notifications =
        alreadyFollowing
          ? current.notifications
          : [
              {
                id: makeId("n"),
                userId: targetUserId,
                type: "followed" as const,
                message: `${viewer.name}\u3055\u3093\u304c\u3042\u306a\u305f\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f`,
                createdAt: new Date().toISOString(),
                read: false,
                actorId: viewer.id,
              },
              ...current.notifications,
            ];

      return {
        ...current,
        users,
        notifications,
        currentUser: users.find((user) => user.id === viewer.id) ?? null,
      };
    });
  }, []);

  const createDiary = useCallback((draft: DraftDiary) => {
    let createdDiary: Diary | null = null;

    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer || viewer.coinBalance < 30) {
        return current;
      }

      const deliveryTargets =
        draft.visibility === "public"
          ? []
          : draft.visibility === "followers"
            ? viewer.followers
            : draft.recipientIds;

      const diary: Diary = {
        id: makeId("d"),
        authorId: viewer.id,
        title: draft.title,
        body: draft.body,
        imageUrl: draft.imageUrl,
        visibility: draft.visibility,
        recipientIds: deliveryTargets,
        tags: draft.tags ?? [],
        createdAt: new Date().toISOString(),
        likedBy: [],
        impressions: [],
      };

      createdDiary = diary;

      const deliveryNotifications: Notification[] = deliveryTargets.map(
        (userId) => ({
          id: makeId("n"),
          userId,
          type: "diary_delivered",
                message: `${viewer.name}\u3055\u3093\u304b\u3089\u4eca\u65e5\u306e\u65e5\u8a18\u304c\u5c4a\u304d\u307e\u3057\u305f`,
          createdAt: diary.createdAt,
          read: false,
          diaryId: diary.id,
          actorId: viewer.id,
        }),
      );

      const users = current.users.map((user) =>
        user.id === viewer.id
          ? { ...user, coinBalance: user.coinBalance - 30 }
          : user,
      );

      return {
        ...current,
        users,
        currentUser: users.find((user) => user.id === viewer.id) ?? null,
        diaries: [diary, ...current.diaries],
        notifications: [...deliveryNotifications, ...current.notifications],
        coinTransactions: [
          ...current.coinTransactions,
          {
            id: makeId("c"),
            userId: viewer.id,
            amount: -30,
            reason: "diary_post",
            createdAt: diary.createdAt,
            relatedDiaryId: diary.id,
          },
        ],
      };
    });

    return createdDiary;
  }, []);

  const addImpression = useCallback((diaryId: string, body: string) => {
    let created = false;

    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer || viewer.coinBalance < 1) {
        return current;
      }

      const diary = current.diaries.find((item) => item.id === diaryId);
      if (!diary) {
        return current;
      }

      created = true;
      const createdAt = new Date().toISOString();
      const impression: Impression = {
        id: makeId("i"),
        diaryId,
        authorId: viewer.id,
        body,
        createdAt,
      };

      const diaries = current.diaries.map((item) =>
        item.id === diaryId
          ? { ...item, impressions: [...item.impressions, impression] }
          : item,
      );

      const notifications =
        diary.authorId === viewer.id
          ? current.notifications
          : [
              {
                id: makeId("n"),
                userId: diary.authorId,
                type: "impression_received" as const,
                message: `${viewer.name}\u3055\u3093\u304c\u3042\u306a\u305f\u306e\u65e5\u8a18\u306b\u611f\u60f3\u3092\u5c4a\u3051\u307e\u3057\u305f`,
                createdAt,
                read: false,
                diaryId,
                actorId: viewer.id,
              },
              ...current.notifications,
            ];

      const users = current.users.map((user) =>
        user.id === viewer.id
          ? { ...user, coinBalance: user.coinBalance - 1 }
          : user,
      );

      return {
        ...current,
        users,
        currentUser: users.find((user) => user.id === viewer.id) ?? null,
        diaries,
        notifications,
        coinTransactions: [
          ...current.coinTransactions,
          {
            id: makeId("c"),
            userId: viewer.id,
            amount: -1,
            reason: "impression_post",
            createdAt,
            relatedDiaryId: diaryId,
          },
        ],
      };
    });

    return created;
  }, []);

  const toggleLike = useCallback((diaryId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer) {
        return current;
      }

      const diary = current.diaries.find((item) => item.id === diaryId);
      if (!diary) {
        return current;
      }

      const alreadyLiked = diary.likedBy.includes(viewer.id);
      const diaries = current.diaries.map((item) =>
        item.id === diaryId
          ? {
              ...item,
              likedBy: alreadyLiked
                ? item.likedBy.filter((id) => id !== viewer.id)
                : [...item.likedBy, viewer.id],
            }
          : item,
      );

      const shouldReward = !alreadyLiked && diary.authorId !== viewer.id;
      const users = current.users.map((user) =>
        shouldReward && user.id === diary.authorId
          ? { ...user, coinBalance: user.coinBalance + 1 }
          : user,
      );

      return {
        ...current,
        users,
        currentUser: users.find((user) => user.id === viewer.id) ?? null,
        diaries,
        coinTransactions: shouldReward
          ? [
              ...current.coinTransactions,
              {
                id: makeId("c"),
                userId: diary.authorId,
                amount: 1,
                reason: "like_received",
                createdAt: new Date().toISOString(),
                relatedDiaryId: diaryId,
              },
            ]
          : current.coinTransactions,
      };
    });
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    }));
  }, []);

  const getVisibleDiaries = useCallback(() => {
    const viewer = state.currentUser;
    if (!viewer) {
      return [];
    }

    return state.diaries.filter((diary) => {
      if (diary.visibility === "public") {
        return true;
      }

      if (diary.authorId === viewer.id) {
        return true;
      }

      if (diary.visibility === "followers") {
        const author = getUser(diary.authorId);
        return author?.followers.includes(viewer.id) ?? false;
      }

      return diary.recipientIds.includes(viewer.id);
    });
  }, [getUser, state.currentUser, state.diaries]);

  const searchDiaries = useCallback(
    (query: string, tag?: string) => {
      const normalizedQuery = query.trim().toLowerCase();
      return getVisibleDiaries().filter((diary) => {
        const matchesQuery =
          !normalizedQuery ||
          diary.title.toLowerCase().includes(normalizedQuery) ||
          diary.body.toLowerCase().includes(normalizedQuery);
        const matchesTag = !tag || diary.tags.includes(tag);
        return matchesQuery && matchesTag;
      });
    },
    [getVisibleDiaries],
  );

  const searchUsers = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim().toLowerCase();
      return state.users.filter(
        (user) =>
          !normalizedQuery ||
          user.name.toLowerCase().includes(normalizedQuery) ||
          user.handle.toLowerCase().includes(normalizedQuery) ||
          user.title.toLowerCase().includes(normalizedQuery),
      );
    },
    [state.users],
  );

  const value = useMemo<DayDropContextValue>(
    () => ({
      ...state,
      login,
      updateProfile,
      createDiary,
      addImpression,
      toggleLike,
      toggleFollow,
      markNotificationRead,
      getUser,
      getVisibleDiaries,
      getDiaryCount,
      searchDiaries,
      searchUsers,
    }),
    [
      state,
      login,
      updateProfile,
      createDiary,
      addImpression,
      toggleLike,
      toggleFollow,
      markNotificationRead,
      getUser,
      getVisibleDiaries,
      getDiaryCount,
      searchDiaries,
      searchUsers,
    ],
  );

  return (
    <DayDropContext.Provider value={value}>{children}</DayDropContext.Provider>
  );
}

export function useDayDrop() {
  const context = useContext(DayDropContext);
  if (!context) {
    throw new Error("useDayDrop must be used inside DayDropProvider");
  }

  return context;
}
