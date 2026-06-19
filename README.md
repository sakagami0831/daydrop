# DayDrop

DayDrop（でいどろ）は「日記が届くSNS」です。

XやInstagramのようなタイムラインSNSではなく、日記を書き、届けたい相手に届け、感想をもらう体験を最優先にします。

## 現在の実装

- Next.js App Router / TypeScript / Tailwind CSS
- MVPプロトタイプ
- ログイン
- プロフィール表示・編集
- 日記投稿
- 画像投稿
- 公開範囲選択
  - 全体公開
  - フォロワーへ送信
  - 指定ユーザーへ送信
- 日記詳細ページ
- 感想
- いいね
- 通知
- フォロー / フォロー解除

## Phase2 実装内容

- プロフィールからフォロー / フォロー解除
- フォロー通知
  - 「〇〇さんがあなたをフォローしました」
- 日記送信時の届け先表示
- 通知種別表示
  - 日記
  - フォロー
  - 感想
- プロフィール改善
  - 二つ名
  - 自己紹介
  - 投稿数
  - フォロー数
  - フォロワー数
- ホーム画面をブログカード型の日記棚デザインへ改善
- 感想数を大きく表示

## コイン仕様

初期実装ではDB設計相当の型と状態を用意しています。

- 初期100コイン
- 投稿30コイン消費
- 感想1コイン消費
- デイリー報酬あり
- いいね獲得で+1

後回し機能: 課金、称号、レベル、ショップ、プロフィール装飾。

## ファイル構成

```text
src/
  app/
    page.tsx
    diary/[id]/page.tsx
    globals.css
    layout.tsx
  components/
    AppShell.tsx
    AuthPanel.tsx
    Composer.tsx
    DiaryCard.tsx
    DiaryDetail.tsx
    NotificationsPanel.tsx
    ProfilePanel.tsx
  lib/
    daydrop.ts
    seed.ts
    store.tsx
```

## 開発

```bash
npm run dev
```

http://localhost:3000 で確認します。
