# Markup adjustment reference

ヒアリング後に行うマークアップ調整の参考。

## 対象になりやすいファイル

- `DESIGN.md`
  - デザイン方針
  - 参考URL・画像
  - 作成するページやセクション
- `src/site.config.mjs`
  - `SITE_TITLE`
  - `SITE_DESCRIPTION`
- `src/pages/index.astro`
  - トップページの構成
- `src/components/Header.astro`
  - ナビゲーション
- `src/components/Footer.astro`
  - フッター
- `src/styles/global.css`
  - 全体の見た目
- `src/content/blog/`
  - ブログ記事サンプル

## 作業方針

- 既存の Astro 構成を崩さない。
- まずトップページとナビゲーションを整える。
- ユーザーが希望したページやセクションだけ作る。
- 初心者向けなので、複雑なCMS、独自認証、問い合わせフォームは追加しない。
- デザイン参考URLや画像がある場合は、雰囲気だけ参考にし、コピーしない。

## 説明文の作り方

ユーザーの「どんなサイトにしますか？」への回答から、短い説明文を作る。

例:

- 回答: `美容室のサイト。お知らせとメニューを載せたい。`
- `SITE_DESCRIPTION`: `お知らせやメニューを掲載する美容室サイトです。`

- 回答: `日記と技術メモを書きたい。`
- `SITE_DESCRIPTION`: `日々の記録や技術メモをまとめる個人ブログです。`

## 確認

マークアップ調整後は必ず実行する。

```bash
npm run lint
npm run build
```

セットアップや hook を変更した場合だけ、追加で実行する。

```bash
npm run hooks:run
```
