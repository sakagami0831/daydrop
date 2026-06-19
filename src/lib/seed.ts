import type { CoinTransaction, Diary, Notification, User } from "./daydrop";

export const seedUsers: User[] = [
  {
    id: "u-me",
    name: "\u3057\u304a\u3093",
    handle: "shion",
    title: "\u591c\u306b\u66f8\u304f\u4eba",
    bio: "\u591c\u306b\u77ed\u3044\u65e5\u8a18\u3092\u66f8\u304f\u4eba\u3002\u5c4a\u3044\u305f\u611f\u60f3\u3092\u3086\u3063\u304f\u308a\u8aad\u3080\u306e\u304c\u597d\u304d\u3002",
    avatar: "\u3057",
    followers: ["u-mio", "u-haru"],
    following: ["u-mio", "u-haru"],
    coinBalance: 100,
  },
  {
    id: "u-mio",
    name: "\u307f\u304a",
    handle: "mio",
    title: "\u55ab\u8336\u5e97\u306e\u89b3\u5bdf\u8005",
    bio: "\u55ab\u8336\u5e97\u3068\u6563\u6b69\u306e\u8a18\u9332\u3002\u77ed\u3044\u65e5\u8a18\u3092\u9759\u304b\u306b\u5c4a\u3051\u307e\u3059\u3002",
    avatar: "\u307f",
    followers: ["u-me"],
    following: ["u-me"],
    coinBalance: 100,
  },
  {
    id: "u-haru",
    name: "\u306f\u308b",
    handle: "haru",
    title: "\u5199\u771f\u3092\u6dfb\u3048\u308b\u4eba",
    bio: "\u5199\u771f\u3064\u304d\u306e\u65e5\u8a18\u3092\u3088\u304f\u5c4a\u3051\u307e\u3059\u3002",
    avatar: "\u306f",
    followers: ["u-me"],
    following: ["u-me"],
    coinBalance: 100,
  },
  {
    id: "u-ren",
    name: "\u308c\u3093",
    handle: "ren",
    title: "\u8aad\u3080\u5c02\u9580\u306e\u65e5",
    bio: "\u8aad\u3080\u5c02\u9580\u306b\u306a\u308a\u304c\u3061\u3002\u3068\u304d\u3069\u304d\u77ed\u3044\u611f\u60f3\u3092\u9001\u308a\u307e\u3059\u3002",
    avatar: "\u308c",
    followers: [],
    following: [],
    coinBalance: 100,
  },
];

export const seedDiaries: Diary[] = [
  {
    id: "d-1",
    authorId: "u-mio",
    title: "\u96e8\u4e0a\u304c\u308a\u306e\u5e30\u308a\u9053",
    body: "\u99c5\u307e\u3067\u306e\u9053\u304c\u5c11\u3057\u3060\u3051\u5149\u3063\u3066\u3044\u3066\u3001\u4eca\u65e5\u306f\u6025\u304c\u306a\u304f\u3066\u3044\u3044\u6c17\u304c\u3057\u307e\u3057\u305f\u3002\u30b3\u30f3\u30d3\u30cb\u3067\u6e29\u304b\u3044\u304a\u8336\u3092\u8cb7\u3063\u3066\u5e30\u308a\u307e\u3057\u305f\u3002",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    visibility: "followers",
    recipientIds: ["u-me"],
    tags: ["\u6563\u6b69", "\u65e5\u5e38"],
    createdAt: "2026-06-18T21:20:00.000Z",
    likedBy: ["u-me"],
    impressions: [
      {
        id: "i-1",
        diaryId: "d-1",
        authorId: "u-me",
        body: "\u5149\u3063\u3066\u3044\u308b\u9053\u3001\u3044\u3044\u306d\u3002\u77ed\u3044\u4e00\u65e5\u304c\u3061\u3083\u3093\u3068\u6b8b\u3063\u3066\u3044\u308b\u611f\u3058\u304c\u3057\u305f\u3002",
        createdAt: "2026-06-18T22:02:00.000Z",
      },
    ],
  },
  {
    id: "d-2",
    authorId: "u-haru",
    title: "\u663c\u4f11\u307f\u306b\u898b\u3064\u3051\u305f\u767d\u3044\u82b1",
    body: "\u4f1a\u793e\u306e\u8fd1\u304f\u306e\u690d\u3048\u8fbc\u307f\u306b\u5c0f\u3055\u306a\u767d\u3044\u82b1\u304c\u5897\u3048\u3066\u3044\u307e\u3057\u305f\u3002\u5199\u771f\u306f\u64ae\u308c\u306a\u304b\u3063\u305f\u3051\u3069\u3001\u660e\u65e5\u3082\u898b\u306b\u884c\u304d\u305f\u3044\u3067\u3059\u3002",
    imageUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
    visibility: "specified",
    recipientIds: ["u-me"],
    tags: ["\u5199\u771f", "\u6563\u6b69"],
    createdAt: "2026-06-17T12:45:00.000Z",
    likedBy: [],
    impressions: [],
  },
  {
    id: "d-3",
    authorId: "u-me",
    title: "\u65e5\u8a18\u68da\u3092\u6574\u3048\u305f",
    body: "\u4eca\u65e5\u306fDayDrop\u306e\u898b\u305f\u76ee\u3092\u5c11\u3057\u6574\u3048\u307e\u3057\u305f\u3002\u6d41\u308c\u3066\u3044\u304f\u5834\u6240\u3067\u306f\u306a\u304f\u3001\u5c4a\u3044\u305f\u65e5\u8a18\u304c\u68da\u306b\u4e26\u3093\u3067\u3044\u308b\u611f\u3058\u306b\u3057\u305f\u3044\u3067\u3059\u3002",
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    visibility: "public",
    recipientIds: [],
    tags: ["\u65e5\u5e38", "\u77ed\u6587"],
    createdAt: "2026-06-16T20:10:00.000Z",
    likedBy: ["u-mio"],
    impressions: [],
  },
];

export const seedNotifications: Notification[] = [
  {
    id: "n-1",
    userId: "u-me",
    type: "diary_delivered",
    message: "\u307f\u304a\u3055\u3093\u304b\u3089\u65e5\u8a18\u304c\u5c4a\u3044\u3066\u3044\u307e\u3059",
    createdAt: "2026-06-18T21:20:00.000Z",
    read: false,
    diaryId: "d-1",
    actorId: "u-mio",
  },
  {
    id: "n-2",
    userId: "u-me",
    type: "diary_delivered",
    message: "\u306f\u308b\u3055\u3093\u304b\u3089\u65e5\u8a18\u304c\u5c4a\u3044\u3066\u3044\u307e\u3059",
    createdAt: "2026-06-17T12:45:00.000Z",
    read: false,
    diaryId: "d-2",
    actorId: "u-haru",
  },
];

export const seedCoinTransactions: CoinTransaction[] = [
  {
    id: "c-1",
    userId: "u-me",
    amount: 100,
    reason: "initial_bonus",
    createdAt: "2026-06-16T09:00:00.000Z",
  },
];
