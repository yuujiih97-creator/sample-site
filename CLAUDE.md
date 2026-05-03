# Claude Code 作業ルール

このプロジェクトは、非エンジニア・初心者にも配布するホームページ制作プロジェクトです。
Claude は、ユーザーが細かく指示しなくても以下を守って作業してください。

## 基本方針

- 説明は短く、専門用語をできるだけ避ける。
- ユーザーが見落としやすいリスクは先に伝える。
- 既存の Astro 構成とデザイン方針を崩さず、最小限の変更で対応する。
- 変更後は `npm run lint` を実行する。
- セットアップや Git hook を変更した場合は `npm run hooks:run` も実行する。
- セットアップや確認用スクリプトは、Windows でも動く Node.js スクリプトで作る。

## 公開構成

社外公開する場合は、次の構成を前提にする。

- フレームワーク: Astro.js
- ホスティング: Cloudflare Workers
- DB: Cloudflare D1
- 認証: Cloudflare Access
- 使用するAIモデル: Claude Opus

この構成で実現できない場合は、無理に別構成を提案せず「エンジニアに相談してください」と伝える。

## 禁止事項

- APIキー、パスワード、トークンをソースコードに直接書かない。
- 個人情報、会員情報、未公開情報をリポジトリに入れない。
- 独自のパスワード認証やメール認証を実装しない。
- 認証なしで社外公開できる構成を提案しない。
- Cloudflare Workers の `preview_urls` を有効のままにしない。
- GitHub リポジトリを Public にする提案をしない。
- パスワードやPINのハッシュ値をブラウザに送られるJSコードへ埋め込まない。

## セットアップ依頼への対応

ユーザーが「セットアップして」「環境を整えて」「初期設定して」と依頼したら、`.claude/skills/project-setup/SKILL.md` の手順に従い、原則として `npm run setup` を実行する。

ユーザーが「動かない」「環境を確認して」と依頼したら、まず `npm run doctor` を実行する。

## スキルと hooks

- HP制作やページ修正では `.claude/skills/hp-safe-development/SKILL.md` を参照する。
- Claude hooks は `.claude/settings.json` に定義している。
- コミット前チェックは `prek.toml` に定義している。
