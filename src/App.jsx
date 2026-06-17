import { Suspense, lazy, useMemo, useReducer } from "react";
import { gameReducer, initialState } from "./engine/gameReducer.js";
import TitleScreen from "./components/TitleScreen.jsx";
import Dashboard from "./components/Dashboard.jsx";
import TabBar from "./components/TabBar.jsx";
import EventCard from "./components/EventCard.jsx";
import ResolveScreen from "./components/ResolveScreen.jsx";
import Chronicle from "./components/Chronicle.jsx";
import GameOverScreen from "./components/GameOverScreen.jsx";
import VictoryScreen from "./components/VictoryScreen.jsx";
import DashboardTab from "./components/tabs/DashboardTab.jsx";
import TutorialOverlay from "./components/TutorialOverlay.jsx";

const BudgetTab = lazy(() => import("./components/tabs/BudgetTab.jsx"));
const DepartmentsTab = lazy(() => import("./components/tabs/DepartmentsTab.jsx"));
const CouncilTab = lazy(() => import("./components/tabs/CouncilTab.jsx"));
const DistrictsTab = lazy(() => import("./components/tabs/DistrictsTab.jsx"));
const ResidentsTab = lazy(() => import("./components/tabs/ResidentsTab.jsx"));
const ProjectsTab = lazy(() => import("./components/tabs/ProjectsTab.jsx"));
const PoliciesTab = lazy(() => import("./components/tabs/PoliciesTab.jsx"));
const ServicesTab = lazy(() => import("./components/tabs/ServicesTab.jsx"));
const StoryTab = lazy(() => import("./components/tabs/StoryTab.jsx"));
const ChronicleTab = lazy(() => import("./components/tabs/ChronicleTab.jsx"));

function devScenarioState() {
  if (!import.meta.env.DEV || typeof window === "undefined") return initialState;

  const scenario = new URLSearchParams(window.location.search).get("scenario");
  if (!scenario) return initialState;

  const started = gameReducer(initialState, { type: "START_GAME", payload: { difficulty: "normal" } });
  if (scenario === "victory") {
    return {
      ...started,
      phase: "victory",
      turn: 101,
      metrics: {
        ...started.metrics,
        budget: 43,
        trust: 95,
        services: 99,
        debt: 68,
        infrastructure: 82,
        housing: 78,
        economy: 74,
        equity: 76,
      },
      civicRecord: {
        ...started.civicRecord,
        choicesFiled: 47,
        projectsCompleted: 5,
        policiesAdopted: 4,
        publicProcess: 24,
      },
      achievements: started.achievements.map((achievement, index) => ({
        ...achievement,
        unlocked: index < 6,
        unlockedTurn: index < 6 ? Math.max(1, index * 12) : null,
      })),
    };
  }

  if (scenario === "gameover") {
    return {
      ...started,
      phase: "game_over",
      gameOverReason: "trust_collapse",
      metrics: {
        ...started.metrics,
        trust: 0,
        services: 18,
        budget: 9,
      },
    };
  }

  return initialState;
}

function TabLoadingFallback() {
  return (
    <section className="panel p-5 muted-copy">
      Loading City Hall files...
    </section>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState, devScenarioState);
  const eventPhase = useMemo(() => ["council_session", "city_resolve", "news_event", "citizen_response"].includes(state.phase), [state.phase]);
  const displayTab = eventPhase ? "chronicle" : state.activeTab;

  if (state.phase === "title") {
    return <TitleScreen onStart={(difficulty) => dispatch({ type: "START_GAME", payload: { difficulty } })} />;
  }

  if (state.phase === "game_over") {
    return <GameOverScreen reason={state.gameOverReason} onPlayAgain={() => dispatch({ type: "PLAY_AGAIN" })} />;
  }

  if (state.phase === "victory") {
    return <VictoryScreen state={state} onPlayAgain={() => dispatch({ type: "PLAY_AGAIN" })} />;
  }

  const isManagement = state.phase === "management";
  const latestReaction = state.reactions?.[0];
  const latestAchievement = latestReaction?.type === "achievement";

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <div className="top-shell sticky top-0 z-30">
        <Dashboard state={state} />
        <TabBar activeTab={displayTab} disabled={eventPhase} onSetTab={(tab) => dispatch({ type: "SET_TAB", payload: { tab } })} />
      </div>

      {(state.toast || latestReaction) && (
        <div className="civic-notice-stack fixed right-4 top-4 z-50">
          {state.toast && (
            <button className="panel p-3 text-left" onClick={() => dispatch({ type: "DISMISS_TOAST" })}>
              <span className="section-kicker">Agenda filed</span>
              <span className="block font-black mt-1">{state.toast}</span>
            </button>
          )}
          {latestReaction && (
            <section className={`panel p-3 civic-reaction-pop${latestAchievement ? " is-achievement" : ""}`} aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <span className="section-kicker">{latestAchievement ? "Achievement unlocked" : "Resident reaction"}</span>
                <span className={`status-chip${latestAchievement ? " is-good" : ""}`}>{latestReaction.sentiment}</span>
              </div>
              <strong className="block mt-2">{latestReaction.residentName}</strong>
              <p className="text-sm muted-copy mt-1">{latestReaction.message}</p>
            </section>
          )}
        </div>
      )}

      <main className="flex-1 page-frame">
        {isManagement && (
          <div className="page-stack">
            {displayTab === "dashboard" && <DashboardTab state={state} dispatch={dispatch} />}
            {displayTab !== "dashboard" && (
              <Suspense fallback={<TabLoadingFallback />}>
                {displayTab === "budget" && <BudgetTab state={state} dispatch={dispatch} />}
                {displayTab === "departments" && <DepartmentsTab state={state} />}
                {displayTab === "council" && <CouncilTab state={state} dispatch={dispatch} />}
                {displayTab === "districts" && <DistrictsTab state={state} />}
                {displayTab === "residents" && <ResidentsTab state={state} />}
                {displayTab === "projects" && <ProjectsTab state={state} dispatch={dispatch} />}
                {displayTab === "policies" && <PoliciesTab state={state} dispatch={dispatch} />}
                {displayTab === "services" && <ServicesTab state={state} />}
                {displayTab === "story" && <StoryTab state={state} />}
                {displayTab === "chronicle" && <ChronicleTab entries={state.chronicle} />}
              </Suspense>
            )}
          </div>
        )}

        {eventPhase && (
          <div className="event-layout">
            <div className="event-main page-stack">
              {state.phase === "council_session" && state.currentCouncilEvent && (
                <EventCard
                  event={state.currentCouncilEvent}
                  phaseLabel="Council Session"
                  onChoose={(optionIndex) => dispatch({ type: "SELECT_COUNCIL_OPTION", payload: { optionIndex } })}
                />
              )}

              {state.phase === "city_resolve" && (
                <ResolveScreen
                  title="Quarter Resolved"
                  body="Staff reports are filed. Now the town's public story catches up."
                  buttonText="Read the Headlines"
                  deltas={state.resourceDeltas}
                  onContinue={() => dispatch({ type: "CONTINUE_TO_NEWS" })}
                />
              )}

              {state.phase === "news_event" && state.currentNewsEvent && (
                <EventCard
                  event={state.currentNewsEvent}
                  phaseLabel="Middletown Herald"
                  onChoose={(optionIndex) => dispatch({ type: "SELECT_NEWS_RESPONSE", payload: { optionIndex } })}
                />
              )}

              {state.phase === "citizen_response" && (
                <ResolveScreen
                  title="Citizen Response"
                  body="The quarter is part policy, part memory. Residents carry both into the next meeting."
                  buttonText="Advance Quarter"
                  deltas={state.resourceDeltas}
                  onContinue={() => dispatch({ type: "ADVANCE_QUARTER" })}
                />
              )}
            </div>
            <Chronicle entries={state.chronicle} />
          </div>
        )}
      </main>

      {isManagement && (
        <div className="bottom-action-bar sticky bottom-0 z-20 text-center px-4 py-3">
          <button className="btn btn-primary px-10 py-3" onClick={() => dispatch({ type: "SIMULATE_QUARTER" })}>
            Run Quarter
          </button>
          <p className="text-sm mt-1 muted-copy">Make your choices, then see how Middletown reacts.</p>
        </div>
      )}

      {isManagement && state.turn === 1 && <TutorialOverlay tutorial={state.tutorial} dispatch={dispatch} />}
    </div>
  );
}
