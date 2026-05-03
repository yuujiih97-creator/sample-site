import { readFileSync } from "node:fs";

function readInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

const input = readInput();
const toolInput = input.tool_input ?? {};
const filePath = toolInput.file_path ?? toolInput.path ?? "";

if (!filePath) {
  process.exit(0);
}

const shouldRemind =
  /\.(astro|css|js|mjs|ts|json|jsonc|md|yml|yaml|toml)$/i.test(filePath) ||
  filePath.includes("/src/") ||
  filePath.endsWith("package.json");

if (shouldRemind) {
  process.stdout.write(
    `${JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext:
          "After changing project files, run npm run lint before finishing. If setup-related files changed, also run npm run hooks:run.",
      },
    })}\n`,
  );
}
