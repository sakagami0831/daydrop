export type Visibility = "public" | "followers" | "specified";

export type User = {
  id: string;
  email?: string;
  name: string;
  handle: string;
  title: string;
  bio: string;
  avatar: string;
  avatarImageUrl?: string;
  headerImageUrl?: string;
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
  tags: string[];
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
  type: "diary_delivered" | "followed" | "impression_received";
  message: string;
  createdAt: string;
  read: boolean;
  diaryId?: string;
  actorId?: string;
};

export type ReportReason =
  | "inappropriate"
  | "harassment"
  | "impersonation"
  | "personal_info"
  | "other";

export type SafetyReport = {
  id: string;
  reporterId: string;
  targetType: "diary" | "impression";
  targetId: string;
  reason: ReportReason;
  createdAt: string;
};

export type CoinTransactionReason =
  | "initial_bonus"
  | "diary_post"
  | "impression_post"
  | "daily_reward"
  | "like_received"
  | "shop_purchase"
  | "recommendation_application";

export type CoinTransaction = {
  id: string;
  userId: string;
  amount: number;
  reason: CoinTransactionReason;
  createdAt: string;
  relatedDiaryId?: string;
};

export const visibilityLabels: Record<Visibility, string> = {
  public: "\u5168\u4f53\u516c\u958b",
  followers: "\u30d5\u30a9\u30ed\u30ef\u30fc\u3078\u9001\u4fe1",
  specified: "\u6307\u5b9a\u30e6\u30fc\u30b6\u30fc\u3078\u9001\u4fe1",
};

export const visibilityDescriptions: Record<Visibility, string> = {
  public: "\u8ab0\u3067\u3082\u8aad\u3081\u308b\u65e5\u8a18\u3068\u3057\u3066\u7f6e\u3044\u3066\u304a\u304f",
  followers: "\u3042\u306a\u305f\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u308b\u4eba\u306b\u5c4a\u3051\u308b",
  specified: "\u9078\u3093\u3060\u76f8\u624b\u3060\u3051\u306b\u5c4a\u3051\u308b",
};
