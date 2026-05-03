# Cloudflare Web Analytics reference

## Official pages

- Get started: https://developers.cloudflare.com/web-analytics/get-started/
- Cloudflare Dashboard: https://dash.cloudflare.com/

## What the user needs from Cloudflare

Cloudflare Web Analytics provides a small JavaScript snippet like this:

```html
<!-- Cloudflare Web Analytics -->
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
></script>
<!-- End Cloudflare Web Analytics -->
```

For this project, only the `token` value is copied into `src/site.config.mjs`.

## Dashboard steps

1. Open https://dash.cloudflare.com/
2. Open **Web Analytics**.
3. Select **Add a site**.
4. Enter or select the production hostname.
5. Choose JS snippet/manual installation if Cloudflare offers a choice.
6. Copy the snippet.
7. Extract the value inside `data-cf-beacon` → `token`.

## Important note about double counting

If Cloudflare automatically injects Web Analytics and the project also includes the script, page views may be counted twice. For this project, prefer project-side control through `CLOUDFLARE_WEB_ANALYTICS_TOKEN` so the setting is visible in source configuration.
