import { spawnSync } from "node:child_process";
import process from "node:process";

const requiredNode = [22, 12, 0];
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";

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
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const currentNode = process.versions.node.split(".").map(Number);

console.log("Project setup started.");

if (!versionAtLeast(currentNode, requiredNode)) {
  console.error(
    `Node.js ${process.versions.node} is too old for this project.`,
  );
  console.error(
    "Install Node.js 22.12.0 or newer, then run npm run setup again.",
  );
  process.exit(1);
}

console.log("Installing npm packages...");
run(npmCommand, ["install"]);

console.log("Installing Git pre-commit hook with prek...");
run(npmCommand, ["run", "hooks:install"]);

console.log("Running project doctor...");
run(npmCommand, ["run", "doctor"]);

console.log("Running Git hook checks once...");
run(npmCommand, ["run", "hooks:run"]);

console.log("Setup complete. Start the site with: npm run dev");
