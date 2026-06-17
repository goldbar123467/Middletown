import { enrichGeneratedCivicEvent } from "./localFlavor.js";

const COUNCIL_EVENT_SPOTLIGHTS = {
  council_0001: {
    title: "First Budget Hearing: The Ledger Opens",
    description: "The first council night combines three inherited problems: a Northside water main break, a downtown redevelopment vote, and a staffing request that no ward wants to own alone.",
    context: "Elena Marquez wants the mayor to show their governing style immediately: transparent numbers, visible urgency, and no pretend consensus.",
    options: [
      {
        text: "Publish a line-item repair calendar",
        resultText: "The budget table is blunt. Residents appreciate the honesty, but every delayed line now has a named constituency.",
      },
      {
        text: "Broker a council amendment",
        resultText: "The amendment keeps more votes in the room. It also makes the first ledger messier than Finance wanted.",
      },
      {
        text: "Hold the vote for verified costs",
        resultText: "Staff gets more time, but the first impression is caution when some residents wanted motion.",
      },
    ],
  },
  council_0021: {
    title: "Westhaven Heat Island Work Order",
    description: "Public Works brings temperature maps from clinic routes, senior housing, and school-adjacent sidewalks. Shade, drainage, and maintenance are suddenly the same argument.",
    context: "Council members agree the heat is real, then split over whether the first dollars should go to fast relief or long-lived infrastructure.",
    options: [
      {
        text: "Move crews to the hottest blocks now",
        resultText: "The response is visible quickly. Crews warn that rapid work will bump quieter maintenance down the queue.",
      },
      {
        text: "Tie shade work to the capital schedule",
        resultText: "The plan is sturdier and easier to defend, but residents in the hottest blocks hear another timeline.",
      },
      {
        text: "Wait for the resilience grant window",
        resultText: "The city protects local dollars, and the delay becomes the story by the next warm week.",
      },
    ],
  },
  council_0041: {
    title: "Downtown Clinic Staffing Strain",
    description: "Public Health reports missed appointments, burnout, and longer intake lines at downtown partner clinics. The issue is labor, but the symptoms show up as health, transit, and trust.",
    context: "Council has to decide whether to fund immediate relief, bargain for a shared staffing plan, or hold the line until revenue is clearer.",
    options: [
      {
        text: "Authorize short-term clinic relief",
        resultText: "The pressure eases at front desks, but Finance marks another recurring-cost warning in the margin.",
      },
      {
        text: "Negotiate a partner staffing compact",
        resultText: "The compact takes longer, but it spreads responsibility beyond City Hall and gives staff a clearer ladder.",
      },
      {
        text: "Delay until the quarterly forecast",
        resultText: "The numbers may improve, but clinic workers hear that their exhaustion is being scheduled for later.",
      },
    ],
  },
};

function applyCouncilEventSpotlight(event) {
  const spotlight = COUNCIL_EVENT_SPOTLIGHTS[event.id];
  if (!spotlight) return event;

  return {
    ...event,
    ...spotlight,
    options: event.options.map((option, index) => ({
      ...option,
      ...spotlight.options?.[index],
    })),
  };
}

const PUBLIC_RECORD_COUNCIL_EVENTS = [
  {
    id: "council_records_001",
    title: "Downtown Records Request Night",
    domain: "communications",
    district: "downtown",
    department: "finance",
    minTurn: 18,
    tone: "accountable",
    description: "A parent group, a downtown merchant, and a retired city clerk file overlapping records requests for pothole orders, project delays, and department overtime. The request is legal, local, and politically loaded.",
    context: "Finance can publish the documents quickly, narrow the request, or ask council for a records backlog hearing. Every option changes what residents think the city is hiding.",
    options: [
      {
        text: "Publish the ledger packet this week",
        resultText: "The packet answers the central question, but it also reveals which streets and departments were waiting longer than residents were told.",
        effects: {
          trust: 2,
          media: 1,
          labor: -2,
          budget: -1,
        },
      },
      {
        text: "Narrow the request to legal minimums",
        resultText: "The city protects staff time, and the room hears a technical answer instead of a civic one.",
        effects: {
          budget: 1,
          labor: 1,
          trust: -2,
          media: -2,
        },
      },
      {
        text: "Schedule a records backlog hearing",
        resultText: "Council gets a public process, while residents hear that the answer is coming after another meeting.",
        effects: {
          trust: 1,
          media: -1,
          labor: -1,
          services: -1,
        },
      },
    ],
  },
  {
    id: "council_records_002",
    title: "Midtown Body-Camera and Response-Time Request",
    domain: "safety",
    district: "midtown",
    department: "police",
    minTurn: 38,
    tone: "tense",
    description: "Midtown renters ask for response-time logs, camera-release rules, and the complaint calendar after a safety call becomes a neighborhood argument.",
    context: "The mayor has to choose between speed, privacy review, and a public standard that will bind future cases too.",
    options: [
      {
        text: "Release the response-time dashboard first",
        resultText: "Residents get numbers they can inspect, but the camera question keeps burning in the background.",
        effects: {
          safety: 1,
          trust: 1,
          media: 1,
          labor: -2,
        },
      },
      {
        text: "Wait for full legal review",
        resultText: "The city reduces legal risk and increases the belief that delay is the real policy.",
        effects: {
          budget: 1,
          safety: 1,
          trust: -2,
          media: -2,
        },
      },
      {
        text: "Adopt a release calendar for future cases",
        resultText: "The current case still hurts, but future residents can see the rule before the next crisis.",
        effects: {
          trust: 2,
          safety: -1,
          labor: -1,
          media: 0,
        },
      },
    ],
  },
];

const OVER_OPTIMIZATION_COUNCIL_EVENTS = [
  {
    id: "council_overopt_001",
    title: "Fund Balance Hearing: The Work Is Still Outside",
    domain: "budget",
    district: "northside",
    department: "finance",
    minTurn: 30,
    tone: "skeptical",
    description: "Finance shows a cleaner fund balance, and Northside residents answer with photos of old mains, patched asphalt, and the school crossing still waiting for crews.",
    context: "The mayor can spend into the visible backlog, defend the reserve target, or open a public ranking process that will expose which blocks have waited longest.",
    options: [
      {
        text: "Move reserve dollars into the oldest work orders",
        resultText: "The backlog finally sees money, but the reserve speech gets harder next budget night.",
        effects: { budget: -5, infrastructure: 3, trust: 2, services: 1, debt: 1 },
      },
      {
        text: "Defend the reserve target in public",
        resultText: "The ledger stays cleaner. Residents hear that stability matters and wonder why stability keeps looking like waiting.",
        effects: { budget: 2, reserves: 2, trust: -2, services: -1, media: -1 },
      },
      {
        text: "Rank the backlog with residents in the room",
        resultText: "The process is fairer and slower. It creates a record no department can hide from next quarter.",
        effects: { trust: 2, media: 1, labor: -2, budget: -1, infrastructure: 1 },
      },
    ],
  },
  {
    id: "council_overopt_002",
    title: "Green Dashboard, Red Case Files",
    domain: "services",
    district: "midtown",
    department: "communications",
    minTurn: 52,
    tone: "pointed",
    description: "The dashboard looks excellent, but Midtown renters bring case numbers that never reached the average: hydrants, alleys, repair notices, and library help tickets.",
    context: "Council wants to know whether the mayor will protect the headline score, reopen ugly case files, or build a public exception process.",
    options: [
      {
        text: "Reopen the oldest case files by name",
        resultText: "Residents see specific movement. The dashboard absorbs a messy correction and staff loses quiet time.",
        effects: { services: 2, trust: 2, labor: -3, media: 1, budget: -2 },
      },
      {
        text: "Protect the dashboard and audit later",
        resultText: "The score stays pretty. The people holding case numbers become the story.",
        effects: { budget: 2, services: -2, trust: -2, media: -2 },
      },
      {
        text: "Create an exception docket",
        resultText: "The city admits the average missed people. It is slower, but the rule can outlive the headline.",
        effects: { trust: 2, equity: 2, labor: -2, budget: -1, services: -1 },
      },
    ],
  },
  {
    id: "council_overopt_003",
    title: "Long Memory Hearing: Debt Victory Lap Backfires",
    domain: "debt",
    district: "westhaven",
    department: "mayor",
    minTurn: 70,
    tone: "hard-earned",
    description: "The mayor's debt-control remarks land the same week Westhaven clinics ask why a balanced ledger did not keep the winter access list staffed.",
    context: "The choice is not debt good or debt bad. It is whether fiscal discipline can admit the human cost of being too tidy.",
    options: [
      {
        text: "Pair debt control with clinic access funding",
        resultText: "The mayor keeps the fiscal story and admits that some savings have to become service.",
        effects: { budget: -4, health: 3, seniors: 2, trust: 2, debt: 1 },
      },
      {
        text: "Stay on the debt-control message",
        resultText: "Fiscal hawks applaud. Westhaven hears that a clean graph outranked missed appointments.",
        effects: { debt: -2, budget: 2, trust: -2, health: -2, media: -1 },
      },
      {
        text: "Ask clinics to design the next fiscal trigger",
        resultText: "The city gives residents a say in when savings become service, while Finance accepts a messier rulebook.",
        effects: { trust: 2, health: 1, labor: -1, budget: -1, media: 1 },
      },
    ],
  },
];

const RAW_PLAYABLE_COUNCIL_EVENTS = [
  {
    "id": "council_0001",
    "title": "Downtown Council Night 1",
    "domain": "budget",
    "district": "downtown",
    "department": "mayor",
    "minTurn": 1,
    "tone": "practical",
    "description": "In Downtown, Mayor's Office faces a budget choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "economy": -2,
          "debt": 0,
          "budget": -2
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "debt": 0,
          "economy": 2,
          "downtown": -1,
          "budget": 3,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "reserves": -2,
          "utilities": 2,
          "housing": -1,
          "budget": 3,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0002",
    "title": "Airport Industrial Council Night 2",
    "domain": "safety",
    "district": "airport",
    "department": "utilities",
    "minTurn": 2,
    "tone": "transparent",
    "description": "In Airport Industrial, Water and Utilities faces a safety choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "labor": 0,
          "education": 1,
          "services": 1,
          "safety": 2,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "housing": 2,
          "emergencyReadiness": 3,
          "infrastructure": 1,
          "safety": 2,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "environment": 0,
          "safety": 5,
          "youth": 1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0003",
    "title": "University District Council Night 3",
    "domain": "infrastructure",
    "district": "university",
    "department": "library",
    "minTurn": 3,
    "tone": "neighborly",
    "description": "In University District, Public Library faces a infrastructure choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "infrastructure": 2,
          "business": 2,
          "population": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "business": 4,
          "infrastructure": -3,
          "emergencyReadiness": -1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "debt": 2,
          "media": -3,
          "environment": -1
        }
      }
    ]
  },
  {
    "id": "council_0004",
    "title": "Midtown Council Night 4",
    "domain": "housing",
    "district": "midtown",
    "department": "communications",
    "minTurn": 4,
    "tone": "fiscally careful",
    "description": "In Midtown, Communications faces a housing choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "infrastructure": 4,
          "mobility": 3,
          "media": 1,
          "housing": 2,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "business": -4,
          "youth": -2,
          "economy": 1,
          "housing": 2,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "debt": 4,
          "infrastructure": -2,
          "business": 1,
          "housing": 2,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0005",
    "title": "Westhaven Council Night 5",
    "domain": "economy",
    "district": "westhaven",
    "department": "publicWorks",
    "minTurn": 5,
    "tone": "future-facing",
    "description": "In Westhaven, Public Works faces a economy choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of future-facing government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Westhaven.",
        "effects": {
          "equity": -4,
          "neighborhoods": -3,
          "safety": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "safety": -2,
          "housing": -1,
          "seniors": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "housing": -4,
          "downtown": -1,
          "education": -1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0006",
    "title": "Southgate Council Night 6",
    "domain": "environment",
    "district": "southgate",
    "department": "parks",
    "minTurn": 6,
    "tone": "service-minded",
    "description": "In Southgate, Parks and Recreation faces a environment choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of service-minded government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Southgate.",
        "effects": {
          "debt": -2,
          "business": -2,
          "utilities": 1,
          "environment": 2,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "media": 0,
          "infrastructure": 0,
          "health": 1,
          "environment": 2,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "utilities": -2,
          "media": -2,
          "debt": 1,
          "environment": 2
        }
      }
    ]
  },
  {
    "id": "council_0007",
    "title": "East Bank Council Night 7",
    "domain": "health",
    "district": "eastbank",
    "department": "emergencyManagement",
    "minTurn": 7,
    "tone": "equity-aware",
    "description": "In East Bank, Emergency Management faces a health choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of equity-aware government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in East Bank.",
        "effects": {
          "reserves": 0,
          "utilities": -1,
          "housing": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "utilities": 2,
          "reserves": 1,
          "neighborhoods": -1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "youth": 0,
          "mobility": 1,
          "equity": -1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0008",
    "title": "Northside Council Night 8",
    "domain": "education",
    "district": "northside",
    "department": "fire",
    "minTurn": 8,
    "tone": "calm under pressure",
    "description": "In Northside, Fire and EMS faces a education choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of calm under pressure government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Northside.",
        "effects": {
          "mobility": 2,
          "services": 0,
          "youth": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "trust": 4,
          "business": 2,
          "mobility": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "infrastructure": 2,
          "economy": 2,
          "reserves": 1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0009",
    "title": "Downtown Council Night 9",
    "domain": "mobility",
    "district": "downtown",
    "department": "health",
    "minTurn": 9,
    "tone": "practical",
    "description": "In Downtown, Public Health faces a mobility choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "utilities": 4,
          "business": 1,
          "environment": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "health": -4,
          "infrastructure": 3,
          "budget": -1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "mobility": 4,
          "media": 4,
          "labor": -1
        }
      }
    ]
  },
  {
    "id": "council_0010",
    "title": "Airport Industrial Council Night 10",
    "domain": "equity",
    "district": "airport",
    "department": "economicDevelopment",
    "minTurn": 10,
    "tone": "transparent",
    "description": "In Airport Industrial, Economic Development faces a equity choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "neighborhoods": -4,
          "population": 2,
          "business": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "labor": -2,
          "education": -3,
          "services": 1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "downtown": -4,
          "seniors": -3,
          "trust": 1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0011",
    "title": "University District Council Night 11",
    "domain": "labor",
    "district": "university",
    "department": "police",
    "minTurn": 11,
    "tone": "neighborly",
    "description": "In University District, Police faces a labor choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "safety": -2,
          "education": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "seniors": 0,
          "emergencyReadiness": -2,
          "population": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "neighborhoods": -2,
          "safety": -2,
          "downtown": -1,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0012",
    "title": "Midtown Council Night 12",
    "domain": "communications",
    "district": "midtown",
    "department": "housing",
    "minTurn": 12,
    "tone": "fiscally careful",
    "description": "In Midtown, Housing Office faces a communications choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "seniors": 0,
          "budget": -10,
          "debt": 1
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "equity": 2,
          "environment": -1,
          "media": 1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "labor": 0,
          "emergencyReadiness": -1,
          "infrastructure": 1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0013",
    "title": "Westhaven Council Night 13",
    "domain": "emergency",
    "district": "westhaven",
    "department": "schools",
    "minTurn": 13,
    "tone": "future-facing",
    "description": "In Westhaven, School Partnership faces a emergency choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of future-facing government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Westhaven.",
        "effects": {
          "neighborhoods": 2,
          "seniors": -2,
          "equity": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "labor": 4,
          "safety": -1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "downtown": 2,
          "labor": 0,
          "emergencyReadiness": -1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0014",
    "title": "Southgate Council Night 14",
    "domain": "utilities",
    "district": "southgate",
    "department": "finance",
    "minTurn": 14,
    "tone": "service-minded",
    "description": "In Southgate, Finance faces a utilities choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of service-minded government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Southgate.",
        "effects": {
          "infrastructure": 4,
          "economy": -1,
          "reserves": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "business": -4,
          "media": 1,
          "utilities": 1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "debt": 4,
          "reserves": 1,
          "economy": 1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0015",
    "title": "East Bank Council Night 15",
    "domain": "downtown",
    "district": "eastbank",
    "department": "planning",
    "minTurn": 15,
    "tone": "equity-aware",
    "description": "In East Bank, Planning and Zoning faces a downtown choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of equity-aware government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in East Bank.",
        "effects": {
          "mobility": -4,
          "media": 0,
          "labor": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "trust": -1,
          "debt": 2,
          "housing": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "infrastructure": -4,
          "health": 2,
          "seniors": -1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0016",
    "title": "Northside Council Night 16",
    "domain": "budget",
    "district": "northside",
    "department": "transit",
    "minTurn": 16,
    "tone": "calm under pressure",
    "description": "In Northside, Transit faces a budget choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of calm under pressure government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Northside.",
        "effects": {
          "downtown": -2,
          "seniors": 1,
          "trust": 1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "environment": 0,
          "safety": 3,
          "youth": 1,
          "budget": 3,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "education": -2,
          "labor": 3,
          "health": 1,
          "budget": 3,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0017",
    "title": "Downtown Council Night 17",
    "domain": "safety",
    "district": "downtown",
    "department": "mayor",
    "minTurn": 17,
    "tone": "practical",
    "description": "In Downtown, Mayor's Office faces a safety choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "debt": 0,
          "economy": 2,
          "downtown": -1,
          "safety": 2,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "media": -3,
          "environment": -1,
          "safety": 2,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "utilities": 0,
          "reserves": -3,
          "neighborhoods": -1,
          "safety": 2,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0018",
    "title": "Airport Industrial Council Night 18",
    "domain": "infrastructure",
    "district": "airport",
    "department": "utilities",
    "minTurn": 18,
    "tone": "transparent",
    "description": "In Airport Industrial, Water and Utilities faces a infrastructure choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "labor": 2,
          "emergencyReadiness": 3,
          "infrastructure": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "housing": 4,
          "population": -2,
          "business": 1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "environment": 2,
          "equity": -2,
          "mobility": 1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0019",
    "title": "University District Council Night 19",
    "domain": "housing",
    "district": "university",
    "department": "library",
    "minTurn": 19,
    "tone": "neighborly",
    "description": "In University District, Public Library faces a housing choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "labor": 4,
          "environment": -3,
          "emergencyReadiness": -1,
          "housing": 2,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "housing": -2,
          "downtown": -1,
          "education": -1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "environment": 4,
          "population": -1,
          "budget": -1,
          "housing": 2,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0020",
    "title": "Midtown Council Night 20",
    "domain": "economy",
    "district": "midtown",
    "department": "communications",
    "minTurn": 20,
    "tone": "fiscally careful",
    "description": "In Midtown, Communications faces a economy choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "business": -4,
          "youth": -2,
          "economy": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "services": -2,
          "trust": 0,
          "debt": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "media": -2,
          "services": 1
        }
      }
    ]
  },
  {
    "id": "council_0021",
    "title": "Westhaven Council Night 21",
    "domain": "environment",
    "district": "westhaven",
    "department": "publicWorks",
    "minTurn": 1,
    "tone": "future-facing",
    "description": "In Westhaven, Public Works faces a environment choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of future-facing government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Westhaven.",
        "effects": {
          "environment": 0,
          "emergencyReadiness": -1,
          "seniors": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "budget": 0,
          "population": 1,
          "equity": -1,
          "environment": 2,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "population": -1,
          "equity": 1,
          "environment": 2,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0022",
    "title": "Southgate Council Night 22",
    "domain": "health",
    "district": "southgate",
    "department": "parks",
    "minTurn": 2,
    "tone": "service-minded",
    "description": "In Southgate, Parks and Recreation faces a health choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of service-minded government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Southgate.",
        "effects": {
          "education": 0,
          "labor": 0,
          "health": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "population": 2,
          "neighborhoods": 2,
          "reserves": 1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "safety": 0,
          "environment": 2,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0023",
    "title": "East Bank Council Night 23",
    "domain": "education",
    "district": "eastbank",
    "department": "emergencyManagement",
    "minTurn": 3,
    "tone": "equity-aware",
    "description": "In East Bank, Emergency Management faces a education choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of equity-aware government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in East Bank.",
        "effects": {
          "seniors": 2,
          "education": 1,
          "neighborhoods": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "equity": 4,
          "emergencyReadiness": 3,
          "labor": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "labor": 2,
          "safety": -1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0024",
    "title": "Northside Council Night 24",
    "domain": "mobility",
    "district": "northside",
    "department": "fire",
    "minTurn": 4,
    "tone": "calm under pressure",
    "description": "In Northside, Fire and EMS faces a mobility choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of calm under pressure government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Northside.",
        "effects": {
          "population": 4,
          "emergencyReadiness": 2,
          "mobility": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "emergencyReadiness": -4,
          "population": -3,
          "trust": 2
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "seniors": 4,
          "equity": -3,
          "utilities": 1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0025",
    "title": "Downtown Council Night 25",
    "domain": "equity",
    "district": "downtown",
    "department": "health",
    "minTurn": 5,
    "tone": "practical",
    "description": "In Downtown, Public Health faces a equity choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "economy": -4,
          "debt": 3,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "debt": -2,
          "economy": -2,
          "downtown": -1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "reserves": -4,
          "utilities": -2,
          "housing": -1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0026",
    "title": "Airport Industrial Council Night 26",
    "domain": "labor",
    "district": "airport",
    "department": "economicDevelopment",
    "minTurn": 6,
    "tone": "transparent",
    "description": "In Airport Industrial, Economic Development faces a labor choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "services": 1,
          "economy": -3,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "infrastructure": 1,
          "media": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "economy": -2,
          "reserves": -1,
          "youth": 1,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0027",
    "title": "University District Council Night 27",
    "domain": "communications",
    "district": "university",
    "department": "police",
    "minTurn": 7,
    "tone": "neighborly",
    "description": "In University District, Police faces a communications choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "infrastructure": 0,
          "business": -2,
          "population": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "business": 2,
          "infrastructure": 0,
          "emergencyReadiness": -1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "debt": 0,
          "media": -1,
          "environment": -1
        }
      }
    ]
  },
  {
    "id": "council_0028",
    "title": "Midtown Council Night 28",
    "domain": "emergency",
    "district": "midtown",
    "department": "housing",
    "minTurn": 8,
    "tone": "fiscally careful",
    "description": "In Midtown, Housing Office faces a emergency choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "economy": 2,
          "utilities": -1,
          "media": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "debt": 4,
          "reserves": 1,
          "economy": 1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "reserves": 2,
          "mobility": 1,
          "business": 1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0029",
    "title": "Westhaven Council Night 29",
    "domain": "utilities",
    "district": "westhaven",
    "department": "schools",
    "minTurn": 9,
    "tone": "future-facing",
    "description": "In Westhaven, School Partnership faces a utilities choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of future-facing government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Westhaven.",
        "effects": {
          "labor": 4,
          "safety": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "housing": -4,
          "equity": 2,
          "seniors": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "environment": 4,
          "neighborhoods": 2,
          "education": -1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0030",
    "title": "Southgate Council Night 30",
    "domain": "downtown",
    "district": "southgate",
    "department": "finance",
    "minTurn": 10,
    "tone": "service-minded",
    "description": "In Southgate, Finance faces a downtown choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of service-minded government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Southgate.",
        "effects": {
          "seniors": -4,
          "equity": 1,
          "utilities": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "equity": -2,
          "seniors": 3,
          "health": 1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "labor": -4,
          "housing": 3,
          "debt": 1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0031",
    "title": "East Bank Council Night 31",
    "domain": "budget",
    "district": "eastbank",
    "department": "planning",
    "minTurn": 11,
    "tone": "equity-aware",
    "description": "In East Bank, Planning and Zoning faces a budget choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of equity-aware government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in East Bank.",
        "effects": {
          "reserves": -2,
          "utilities": 2,
          "housing": -1,
          "budget": -3
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "utilities": 0,
          "reserves": -3,
          "neighborhoods": -1,
          "budget": 3,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "youth": -2,
          "mobility": -3,
          "equity": -1,
          "budget": 3,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0032",
    "title": "Northside Council Night 32",
    "domain": "safety",
    "district": "northside",
    "department": "transit",
    "minTurn": 12,
    "tone": "calm under pressure",
    "description": "In Northside, Transit faces a safety choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of calm under pressure government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Northside.",
        "effects": {
          "environment": 0,
          "safety": 5,
          "youth": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "budget": 2,
          "equity": -2,
          "mobility": 1,
          "safety": 2,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "population": 0,
          "neighborhoods": -2,
          "reserves": 1,
          "safety": 2,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0033",
    "title": "Downtown Council Night 33",
    "domain": "infrastructure",
    "district": "downtown",
    "department": "mayor",
    "minTurn": 13,
    "tone": "practical",
    "description": "In Downtown, Mayor's Office faces a infrastructure choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "debt": 2,
          "media": -3,
          "environment": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "media": 4,
          "debt": -1,
          "budget": -1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "utilities": 2,
          "health": -1,
          "labor": -1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0034",
    "title": "Airport Industrial Council Night 34",
    "domain": "housing",
    "district": "airport",
    "department": "utilities",
    "minTurn": 14,
    "tone": "transparent",
    "description": "In Airport Industrial, Water and Utilities faces a housing choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "debt": 4,
          "infrastructure": -2,
          "business": 1,
          "housing": 2,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "media": -4,
          "services": 1,
          "housing": 2,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "utilities": 4,
          "debt": 0,
          "trust": 1,
          "housing": 2,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0035",
    "title": "University District Council Night 35",
    "domain": "economy",
    "district": "university",
    "department": "library",
    "minTurn": 15,
    "tone": "neighborly",
    "description": "In University District, Public Library faces a economy choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "housing": -4,
          "downtown": -1,
          "education": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "neighborhoods": -2,
          "budget": 1,
          "population": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "budget": -4,
          "education": 1,
          "downtown": -1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0036",
    "title": "Midtown Council Night 36",
    "domain": "environment",
    "district": "midtown",
    "department": "communications",
    "minTurn": 16,
    "tone": "fiscally careful",
    "description": "In Midtown, Communications faces a environment choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "utilities": -2,
          "media": 0,
          "debt": 1,
          "environment": 2,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "health": 0,
          "debt": 2,
          "media": 1,
          "environment": 2,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "mobility": -2,
          "health": 2,
          "infrastructure": 1,
          "environment": 2,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0037",
    "title": "Westhaven Council Night 37",
    "domain": "health",
    "district": "westhaven",
    "department": "publicWorks",
    "minTurn": 17,
    "tone": "future-facing",
    "description": "In Westhaven, Public Works faces a health choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of future-facing government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Westhaven.",
        "effects": {
          "youth": 0,
          "mobility": 1,
          "equity": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "mobility": 2,
          "youth": 3,
          "safety": -1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "services": 0,
          "infrastructure": 3,
          "emergencyReadiness": -1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0038",
    "title": "Southgate Council Night 38",
    "domain": "education",
    "district": "southgate",
    "department": "parks",
    "minTurn": 18,
    "tone": "service-minded",
    "description": "In Southgate, Parks and Recreation faces a education choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of service-minded government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Southgate.",
        "effects": {
          "infrastructure": 2,
          "economy": 2,
          "reserves": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "business": 4,
          "media": -3,
          "utilities": 1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "debt": 2,
          "reserves": -3,
          "economy": 1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0039",
    "title": "East Bank Council Night 39",
    "domain": "mobility",
    "district": "eastbank",
    "department": "emergencyManagement",
    "minTurn": 19,
    "tone": "equity-aware",
    "description": "In East Bank, Emergency Management faces a mobility choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of equity-aware government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in East Bank.",
        "effects": {
          "mobility": 4,
          "media": 3,
          "labor": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "trust": -3,
          "debt": -2,
          "housing": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "infrastructure": 4,
          "health": -2,
          "seniors": -1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0040",
    "title": "Northside Council Night 40",
    "domain": "equity",
    "district": "northside",
    "department": "fire",
    "minTurn": 20,
    "tone": "calm under pressure",
    "description": "In Northside, Fire and EMS faces a equity choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of calm under pressure government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Northside.",
        "effects": {
          "downtown": -4,
          "seniors": -3,
          "trust": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "environment": -2,
          "safety": -1,
          "youth": 1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "education": -4,
          "labor": -1,
          "health": 1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0041",
    "title": "Downtown Council Night 41",
    "domain": "labor",
    "district": "downtown",
    "department": "health",
    "minTurn": 1,
    "tone": "practical",
    "description": "In Downtown, Public Health faces a labor choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "neighborhoods": -2,
          "safety": -2,
          "downtown": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "labor": 0,
          "equity": 0,
          "environment": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "downtown": -2,
          "neighborhoods": -1,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0042",
    "title": "Airport Industrial Council Night 42",
    "domain": "communications",
    "district": "airport",
    "department": "economicDevelopment",
    "minTurn": 2,
    "tone": "transparent",
    "description": "In Airport Industrial, Economic Development faces a communications choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "labor": 0,
          "emergencyReadiness": -1,
          "infrastructure": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "housing": 2,
          "population": 1,
          "business": 1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "environment": 0,
          "equity": 1,
          "mobility": 1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0043",
    "title": "University District Council Night 43",
    "domain": "emergency",
    "district": "university",
    "department": "police",
    "minTurn": 3,
    "tone": "neighborly",
    "description": "In University District, Police faces a emergency choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "downtown": 2,
          "labor": 0,
          "emergencyReadiness": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "environment": 4,
          "neighborhoods": 2,
          "education": -1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "education": 2,
          "environment": 2,
          "budget": -1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0044",
    "title": "Midtown Council Night 44",
    "domain": "utilities",
    "district": "midtown",
    "department": "housing",
    "minTurn": 4,
    "tone": "fiscally careful",
    "description": "In Midtown, Housing Office faces a utilities choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "debt": 4,
          "reserves": 1,
          "economy": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "media": -4,
          "health": 3,
          "debt": 1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "utilities": 4,
          "youth": 3,
          "services": 1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0045",
    "title": "Westhaven Council Night 45",
    "domain": "downtown",
    "district": "westhaven",
    "department": "schools",
    "minTurn": 5,
    "tone": "future-facing",
    "description": "In Westhaven, School Partnership faces a downtown choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of future-facing government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Westhaven.",
        "effects": {
          "infrastructure": -4,
          "health": 2,
          "seniors": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "business": -2,
          "utilities": -3,
          "equity": -1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "debt": -4,
          "trust": -3,
          "population": -1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0046",
    "title": "Southgate Council Night 46",
    "domain": "budget",
    "district": "southgate",
    "department": "finance",
    "minTurn": 6,
    "tone": "service-minded",
    "description": "In Southgate, Finance faces a budget choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of service-minded government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Southgate.",
        "effects": {
          "education": -2,
          "labor": 3,
          "health": 1,
          "budget": -2
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "population": 0,
          "neighborhoods": -2,
          "reserves": 1,
          "budget": 3,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "safety": -2,
          "environment": -2,
          "media": -1,
          "budget": 3
        }
      }
    ]
  },
  {
    "id": "council_0047",
    "title": "East Bank Council Night 47",
    "domain": "safety",
    "district": "eastbank",
    "department": "planning",
    "minTurn": 7,
    "tone": "equity-aware",
    "description": "In East Bank, Planning and Zoning faces a safety choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of equity-aware government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in East Bank.",
        "effects": {
          "utilities": 0,
          "reserves": -3,
          "neighborhoods": -1,
          "safety": 2,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "health": -1,
          "labor": -1,
          "safety": 2,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "mobility": 0,
          "youth": -1,
          "safety": 1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0048",
    "title": "Northside Council Night 48",
    "domain": "infrastructure",
    "district": "northside",
    "department": "transit",
    "minTurn": 8,
    "tone": "calm under pressure",
    "description": "In Northside, Transit faces a infrastructure choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of calm under pressure government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Northside.",
        "effects": {
          "environment": 2,
          "equity": -2,
          "mobility": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "budget": 4,
          "seniors": 0,
          "trust": 2
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "population": 2,
          "housing": 0,
          "utilities": 1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0049",
    "title": "Downtown Council Night 49",
    "domain": "housing",
    "district": "downtown",
    "department": "mayor",
    "minTurn": 9,
    "tone": "practical",
    "description": "In Downtown, Mayor's Office faces a housing choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "environment": 4,
          "population": -1,
          "budget": -5,
          "housing": 2
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "budget": -4,
          "education": 1,
          "downtown": -1,
          "housing": 2,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "population": 4,
          "seniors": 1,
          "housing": 1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0050",
    "title": "Airport Industrial Council Night 50",
    "domain": "economy",
    "district": "airport",
    "department": "utilities",
    "minTurn": 10,
    "tone": "transparent",
    "description": "In Airport Industrial, Water and Utilities faces a economy choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "media": -4,
          "services": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "economy": -2,
          "business": 2,
          "infrastructure": 1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "health": -4,
          "economy": 2,
          "youth": 1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0051",
    "title": "University District Council Night 51",
    "domain": "environment",
    "district": "university",
    "department": "library",
    "minTurn": 11,
    "tone": "neighborly",
    "description": "In University District, Public Library faces a environment choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "population": -1,
          "equity": 1,
          "environment": 2,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "emergencyReadiness": -1,
          "seniors": 3,
          "environment": 2,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "seniors": -2,
          "housing": 3,
          "environment": 1,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0052",
    "title": "Midtown Council Night 52",
    "domain": "health",
    "district": "midtown",
    "department": "communications",
    "minTurn": 12,
    "tone": "fiscally careful",
    "description": "In Midtown, Communications faces a health choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "safety": 0,
          "environment": 2,
          "media": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "seniors": 2,
          "downtown": -3,
          "economy": 1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "neighborhoods": 0,
          "population": -3,
          "business": 1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0053",
    "title": "Westhaven Council Night 53",
    "domain": "education",
    "district": "westhaven",
    "department": "publicWorks",
    "minTurn": 13,
    "tone": "future-facing",
    "description": "In Westhaven, Public Works faces a education choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of future-facing government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Westhaven.",
        "effects": {
          "labor": 2,
          "safety": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "housing": 4,
          "equity": -2,
          "seniors": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "environment": 2,
          "neighborhoods": -2,
          "education": -1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0054",
    "title": "Southgate Council Night 54",
    "domain": "mobility",
    "district": "southgate",
    "department": "parks",
    "minTurn": 14,
    "tone": "service-minded",
    "description": "In Southgate, Parks and Recreation faces a mobility choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of service-minded government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Southgate.",
        "effects": {
          "seniors": 4,
          "equity": -3,
          "utilities": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "equity": -4,
          "seniors": -1,
          "health": 1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "labor": 4,
          "housing": -1,
          "debt": 1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0055",
    "title": "East Bank Council Night 55",
    "domain": "equity",
    "district": "eastbank",
    "department": "emergencyManagement",
    "minTurn": 15,
    "tone": "equity-aware",
    "description": "In East Bank, Emergency Management faces a equity choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of equity-aware government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in East Bank.",
        "effects": {
          "reserves": -4,
          "utilities": -2,
          "housing": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "utilities": -2,
          "reserves": 0,
          "neighborhoods": -1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "youth": -4,
          "mobility": 0,
          "equity": -1,
          "media": 2
        }
      }
    ]
  },
  {
    "id": "council_0056",
    "title": "Northside Council Night 56",
    "domain": "labor",
    "district": "northside",
    "department": "fire",
    "minTurn": 16,
    "tone": "calm under pressure",
    "description": "In Northside, Fire and EMS faces a labor choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of calm under pressure government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Northside.",
        "effects": {
          "economy": -2,
          "reserves": -1,
          "youth": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "debt": 0,
          "health": 1,
          "mobility": 1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "reserves": 1,
          "youth": 1,
          "media": -2
        }
      }
    ]
  },
  {
    "id": "council_0057",
    "title": "Downtown Council Night 57",
    "domain": "communications",
    "district": "downtown",
    "department": "health",
    "minTurn": 17,
    "tone": "practical",
    "description": "In Downtown, Public Health faces a communications choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of practical government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Downtown.",
        "effects": {
          "debt": 0,
          "media": 0,
          "environment": -1,
          "budget": -4
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "media": 2,
          "debt": 2,
          "budget": -1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "utilities": 0,
          "health": 2,
          "labor": -1,
          "media": -1
        }
      }
    ]
  },
  {
    "id": "council_0058",
    "title": "Airport Industrial Council Night 58",
    "domain": "emergency",
    "district": "airport",
    "department": "economicDevelopment",
    "minTurn": 18,
    "tone": "transparent",
    "description": "In Airport Industrial, Economic Development faces a emergency choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of transparent government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Airport Industrial.",
        "effects": {
          "reserves": 2,
          "mobility": 1,
          "business": 1,
          "budget": -5
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "utilities": 4,
          "youth": 3,
          "services": 1,
          "trust": -1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "youth": 2,
          "infrastructure": 3,
          "trust": 1,
          "media": 0
        }
      }
    ]
  },
  {
    "id": "council_0059",
    "title": "University District Council Night 59",
    "domain": "utilities",
    "district": "university",
    "department": "police",
    "minTurn": 19,
    "tone": "neighborly",
    "description": "In University District, Police faces a utilities choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of neighborly government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in University District.",
        "effects": {
          "environment": 4,
          "neighborhoods": 2,
          "education": -1,
          "budget": -6
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "budget": -4,
          "housing": -3,
          "population": -1,
          "trust": 0
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "population": 4,
          "downtown": -1,
          "media": 1
        }
      }
    ]
  },
  {
    "id": "council_0060",
    "title": "Midtown Council Night 60",
    "domain": "downtown",
    "district": "midtown",
    "department": "housing",
    "minTurn": 20,
    "tone": "fiscally careful",
    "description": "In Midtown, Housing Office faces a downtown choice that feels local, practical, and politically loud. The issue is not abstract: it changes commute times, utility bills, wait lists, meeting rooms, and whether people believe City Hall is listening.",
    "context": "The mayor's briefing frames this as a test of fiscally careful government. Staff can move quickly, bargain carefully, or invite the public into a slower process.",
    "options": [
      {
        "text": "Move quickly with staff authority",
        "resultText": "The administration acts fast. Supporters praise competence; critics ask who got left outside the room in Midtown.",
        "effects": {
          "labor": -4,
          "housing": 3,
          "debt": 1,
          "budget": -7
        }
      },
      {
        "text": "Broker a public compromise",
        "resultText": "Council members leave with a compromise. It is slower, but the public record is sturdier.",
        "effects": {
          "housing": -2,
          "labor": -2,
          "media": 1,
          "trust": 1
        }
      },
      {
        "text": "Delay until next quarter",
        "resultText": "The city buys time. The problem waits too, and residents notice the hesitation.",
        "effects": {
          "environment": -4,
          "budget": -2,
          "infrastructure": 1,
          "media": 2
        }
      }
    ]
  }
];

export const PLAYABLE_COUNCIL_EVENTS = [
  ...PUBLIC_RECORD_COUNCIL_EVENTS,
  ...OVER_OPTIMIZATION_COUNCIL_EVENTS,
  ...RAW_PLAYABLE_COUNCIL_EVENTS.map((event) => applyCouncilEventSpotlight(enrichGeneratedCivicEvent(event, "council"))),
];
