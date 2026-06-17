import { readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../..");
const outputDir = resolve(rootDir, "playwright-results");
const fullMatrix = process.env.MIDDLETOWN_MATRIX_FULL === "1";

const cases = [
  { id: "normal-civic-a", difficulty: "normal", seed: "civic-a", turns: fullMatrix ? 100 : 36 },
  { id: "normal-civic-b", difficulty: "normal", seed: "civic-b", turns: fullMatrix ? 100 : 36 },
  { id: "hard-winter-a", difficulty: "hard", seed: "bad-winter-a", turns: fullMatrix ? 100 : 64 },
];

function runCase(testCase) {
  return new Promise((resolveCase, rejectCase) => {
    const child = spawn(process.execPath, ["tests/playwright/runMiddletownRlPlaytest.mjs"], {
      cwd: rootDir,
      env: {
        ...process.env,
        MIDDLETOWN_RL_DIFFICULTY: testCase.difficulty,
        MIDDLETOWN_RL_SEED: testCase.seed,
        MIDDLETOWN_RL_TURNS: String(testCase.turns),
        MIDDLETOWN_RL_OUTPUT: `middletown-grading-${testCase.id}.md`,
      },
      stdio: "inherit",
    });

    child.on("error", rejectCase);
    child.on("exit", (code) => {
      if (code === 0) {
        resolveCase();
      } else {
        rejectCase(new Error(`${testCase.id} failed with exit code ${code}`));
      }
    });
  });
}

function matchLine(markdown, pattern, fallback = "missing") {
  return markdown.match(pattern)?.[1] ?? fallback;
}

async function summarizeCase(testCase) {
  const outputFile = resolve(outputDir, `middletown-grading-${testCase.id}.md`);
  const markdown = await readFile(outputFile, "utf8");
  return {
    ...testCase,
    grade: matchLine(markdown, /Final Grade: \*\*(.*?)\*\*/),
    result: matchLine(markdown, /Result: \*\*(.*?)\*\*/),
    turns: matchLine(markdown, /Turns played: \*\*(.*?)\*\*/),
    agency: matchLine(markdown, /Agency Score: \*\*(.*?)\*\*/),
    actions: matchLine(markdown, /Visible agenda actions: \*\*(.*?)\*\*/),
    final: matchLine(markdown, /- Final summary: (.*)/),
    victory: matchLine(markdown, /- Victory screen visible: (.*)/),
  };
}

const completed = [];
for (const testCase of cases) {
  await runCase(testCase);
  completed.push(await summarizeCase(testCase));
}

const summary = [
  "# Middletown Seeded RL Matrix",
  "",
  `Mode: ${fullMatrix ? "full 100-quarter matrix" : "short stress matrix"}`,
  "",
  "| Case | Difficulty | Seed | Turns | Result | Grade | Agency | Actions | Victory | Final Summary |",
  "| --- | --- | --- | ---: | --- | --- | --- | ---: | --- | --- |",
  ...completed.map((item) => `| ${item.id} | ${item.difficulty} | ${item.seed} | ${item.turns} | ${item.result} | ${item.grade} | ${item.agency} | ${item.actions} | ${item.victory} | ${item.final} |`),
  "",
  "PowerShell full run: `$env:MIDDLETOWN_MATRIX_FULL=\"1\"; npm run playtest:rl:matrix` for three full 100-quarter seeded runs.",
  "",
].join("\n");

await writeFile(resolve(outputDir, "middletown-rl-matrix.md"), summary, "utf8");
console.log(`RL matrix complete: ${resolve(outputDir, "middletown-rl-matrix.md")}`);
