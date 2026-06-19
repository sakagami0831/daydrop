# DayDrop

DayDrop（でいどろ）は「日記が届くSNS」です。

XのようなタイムラインSNSではなく、日記を書き、届けたい相手に届け、感想をもらうアプリとして設計します。MVPではスマホ最優先の白基調・ゆるふわUIで、ブログカード型の日記体験を実装します。

## MVP実装計画

1. 初期構築
   - Next.js App Router / TypeScript / Tailwind CSS
   - READMEに概要と方針を記載
2. Phase1
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
     - 「〇〇さんから日記が届いています」
     - 「〇〇さんから感想が届いています」
3. Phase2以降
   - 永続DB・認証基盤への接続
   - コインUI
   - 通知既読管理の強化
   - 画像アップロード基盤

## コイン仕様

初期実装ではDB設計相当の型と状態だけを用意しています。

- 初期100コイン
- 投稿30コイン消費
- 感想1コイン消費
- デイリー報酬あり
- いいね獲得で+1

後回し機能: 課金、称号、二つ名、レベル、ショップ、プロフィール装飾。

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
