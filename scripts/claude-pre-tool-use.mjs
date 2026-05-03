import { readFileSync } from "node:fs";

function readInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

function respond(permissionDecision, permissionDecisionReason) {
  process.stdout.write(
    `${JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision,
        permissionDecisionReason,
      },
    })}\n`,
  );
}

const input = readInput();
const toolName = input.tool_name ?? "";
const toolInput = input.tool_input ?? {};
const filePath = toolInput.file_path ?? toolInput.path ?? "";
const command = toolInput.command ?? "";

if (/(\.env($|\.|\/)|\.pem$|\.key$|id_rsa$|id_ed25519$)/i.test(filePath)) {
  respond(
    "deny",
    "Do not edit secret files directly. Use Cloudflare Secrets or a local-only file that is not committed.",
  );
  process.exit(0);
}

if (
  toolName === "Bash" &&
  /\b(git\s+reset\s+--hard|git\s+checkout\s+--|rm\s+-rf|wrangler\s+deploy|npm\s+publish)\b/.test(
    command,
  )
) {
  respond(
    "ask",
    "This command can publish, delete, or discard work. Confirm the intent before running it.",
  );
  process.exit(0);
}
