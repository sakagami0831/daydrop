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
};

type DayDropState = {
  users: User[];
  diaries: Diary[];
  notifications: Notification[];
  coinTransactions: CoinTransaction[];
  currentUser: User | null;
};

type DayDropContextValue = DayDropState & {
  login: (userId: string) => void;
  updateProfile: (input: Pick<User, "name" | "handle" | "bio">) => void;
  createDiary: (draft: DraftDiary) => Diary;
  addImpression: (diaryId: string, body: string) => void;
  toggleLike: (diaryId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  getUser: (userId: string) => User | undefined;
  getVisibleDiaries: () => Diary[];
};

const storageKey = "daydrop-mvp-state";
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

const loadInitialState = () => {
  if (typeof window === "undefined") {
    return initialState;
  }

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return initialState;
  }

  try {
    return JSON.parse(saved) as DayDropState;
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

  const login = useCallback((userId: string) => {
    setState((current) => ({
      ...current,
      currentUser: current.users.find((user) => user.id === userId) ?? null,
    }));
  }, []);

  const updateProfile = useCallback(
    (input: Pick<User, "name" | "handle" | "bio">) => {
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
    },
    [],
  );

  const createDiary = useCallback((draft: DraftDiary) => {
    let createdDiary = initialState.diaries[0];

    setState((current) => {
      if (!current.currentUser) {
        return current;
      }

      const diary: Diary = {
        id: makeId("d"),
        authorId: current.currentUser.id,
        title: draft.title,
        body: draft.body,
        imageUrl: draft.imageUrl,
        visibility: draft.visibility,
        recipientIds: draft.recipientIds,
        createdAt: new Date().toISOString(),
        likedBy: [],
        impressions: [],
      };

      createdDiary = diary;

      const deliveryTargets =
        draft.visibility === "public"
          ? []
          : draft.visibility === "followers"
            ? current.currentUser.followers
            : draft.recipientIds;

      const deliveryNotifications: Notification[] = deliveryTargets.map(
        (userId) => ({
          id: makeId("n"),
          userId,
          message: `${current.currentUser?.name}さんから日記が届いています`,
          createdAt: diary.createdAt,
          read: false,
          diaryId: diary.id,
        }),
      );

      const coinTransactions: CoinTransaction[] = [
        ...current.coinTransactions,
        {
          id: makeId("c"),
          userId: current.currentUser.id,
          amount: -30,
          reason: "diary_post",
          createdAt: diary.createdAt,
          relatedDiaryId: diary.id,
        },
      ];

      const users = current.users.map((user) =>
        user.id === current.currentUser?.id
          ? { ...user, coinBalance: user.coinBalance - 30 }
          : user,
      );

      return {
        ...current,
        users,
        currentUser:
          users.find((user) => user.id === current.currentUser?.id) ?? null,
        diaries: [diary, ...current.diaries],
        notifications: [...deliveryNotifications, ...current.notifications],
        coinTransactions,
      };
    });

    return createdDiary;
  }, []);

  const addImpression = useCallback((diaryId: string, body: string) => {
    setState((current) => {
      if (!current.currentUser) {
        return current;
      }

      const diary = current.diaries.find((item) => item.id === diaryId);
      if (!diary) {
        return current;
      }

      const createdAt = new Date().toISOString();
      const impression: Impression = {
        id: makeId("i"),
        diaryId,
        authorId: current.currentUser.id,
        body,
        createdAt,
      };

      const diaries = current.diaries.map((item) =>
        item.id === diaryId
          ? { ...item, impressions: [...item.impressions, impression] }
          : item,
      );

      const notifications =
        diary.authorId === current.currentUser.id
          ? current.notifications
          : [
              {
                id: makeId("n"),
                userId: diary.authorId,
                message: `${current.currentUser.name}さんから感想が届いています`,
                createdAt,
                read: false,
                diaryId,
              },
              ...current.notifications,
            ];

      const users = current.users.map((user) =>
        user.id === current.currentUser?.id
          ? { ...user, coinBalance: user.coinBalance - 1 }
          : user,
      );

      return {
        ...current,
        users,
        currentUser:
          users.find((user) => user.id === current.currentUser?.id) ?? null,
        diaries,
        notifications,
        coinTransactions: [
          ...current.coinTransactions,
          {
            id: makeId("c"),
            userId: current.currentUser.id,
            amount: -1,
            reason: "impression_post",
            createdAt,
            relatedDiaryId: diaryId,
          },
        ],
      };
    });
  }, []);

  const toggleLike = useCallback((diaryId: string) => {
    setState((current) => {
      if (!current.currentUser) {
        return current;
      }

      const diary = current.diaries.find((item) => item.id === diaryId);
      if (!diary) {
        return current;
      }

      const alreadyLiked = diary.likedBy.includes(current.currentUser.id);
      const diaries = current.diaries.map((item) =>
        item.id === diaryId
          ? {
              ...item,
              likedBy: alreadyLiked
                ? item.likedBy.filter((id) => id !== current.currentUser?.id)
                : [...item.likedBy, current.currentUser?.id ?? ""],
            }
          : item,
      );

      const shouldReward = !alreadyLiked && diary.authorId !== current.currentUser.id;
      const users = current.users.map((user) =>
        shouldReward && user.id === diary.authorId
          ? { ...user, coinBalance: user.coinBalance + 1 }
          : user,
      );

      return {
        ...current,
        users,
        currentUser:
          users.find((user) => user.id === current.currentUser?.id) ?? null,
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

  const value = useMemo<DayDropContextValue>(
    () => ({
      ...state,
      login,
      updateProfile,
      createDiary,
      addImpression,
      toggleLike,
      markNotificationRead,
      getUser,
      getVisibleDiaries,
    }),
    [
      state,
      login,
      updateProfile,
      createDiary,
      addImpression,
      toggleLike,
      markNotificationRead,
      getUser,
      getVisibleDiaries,
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
