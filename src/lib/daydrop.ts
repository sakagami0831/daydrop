export type Visibility = "public" | "followers" | "specified";

export type User = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  followers: string[];
  following: string[];
  coinBalance: number;
};

export type Diary = {
  id: string;
  authorId: string;
  title: string;
  body: string;
  imageUrl?: string;
  visibility: Visibility;
  recipientIds: string[];
  createdAt: string;
  likedBy: string[];
  impressions: Impression[];
};

export type Impression = {
  id: string;
  diaryId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  read: boolean;
  diaryId?: string;
};

export type CoinTransactionReason =
  | "initial_bonus"
  | "diary_post"
  | "impression_post"
  | "daily_reward"
  | "like_received";

export type CoinTransaction = {
  id: string;
  userId: string;
  amount: number;
  reason: CoinTransactionReason;
  createdAt: string;
  relatedDiaryId?: string;
};

export const visibilityLabels: Record<Visibility, string> = {
  public: "全体公開",
  followers: "フォロワーへ送信",
  specified: "指定ユーザーへ送信",
};

