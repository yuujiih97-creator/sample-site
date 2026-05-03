---
name: cloudflare-publish-deploy-setup
description: "Astro + Cloudflare Workers サイトの公開・deploy 段階で、SITE_URL、Cloudflare Web Analytics、wrangler 設定、公開前確認をステップバイステップで案内・実装する。ユーザーが公開、deploy、デプロイ、SITE_URL、Web Analytics、アクセス解析、CLOUDFLARE_WEB_ANALYTICS_TOKEN、Cloudflare 計測タグについて相談したら必ず使う。"
---

# Cloudflare Publish Deploy Setup

サイト内容とマークアップが整った後に使う、公開・deploy 用の設定フローです。

サイト名、説明文、ページ構成、デザイン調整はこのスキルでは扱わない。制作段階は `beginner-site-development-flow` を使う。

参考情報:

- Cloudflare Web Analytics: `references/cloudflare-web-analytics.md`
- 公開用のプロジェクト設定: `references/project-settings.md`

## ゴール

公開前に次を確認・設定する。

1. `SITE_URL` に公開URLを設定する。
2. Cloudflare Web Analytics token を設定する。
3. 生成HTMLに計測 script が入ることを確認する。
4. Cloudflare Workers の設定で危険な preview URL を有効にしない。
5. `npm run lint` と `npm run build` を成功させる。
6. 必要なら commit / push する。

## このスキルで聞くこと

公開段階で、必要な場合だけ次を聞く。

```text
公開設定を進めます。わかる範囲で大丈夫です。

1. 公開URLは何ですか？（例: https://example.com）
2. Cloudflare Web Analytics の token または script はありますか？
```

まだ公開URLがない場合は、Cloudflare Workers の仮URLでもよい。ただし後で独自ドメインに変えたら `SITE_URL` も更新する必要があると伝える。

## 開発フローとの分担

`beginner-site-development-flow` で扱うもの:

- サイト名
- サイト説明文
- 参考デザイン
- ページやセクション
- マークアップ調整

このスキルで扱うもの:

- `SITE_URL`
- `CLOUDFLARE_WEB_ANALYTICS_TOKEN`
- Cloudflare Web Analytics script
- deploy 前確認
- Cloudflare Workers 公開設定

## Step 1: 現在の設定を読む

必ず先に読む。

- `src/site.config.mjs`
- `wrangler.jsonc`
- `package.json`

## Step 2: SITE_URL を設定する

`src/site.config.mjs` の `SITE_URL` に公開URLを入れる。

例:

```js
export const SITE_URL = "https://example.com";
```

注意:

- URL の末尾に `/` は付けない。
- 独自ドメインが未設定なら Workers の URL でもよい。
- 後でURLを変えたら再設定が必要。

## Step 3: Web Analytics token を設定する

ユーザーが Cloudflare の script を貼った場合は、`data-cf-beacon` の `token` だけを取り出す。

例:

```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "abc123"}'></script>
```

設定する値:

```text
abc123
```

`src/site.config.mjs` に設定する。

```js
export const CLOUDFLARE_WEB_ANALYTICS_TOKEN = "abc123";
```

詳しい取得手順は `references/cloudflare-web-analytics.md` を参照する。

## Step 4: 二重計測を避ける

Cloudflare 側で Web Analytics の自動挿入を有効にしている場合、コード側の script と重なって二重計測になる可能性がある。

初心者には短くこう伝える。

```text
Cloudflare 側で自動挿入を有効にしている場合は、二重計測になる可能性があります。このプロジェクトではコード側の設定で管理するのがおすすめです。
```

## Step 5: Cloudflare Workers 設定を確認する

`wrangler.jsonc` を確認する。

特に確認すること:

- `preview_urls` が有効のままになっていないこと。
- 公開用の名前や互換日付が意図通りであること。
- APIキー、パスワード、個人情報が入っていないこと。

`preview_urls` を有効にしたまま社外公開しない。

## Step 6: 動作確認する

必ず実行する。

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

生成HTML確認:

```bash
rg "cloudflareinsights|data-cf-beacon|<token-prefix>" dist/client
```

`<token-prefix>` は実際の token の先頭数文字に置き換える。

## Step 7: 完了報告する

初心者にわかりやすく短く報告する。

```text
公開用の設定をしました。

変更:
- SITE_URL を公開URLに設定
- Cloudflare Web Analytics token を設定

確認:
- npm run lint 成功
- npm run build 成功
- 生成HTMLに Cloudflare Web Analytics script が入っていることを確認済み

注意:
- Cloudflare 側で Web Analytics を自動挿入している場合は、二重計測にならないよう片方にしてください。
```

## Step 8: commit / push する

ユーザーが `pls`、「コミットして」、「pushして」と返したら実行する。

```bash
git add src/site.config.mjs wrangler.jsonc
git commit -m "Configure Cloudflare publish settings" \
  -m "Set the public site URL and Cloudflare analytics settings for deployment." \
  -m "Co-Authored-By: Mastra Code (openai/gpt-5.5) <noreply@mastra.ai>"
git push origin main
```

push 後は次だけ報告する。

- 最新コミットID
- リモートと同期済みか
- 未コミット変更の有無

## 注意

- Cloudflare の API token、ログイン情報、パスワードは聞かない。
- 独自ログイン機能は作らない。認証が必要なら Cloudflare Access を使う。
- 認証なしで社外公開できる構成を提案しない。
- GitHub リポジトリを Public にする提案はしない。
