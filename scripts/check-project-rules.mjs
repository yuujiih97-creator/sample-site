import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";

const errors = [];

function stagedFiles() {
  try {
    const output = execFileSync(
      "git",
      ["diff", "--cached", "--name-only", "--diff-filter=ACMR"],
      { encoding: "utf8" },
    );
    return output.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function fileText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

const staged = stagedFiles();
const secretFilePatterns = [
  /^\.env($|\.)/,
  /(^|\/)\.env($|\.)/,
  /\.(pem|key|p12|pfx)$/i,
  /(^|\/)id_rsa$/i,
  /(^|\/)id_ed25519$/i,
];

for (const file of staged) {
  if (secretFilePatterns.some((pattern) => pattern.test(file))) {
    errors.push(`${file}: secrets or private keys must not be committed.`);
  }
}

const wranglerFiles = [
  "wrangler.json",
  "wrangler.jsonc",
  "wrangler.toml",
].filter((file) => existsSync(file));

for (const file of wranglerFiles) {
  const text = fileText(file);
  if (/preview_urls\s*[:=]\s*true/i.test(text)) {
    errors.push(`${file}: Cloudflare Workers preview_urls must be false.`);
  }
}

const packageText = existsSync("package.json") ? fileText("package.json") : "";
const riskyAuthPackages = [
  "next-auth",
  "@auth/core",
  "passport",
  "jsonwebtoken",
  "bcrypt",
];

for (const name of riskyAuthPackages) {
  if (packageText.includes(`"${name}"`)) {
    errors.push(
      `package.json: ${name} may indicate custom authentication. Use Cloudflare Access unless an engineer approves the change.`,
    );
  }
}

for (const file of staged) {
  const name = basename(file).toLowerCase();
  if (name.startsWith(".secretlint")) {
    continue;
  }

  if (
    name.includes("password") ||
    name.includes("secret") ||
    name.includes("token")
  ) {
    errors.push(
      `${file}: sensitive-looking file names should not be committed.`,
    );
  }
}

if (errors.length > 0) {
  console.error("Project safety check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Project safety check passed.");
