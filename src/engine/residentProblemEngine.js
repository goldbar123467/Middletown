import { DEFAULT_PROBLEM_TEMPLATE, DISTRICT_FLAGSHIP_ISSUES, PROBLEM_TEMPLATES } from "../data/campaign.js";
import { residentProblemDetail } from "../data/localFlavor.js";

const PROBLEM_DETAIL_SPOTLIGHTS = {
  resident_0001: "Maria's diner keeps losing lunch traffic when downtown detours change without a posted schedule, and her staff hear three different budget explanations from three different offices.",
  resident_0002: "DeShawn's ambulance crew keeps finding Southgate calls delayed by blocked turns near the mall corridor and by residents who never saw the service notice.",
  resident_0003: "Hannah sees students lose library lab time because bus timing, housing forms, and campus safety updates do not line up in one place.",
  resident_0004: "Luis is tracking Northside rental repairs where aging mains, bad meters, and landlord delays all point tenants toward different counters.",
  resident_0005: "Pat's Westhaven senior group needs clinic routes, snow clearance, and downtown access explained before winter turns every missed connection into a health risk.",
  resident_0006: "Anita's Airport Industrial shift workers need freight growth to come with buses, childcare timing, and utility bills workers can actually challenge.",
  resident_0007: "Calvin keeps showing East Bank neighbors how floodwater, ramps, asthma visits, and utility outages are one infrastructure problem with several names.",
  resident_0008: "Nadia's Midtown shop can survive repairs, but not cones, alley closures, and hydrant work that arrive with no public calendar.",
  resident_0009: "Sam's downtown route gets blamed for delays that begin with utility cuts, curb work, and departments that do not warn Transit first.",
  resident_0010: "Reese wants Southgate sidewalk and lighting calls ranked by service need, not by who can make the loudest redevelopment argument.",
  resident_0011: "Alex watches University District reliability crews get squeezed between clean-energy promises and old equipment that fails during bad weather.",
  resident_0012: "Jamie wants Northside Elementary safety treated as crossings, lights, response times, and trust instead of one more memo after a near-miss.",
  resident_0013: "Cameron needs Westhaven preparedness lists to know who has oxygen, who lacks a car, and who will not answer an unfamiliar city number.",
  resident_0014: "Drew's Airport Industrial families need safe crossings through freight traffic after school and after second shift, not a map that assumes nine-to-five travel.",
  resident_0015: "Hayden is watching East Bank storefronts ask for flood plans and foot traffic at the same time, because either problem can close a small business.",
  resident_0016: "Rowan wants Midtown maintenance numbers to become named work orders, crews, and dates before another block learns the plan from a barricade.",
  resident_0017: "Marisol's downtown patients can handle hard service news, but not closures and detours announced after appointments are already missed.",
  resident_0018: "Devon wants Southgate youth to see sidewalks, response times, and public meetings solve something before cynicism becomes the lesson.",
};

function problemTemplate(resident) {
  return PROBLEM_TEMPLATES[resident.priority] ?? DEFAULT_PROBLEM_TEMPLATE;
}

function problemDuration(index) {
  return 10 + ((index * 7) % 41);
}

export function createResidentProblems(residents) {
  return residents.map((resident, index) => {
    const template = problemTemplate(resident);
    const issue = DISTRICT_FLAGSHIP_ISSUES[resident.district];
    return {
      id: `problem_${resident.id}`,
      residentId: resident.id,
      residentName: resident.name,
      district: resident.district,
      priority: resident.priority,
      metric: template.metric,
      title: template.title,
      problem: PROBLEM_DETAIL_SPOTLIGHTS[resident.id] ?? residentProblemDetail(resident, template, issue),
      duration: problemDuration(index),
      progress: 0,
      status: "active",
      solvedTurn: null,
    };
  });
}

function actionHelpsProblem(action, problem) {
  if (!action) return false;
  const effects = action.effects ?? {};
  return (
    action.domain === problem.priority ||
    action.district === problem.district ||
    (effects[problem.metric] ?? 0) > 0
  );
}

function progressGain(problem, metrics, helpfulActionCount) {
  const metricValue = metrics[problem.metric] ?? 50;
  const base = metricValue >= 75 ? 3 : metricValue >= 58 ? 2 : 1;
  return Math.max(1, base + Math.min(2, helpfulActionCount));
}

export function updateResidentProblems({ problems, metrics, actions = [], turn }) {
  const solved = [];
  const updated = problems.map((problem) => {
    if (problem.status === "solved") return problem;

    const helpfulActionCount = actions.filter((action) => actionHelpsProblem(action, problem)).length;
    const progress = Math.min(problem.duration, problem.progress + progressGain(problem, metrics, helpfulActionCount));
    if (progress >= problem.duration) {
      const solvedProblem = {
        ...problem,
        progress,
        status: "solved",
        solvedTurn: turn,
      };
      solved.push(solvedProblem);
      return solvedProblem;
    }

    return {
      ...problem,
      progress,
    };
  });

  return { problems: updated, solved };
}

export function residentProblemSummary(problems) {
  const solved = problems.filter((problem) => problem.status === "solved").length;
  const total = problems.length;
  const active = Math.max(0, total - solved);
  return {
    total,
    solved,
    active,
    solvedPct: total ? Math.round((solved / total) * 100) : 100,
  };
}
