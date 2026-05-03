// @ts-check

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import pagefind from "astro-pagefind";
import robotsTxt from "astro-robots-txt";
import { SITE_URL } from "./src/site.config.mjs";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: SITE_URL || undefined,
  integrations: [mdx(), sitemap(), pagefind(), robotsTxt()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Noto Sans JP",
      cssVariable: "--font-noto-sans-jp",
      fallbacks: ["sans-serif"],
      weights: [400, 700],
      subsets: ["japanese", "latin"],
    },
    {
      provider: fontProviders.local(),
      name: "Atkinson",
      cssVariable: "--font-atkinson",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/atkinson-regular.woff"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/atkinson-bold.woff"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],
});
