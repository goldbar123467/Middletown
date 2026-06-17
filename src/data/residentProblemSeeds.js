const NAMES = [
  "Avery Bennett",
  "Jordan Kline",
  "Casey Sinclair",
  "Morgan Cole",
  "Taylor Grant",
  "Riley Patel",
  "Parker Whitaker",
  "Quinn Carver",
  "Sam Lopez",
  "Reese Turner",
  "Alex Dawson",
  "Jamie Hale",
];

const DISTRICTS = ["downtown", "southgate", "university", "northside", "westhaven", "airport", "eastbank", "midtown"];
const OCCUPATIONS = ["nurse", "paramedic", "librarian", "union steward", "retired machinist", "warehouse supervisor", "student", "small business owner"];
const PRIORITIES = ["budget", "communications", "education", "housing", "downtown", "labor", "health", "infrastructure", "utilities", "equity", "environment", "safety", "emergency", "mobility", "economy"];

export const RESIDENT_PROBLEM_COUNT = 900;

function paddedId(index) {
  return String(index + 1).padStart(4, "0");
}

export function createResidentProblemSeeds(count = RESIDENT_PROBLEM_COUNT) {
  return Array.from({ length: count }, (_, index) => ({
    id: `resident_${paddedId(index)}`,
    name: NAMES[index % NAMES.length],
    district: DISTRICTS[index % DISTRICTS.length],
    occupation: OCCUPATIONS[index % OCCUPATIONS.length],
    priority: PRIORITIES[index % PRIORITIES.length],
  }));
}
