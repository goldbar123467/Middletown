import { enrichGeneratedCivicEvent } from "./localFlavor.js";

const NEWS_EVENT_SPOTLIGHTS = {
  news_0001: {
    title: "Middletown Ledger: New Mayor Opens Books",
    description: "The morning headline asks whether the first budget memo is a reset or a warning sign. Downtown business owners quote the same numbers as council, but not with the same patience.",
    context: "Reporters want a clean angle: competent transparency, fiscal drift, or a mayor already trapped by inherited promises.",
    options: [
      {
        text: "Release the repair calendar and cost notes",
        resultText: "The story praises clarity while pointing out every neighborhood that will wait.",
      },
      {
        text: "Stand with council on the compromise",
        resultText: "The coverage calls it collaborative, then asks which tradeoffs were softened behind the dais.",
      },
      {
        text: "Say staff is verifying the numbers",
        resultText: "The quote is responsible. The headline is about delay.",
      },
    ],
  },
  news_0021: {
    title: "Clinic Route Heat Map Fuels Westhaven Debate",
    description: "A local weather segment turns Public Works data into a story about seniors, bus stops, and whether resilience money follows the hottest blocks.",
    context: "The administration can own the heat-risk story, share credit with partners, or wait and hope the next week is cooler.",
    options: [
      {
        text: "Show the hottest-block work orders",
        resultText: "Residents can see action starting, and crews get immediate public attention on their schedule.",
      },
      {
        text: "Announce the capital-schedule approach",
        resultText: "The plan sounds durable. The segment still shows people waiting in the sun.",
      },
      {
        text: "Point to the grant application",
        resultText: "The grant may be real, but the coverage frames the city as waiting for permission to help.",
      },
    ],
  },
  news_0041: {
    title: "Downtown Clinics Warn of Burnout",
    description: "A front-page story follows nurses, intake workers, and patients through a week of missed appointments and stretched public-health capacity.",
    context: "The mayor can frame staffing as urgent service delivery, shared civic responsibility, or a budget question still under review.",
    options: [
      {
        text: "Name immediate clinic relief as service protection",
        resultText: "Workers hear urgency in the quote, and budget hawks hear the beginning of a recurring fight.",
      },
      {
        text: "Highlight the partner staffing compact",
        resultText: "The story gives the city credit for coalition work, then asks how soon the line gets shorter.",
      },
      {
        text: "Wait for the quarterly revenue forecast",
        resultText: "The administration sounds careful. The photo still shows a waiting room.",
      },
    ],
  },
};

function applyNewsEventSpotlight(event) {
  const spotlight = NEWS_EVENT_SPOTLIGHTS[event.id];
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

const PUBLIC_RECORD_NEWS_EVENTS = [
  {
    id: "news_records_001",
    title: "Ledger Requests the Pothole Repair Emails",
    domain: "communications",
    district: "northside",
    department: "communications",
    minTurn: 20,
    tone: "accountable",
    description: "The Middletown Ledger asks for repair emails after Northside residents compare the public pothole queue with what crews told them at the curb.",
    context: "The administration can publish the emails, release a short explanation, or blame the queue software. The story will remember the posture as much as the records.",
    options: [
      {
        text: "Publish the emails with plain-language notes",
        resultText: "The story is messy but legible. Residents can see delays, weather, crew shortages, and a few mistakes in one place.",
        effects: {
          trust: 2,
          media: 2,
          labor: -2,
          budget: -1,
        },
      },
      {
        text: "Release a summary instead of the raw emails",
        resultText: "The summary is easier to read and easier to doubt.",
        effects: {
          trust: -1,
          media: -1,
          labor: 1,
          budget: 0,
        },
      },
      {
        text: "Blame the old work-order software",
        resultText: "The software really is bad, and the headline still says City Hall blamed software for a human promise.",
        effects: {
          budget: 1,
          infrastructure: 1,
          media: -2,
          trust: -1,
        },
      },
    ],
  },
  {
    id: "news_records_002",
    title: "Channel 7 Tracks Public Records Delays",
    domain: "budget",
    district: "downtown",
    department: "finance",
    minTurn: 44,
    tone: "skeptical",
    description: "Channel 7 compares Middletown's records response times with nearby cities and asks whether the mayor's transparency promise has a staffing plan behind it.",
    context: "The mayor can fund the backlog, ask departments to absorb it, or publish a public queue that will embarrass everyone equally.",
    options: [
      {
        text: "Fund a temporary records backlog desk",
        resultText: "The backlog starts moving, and Finance circles the recurring-cost risk in red.",
        effects: {
          trust: 2,
          media: 1,
          budget: -4,
          labor: 1,
        },
      },
      {
        text: "Ask departments to absorb the workload",
        resultText: "The budget stays cleaner, and department directors start treating transparency as another unfunded mandate.",
        effects: {
          budget: 2,
          services: -1,
          labor: -2,
          media: -1,
        },
      },
      {
        text: "Publish the public-records queue",
        resultText: "Everyone can see the line. That makes the process fairer and the delay impossible to spin.",
        effects: {
          trust: 1,
          media: 1,
          services: -1,
          labor: -1,
        },
      },
    ],
  },
];

const OVER_OPTIMIZATION_NEWS_EVENTS = [
  {
    id: "news_overopt_001",
    title: "Ledger: Fund Balance Rises, Northside Waits",
    domain: "budget",
    district: "northside",
    department: "finance",
    minTurn: 32,
    tone: "skeptical",
    description: "The Middletown Ledger runs two photos side by side: a clean reserve chart and a Northside street plate that has been temporary for months.",
    context: "The quote can turn reserves into visible work, defend discipline, or admit that ranking the backlog in public is overdue.",
    options: [
      {
        text: "Say reserves will fund the oldest visible repairs",
        resultText: "The headline shifts from hoarding to action, while Finance warns that one visible fix can become fifty asks.",
        effects: { budget: -4, infrastructure: 3, trust: 2, media: 1, debt: 1 },
      },
      {
        text: "Defend the fund balance without apology",
        resultText: "The business page likes the discipline. The neighborhood page calls it a beautiful number beside an ugly street plate.",
        effects: { budget: 2, reserves: 2, trust: -2, media: -2 },
      },
      {
        text: "Invite residents to rank the repair list",
        resultText: "The story gives the mayor process credit, then prints the oldest unrepaired blocks.",
        effects: { trust: 2, media: 1, labor: -2, budget: -1 },
      },
    ],
  },
  {
    id: "news_overopt_002",
    title: "Channel 7: Great Scores, Bad Case Numbers",
    domain: "services",
    district: "midtown",
    department: "communications",
    minTurn: 54,
    tone: "investigative",
    description: "Channel 7 interviews residents whose case numbers never fit the average service score: a library help ticket, a hydrant note, and a rental inspection delay.",
    context: "The administration can reopen those files, explain the limits of averages, or promise an exception docket.",
    options: [
      {
        text: "Reopen the named cases on camera",
        resultText: "The segment becomes uncomfortable and useful. Staff gets extra work, and residents see names become action.",
        effects: { services: 2, trust: 2, media: 1, labor: -3, budget: -2 },
      },
      {
        text: "Explain why the average is still valid",
        resultText: "The explanation is mathematically true and politically brittle.",
        effects: { budget: 1, services: -2, trust: -2, media: -2 },
      },
      {
        text: "Announce an exception docket",
        resultText: "The story calls it a late correction, but residents with case numbers finally know where to stand.",
        effects: { trust: 2, equity: 2, labor: -2, budget: -1, services: -1 },
      },
    ],
  },
  {
    id: "news_overopt_003",
    title: "Long Memory Headline: Westhaven Asks What Debt Discipline Bought",
    domain: "debt",
    district: "westhaven",
    department: "mayor",
    minTurn: 72,
    tone: "reflective",
    description: "A long Sunday story follows clinic riders through a week when the city celebrates debt control and residents still miss winter access calls.",
    context: "The mayor can connect savings to service, stay on the fiscal message, or let clinics help define the next trigger.",
    options: [
      {
        text: "Turn savings into clinic access hours",
        resultText: "The story gives the mayor credit for learning from the ledger instead of worshiping it.",
        effects: { budget: -4, health: 3, seniors: 2, trust: 2, debt: 1 },
      },
      {
        text: "Stay focused on the debt win",
        resultText: "The quote is clean. The story is about what a clean quote leaves out.",
        effects: { debt: -2, budget: 2, trust: -2, health: -2, media: -1 },
      },
      {
        text: "Let clinics write the fiscal trigger",
        resultText: "Finance dislikes the precedent. Residents hear that the rule will come from the service line, not only the spreadsheet.",
        effects: { trust: 2, health: 1, media: 1, labor: -1, budget: -1 },
      },
    ],
  },
];

const RAW_PLAYABLE_NEWS_EVENTS = [
  {
    "id": "news_0001",
    "title": "Downtown Headline 1",
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
    "id": "news_0002",
    "title": "Airport Industrial Headline 2",
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
    "id": "news_0003",
    "title": "University District Headline 3",
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
    "id": "news_0004",
    "title": "Midtown Headline 4",
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
    "id": "news_0005",
    "title": "Westhaven Headline 5",
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
    "id": "news_0006",
    "title": "Southgate Headline 6",
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
    "id": "news_0007",
    "title": "East Bank Headline 7",
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
    "id": "news_0008",
    "title": "Northside Headline 8",
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
    "id": "news_0009",
    "title": "Downtown Headline 9",
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
    "id": "news_0010",
    "title": "Airport Industrial Headline 10",
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
    "id": "news_0011",
    "title": "University District Headline 11",
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
    "id": "news_0012",
    "title": "Midtown Headline 12",
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
    "id": "news_0013",
    "title": "Westhaven Headline 13",
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
    "id": "news_0014",
    "title": "Southgate Headline 14",
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
    "id": "news_0015",
    "title": "East Bank Headline 15",
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
    "id": "news_0016",
    "title": "Northside Headline 16",
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
    "id": "news_0017",
    "title": "Downtown Headline 17",
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
    "id": "news_0018",
    "title": "Airport Industrial Headline 18",
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
    "id": "news_0019",
    "title": "University District Headline 19",
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
    "id": "news_0020",
    "title": "Midtown Headline 20",
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
    "id": "news_0021",
    "title": "Westhaven Headline 21",
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
    "id": "news_0022",
    "title": "Southgate Headline 22",
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
    "id": "news_0023",
    "title": "East Bank Headline 23",
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
    "id": "news_0024",
    "title": "Northside Headline 24",
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
    "id": "news_0025",
    "title": "Downtown Headline 25",
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
    "id": "news_0026",
    "title": "Airport Industrial Headline 26",
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
    "id": "news_0027",
    "title": "University District Headline 27",
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
    "id": "news_0028",
    "title": "Midtown Headline 28",
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
    "id": "news_0029",
    "title": "Westhaven Headline 29",
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
    "id": "news_0030",
    "title": "Southgate Headline 30",
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
    "id": "news_0031",
    "title": "East Bank Headline 31",
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
    "id": "news_0032",
    "title": "Northside Headline 32",
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
    "id": "news_0033",
    "title": "Downtown Headline 33",
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
    "id": "news_0034",
    "title": "Airport Industrial Headline 34",
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
    "id": "news_0035",
    "title": "University District Headline 35",
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
    "id": "news_0036",
    "title": "Midtown Headline 36",
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
    "id": "news_0037",
    "title": "Westhaven Headline 37",
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
    "id": "news_0038",
    "title": "Southgate Headline 38",
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
    "id": "news_0039",
    "title": "East Bank Headline 39",
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
    "id": "news_0040",
    "title": "Northside Headline 40",
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
    "id": "news_0041",
    "title": "Downtown Headline 41",
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
    "id": "news_0042",
    "title": "Airport Industrial Headline 42",
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
    "id": "news_0043",
    "title": "University District Headline 43",
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
    "id": "news_0044",
    "title": "Midtown Headline 44",
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
    "id": "news_0045",
    "title": "Westhaven Headline 45",
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
    "id": "news_0046",
    "title": "Southgate Headline 46",
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
    "id": "news_0047",
    "title": "East Bank Headline 47",
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
    "id": "news_0048",
    "title": "Northside Headline 48",
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
    "id": "news_0049",
    "title": "Downtown Headline 49",
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
    "id": "news_0050",
    "title": "Airport Industrial Headline 50",
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
    "id": "news_0051",
    "title": "University District Headline 51",
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
    "id": "news_0052",
    "title": "Midtown Headline 52",
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
    "id": "news_0053",
    "title": "Westhaven Headline 53",
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
    "id": "news_0054",
    "title": "Southgate Headline 54",
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
    "id": "news_0055",
    "title": "East Bank Headline 55",
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
    "id": "news_0056",
    "title": "Northside Headline 56",
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
    "id": "news_0057",
    "title": "Downtown Headline 57",
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
    "id": "news_0058",
    "title": "Airport Industrial Headline 58",
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
    "id": "news_0059",
    "title": "University District Headline 59",
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
    "id": "news_0060",
    "title": "Midtown Headline 60",
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

export const PLAYABLE_NEWS_EVENTS = [
  ...PUBLIC_RECORD_NEWS_EVENTS,
  ...OVER_OPTIMIZATION_NEWS_EVENTS,
  ...RAW_PLAYABLE_NEWS_EVENTS.map((event) => applyNewsEventSpotlight(enrichGeneratedCivicEvent(event, "news"))),
];
