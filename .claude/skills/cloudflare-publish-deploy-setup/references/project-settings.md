# Publish settings reference

## File to edit

`src/site.config.mjs`

Current pattern:

```js
export const SITE_TITLE = "sample-site";
export const SITE_DESCRIPTION = "サイトの説明文を入れてください。";
export const SITE_URL = "https://sample-site.ts-createlink-934.workers.dev";
export const CLOUDFLARE_WEB_ANALYTICS_TOKEN = "";
```

## Publish-stage settings checklist

| Setting | Meaning | Example | When to set |
| --- | --- | --- | --- |
| `SITE_URL` | Public production URL | `https://example.com` | Publish/deploy stage |
| `CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Cloudflare Web Analytics token extracted from snippet | `e74f61d4ec0d4a6fa903b6e13e820e47` | Publish/deploy stage |

## Not handled in this publish skill

These are content/development settings. Handle them in `beginner-site-development-flow` instead.

| Setting | Meaning |
| --- | --- |
| `SITE_TITLE` | Site name shown in metadata and UI |
| `SITE_DESCRIPTION` | Short site description for metadata |

## SITE_URL rules

- Use the real public URL.
- Do not add a trailing slash.
- If the custom domain is not ready yet, a Cloudflare Workers URL is acceptable temporarily.
- If the URL changes later, update `SITE_URL` and rebuild.

## Verification commands

Run after editing settings:

```bash
npm run lint
npm run build
```

If formatting fails:

```bash
npm run lint:fix
npm run lint
npm run build
```

Confirm generated HTML includes the analytics beacon:

```bash
rg "cloudflareinsights|data-cf-beacon|<token-prefix>" dist/client
```

Replace `<token-prefix>` with the first few characters of the actual token.
