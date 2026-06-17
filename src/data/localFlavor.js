const DISTRICT_DETAILS = {
  downtown: {
    name: "Downtown",
    place: "the courthouse square, transfer bays, and City Hall counter",
    publicTable: "Council chamber dais",
    pressure: "budget hearings, bus transfers, apartment calls, and storefront deliveries all compete for the same blocks",
    residentAsk: "a calendar that names the affected blocks before rumors own the room",
    scenes: ["the College Avenue bus island", "the courthouse annex doors", "River Street loading zones"],
  },
  northside: {
    name: "Northside",
    place: "Northside Elementary, older mains, rental meters, and factory-edge streets",
    publicTable: "school cafeteria forum",
    pressure: "old pipes, school crossings, and landlord repair delays keep landing in the same family schedules",
    residentAsk: "repair orders with dates, crews, and a plain answer when work slips",
    scenes: ["Maple and Sixth", "the Northside Elementary crosswalk", "the Oak Street meter bank"],
  },
  eastbank: {
    name: "East Bank",
    place: "riverfront apartments, trailheads, lift stations, and floodplain streets",
    publicTable: "riverfront flood map table",
    pressure: "growth sounds fragile whenever basements, ramps, and lift stations are one storm from failure",
    residentAsk: "proof that drainage, housing, and business access are being solved together",
    scenes: ["the Mill Race ramp", "East Bank lift station two", "the Riverside trail crossing"],
  },
  southgate: {
    name: "Southgate",
    place: "the mall edge, subdivisions, warehouse roads, and stretched sidewalks",
    publicTable: "mall corridor hearing room",
    pressure: "families, buses, freight, and redevelopment promises all meet at the same tired intersections",
    residentAsk: "a service order that treats sidewalks, lights, and buses as daily life, not extras",
    scenes: ["Southgate Mall ring road", "Juniper Signal", "the warehouse school-bus stop"],
  },
  westhaven: {
    name: "Westhaven",
    place: "senior housing, clinics, the medical campus, and snow-route hills",
    publicTable: "clinic partnership table",
    pressure: "heat, snow, missed appointments, and fragile utility access turn small delays into health risks",
    residentAsk: "a readiness list that reaches people before weather makes the list urgent",
    scenes: ["Westhaven Clinic loop", "Birchview senior apartments", "the hospital hill plow route"],
  },
  midtown: {
    name: "Midtown",
    place: "duplex blocks, alley shops, old hydrants, and the central library",
    publicTable: "library community room",
    pressure: "renters, small shops, hydrants, alleys, and library desks carry problems that used to stay separate",
    residentAsk: "work orders that name the detour, the inspector, and the next public date",
    scenes: ["the Main Library steps", "Benton Alley", "the duplex blocks behind Ash Street"],
  },
  university: {
    name: "University District",
    place: "community college paths, student rentals, public desks, and research-park offices",
    publicTable: "College Square service desk",
    pressure: "students and renters lose whole weeks when forms, safety, housing, and transit are split across offices",
    residentAsk: "one public desk where city services match campus life and late schedules",
    scenes: ["College Square", "the student rental counter", "the research park shuttle stop"],
  },
  airport: {
    name: "Airport Industrial",
    place: "freight yards, utility plants, shift-worker housing, and airport frontage",
    publicTable: "shift-change warehouse forum",
    pressure: "freight growth looks different to workers who need buses, childcare timing, and utility bills they can challenge",
    residentAsk: "growth math that includes the people crossing those roads before sunrise",
    scenes: ["the freight gate crosswalk", "Airport Road frontage", "the second-shift bus shelter"],
  },
};

const DOMAIN_DETAILS = {
  budget: {
    label: "budget",
    artifact: "line-item ledger",
    issue: "what gets paid for now and what waits",
    fast: "publish the cost table",
    compromise: "split the appropriation into a public phase plan",
    delay: "hold the item for verified cost notes",
  },
  communications: {
    label: "communications",
    artifact: "plain-language bulletin",
    issue: "whether residents hear service changes before rumor hardens",
    fast: "post the public notice package",
    compromise: "open a weekly question desk",
    delay: "wait for a cleaner message",
  },
  education: {
    label: "education",
    artifact: "student access calendar",
    issue: "whether youth services match school, library, and campus schedules",
    fast: "open the after-school service slot",
    compromise: "share the program with partners",
    delay: "wait for district confirmation",
  },
  housing: {
    label: "housing",
    artifact: "case-status board",
    issue: "which repair and rental cases move before people are displaced",
    fast: "send inspectors to the oldest cases",
    compromise: "triage cases with landlords and renters at the table",
    delay: "wait for a clean legal review",
  },
  downtown: {
    label: "downtown access",
    artifact: "street-access map",
    issue: "whether the center of town remains useful during repairs and hearings",
    fast: "open the access detour plan",
    compromise: "split deliveries, buses, and foot traffic into phases",
    delay: "hold the route change for traffic counts",
  },
  labor: {
    label: "labor",
    artifact: "staffing memo",
    issue: "whether city workers have capacity to make promises real",
    fast: "authorize a temporary crew schedule",
    compromise: "negotiate a shared staffing compact",
    delay: "wait for the bargaining forecast",
  },
  health: {
    label: "public health",
    artifact: "clinic access log",
    issue: "whether prevention work reaches residents before the emergency room does",
    fast: "fund immediate outreach shifts",
    compromise: "pair clinics, transit, and case managers",
    delay: "wait for the quarterly health dashboard",
  },
  infrastructure: {
    label: "infrastructure",
    artifact: "work-order queue",
    issue: "which streets, pipes, lights, and crossings stop being studied and start being fixed",
    fast: "send crews to the oldest work orders",
    compromise: "publish a repair sequence by block",
    delay: "wait for engineering verification",
  },
  utilities: {
    label: "utilities",
    artifact: "meter and outage log",
    issue: "whether invisible systems stay boring enough for residents to trust them",
    fast: "move utility crews to visible failures",
    compromise: "bundle meter, valve, and outage work by corridor",
    delay: "wait for the rate-impact note",
  },
  equity: {
    label: "fair service",
    artifact: "service equity map",
    issue: "whether quieter blocks get the same answer as loud ones",
    fast: "publish a block-by-block service order",
    compromise: "let districts score the queue in public",
    delay: "wait for a fuller equity audit",
  },
  environment: {
    label: "environment",
    artifact: "testing and cleanup map",
    issue: "whether air, water, heat, and flooding complaints become measurable work",
    fast: "start testing at the complaint sites",
    compromise: "pair cleanup with maintenance scheduling",
    delay: "wait for state sampling help",
  },
  safety: {
    label: "public safety",
    artifact: "response-time dashboard",
    issue: "whether emergency minutes, lighting, and patrol trust improve together",
    fast: "move crews to the hottest safety calls",
    compromise: "share the response plan with neighborhood partners",
    delay: "wait for the full incident review",
  },
  emergency: {
    label: "emergency readiness",
    artifact: "readiness checklist",
    issue: "whether heat, snow, flooding, and outages are planned before they become headlines",
    fast: "pre-stage emergency crews",
    compromise: "test the call tree with partners",
    delay: "wait for the seasonal forecast",
  },
  mobility: {
    label: "mobility",
    artifact: "route reliability board",
    issue: "whether buses, sidewalks, signals, and real commutes line up",
    fast: "fix the daily bottleneck first",
    compromise: "phase routes around school and shift schedules",
    delay: "wait for ridership counts",
  },
  economy: {
    label: "local economy",
    artifact: "small-business impact note",
    issue: "whether growth reaches storefronts, jobs, and workers instead of only press releases",
    fast: "launch the visible business fix",
    compromise: "tie incentives to local hiring and access",
    delay: "wait for the revenue forecast",
  },
};

const DEPARTMENT_DETAILS = {
  mayor: { name: "Mayor's Office", desk: "the mayor's weekly calendar" },
  finance: { name: "Finance", desk: "the budget counter" },
  police: { name: "Police", desk: "the watch commander desk" },
  fire: { name: "Fire and EMS", desk: "the EMS duty board" },
  publicWorks: { name: "Public Works", desk: "the work-order wall" },
  utilities: { name: "Water and Utilities", desk: "the outage board" },
  planning: { name: "Planning and Zoning", desk: "the map table" },
  housing: { name: "Housing Office", desk: "the repair-case counter" },
  health: { name: "Public Health", desk: "the clinic partner line" },
  parks: { name: "Parks and Recreation", desk: "the permit desk" },
  library: { name: "Public Library", desk: "the reference desk" },
  transit: { name: "Transit", desk: "the route room" },
  schools: { name: "School Partnership", desk: "the after-school calendar" },
  economicDevelopment: { name: "Economic Development", desk: "the small-business counter" },
  emergencyManagement: { name: "Emergency Management", desk: "the operations board" },
  communications: { name: "Communications", desk: "the public notice queue" },
};

const OCCUPATION_LENSES = {
  nurse: "missed appointments and discharge plans",
  paramedic: "response minutes and transfer delays",
  librarian: "forms, Wi-Fi, study time, and people asking for help at the desk",
  "union steward": "shift coverage, overtime, and workers tired of quiet vacancies",
  "retired machinist": "snow routes, utility bills, and practical fixes older residents can verify",
  "warehouse supervisor": "shift changes, freight turns, and families crossing industrial roads",
  "civil engineer": "the drawings, drains, and field conditions behind the public promise",
  "small business owner": "cones, foot traffic, utility work, and whether customers can still reach the door",
  "bus driver": "routes, transfers, blocked turns, and riders blaming the driver for City Hall delay",
  "restaurant manager": "late shifts, sidewalk access, and which block gets service first",
  "line worker": "utility reliability and the crews asked to make clean promises in rough weather",
  planner: "maps that become real only when departments share ownership",
  "case manager": "the people who miss a letter, a ride, or a call and then fall off the system",
  teacher: "students watching whether adults can turn a meeting into a safer daily route",
  student: "rent, routes, evening hours, and the city desk that either helps or shrugs",
  electrician: "hydrants, meters, alleys, and the hidden systems behind visible confidence",
};

const CIVIC_ARCS = [
  {
    until: 12,
    councilTitle: "Inherited File",
    newsTitle: "Opening Ledger",
    context: "The first-year file is still teaching residents what kind of mayor they have.",
  },
  {
    until: 24,
    councilTitle: "Budget Markup",
    newsTitle: "Budget Watch",
    context: "The easy press conference is over; council wants proof that the early promises have a costed path.",
  },
  {
    until: 36,
    councilTitle: "Labor and Records Season",
    newsTitle: "Records Desk",
    context: "Staff capacity, public records, and visible service speed are now the same fight.",
  },
  {
    until: 48,
    councilTitle: "Capital Queue",
    newsTitle: "Project Tracker",
    context: "Residents are comparing project calendars against the streets, clinics, and counters they use every week.",
  },
  {
    until: 60,
    councilTitle: "Bad Winter Table",
    newsTitle: "Winter Ledger",
    context: "The long winter window turns preparedness, staffing, and debt into one public test.",
  },
  {
    until: 1000,
    councilTitle: "Long Memory Hearing",
    newsTitle: "Legacy Check",
    context: "By now every choice is judged against the administration's own record.",
  },
];

function pick(items, key) {
  if (!items.length) return "";
  const text = String(key ?? "");
  const numeric = Number(text.replace(/\D/g, "")) || text.length;
  return items[numeric % items.length];
}

function sequenceNumber(id = "") {
  return Number(String(id).match(/(\d+)$/)?.[1] ?? 1);
}

function arcForEvent(event) {
  const sequence = sequenceNumber(event?.id);
  return CIVIC_ARCS.find((arc) => sequence <= arc.until) ?? CIVIC_ARCS.at(-1);
}

function districtFor(id) {
  return DISTRICT_DETAILS[id] ?? DISTRICT_DETAILS.downtown;
}

function domainFor(id) {
  return DOMAIN_DETAILS[id] ?? DOMAIN_DETAILS.infrastructure;
}

function departmentFor(id) {
  return DEPARTMENT_DETAILS[id] ?? DEPARTMENT_DETAILS.mayor;
}

function mergeEffects(baseEffects = {}, adjustment = {}) {
  const merged = { ...baseEffects };
  for (const [key, value] of Object.entries(adjustment)) {
    merged[key] = (merged[key] ?? 0) + value;
  }
  return Object.fromEntries(Object.entries(merged).filter(([, value]) => value !== 0));
}

function optionEffectAdjustment(index, source) {
  if (index === 0) {
    return {
      trust: source === "news" ? 0 : 1,
      services: 1,
      budget: -1,
      labor: -1,
      media: source === "news" ? -1 : 0,
    };
  }
  if (index === 1) {
    return {
      trust: 1,
      media: 1,
      budget: -1,
      labor: -1,
      services: source === "news" ? 0 : 1,
    };
  }
  return {
    budget: 1,
    labor: 1,
    trust: -1,
    services: -1,
    media: -1,
  };
}

function optionCopy({ event, source, index, district, domain, department }) {
  const scene = pick(district.scenes, `${event.id}_${index}`);
  const label = source === "news" ? "The story" : "Council";

  if (index === 0) {
    return {
      text: `${domain.fast} and name ${scene}`,
      resultText: `${label} sees fast movement at ${scene}. The win is visible, but ${department.name} spends staff time and budget room before quieter blocks are ready.`,
    };
  }
  if (index === 1) {
    return {
      text: `${domain.compromise} at ${district.publicTable}`,
      resultText: `${label} gets a fairer public record. It is slower than a clean order, and the compromise leaves every side with one thing to explain at home.`,
    };
  }
  return {
    text: `${domain.delay} before the next vote`,
    resultText: `${label} gets a cleaner file and a little fiscal room. Residents waiting on ${domain.issue} hear another quarter of process and mark the delay down.`,
  };
}

export function residentProblemDetail(resident, template, issue) {
  const district = districtFor(resident.district);
  const domain = domainFor(resident.priority);
  const lens = OCCUPATION_LENSES[resident.occupation] ?? "the daily details that make city service feel real";
  const scene = pick(district.scenes, resident.id);
  return `${resident.name}'s ${resident.occupation} routine runs through ${scene}, where ${lens} expose ${domain.issue}. The practical ask is ${district.residentAsk}. This is part of ${issue?.title ?? district.pressure}, not a one-off complaint.`;
}

export function residentQuote(resident) {
  const district = districtFor(resident.district);
  const domain = domainFor(resident.priority);
  return `${resident.name} wants ${domain.artifact} for ${district.name}, because ${domain.issue} decides whether a normal week works.`;
}

export function residentMemory(resident) {
  const district = districtFor(resident.district);
  const scene = pick(district.scenes, `${resident.id}_memory`);
  return `They remember the quarter City Hall either named ${scene} in the public record or let the problem dissolve into another department handoff.`;
}

export function enrichGeneratedCivicEvent(event, source = "council") {
  const district = districtFor(event.district);
  const domain = domainFor(event.domain);
  const department = departmentFor(event.department);
  const arc = arcForEvent(event);
  const titlePrefix = source === "news" ? arc.newsTitle : arc.councilTitle;
  const sourceNoun = source === "news" ? "headline" : "council item";

  return {
    ...event,
    title: `${district.name} ${titlePrefix}: ${domain.artifact}`,
    description: `${department.name} brings a ${sourceNoun} from ${district.place}. The issue is ${domain.issue}, and the local pressure is plain: ${district.pressure}.`,
    context: `${arc.context} The mayor can use ${department.desk}, but ${district.name} wants ${district.residentAsk}.`,
    options: event.options.map((option, index) => ({
      ...option,
      ...optionCopy({ event, source, index, district, domain, department }),
      effects: mergeEffects(option.effects, optionEffectAdjustment(index, source)),
    })),
  };
}

export function enginePartReport(part, effects = {}, state = {}) {
  const district = districtFor(part.district);
  const domain = domainFor(part.domain);
  const department = departmentFor(part.department);
  const scene = pick(district.scenes, `${part.id}_${state.turn ?? 1}`);
  const biggest = Object.entries(effects)
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))[0];
  const metricLine = biggest ? `${biggest[0]} ${biggest[1] >= 0 ? "rose" : "fell"} by ${Math.abs(biggest[1])}` : "the dashboard barely moved";
  return `${department.name} at ${scene}: ${domain.issue}. ${metricLine}, and ${district.name} reads it through ${district.residentAsk}.`;
}

export function overOptimizationReport(state) {
  const metrics = state.metrics ?? {};
  const record = state.civicRecord ?? {};
  const turn = state.turn ?? 0;
  if ((metrics.budget ?? 0) >= 135 && (record.projectsCompleted ?? 0) < 2 && turn >= 40 && turn % 8 === 0) {
    return {
      effects: { budget: -3, trust: -2, services: -1, media: -1 },
      report: "Residents heard the fund-balance speech again while project calendars stayed thin. A perfect ledger without visible work became its own criticism.",
      reaction: {
        type: "optimization",
        sentiment: "worry",
        residentName: "Council Budget Watch",
        message: "The town is asking why a healthy budget has not become visible work.",
      },
    };
  }
  if ((metrics.trust ?? 0) >= 96 && (metrics.services ?? 0) >= 96 && turn >= 70 && turn % 10 === 0) {
    return {
      effects: { budget: -2, trust: -1, services: -1, media: -1 },
      report: "The dashboard looked almost too clean. Reporters started looking for the blocks, counters, and families not visible in the averages.",
      reaction: {
        type: "optimization",
        sentiment: "worry",
        residentName: "Neighborhood Wire",
        message: "Green metrics are not enough when residents can name the cases still waiting.",
      },
    };
  }
  if ((record.eventPatterns?.fast ?? 0) >= 10 && turn % 5 === 0) {
    return {
      effects: { services: 1, labor: -2, media: -1 },
      report: "The administration's fast-response habit kept producing wins, but department staff started calling it emergency mode with nicer letterhead.",
      reaction: {
        type: "optimization",
        sentiment: "worry",
        residentName: "Department Directors",
        message: "Fast choices are helping residents and exhausting the offices that make them real.",
      },
    };
  }
  return null;
}

export { DISTRICT_DETAILS, DOMAIN_DETAILS };
