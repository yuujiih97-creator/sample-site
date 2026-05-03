import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const patchedOgCanvasDir = ".astro/astro-og-canvas";
await mkdir(patchedOgCanvasDir, { recursive: true });

for (const file of await readdir("node_modules/astro-og-canvas/dist")) {
  if (!file.endsWith(".js")) continue;

  const source = await readFile(
    `node_modules/astro-og-canvas/dist/${file}`,
    "utf-8",
  );
  const patched = source
    .replaceAll("'./assetLoaders'", "'./assetLoaders.js'")
    .replaceAll("'./cache'", "'./cache.js'")
    .replaceAll("'./queue'", "'./queue.js'")
    .replaceAll("'./shorthash'", "'./shorthash.js'")
    .replaceAll("'./routing'", "'./routing.js'")
    .replaceAll("'./generateOpenGraphImage'", "'./generateOpenGraphImage.js'");
  await writeFile(`${patchedOgCanvasDir}/${file}`, patched);
}

const { generateOpenGraphImage } = await import(
  "../.astro/astro-og-canvas/generateOpenGraphImage.js"
);
const siteConfig = await import("../src/site.config.mjs");
const outputDir = "public/og";

function readFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.match(/^([A-Za-z0-9_]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.replace(/^['"]|['"]$/g, "")]),
  );
}

async function getBlogPages() {
  const blogDir = "src/content/blog";
  const files = await readdir(blogDir);
  const pages = [];

  for (const file of files) {
    if (![".md", ".mdx"].includes(extname(file))) continue;

    const content = await readFile(join(blogDir, file), "utf-8");
    const data = readFrontmatter(content);
    pages.push({
      slug: `blog/${basename(file, extname(file))}`,
      title: data.title,
      description: data.description,
    });
  }

  return pages;
}

function getImageOptions(page) {
  return {
    title: page.title,
    description: page.description,
    bgGradient: [
      [26, 54, 93],
      [79, 136, 190],
    ],
    border: {
      width: 0,
    },
    padding: 72,
    fonts: [
      "./src/assets/fonts/noto-sans-jp-japanese-700-normal.ttf",
      "./src/assets/fonts/noto-sans-jp-japanese-400-normal.ttf",
    ],
    font: {
      title: {
        families: ["Noto Sans JP Thin"],
        size: 68,
        weight: "Bold",
        lineHeight: 1.15,
      },
      description: {
        families: ["Noto Sans JP Thin"],
        size: 34,
        weight: "Normal",
        lineHeight: 1.5,
      },
    },
  };
}

const pages = [
  {
    slug: "index",
    title: siteConfig.SITE_TITLE,
    description: siteConfig.SITE_DESCRIPTION,
  },
  {
    slug: "blog/index",
    title: `ブログ — ${siteConfig.SITE_TITLE}`,
    description: "投稿一覧",
  },
  ...(await getBlogPages()),
];

await mkdir(outputDir, { recursive: true });
await mkdir(join(outputDir, "blog"), { recursive: true });

for (const page of pages) {
  const image = await generateOpenGraphImage(getImageOptions(page));
  await writeFile(join(outputDir, `${page.slug}.png`), image);
}

console.log(`Generated ${pages.length} OG images.`);
