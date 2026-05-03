---
name: beginner-site-development-flow
description: "初心者・非エンジニア向けに、サイト名、サイト内容、参考デザイン、作りたいページやセクションを聞き取り、その回答から site.config とマークアップを調整する総合的な開発フロー。ユーザーがホームページ制作、サイト制作、ブログ制作、デザイン相談、トップページ調整、ページ構成相談をしたら必ず使う。"
---

# Beginner Site Development Flow

初心者・非エンジニアが、AI と一緒に安全にホームページやブログを作るための開発フローです。

Cloudflare の公開URL、deploy、Web Analytics はこのスキルでは扱わない。公開設定は `cloudflare-publish-deploy-setup` に分ける。

参考情報:

- ヒアリング項目: `references/intake-questions.md`
- DESIGN.md 作成方針: `references/design-doc.md`
- マークアップ調整方針: `references/markup-adjustment.md`

## ゴール

ユーザーの回答から、次を安全に整える。

1. サイト名を決める。
2. サイト説明文を作る。
3. 参考デザインの方向性を確認する。
4. 参考URL、参考画像、またはデザインの方向性をもとに `DESIGN.md` を作成する。
5. 作りたいページやセクションを決める。
6. その内容に合わせて `src/site.config.mjs` とマークアップを調整する。
7. `npm run lint` と `npm run build` で確認する。

## 最初に聞くこと

ユーザーが「サイトを作りたい」「ホームページを整えたい」「初心者向けフローを進めたい」と言ったら、まず次だけ聞く。

```text
まずサイトの中身を決めましょう。わかる範囲で大丈夫です。

1. サイト名は何にしますか？
2. どんなサイトにしますか？（ここから説明文を作ります）
3. 参考にしたいデザインはありますか？URLや画像があればください。
4. 作りたいページやセクションを教えてください。
```

## 重要な進行ルール

- 上の4項目を聞くまでは、マークアップ調整に入らない。
- 参考URL、参考画像、またはデザインの方向性を確認できたら、マークアップ調整前に必ず `DESIGN.md` を作成する。
- 4項目の回答がそろったら、`DESIGN.md` を作成してからマークアップ調整を行う。
- 回答が一部だけでも、合理的に補える場合は作業を進める。
- ただし、サイト名とサイト内容が両方不明な場合は先に確認する。
- `SITE_URL` と `CLOUDFLARE_WEB_ANALYTICS_TOKEN` は聞かない。公開・deploy の段階で別スキルに任せる。

## 開発フロー

### Step 1: ヒアリングする

`references/intake-questions.md` を参考に、初心者向けに短く聞く。

必須の質問:

- サイト名は何にしますか？
- どんなサイトにしますか？
- 参考となるデザインはありますか？URLや画像などを下さい。
- 作成したいページやセクションを教えてください。

### Step 2: 回答を整理する

ユーザーの回答から次を整理する。

- `SITE_TITLE`
- `SITE_DESCRIPTION`
- デザインの方向性
- 作るページ
- 作るセクション

説明文は、ユーザーの回答を短く自然な日本語にする。

例:

```text
美容室のサイト。お知らせとメニューを載せたい。
```

なら、次のようにする。

```text
お知らせやメニューを掲載する美容室サイトです。
```

### Step 3: DESIGN.md を作成する

参考URL、参考画像、またはデザインの方向性を確認できたら、マークアップ調整前にプロジェクト直下へ `DESIGN.md` を作成する。

`references/design-doc.md` を参考に、次を短く整理する。

- サイト概要
- 参考デザイン
- デザインの方向性
- 作成するページ・セクション
- 実装メモ

参考デザインは雰囲気だけ参考にし、HTML/CSSや画像をそのままコピーしない。

### Step 4: 実装前に対象ファイルを読む

必ず関連ファイルを読んでから編集する。

よく見るファイル:

- `DESIGN.md`
- `src/site.config.mjs`
- `src/pages/index.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/styles/global.css`
- `src/content/blog/`

### Step 5: site.config を調整する

`src/site.config.mjs` のうち、この段階では次だけ調整する。

```js
export const SITE_TITLE = "...";
export const SITE_DESCRIPTION = "...";
```

この段階では次は触らない。

```js
export const SITE_URL = "...";
export const CLOUDFLARE_WEB_ANALYTICS_TOKEN = "...";
```

公開URLやアクセス解析は、公開・deploy スキルに分ける。

### Step 6: マークアップを調整する

`references/markup-adjustment.md` を参考に、ユーザーの希望に合わせて最小限で調整する。

調整例:

- トップページの見出しや説明文
- ナビゲーション
- セクション構成
- サンプル記事や表示文言
- 色や余白などの軽いデザイン調整

避けること:

- 独自ログイン機能
- 複雑な問い合わせフォーム
- APIキーや秘密情報の追加
- Cloudflare deploy 設定
- Web Analytics 設定

### Step 7: 確認する

変更後は必ず実行する。

```bash
npm run lint
npm run build
```

整形エラーだけなら次を実行する。

```bash
npm run lint:fix
npm run lint
npm run build
```

### Step 8: 完了報告する

初心者にわかりやすく、短く報告する。

```text
サイトの基本部分を調整しました。

変更:
- DESIGN.md にデザイン方針を整理
- サイト名と説明文を設定
- トップページの見出しとセクションを調整
- ナビゲーションを調整

確認:
- npm run lint 成功
- npm run build 成功

次は公開する段階で、SITE_URL と Cloudflare Web Analytics を設定します。
```

## 公開設定へ進む場合

ユーザーが「公開したい」「deployしたい」「SITE_URLを設定したい」「Web Analyticsを設定したい」と言ったら、`cloudflare-publish-deploy-setup` を使う。
