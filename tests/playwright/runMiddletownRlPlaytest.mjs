import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DIFFICULTIES } from "../../src/config/cityConfig.js";
import { CIVIC_ACTIONS, CIVIC_MICRO_ACTIONS } from "../../src/data/civicActions.js";
import { POLICIES } from "../../src/data/policies.js";
import { CAPITAL_PROJECTS } from "../../src/data/projects.js";
import {
  chooseAgendaAction,
  gradePlaythrough,
  parseMetricText,
  scoreOptionText,
  summarizeMetrics,
} from "./rlPolicy.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../..");
const outputDir = resolve(rootDir, "playwright-results");
const outputPath = resolve(outputDir, process.env.MIDDLETOWN_RL_OUTPUT ?? "middletown-grading-sheet.md");
const defaultUrl = process.env.MIDDLETOWN_URL ?? "http://127.0.0.1:5175/";
const targetTurns = Number(process.env.MIDDLETOWN_RL_TURNS ?? 100);
const targetDifficulty = process.env.MIDDLETOWN_RL_DIFFICULTY ?? "normal";
const randomSeed = process.env.MIDDLETOWN_RL_SEED ?? "middletown-default";
const visibleStarterBudgets = ["Mayor's Office", "Finance", "Police", "Fire and EMS", "Public Works", "Housing Office"];

function rotatingItems(items, start, count) {
  if (!items.length) return [];
  return Array.from({ length: Math.min(count, items.length) }, (_, index) => items[(start + index) % items.length]);
}

function displayActionLabel(label) {
  return label.replace(/\s+initiative\s+\d+$/i, "");
}

function visibleAgendaActions(turn, usedActionIds) {
  const unused = CIVIC_ACTIONS.filter((action) => !usedActionIds.has(action.id));
  const pool = unused.length >= 6 ? unused : CIVIC_ACTIONS;
  const largeAgenda = rotatingItems(pool, ((turn - 1) * 3) % pool.length, 6);
  const smallWins = rotatingItems(CIVIC_MICRO_ACTIONS, (turn - 1) % CIVIC_MICRO_ACTIONS.length, 2)
    .filter((action) => !usedActionIds.has(action.id));
  return [...smallWins, ...largeAgenda];
}

function visibleProjects(turn, usedProjectIds) {
  const pool = CAPITAL_PROJECTS.filter((project) => !usedProjectIds.has(project.id));
  return rotatingItems(pool, ((turn - 1) * 2) % Math.max(1, pool.length), 3);
}

function visiblePolicies(turn, activePolicyIds) {
  const pool = POLICIES.filter((policy) => !activePolicyIds.has(policy.id));
  return rotatingItems(pool, (turn - 1) % Math.max(1, pool.length), 2);
}

async function importPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    throw new Error(`Playwright is not available. Install it or run from the parent workspace that already has Playwright. ${error.message}`);
  }
}

async function launchBrowser(chromium) {
  const attempts = [
    { label: "bundled Chromium", options: { headless: true } },
    { label: "Microsoft Edge", options: { headless: true, channel: "msedge" } },
    { label: "Google Chrome", options: { headless: true, channel: "chrome" } },
  ];

  const failures = [];
  for (const attempt of attempts) {
    try {
      const browser = await chromium.launch(attempt.options);
      return { browser, label: attempt.label };
    } catch (error) {
      failures.push(`${attempt.label}: ${error.message.split("\n")[0]}`);
    }
  }

  throw new Error(`Could not launch a browser.\n${failures.join("\n")}`);
}

async function assertServerAvailable(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Middletown is not reachable at ${url}. Start it with: npm run dev -- --host 127.0.0.1 --port 5175\n${error.message}`);
  }
}

async function readHeaderMetrics(page) {
  const tileTexts = await page.locator(".metric-tile").allTextContents();
  return tileTexts.reduce((metrics, text) => ({ ...metrics, ...parseMetricText(text) }), {});
}

async function bestVisibleOption(page) {
  const options = await page.locator(".event-option").all();
  if (!options.length) return null;

  let best = { option: options[0], score: Number.NEGATIVE_INFINITY, text: "" };
  for (const option of options) {
    const text = await option.innerText();
    const score = scoreOptionText(text);
    if (score > best.score) {
      best = { option, score, text };
    }
  }
  return best;
}

async function chooseBestEventOption(page, trace, turn, label) {
  const option = await bestVisibleOption(page);
  if (!option) return false;
  const firstLine = option.text.split(/\r?\n/).find(Boolean) ?? label;
  await option.option.click();
  trace.push({ turn, label: `${label}: ${firstLine}` });
  return true;
}

async function installSeededRandom(page, seed) {
  await page.addInitScript((seedValue) => {
    function hashString(value) {
      let hash = 2166136261;
      for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0;
    }

    function mulberry32(seedNumber) {
      return function random() {
        let t = seedNumber += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    Math.random = mulberry32(hashString(String(seedValue)));
  }, seed);
}

async function startGame(page) {
  await page.goto(defaultUrl, { waitUntil: "networkidle" });
  const difficulty = DIFFICULTIES[targetDifficulty] ? targetDifficulty : "normal";
  await page.getByRole("button", { name: new RegExp(DIFFICULTIES[difficulty].label, "i") }).click();
  await page.waitForLoadState("networkidle");

  if (await page.locator(".voice-log-item").first().isVisible().catch(() => false)) {
    await page.locator(".voice-log-item").first().click();
  }
  if (await page.getByLabel("Skip orientation").isVisible().catch(() => false)) {
    await page.getByLabel("Skip orientation").click();
  }
}

async function stabilizeStarterBudget(page, eventTrace) {
  await page.getByRole("button", { name: /^Money$/i }).click();
  await page.waitForTimeout(250);
  const starterFloor = targetDifficulty === "hard" ? "9" : "6";

  for (const label of visibleStarterBudgets) {
    const input = page.getByLabel(`${label} budget`);
    if (await input.isVisible().catch(() => false)) {
      await input.fill(starterFloor);
    }
  }

  eventTrace.push({ turn: 1, label: `Money: set starter department budgets to ${starterFloor} for long-term play` });
}

async function startUsefulProject(page, turn, metrics, usedProjectIds, projectTrace, eventTrace) {
  if ((metrics.budget ?? 0) < 32 || projectTrace.length >= 8 || !(turn === 1 || turn % 8 === 0)) return;
  const projects = visibleProjects(turn, usedProjectIds);
  const chosen = projects.find((project) => ["infrastructure", "utilities", "mobility", "safety", "emergency"].includes(project.domain)) ?? projects[0];
  if (!chosen) return;
  const card = page.locator(".action-card").filter({ hasText: chosen.name }).first();
  if (await card.count()) {
    await card.getByRole("button", { name: /Start Project/i }).click();
    usedProjectIds.add(chosen.id);
    projectTrace.push({ turn, id: chosen.id, label: chosen.name });
    eventTrace.push({ turn, label: `Project: started ${chosen.name}` });
  }
}

async function adoptUsefulPolicy(page, turn, metrics, activePolicyIds, policyTrace, eventTrace) {
  if ((metrics.budget ?? 0) < 26 || policyTrace.length >= 4 || !(turn === 2 || turn % 12 === 0)) return;
  const policies = visiblePolicies(turn, activePolicyIds);
  const chosen = policies.find((policy) => ["budget", "infrastructure", "communications", "mobility"].includes(policy.domain)) ?? policies[0];
  if (!chosen) return;
  const card = page.locator(".action-card").filter({ hasText: chosen.name }).first();
  if (await card.count()) {
    await card.getByRole("button", { name: /Adopt Policy/i }).click();
    activePolicyIds.add(chosen.id);
    policyTrace.push({ turn, id: chosen.id, label: chosen.name });
    eventTrace.push({ turn, label: `Policy: adopted ${chosen.name}` });
  }
}

async function applyOversightTools(page, turn, metrics, eventTrace) {
  if (turn % 18 === 0 && (metrics.budget ?? 0) >= 24) {
    const audit = page.getByRole("button", { name: /Run Audit/i });
    if (await audit.isVisible().catch(() => false)) {
      await audit.click();
      eventTrace.push({ turn, label: "Oversight: ran public audit before records pressure hardened" });
    }
  }

  if ((turn === 49 || turn === 57 || turn === 65) && (metrics.budget ?? 0) >= 34) {
    const emergency = page.getByRole("button", { name: /Declare Emergency/i });
    if (await emergency.isVisible().catch(() => false)) {
      await emergency.click();
      eventTrace.push({ turn, label: "Oversight: declared emergency for seasonal service pressure" });
    }
  }
}

async function playQuarter(page, turn, usedActionIds, usedProjectIds, activePolicyIds, actionTrace, projectTrace, policyTrace, eventTrace) {
  const before = await readHeaderMetrics(page);
  await page.getByRole("button", { name: /^Choices$/i }).click();
  await page.locator(".action-card").first().waitFor({ state: "visible", timeout: 5000 }).catch(() => {});

  const visibleActions = visibleAgendaActions(turn, usedActionIds);
  const needsAgency = actionTrace.length < Math.min(24, Math.ceil(targetTurns / 4));
  const agendaCadence = turn <= 12 || turn % 2 === 0 || needsAgency;
  const budgetFloor = turn > 70 ? 24 : turn > 40 ? 30 : 28;
  const canAffordAgenda = agendaCadence && (before.budget ?? 0) >= budgetFloor;
  const chosen = canAffordAgenda ? chooseAgendaAction({ metrics: before, availableActions: visibleActions, usedActionIds }) : null;
  const civicCushion = (before.trust ?? 0) >= 80 && (before.services ?? 0) >= 80 && (before.debt ?? 0) <= 66;
  const rewardFloor = civicCushion ? -12 : (before.debt ?? 0) > 68 ? -2 : turn > 40 || (before.trust ?? 0) < 45 ? -6 : -8;
  const lateAgencyRisk = civicCushion && turn >= 60 && (before.budget ?? 0) >= 32 && (chosen?.expectedReward ?? 0) > -13;
  if (chosen && (chosen.expectedReward > rewardFloor || lateAgencyRisk)) {
    const visibleLabel = displayActionLabel(chosen.label);
    const actionCard = page.locator(".action-card").filter({ hasText: visibleLabel }).first();
    if (await actionCard.count()) {
      await actionCard.getByRole("button", { name: /Put on Agenda/i }).click();
      usedActionIds.add(chosen.id);
      actionTrace.push({
        turn,
        id: chosen.id,
        label: visibleLabel,
        expectedReward: chosen.expectedReward,
        reason: chosen.reason,
      });
    } else {
      eventTrace.push({ turn, label: `Choices: RL wanted ${chosen.label}, but the card was not visible` });
    }
  } else {
    eventTrace.push({ turn, label: canAffordAgenda ? `Choices: skipped ${chosen?.label ?? "agenda"} because it missed the reward floor` : `Choices: skipped agenda spending because budget was below the ${budgetFloor}-point RL safety floor` });
  }

  const afterAgenda = await readHeaderMetrics(page);
  await startUsefulProject(page, turn, afterAgenda, usedProjectIds, projectTrace, eventTrace);
  const afterProject = await readHeaderMetrics(page);
  await adoptUsefulPolicy(page, turn, afterProject, activePolicyIds, policyTrace, eventTrace);
  const afterPolicy = await readHeaderMetrics(page);
  await applyOversightTools(page, turn, afterPolicy, eventTrace);

  await page.getByRole("button", { name: /Run Quarter/i }).click();
  await page.waitForTimeout(120);

  if (await page.locator(".event-option").first().isVisible().catch(() => false)) {
    await chooseBestEventOption(page, eventTrace, turn, "Council");
    await page.waitForTimeout(80);
  }

  if (await page.getByRole("button", { name: /Read the Headlines/i }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: /Read the Headlines/i }).click();
    await page.waitForTimeout(80);
  }

  if (await page.locator(".event-option").first().isVisible().catch(() => false)) {
    await chooseBestEventOption(page, eventTrace, turn, "News");
    await page.waitForTimeout(80);
  }

  if (await page.getByRole("button", { name: /Advance Quarter/i }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: /Advance Quarter/i }).click();
    await page.waitForTimeout(120);
  }

  return await readHeaderMetrics(page);
}

async function main() {
  if (!Number.isFinite(targetTurns) || targetTurns < 1) {
    throw new Error("MIDDLETOWN_RL_TURNS must be a positive number.");
  }
  if (!DIFFICULTIES[targetDifficulty]) {
    throw new Error(`Unknown MIDDLETOWN_RL_DIFFICULTY: ${targetDifficulty}`);
  }

  await assertServerAvailable(defaultUrl);
  const { chromium } = await importPlaywright();
  const { browser, label } = await launchBrowser(chromium);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const usedActionIds = new Set();
  const usedProjectIds = new Set();
  const activePolicyIds = new Set();
  const actionTrace = [];
  const projectTrace = [];
  const policyTrace = [];
  const eventTrace = [];

  try {
    await installSeededRandom(page, randomSeed);
    await startGame(page);
    await stabilizeStarterBudget(page, eventTrace);
    const startMetrics = await readHeaderMetrics(page);
    let latestMetrics = startMetrics;
    let completedTurns = 0;

    for (let turn = 1; turn <= targetTurns; turn += 1) {
      if (!(await page.getByRole("button", { name: /Run Quarter/i }).isVisible().catch(() => false))) {
        break;
      }
      latestMetrics = await playQuarter(page, turn, usedActionIds, usedProjectIds, activePolicyIds, actionTrace, projectTrace, policyTrace, eventTrace);
      completedTurns += 1;
    }

    const readableFinalMetrics = await readHeaderMetrics(page);
    const finalMetrics = Object.keys(readableFinalMetrics).length ? readableFinalMetrics : latestMetrics;
    const victoryVisible = await page.getByText(/25-Year Record/i).isVisible().catch(() => false);
    if (victoryVisible) {
      await page.screenshot({ path: resolve(outputDir, "rl-victory.png"), fullPage: true });
    }
    const grade = gradePlaythrough({
      difficulty: targetDifficulty,
      turnsPlayed: completedTurns,
      requiredTurns: targetTurns,
      startMetrics,
      finalMetrics,
      actions: actionTrace,
      projects: projectTrace,
      policies: policyTrace,
      events: eventTrace,
    });

    await mkdir(outputDir, { recursive: true });
    await writeFile(
      outputPath,
      [
        grade.markdown,
        `\n## Runner Metadata\n`,
        `- URL: ${defaultUrl}`,
        `- Browser: ${label}`,
        `- Difficulty: ${targetDifficulty}`,
        `- Seed: ${randomSeed}`,
        `- Start summary: ${JSON.stringify(summarizeMetrics(startMetrics))}`,
        `- Final summary: ${JSON.stringify(summarizeMetrics(finalMetrics))}`,
        `- Victory screen visible: ${victoryVisible ? "yes" : "no"}`,
        "",
      ].join("\n"),
      "utf8",
    );

    console.log(`RL playtest ${grade.passed ? "PASS" : "RETRY"}: ${grade.letter} (${grade.score}/100)`);
    console.log(`Grading sheet: ${outputPath}`);
    if (targetTurns >= 100 && !victoryVisible) {
      console.log("RL playtest reached the target loop without the victory screen.");
      process.exitCode = 1;
    }
    if (!grade.passed) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

await main();
