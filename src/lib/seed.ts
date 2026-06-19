import type { CoinTransaction, Diary, Notification, User } from "./daydrop";

export const seedUsers: User[] = [
  {
    id: "u-me",
    name: "しおん",
    handle: "shion",
    bio: "夜に短い日記を書く人。届いた感想をゆっくり読むのが好き。",
    avatar: "し",
    followers: ["u-mio", "u-haru"],
    following: ["u-mio", "u-haru", "u-ren"],
    coinBalance: 100,
  },
  {
    id: "u-mio",
    name: "みお",
    handle: "mio",
    bio: "喫茶店と散歩の記録。",
    avatar: "み",
    followers: ["u-me"],
    following: ["u-me"],
    coinBalance: 100,
  },
  {
    id: "u-haru",
    name: "はる",
    handle: "haru",
    bio: "写真つきの日記をよく届けます。",
    avatar: "は",
    followers: ["u-me"],
    following: ["u-me"],
    coinBalance: 100,
  },
  {
    id: "u-ren",
    name: "れん",
    handle: "ren",
    bio: "読む専門になりがち。",
    avatar: "れ",
    followers: [],
    following: ["u-me"],
    coinBalance: 100,
  },
];

export const seedDiaries: Diary[] = [
  {
    id: "d-1",
    authorId: "u-mio",
    title: "雨上がりの帰り道",
    body: "駅までの道が少しだけ光っていて、今日は急がなくていい気がしました。コンビニで温かいお茶を買って帰りました。",
    visibility: "followers",
    recipientIds: ["u-me"],
    createdAt: "2026-06-18T21:20:00.000Z",
    likedBy: ["u-me"],
    impressions: [
      {
        id: "i-1",
        diaryId: "d-1",
        authorId: "u-me",
        body: "光っている道、いいね。短い一日がちゃんと残っている感じがした。",
        createdAt: "2026-06-18T22:02:00.000Z",
      },
    ],
  },
  {
    id: "d-2",
    authorId: "u-haru",
    title: "昼休みに見つけた白い花",
    body: "会社の近くの植え込みに小さな白い花が増えていました。写真は撮れなかったけど、明日も見に行きたいです。",
    visibility: "specified",
    recipientIds: ["u-me"],
    createdAt: "2026-06-17T12:45:00.000Z",
    likedBy: [],
    impressions: [],
  },
];

export const seedNotifications: Notification[] = [
  {
    id: "n-1",
    userId: "u-me",
    message: "みおさんから日記が届いています",
    createdAt: "2026-06-18T21:20:00.000Z",
    read: false,
    diaryId: "d-1",
  },
  {
    id: "n-2",
    userId: "u-me",
    message: "はるさんから日記が届いています",
    createdAt: "2026-06-17T12:45:00.000Z",
    read: false,
    diaryId: "d-2",
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

