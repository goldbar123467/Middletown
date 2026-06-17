process.env.MIDDLETOWN_DEVICE = "mobile";
process.env.MIDDLETOWN_RL_TURNS ??= "100";
process.env.MIDDLETOWN_RL_SEED ??= "mobile-100";
process.env.MIDDLETOWN_RL_OUTPUT ??= "middletown-grading-mobile-100.md";

await import("./runMiddletownRlPlaytest.mjs");
