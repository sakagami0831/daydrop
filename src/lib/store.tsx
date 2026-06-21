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
  ReportReason,
  SafetyReport,
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

type ProfileInput = Partial<Pick<User, "name" | "handle" | "title" | "bio" | "avatar">>;

type DayDropState = {
  users: User[];
  diaries: Diary[];
  notifications: Notification[];
  coinTransactions: CoinTransaction[];
  dailyReads: Record<string, string[]>;
  dailyClaims: Record<string, string[]>;
  purchasedShopItemIds: Record<string, string[]>;
  equippedShopItemIds: Record<string, Record<string, string>>;
  recommendationApplications: Record<string, string[]>;
  blockedUserIds: Record<string, string[]>;
  mutedUserIds: Record<string, string[]>;
  hiddenDiaryIds: Record<string, string[]>;
  hiddenImpressionIds: Record<string, string[]>;
  safetyReports: SafetyReport[];
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
  markDiaryRead: (diaryId: string) => void;
  claimDailyBonus: () => boolean;
  claimDailyMission: (missionId: string, reward: number) => boolean;
  purchaseShopItem: (itemId: string, price: number) => boolean;
  equipShopItem: (itemId: string, slot: string) => boolean;
  applyRecommendation: () => boolean;
  toggleBlockUser: (targetUserId: string) => void;
  toggleMuteUser: (targetUserId: string) => void;
  hideDiary: (diaryId: string) => void;
  unhideDiary: (diaryId: string) => void;
  reportTarget: (
    targetType: SafetyReport["targetType"],
    targetId: string,
    reason: ReportReason,
  ) => boolean;
  deleteImpression: (diaryId: string, impressionId: string) => void;
  hideImpression: (impressionId: string) => void;
  getUser: (userId: string) => User | undefined;
  getVisibleDiaries: () => Diary[];
  getDiaryCount: (userId: string) => number;
  searchDiaries: (query: string, tag?: string) => Diary[];
  searchUsers: (query: string) => User[];
};

const storageKey = "daydrop-streamer-exchange-state";
const DayDropContext = createContext<DayDropContextValue | null>(null);

const initialState: DayDropState = {
  users: seedUsers,
  diaries: seedDiaries,
  notifications: seedNotifications,
  coinTransactions: seedCoinTransactions,
  dailyReads: {},
  dailyClaims: {},
  purchasedShopItemIds: {},
  equippedShopItemIds: {},
  recommendationApplications: {},
  blockedUserIds: {},
  mutedUserIds: {},
  hiddenDiaryIds: {},
  hiddenImpressionIds: {},
  safetyReports: [],
  currentUser: seedUsers[0],
};

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const normalizeState = (state: DayDropState): DayDropState => ({
  ...state,
  dailyReads: state.dailyReads ?? {},
  dailyClaims: state.dailyClaims ?? {},
  purchasedShopItemIds: state.purchasedShopItemIds ?? {},
  equippedShopItemIds: state.equippedShopItemIds ?? {},
  recommendationApplications: state.recommendationApplications ?? {},
  blockedUserIds: state.blockedUserIds ?? {},
  mutedUserIds: state.mutedUserIds ?? {},
  hiddenDiaryIds: state.hiddenDiaryIds ?? {},
  hiddenImpressionIds: state.hiddenImpressionIds ?? {},
  safetyReports: state.safetyReports ?? [],
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
    const viewer = state.currentUser;
    if (!viewer || viewer.coinBalance < 30) {
      return null;
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

    setState((current) => {
      const activeUser = current.currentUser;
      if (!activeUser || activeUser.id !== viewer.id || activeUser.coinBalance < 30) {
        return current;
      }

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

    return diary;
  }, [state.currentUser]);

  const addImpression = useCallback((diaryId: string, body: string) => {
    const viewer = state.currentUser;
    const targetDiary = state.diaries.find((item) => item.id === diaryId);
    const diaryAuthorBlocks = targetDiary
      ? (state.blockedUserIds[targetDiary.authorId] ?? [])
      : [];
    if (
      !viewer ||
      !targetDiary ||
      viewer.coinBalance < 1 ||
      diaryAuthorBlocks.includes(viewer.id)
    ) {
      return false;
    }

    setState((current) => {
      const activeUser = current.currentUser;
      if (!activeUser || activeUser.id !== viewer.id || activeUser.coinBalance < 1) {
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

    return true;
  }, [state.blockedUserIds, state.currentUser, state.diaries]);

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

  const markDiaryRead = useCallback((diaryId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer || !current.diaries.some((diary) => diary.id === diaryId)) {
        return current;
      }

      const key = `${viewer.id}:${toDayKey()}`;
      const reads = current.dailyReads[key] ?? [];
      if (reads.includes(diaryId)) {
        return current;
      }

      return {
        ...current,
        dailyReads: {
          ...current.dailyReads,
          [key]: [...reads, diaryId],
        },
      };
    });
  }, []);

  const claimDailyMission = useCallback((missionId: string, reward: number) => {
    const viewer = state.currentUser;
    if (!viewer || reward <= 0) {
      return false;
    }

    const key = `${viewer.id}:${toDayKey()}`;
    const claimed = state.dailyClaims[key] ?? [];
    if (claimed.includes(missionId)) {
      return false;
    }

    setState((current) => {
      const activeUser = current.currentUser;
      if (!activeUser || activeUser.id !== viewer.id) {
        return current;
      }

      const claimKey = `${viewer.id}:${toDayKey()}`;
      const currentClaims = current.dailyClaims[claimKey] ?? [];
      if (currentClaims.includes(missionId)) {
        return current;
      }

      const createdAt = new Date().toISOString();
      const users = current.users.map((user) =>
        user.id === viewer.id
          ? { ...user, coinBalance: user.coinBalance + reward }
          : user,
      );

      return {
        ...current,
        users,
        currentUser: users.find((user) => user.id === viewer.id) ?? null,
        dailyClaims: {
          ...current.dailyClaims,
          [claimKey]: [...currentClaims, missionId],
        },
        coinTransactions: [
          ...current.coinTransactions,
          {
            id: makeId("c"),
            userId: viewer.id,
            amount: reward,
            reason: "daily_reward",
            createdAt,
          },
        ],
      };
    });

    return true;
  }, [state.currentUser, state.dailyClaims]);

  const claimDailyBonus = useCallback(
    () => claimDailyMission("login", 10),
    [claimDailyMission],
  );

  const purchaseShopItem = useCallback((itemId: string, price: number) => {
    const viewer = state.currentUser;
    if (!viewer || viewer.coinBalance < price) {
      return false;
    }

    const purchased = state.purchasedShopItemIds[viewer.id] ?? [];
    if (purchased.includes(itemId)) {
      return false;
    }

    setState((current) => {
      const activeUser = current.currentUser;
      const currentPurchased = activeUser
        ? (current.purchasedShopItemIds[activeUser.id] ?? [])
        : [];
      if (
        !activeUser ||
        activeUser.id !== viewer.id ||
        activeUser.coinBalance < price ||
        currentPurchased.includes(itemId)
      ) {
        return current;
      }

      const createdAt = new Date().toISOString();
      const users = current.users.map((user) =>
        user.id === viewer.id
          ? { ...user, coinBalance: user.coinBalance - price }
          : user,
      );

      return {
        ...current,
        users,
        currentUser: users.find((user) => user.id === viewer.id) ?? null,
        purchasedShopItemIds: {
          ...current.purchasedShopItemIds,
          [viewer.id]: [...currentPurchased, itemId],
        },
        coinTransactions: [
          ...current.coinTransactions,
          {
            id: makeId("c"),
            userId: viewer.id,
            amount: -price,
            reason: "shop_purchase",
            createdAt,
          },
        ],
      };
    });

    return true;
  }, [state.currentUser, state.purchasedShopItemIds]);

  const equipShopItem = useCallback((itemId: string, slot: string) => {
    const viewer = state.currentUser;
    if (!viewer) {
      return false;
    }

    const purchased = state.purchasedShopItemIds[viewer.id] ?? [];
    if (!purchased.includes(itemId)) {
      return false;
    }

    setState((current) => {
      const activeUser = current.currentUser;
      if (!activeUser || activeUser.id !== viewer.id) {
        return current;
      }

      const currentEquipped = current.equippedShopItemIds[viewer.id] ?? {};
      return {
        ...current,
        equippedShopItemIds: {
          ...current.equippedShopItemIds,
          [viewer.id]: {
            ...currentEquipped,
            [slot]: itemId,
          },
        },
      };
    });

    return true;
  }, [state.currentUser, state.purchasedShopItemIds]);

  const applyRecommendation = useCallback(() => {
    const viewer = state.currentUser;
    if (!viewer || viewer.coinBalance < 1000) {
      return false;
    }

    const today = toDayKey();
    const applications = state.recommendationApplications[viewer.id] ?? [];
    if (applications.includes(today)) {
      return false;
    }

    setState((current) => {
      const activeUser = current.currentUser;
      const currentApplications = activeUser
        ? (current.recommendationApplications[activeUser.id] ?? [])
        : [];
      if (
        !activeUser ||
        activeUser.id !== viewer.id ||
        activeUser.coinBalance < 1000 ||
        currentApplications.includes(today)
      ) {
        return current;
      }

      const createdAt = new Date().toISOString();
      const users = current.users.map((user) =>
        user.id === viewer.id
          ? { ...user, coinBalance: user.coinBalance - 1000 }
          : user,
      );

      return {
        ...current,
        users,
        currentUser: users.find((user) => user.id === viewer.id) ?? null,
        recommendationApplications: {
          ...current.recommendationApplications,
          [viewer.id]: [...currentApplications, today],
        },
        coinTransactions: [
          ...current.coinTransactions,
          {
            id: makeId("c"),
            userId: viewer.id,
            amount: -1000,
            reason: "recommendation_application",
            createdAt,
          },
        ],
      };
    });

    return true;
  }, [state.currentUser, state.recommendationApplications]);

  const toggleBlockUser = useCallback((targetUserId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer || viewer.id === targetUserId) {
        return current;
      }

      const currentBlocked = current.blockedUserIds[viewer.id] ?? [];
      const blocked = currentBlocked.includes(targetUserId);
      const nextBlocked = blocked
        ? currentBlocked.filter((id) => id !== targetUserId)
        : [...currentBlocked, targetUserId];
      const currentMuted = current.mutedUserIds[viewer.id] ?? [];

      return {
        ...current,
        blockedUserIds: {
          ...current.blockedUserIds,
          [viewer.id]: nextBlocked,
        },
        mutedUserIds: {
          ...current.mutedUserIds,
          [viewer.id]: blocked
            ? currentMuted
            : currentMuted.filter((id) => id !== targetUserId),
        },
      };
    });
  }, []);

  const toggleMuteUser = useCallback((targetUserId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer || viewer.id === targetUserId) {
        return current;
      }

      const blocked = current.blockedUserIds[viewer.id]?.includes(targetUserId);
      if (blocked) {
        return current;
      }

      const currentMuted = current.mutedUserIds[viewer.id] ?? [];
      const muted = currentMuted.includes(targetUserId);

      return {
        ...current,
        mutedUserIds: {
          ...current.mutedUserIds,
          [viewer.id]: muted
            ? currentMuted.filter((id) => id !== targetUserId)
            : [...currentMuted, targetUserId],
        },
      };
    });
  }, []);

  const hideDiary = useCallback((diaryId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer) {
        return current;
      }
      const hidden = current.hiddenDiaryIds[viewer.id] ?? [];
      if (hidden.includes(diaryId)) {
        return current;
      }
      return {
        ...current,
        hiddenDiaryIds: {
          ...current.hiddenDiaryIds,
          [viewer.id]: [...hidden, diaryId],
        },
      };
    });
  }, []);

  const unhideDiary = useCallback((diaryId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer) {
        return current;
      }
      return {
        ...current,
        hiddenDiaryIds: {
          ...current.hiddenDiaryIds,
          [viewer.id]: (current.hiddenDiaryIds[viewer.id] ?? []).filter(
            (id) => id !== diaryId,
          ),
        },
      };
    });
  }, []);

  const reportTarget = useCallback(
    (
      targetType: SafetyReport["targetType"],
      targetId: string,
      reason: ReportReason,
    ) => {
      const viewer = state.currentUser;
      if (!viewer) {
        return false;
      }
      const alreadyReported = state.safetyReports.some(
        (report) =>
          report.reporterId === viewer.id &&
          report.targetType === targetType &&
          report.targetId === targetId,
      );
      if (alreadyReported) {
        return false;
      }

      setState((current) => ({
        ...current,
        safetyReports: [
          {
            id: makeId("r"),
            reporterId: viewer.id,
            targetType,
            targetId,
            reason,
            createdAt: new Date().toISOString(),
          },
          ...current.safetyReports,
        ],
      }));
      return true;
    },
    [state.currentUser, state.safetyReports],
  );

  const deleteImpression = useCallback((diaryId: string, impressionId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer) {
        return current;
      }
      const diary = current.diaries.find((item) => item.id === diaryId);
      const impression = diary?.impressions.find((item) => item.id === impressionId);
      if (!diary || !impression || impression.authorId !== viewer.id) {
        return current;
      }
      return {
        ...current,
        diaries: current.diaries.map((item) =>
          item.id === diaryId
            ? {
                ...item,
                impressions: item.impressions.filter(
                  (comment) => comment.id !== impressionId,
                ),
              }
            : item,
        ),
      };
    });
  }, []);

  const hideImpression = useCallback((impressionId: string) => {
    setState((current) => {
      const viewer = current.currentUser;
      if (!viewer) {
        return current;
      }
      const hidden = current.hiddenImpressionIds[viewer.id] ?? [];
      if (hidden.includes(impressionId)) {
        return current;
      }
      return {
        ...current,
        hiddenImpressionIds: {
          ...current.hiddenImpressionIds,
          [viewer.id]: [...hidden, impressionId],
        },
      };
    });
  }, []);

  const getVisibleDiaries = useCallback(() => {
    const viewer = state.currentUser;
    if (!viewer) {
      return [];
    }

    return state.diaries.filter((diary) => {
      const blocked = state.blockedUserIds[viewer.id] ?? [];
      const hidden = state.hiddenDiaryIds[viewer.id] ?? [];
      if (blocked.includes(diary.authorId) || hidden.includes(diary.id)) {
        return false;
      }

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
  }, [
    getUser,
    state.blockedUserIds,
    state.currentUser,
    state.diaries,
    state.hiddenDiaryIds,
  ]);

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
      markDiaryRead,
      claimDailyBonus,
      claimDailyMission,
      purchaseShopItem,
      equipShopItem,
      applyRecommendation,
      toggleBlockUser,
      toggleMuteUser,
      hideDiary,
      unhideDiary,
      reportTarget,
      deleteImpression,
      hideImpression,
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
      markDiaryRead,
      claimDailyBonus,
      claimDailyMission,
      purchaseShopItem,
      equipShopItem,
      applyRecommendation,
      toggleBlockUser,
      toggleMuteUser,
      hideDiary,
      unhideDiary,
      reportTarget,
      deleteImpression,
      hideImpression,
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
