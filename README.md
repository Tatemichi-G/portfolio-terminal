# G-tatemichi Portfolio

就職活動用に制作しているポートフォリオサイトです。現在本格稼働ではなく、あくまでVer0.9です。  
React + Vite をベースに、Three.js / React Three Fiber / GSAP を使って、自己紹介・作品一覧・最新情報・お問い合わせをまとめています。

## 主な技術

- React
- Vite
- react-router-dom
- GSAP / ScrollTrigger
- Three.js
- React Three Fiber
- microCMS
- PHP

## ページ構成

- Top
- About
- Works
- News
- Contact
- Works Detail

## 最新情報について

`最新情報` は microCMS の `news` から取得しています。  
開発中は `microcms-js-sdk` で直接取得し、公開時は PHP API を経由する想定です。

現在の想定フィールドは以下です。

- `title`
- `image`
- `content`
- `summary`
- `category`

## ThreeMV について

トップのThreeMVコンポーネントに関しては、バイブコーディング的に試行錯誤しながら組んだ部分が含まれています。そのため、現時点では自分で完全に同じものをゼロから再現できる状態ではありません。

ただし、以下の点は自分で調整・確認しながら進めています。

- 画像差し替え
- パス修正
- レイアウト調整
- 表示崩れの修正
- 他セクションとのつなぎ込み

今後は Three.js 周りの理解を深めて、自分の言葉で説明できる範囲を増やしていく予定です。

その他は全て、資料確認や調べ物をしつつも今の自分のレベルで作成していると思います。
CSSの重複や、変数名・クラス名などは後から統一感、可読性を上げるためのcodexによる書き換え、
及びキリのいいところでのcodexによる破綻確認は行なっています。

## ローカル起動

```bash
npm install
npm run dev
```

## 環境変数

プロジェクト直下に `.env` を作成します。

```env
VITE_CMS_DOMAIN=g-tatemichi
VITE_CMS_APIKEY=YOUR_API_KEY
```

## 公開時の想定

- フロントは Vite で build
- `dist` を Xserver に配置
- microCMS 取得は PHP API を経由

## 補足

このサイトは、デザイン・実装・演出・調整を通して、未経験からフロントエンド開発を学ぶ過程も含めてまとめたものです。
