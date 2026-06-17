export const TUTORIAL_STEPS = [
  {
    id: "orientation_city_hall",
    kind: "popup",
    speaker: "Elena Marquez",
    role: "Chief of Staff, Mayor's Office",
    district: "Downtown",
    title: "Welcome to the Mayor's Desk",
    targetTab: "dashboard",
    metricFocus: "Trust",
    message:
      "Mayor, the first quarter is your orientation. Do not chase every number at once. Read the dashboard like a morning briefing: trust, services, finances, and pressure points tell you where the town is leaning.",
    transcript:
      "City Hall is not a throne room. It is phones, agenda packets, neighbors in the lobby, and the question everyone asks first: did the mayor notice us?",
  },
  {
    id: "voice_maria_budget",
    kind: "voice_log",
    speaker: "Maria Alvarez",
    role: "Diner owner",
    district: "Downtown",
    title: "Voice Log: Honest Numbers",
    targetTab: "budget",
    metricFocus: "Budget",
    message:
      "Maria runs the diner two blocks from City Hall. She wants budget choices explained in plain English before the rumor mill turns arithmetic into betrayal.",
    transcript:
      "If a street repair has to wait, say it. If a tax dollar is doing three jobs, show us. Mystery math is how people stop believing the room is honest.",
  },
  {
    id: "briefing_finance",
    kind: "popup",
    speaker: "Thomas Reed",
    role: "Finance Director",
    district: "Citywide",
    title: "The Ledger Is Public",
    targetTab: "budget",
    metricFocus: "Reserves",
    message:
      "Your budget is not treasure. It is capacity. Push departments too low and service quality falls; ignore debt and the next quarter starts with fewer choices.",
    transcript:
      "A balanced quarter can still be fragile. Watch reserves, debt, and whether departments can actually do the work you announce.",
  },
  {
    id: "voice_sam_services",
    kind: "voice_log",
    speaker: "Sam Lopez",
    role: "Bus driver",
    district: "Downtown",
    title: "Voice Log: One Hole, Three Departments",
    targetTab: "dashboard",
    metricFocus: "Services",
    message:
      "Sam sees how a water break becomes a transit delay, a safety issue, and a communications failure. Departments are separate on paper; residents experience them as one city.",
    transcript:
      "People do not care which department owns the hole. They care whether the bus detour is posted, the repair crew arrives, and someone answers the phone.",
  },
  {
    id: "briefing_public_works",
    kind: "popup",
    speaker: "Arjun Patel",
    role: "Public Works Director",
    district: "Citywide",
    title: "The Map Is a Maintenance Promise",
    targetTab: "districts",
    metricFocus: "Infrastructure",
    message:
      "Open the districts view when the city feels abstract. Every block has pipes, pavement, crossings, and old promises. Infrastructure changes slowly, then all at once.",
    transcript:
      "A pothole is small until it is an ambulance route, a bus route, and a council member's inbox. The map is where small failures become visible early.",
  },
  {
    id: "voice_hannah_university",
    kind: "voice_log",
    speaker: "Hannah Cho",
    role: "Student librarian",
    district: "University District",
    title: "Voice Log: Campus Meets City Hall",
    targetTab: "residents",
    metricFocus: "Education",
    message:
      "Hannah lives where the community college, rentals, buses, and clinics overlap. The town colors are red, white, and black because the university is part of Middletown's civic identity.",
    transcript:
      "A late bus can erase a lab shift. A confusing permit can kill a student project. Government feels real when it respects the week people are actually living.",
  },
  {
    id: "briefing_council",
    kind: "popup",
    speaker: "Denise Walker",
    role: "Council President",
    district: "Northside",
    title: "Agenda Before Drama",
    targetTab: "council",
    metricFocus: "Legitimacy",
    message:
      "Use the council agenda to choose what gets political oxygen this quarter. Every action helps someone and disappoints someone else. The public remembers the tradeoff more than the speech.",
    transcript:
      "Bring us clear choices. Council can fight over priorities, but vague priorities turn every meeting into a weather system.",
  },
  {
    id: "voice_luis_housing",
    kind: "voice_log",
    speaker: "Luis Garcia",
    role: "Union steward",
    district: "Northside",
    title: "Voice Log: Repairs Are Policy",
    targetTab: "districts",
    metricFocus: "Housing",
    message:
      "Luis wants housing, code calls, and repairs treated as core government work. A resident who cannot get a call returned does not care how elegant the plan sounded.",
    transcript:
      "We do not need another speech about housing. We need repairs, enforcement, and a number to call that works.",
  },
  {
    id: "briefing_begin",
    kind: "popup",
    speaker: "Iris Campbell",
    role: "Communications Director",
    district: "Citywide",
    title: "Now Govern in Public",
    targetTab: "dashboard",
    metricFocus: "Public trust",
    message:
      "Your first quarter starts with orientation because trust begins before policy. Read the voice logs, pick an agenda item, adjust budgets if needed, then simulate the quarter.",
    transcript:
      "Say what you are doing, say why, and say what residents should expect next. That is not spin. That is the operating system of local government.",
  },
];

export function clampTutorialIndex(index) {
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, Math.trunc(index)));
}
