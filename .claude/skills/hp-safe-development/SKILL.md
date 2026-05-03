---
name: hp-safe-development
description: "HP制作やページ修正を安全に行う。公開構成、認証、秘密情報、初心者向け説明を確認しながら作業する。"
---

# HP Safe Development

HP制作やページ修正をするときに使うスキルです。

## 必ず守ること

- 構成は Astro.js、Cloudflare Workers、Cloudflare D1、Cloudflare Access を前提にする。
- この構成で難しい場合は、エンジニアへの相談を勧める。
- APIキー、パスワード、トークン、個人情報、未公開情報をリポジトリに入れない。
- 独自のパスワード認証やメール認証を実装しない。
- 社外公開前に Cloudflare Access と `preview_urls: false` を確認する。
- 説明は非エンジニア向けに短く、専門用語を避ける。

## 作業後

- `npm run lint` を実行する。
- セットアップやhookを変更した場合は `npm run hooks:run` も実行する。
