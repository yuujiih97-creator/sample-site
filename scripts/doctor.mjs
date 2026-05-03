import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const gitCommand = isWindows ? "git.exe" : "git";
const requiredNode = [22, 12, 0];
const checks = [];

function versionAtLeast(current, required) {
  for (let index = 0; index < required.length; index += 1) {
    if ((current[index] ?? 0) > required[index]) {
      return true;
    }
    if ((current[index] ?? 0) < required[index]) {
      return false;
    }
  }

  return true;
}

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });
}

function pass(name, detail = "") {
  checks.push({ status: "pass", name, detail });
}

function warn(name, detail) {
  checks.push({ status: "warn", name, detail });
}

function fail(name, detail) {
  checks.push({ status: "fail", name, detail });
}

function commandVersion(name, command, args) {
  const result = run(command, args);

  if (result.error || result.status !== 0) {
    fail(name, "Not found. Install it, then run npm run doctor again.");
    return;
  }

  pass(name, result.stdout.trim() || result.stderr.trim());
}

function fileExists(name, path) {
  if (existsSync(path)) {
    pass(name, path);
  } else {
    fail(name, `${path} is missing.`);
  }
}

console.log("Project doctor started.");
console.log("");

const currentNode = process.versions.node.split(".").map(Number);
if (versionAtLeast(currentNode, requiredNode)) {
  pass("Node.js", process.versions.node);
} else {
  fail(
    "Node.js",
    `${process.versions.node} is too old. Install 22.12.0 or newer.`,
  );
}

commandVersion("npm", npmCommand, ["--version"]);
commandVersion("Git", gitCommand, ["--version"]);

fileExists("package.json", "package.json");
fileExists("Astro config", "astro.config.mjs");
fileExists("Biome config", "biome.json");
fileExists("secretlint config", ".secretlintrc.json");
fileExists("prek config", "prek.toml");
fileExists("Claude rules", "CLAUDE.md");

const requiredBins = ["astro", "biome", "prek", "secretlint"];
const binExt = isWindows ? ".cmd" : "";

if (!existsSync("node_modules")) {
  warn("npm packages", "node_modules is missing. Run npm run setup.");
} else {
  pass("npm packages", "node_modules exists.");
}

for (const bin of requiredBins) {
  const path = `node_modules/.bin/${bin}${binExt}`;
  if (existsSync(path)) {
    pass(`${bin} command`, path);
  } else {
    warn(`${bin} command`, `${path} is missing. Run npm install.`);
  }
}

const projectRules = run(npmCommand, ["run", "check:project-rules"]);
if (projectRules.status === 0) {
  pass("Project safety rules", "passed");
} else {
  fail(
    "Project safety rules",
    (projectRules.stderr || projectRules.stdout || "failed").trim(),
  );
}

console.log("");
for (const check of checks) {
  const mark =
    check.status === "pass"
      ? "[OK]"
      : check.status === "warn"
        ? "[WARN]"
        : "[NG]";
  console.log(
    `${mark} ${check.name}${check.detail ? `: ${check.detail}` : ""}`,
  );
}

const failures = checks.filter((check) => check.status === "fail");
const warnings = checks.filter((check) => check.status === "warn");

console.log("");
if (failures.length > 0) {
  console.error("Doctor found problems that must be fixed.");
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(
    "Doctor finished with warnings. Run npm run setup if commands are missing.",
  );
  process.exit(0);
}

console.log("Doctor finished. This project is ready to run.");
