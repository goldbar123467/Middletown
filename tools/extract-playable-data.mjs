import fs from "node:fs";
import path from "node:path";
import { COUNCIL_EVENTS } from "../src/data/archive/councilEventsArchive.js";
import { NEWS_EVENTS } from "../src/data/archive/newsEventsArchive.js";
import { NARRATIVE_EPISODES } from "../src/data/archive/narrativeEpisodesArchive.js";

const root = path.resolve(".");

function writeModule(filePath, exportName, items) {
  const fullPath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(
    fullPath,
    `export const ${exportName} = ${JSON.stringify(items, null, 2)};\n`,
    "utf8",
  );
}

writeModule("src/data/playableCouncilEvents.js", "PLAYABLE_COUNCIL_EVENTS", COUNCIL_EVENTS.slice(0, 60));
writeModule("src/data/playableNewsEvents.js", "PLAYABLE_NEWS_EVENTS", NEWS_EVENTS.slice(0, 60));
writeModule("src/data/storySamples.js", "STORY_SAMPLES", NARRATIVE_EPISODES.slice(0, 48));
