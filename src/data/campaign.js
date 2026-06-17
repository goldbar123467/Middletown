export const CITY_BACKLOG_START = {
  potholes: 100,
  unansweredCases: 900,
  districtPotholes: {
    downtown: 10,
    northside: 18,
    eastbank: 14,
    southgate: 16,
    westhaven: 10,
    midtown: 13,
    university: 8,
    airport: 11,
  },
  projectClearedPotholes: 0,
};

export const DISTRICT_FLAGSHIP_ISSUES = {
  downtown: {
    title: "Budget hearings and public legitimacy",
    recurringPressure: "Downtown expects the mayor to keep the public record clear before rumor becomes policy.",
  },
  northside: {
    title: "Aging mains and school crossings",
    recurringPressure: "Northside notices whether old pipes, rental meters, and school crossings get fixed before a near-miss.",
  },
  eastbank: {
    title: "Flood risk and riverfront service",
    recurringPressure: "East Bank judges every growth promise against lift stations, drainage, and the next heavy rain.",
  },
  southgate: {
    title: "Mall-edge mobility and housing",
    recurringPressure: "Southgate wants the mall corridor to connect homes, schools, jobs, and buses instead of only parking lots.",
  },
  westhaven: {
    title: "Clinic access and winter readiness",
    recurringPressure: "Westhaven measures competence by whether seniors, clinics, and crews can function during heat, snow, and outages.",
  },
  midtown: {
    title: "Renters, alleys, hydrants, and the library",
    recurringPressure: "Midtown watches small-shop disruption, renter repairs, and old-block infrastructure stack up.",
  },
  university: {
    title: "Student housing and public desks",
    recurringPressure: "The University District wants City Hall to treat student rentals, safety, and city forms as normal service work.",
  },
  airport: {
    title: "Freight growth and worker stability",
    recurringPressure: "Airport Industrial asks whether growth includes the workers, roads, utilities, and housing carrying it.",
  },
};

export const PROBLEM_TEMPLATES = {
  budget: {
    metric: "budget",
    title: "Needs a clear city budget answer",
    problem: "wants City Hall to explain what can be paid for now and what has to wait.",
  },
  communications: {
    metric: "media",
    title: "Needs plain-language updates",
    problem: "needs service changes explained before rumors do the job.",
  },
  education: {
    metric: "education",
    title: "Needs a student opportunity fix",
    problem: "needs city services to line up with school, library, and campus life.",
  },
  housing: {
    metric: "housing",
    title: "Needs housing help",
    problem: "needs repairs, code calls, or rental support to move from promise to reality.",
  },
  downtown: {
    metric: "downtown",
    title: "Needs downtown access",
    problem: "needs downtown to stay reachable, useful, and worth the trip.",
  },
  labor: {
    metric: "labor",
    title: "Needs workday support",
    problem: "needs city choices to respect shift work, staffing, and burnout.",
  },
  health: {
    metric: "health",
    title: "Needs a public health fix",
    problem: "needs outreach, clinics, or prevention work to show up on their block.",
  },
  infrastructure: {
    metric: "infrastructure",
    title: "Needs a visible repair",
    problem: "needs streets, pipes, lights, or crossings to get fixed instead of studied forever.",
  },
  utilities: {
    metric: "utilities",
    title: "Needs reliable utilities",
    problem: "needs water, power, or service calls to stop becoming a weekly gamble.",
  },
  equity: {
    metric: "equity",
    title: "Needs fair service",
    problem: "needs City Hall to prove their block counts as much as the loudest block.",
  },
  environment: {
    metric: "environment",
    title: "Needs cleaner air and water",
    problem: "needs environmental complaints to turn into tests, maps, and action.",
  },
  safety: {
    metric: "safety",
    title: "Needs safer streets",
    problem: "needs emergency response, crossings, lights, or patrol trust to improve.",
  },
  emergency: {
    metric: "emergencyReadiness",
    title: "Needs disaster readiness",
    problem: "needs the city to prepare before storms, heat, or outages arrive.",
  },
  mobility: {
    metric: "mobility",
    title: "Needs better mobility",
    problem: "needs buses, sidewalks, and routes that match real life.",
  },
  economy: {
    metric: "economy",
    title: "Needs a local economy win",
    problem: "needs growth to show up as practical jobs, storefronts, or opportunity.",
  },
};

export const DEFAULT_PROBLEM_TEMPLATE = PROBLEM_TEMPLATES.infrastructure;

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "first_term_survivor",
    title: "First Term Survivor",
    description: "Survive the first four quarters without collapse.",
  },
  {
    id: "hundred_quarter_mayor",
    title: "Century Mayor",
    description: "Win a 100-quarter career.",
  },
  {
    id: "anti_pot_mayor",
    title: "The Anti-Pot Mayor",
    description: "Clear every pothole backlog in Middletown.",
  },
  {
    id: "peoples_mayor",
    title: "The People's Mayor",
    description: "Solve every resident problem in the 900-person civic file.",
  },
  {
    id: "budget_grown_up",
    title: "Budget Grown-Up",
    description: "Keep the budget positive and debt under control through a long term.",
  },
  {
    id: "services_actually_work",
    title: "Services Actually Work",
    description: "Keep service quality high enough that residents can feel it.",
  },
  {
    id: "quarter_25_public_record",
    title: "Q25 Public Record",
    description: "Reach quarter 25 with a visible governing record.",
  },
  {
    id: "quarter_50_hard_winter",
    title: "Hard Winter Mayor",
    description: "Reach quarter 50 without losing the town's basic trust.",
  },
  {
    id: "quarter_75_long_memory",
    title: "Long Memory Mayor",
    description: "Reach quarter 75 with services and resident problem-solving still moving.",
  },
  {
    id: "hands_on_mayor",
    title: "Hands-On Mayor",
    description: "File repeated visible agenda actions instead of only riding staff reports.",
  },
  {
    id: "builder_mayor",
    title: "Builder Mayor",
    description: "Complete visible capital projects.",
  },
  {
    id: "policy_mayor",
    title: "Policy Mayor",
    description: "Adopt standing policies and live with their upkeep.",
  },
  {
    id: "passive_administrator",
    title: "Passive Administrator",
    description: "Let several quarters pass without a mayor agenda.",
  },
  {
    id: "debt_scare",
    title: "Debt Scare",
    description: "Let debt pressure get high enough that the public notices.",
  },
  {
    id: "staff_burnout",
    title: "Staff Burnout",
    description: "Let staff morale fall into dangerous territory.",
  },
];

export const GOAL_DEFINITIONS = [
  {
    id: "hundred_quarter_mayor",
    title: "Win 100 Quarters",
    description: "Guide Middletown through a full 25-year mayoral career.",
    reward: "Unlocks the final mayoral record and long-term ending tier.",
  },
  {
    id: "first_four_quarters",
    title: "Survive the First Year",
    description: "Reach quarter 5 with trust, services, and budget intact.",
    reward: "Unlocks First Term Survivor and keeps the tutorial safety net behind you.",
  },
  {
    id: "anti_pot_mayor",
    title: "The Anti-Pot Mayor",
    description: "Remove the townwide pothole backlog.",
    reward: "Unlocks the Anti-Pot Mayor title after project-backed street repair.",
  },
  {
    id: "peoples_mayor",
    title: "The People's Mayor",
    description: "Solve every resident problem over time.",
    reward: "Unlocks The People's Mayor and a stronger neighborhood ending.",
  },
  {
    id: "budget_grown_up",
    title: "Budget Grown-Up",
    description: "Keep fiscal pressure manageable without making the city feel broken.",
    reward: "Keeps debt scares out of the public record.",
  },
  {
    id: "active_government",
    title: "Keep Governing",
    description: "File agenda moves, projects, or policies often enough that the term has a public record.",
    reward: "Prevents the passive administrator ending.",
  },
  {
    id: "builder_mayor",
    title: "Build Something Real",
    description: "Complete capital projects that residents can point to.",
    reward: "Raises the ceiling for service quality and builder endings.",
  },
];
