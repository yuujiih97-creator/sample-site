# libe-hp

Astro.js と Cloudflare Workers を使ったホームページ制作プロジェクトです。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ts-76/libe-hp)

このボタンは、Cloudflare アカウントにログインして、このテンプレートを Workers にデプロイするための入口です。公開前に `src/site.config.mjs` の `SITE_URL` と、必要に応じて `CLOUDFLARE_WEB_ANALYTICS_TOKEN` を設定してください。

## はじめに

このプロジェクトは、非エンジニア・初心者でも同じ手順で作業を始められるようにしています。

Claude Code を使っている場合は、次のように依頼してください。

```text
セットアップして
```

Claude が `npm run setup` を実行して、必要なパッケージのインストールと Git hook の設定を行います。

## 自分でセットアップする場合

必要なもの:

- Node.js 22.12.0 以上
- npm
- Git

ターミナルで次を実行して、`v22.12.0` 以上が表示されれば大丈夫です。

```sh
node -v
```

手順:

```sh
npm run setup
```

うまく動かないときは、次のコマンドで不足しているものを確認できます。

```sh
npm run doctor
```

セットアップが終わったら、次のコマンドでサイトを起動できます。

```sh
npm run dev
```

表示された `localhost` のURLをブラウザで開くと、サイトを確認できます。

## 最初に変更する場所

サイト名、説明文、公開URLは `src/site.config.mjs` にまとめています。

Claude Code を使っている場合は、次のように依頼できます。

```text
サイト名を「〇〇」に変えて
```

公開URLは、本番で使うドメインが決まってから変更してください。

## よく使うコマンド

| コマンド | 内容 |
| :-- | :-- |
| `npm run setup` | 初回セットアップを行う |
| `npm run doctor` | このプロジェクトを動かす準備ができているか確認する |
| `npm run dev` | 開発用サーバーを起動する |
| `npm run build` | 公開前のビルド確認をする |
| `npm run lint` | コードと秘密情報の混入を確認する |
| `npm run lint:fix` | 自動修正できる問題を直す |
| `npm run hooks:install` | `prek` の Git hook を入れる |
| `npm run hooks:run` | Git hook のチェックを全ファイルに実行する |

## 自動チェック

このプロジェクトでは `prek` を使って、コミット前に次のチェックを自動実行します。

- プロジェクト固有の安全チェック
- Biome によるコードチェック
- secretlint による秘密情報チェック

通常は `npm run setup` を一度実行すれば、コミット前チェックも自動で入ります。

`setup` や `doctor` は Node.js で書いているため、macOS、Windows、Linux で同じコマンドを使えます。

## 安全ルール

- APIキー、パスワード、トークンはコードに書かないでください。
- 個人情報、会員情報、未公開情報をリポジトリに入れないでください。
- 認証が必要な場合は、独自ログインではなく Cloudflare Access を使います。
- Cloudflare Workers で公開する場合、`preview_urls` は有効にしないでください。
- お問い合わせフォームは、個人情報・スパム対策・通知方法を決める必要があるため、初心者だけで無理に作らずエンジニアに相談してください。
- 判断に迷う情報を扱う場合は、エンジニアに相談してください。

## 公開時の前提

社外公開する場合は、次の構成を前提にします。

- フレームワーク: Astro.js
- ホスティング: Cloudflare Workers
- DB: Cloudflare D1
- 認証: Cloudflare Access

この構成で実現できない場合は、無理に進めずエンジニアに相談してください。

Cloudflare Workers 用の設定は `wrangler.jsonc` にあります。公開前に、必ず `preview_urls: false` になっていることを確認してください。

## Cloudflare で無料でできるサイト防御

Cloudflare には、無料でも使えるサイト防御があります。

ただし、多くの設定は `wrangler.jsonc` ではなく、Cloudflare の管理画面で行います。`wrangler.jsonc` は Workers の公開設定、Cloudflare の管理画面はサイト全体の防御設定、と考えてください。

### まず確認すること

Cloudflare で公開する前に、次を確認してください。

| 確認すること | 場所 | 目的 |
| :-- | :-- | :-- |
| DNS の Proxy status を `Proxied` にする | Cloudflare 管理画面 → DNS | Cloudflare の防御を通すため |
| SSL/TLS を `Full (strict)` にする | Cloudflare 管理画面 → SSL/TLS | 通信を安全にするため |
| WAF Free Managed Ruleset を有効にする | Cloudflare 管理画面 → Security → WAF | よくある攻撃を防ぐため |
| 不要なアクセスを WAF Custom Rules で止める | Cloudflare 管理画面 → Security → WAF | WordPress 狙いなどの不要なアクセスを止めるため |
| Bot Fight Mode は必要に応じて有効にする | Cloudflare 管理画面 → Security → Bots | 単純な bot アクセスを減らすため |
| `preview_urls: false` を確認する | `wrangler.jsonc` | 確認用URLが外部に出たままにならないようにするため |

### 初心者向けのおすすめ設定

最初は、次の設定だけで十分です。

1. DNS の Proxy status を `Proxied` にする
2. SSL/TLS を `Full (strict)` にする
3. WAF Free Managed Ruleset を有効にする
4. `wrangler.jsonc` の `preview_urls: false` を確認する

この4つは、サイトの見た目や記事の書き方には影響しにくく、無料で始めやすい設定です。

### WAF Custom Rules で止めたいアクセス

Astro のサイトでは、WordPress 用のURLや秘密ファイルへのアクセスは不要です。Cloudflare の WAF Custom Rules で、次のようなアクセスを止めると安全性が上がります。

例:

```text
/wp-admin
/wp-login.php
/xmlrpc.php
/.env
/.git
```

迷った場合は、無理に細かく設定せずエンジニアに相談してください。

### 注意が必要な設定

Bot Fight Mode は便利ですが、外部サービスや自動チェックのアクセスまで止めてしまうことがあります。問題が起きたら無効にしてください。

お問い合わせフォーム、ログイン画面、管理画面を追加する場合は、追加の対策が必要です。

- フォームを作る場合: Cloudflare Turnstile などでスパム対策をする
- 管理画面を作る場合: 独自ログインではなく Cloudflare Access で守る
- 個人情報を扱う場合: 保存方法、通知方法、削除方法を決める

このテンプレートでは、安全のためお問い合わせフォームは含めていません。必要な場合は、初心者だけで無理に作らずエンジニアに相談してください。

サイト内検索には Pagefind を使っています。Cloudflare Workers へデプロイしたあと、検索欄に記事タイトルや本文の言葉を入れて、検索結果が表示されるか確認してください。もし本番環境で検索できない場合は、エンジニアに相談してください。

## Claude 用の補助設定

Claude Code 用に、次の設定を含めています。

- `.claude/settings.json`: 危険な操作や秘密情報ファイルの編集を止める hooks
- `.claude/skills/project-setup/SKILL.md`: 「セットアップして」と依頼された時の手順
- `.claude/skills/hp-safe-development/SKILL.md`: HP制作時の安全ルール

Claude に作業を頼む場合は、専門的な手順を細かく指示しなくても、まず「セットアップして」「トップページを直して」のように依頼できます。
