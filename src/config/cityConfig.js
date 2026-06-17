export const GAME_TITLE = "Middletown";
export const POPULATION_START = 100000;
export const MAX_TURNS = 100;
export const QUARTERS = ["Spring", "Summer", "Autumn", "Winter"];
export const DEFAULT_DIFFICULTY = "normal";

export const DIFFICULTIES = {
  easy: {
    label: "Civic Onboarding",
    description: "More reserves, patient public, forgiving headlines.",
    startingBudget: 145,
    startingReserves: 48,
    trust: 62,
    pressureScale: 0.8,
  },
  normal: {
    label: "Mayor's Desk",
    description: "Balanced pressure for a town that wants results.",
    startingBudget: 118,
    startingReserves: 32,
    trust: 54,
    pressureScale: 1,
  },
  hard: {
    label: "Bad Winter",
    description: "Thin reserves, anxious council, impatient residents.",
    startingBudget: 92,
    startingReserves: 18,
    trust: 45,
    pressureScale: 1.25,
  },
};
