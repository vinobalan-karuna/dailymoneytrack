import { useEffect, useState } from "react";
import { PhoneFrame, type Tab } from "./components/Shell";
import { ActivityScreen, TransactionScreen } from "./screens/Activity";
import { HomeScreen } from "./screens/Home";
import { NotificationsScreen } from "./screens/Notifications";
import { OnboardingScreen } from "./screens/Onboarding";
import { PlanScreen, type PlanTab } from "./screens/Plan";
import { SavingsScreen } from "./screens/Savings";
import { YouPageScreen, YouScreen, type YouPage } from "./screens/You";
import { useStore } from "./state/store";

type Route =
  | { name: "onboarding" }
  | { name: "home" }
  | { name: "activity" }
  | { name: "tx"; id: string }
  | { name: "plan"; tab: PlanTab }
  | { name: "savings" }
  | { name: "you" }
  | { name: "page"; page: YouPage }
  | { name: "notifications" };

function parseRoute(hash: string, onboarded: boolean): Route {
  const path = hash.replace(/^#/, "") || "/";
  if (!onboarded) return { name: "onboarding" };
  if (path.startsWith("/activity/")) return { name: "tx", id: decodeURIComponent(path.slice("/activity/".length)) };
  if (path.startsWith("/plan")) {
    const tab = new URLSearchParams(path.split("?")[1] ?? "").get("tab");
    const allowed: PlanTab[] = ["bills", "goals", "debt", "incoming", "forecast"];
    return { name: "plan", tab: allowed.includes(tab as PlanTab) ? (tab as PlanTab) : "bills" };
  }
  if (path.startsWith("/you/")) return { name: "page", page: path.slice("/you/".length) as YouPage };
  if (path.startsWith("/savings")) return { name: "savings" };
  if (path.startsWith("/activity")) return { name: "activity" };
  if (path.startsWith("/you")) return { name: "you" };
  if (path.startsWith("/notifications")) return { name: "notifications" };
  return { name: "home" };
}

function hrefFor(route: Route): string {
  switch (route.name) {
    case "onboarding":
      return "#/onboarding";
    case "home":
      return "#/home";
    case "activity":
      return "#/activity";
    case "tx":
      return `#/activity/${encodeURIComponent(route.id)}`;
    case "plan":
      return `#/plan?tab=${route.tab}`;
    case "savings":
      return "#/savings";
    case "you":
      return "#/you";
    case "page":
      return `#/you/${route.page}`;
    case "notifications":
      return "#/notifications";
  }
}

function tabFor(route: Route): Tab | null {
  if (route.name === "home") return "home";
  if (route.name === "activity" || route.name === "tx") return "activity";
  if (route.name === "plan") return "plan";
  if (route.name === "savings") return "savings";
  if (route.name === "you" || route.name === "page") return "you";
  return route.name === "notifications" ? "home" : null;
}

export function App() {
  const { state, theme, snack, dismissSnack, undoSnack } = useStore();
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash, state.onboarded));

  useEffect(() => {
    const next = parseRoute(window.location.hash, state.onboarded);
    setRoute(next);
    const onHash = () => setRoute(parseRoute(window.location.hash, state.onboarded));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [state.onboarded]);

  const go = (next: Route) => {
    const href = hrefFor(next);
    if (window.location.hash !== href) window.location.hash = href;
    setRoute(next);
  };

  const tab = state.onboarded ? tabFor(route) : null;

  return (
    <PhoneFrame
      theme={theme}
      tab={tab}
      onTab={(next) => go({ name: next === "plan" ? "plan" : next, ...(next === "plan" ? { tab: "bills" as const } : {}) } as Route)}
      snack={
        snack ? (
          <div className="snack" role="status">
            <span>{snack.message}</span>
            {snack.undo && (
              <button type="button" onClick={undoSnack}>
                Undo
              </button>
            )}
            <button type="button" onClick={dismissSnack} aria-label="Dismiss">
              ×
            </button>
          </div>
        ) : null
      }
    >
      {!state.onboarded || route.name === "onboarding" ? (
        <OnboardingScreen />
      ) : route.name === "home" ? (
        <HomeScreen
          onNotifications={() => go({ name: "notifications" })}
          onProfile={() => go({ name: "you" })}
          onActivity={() => go({ name: "activity" })}
          onPlan={() => go({ name: "plan", tab: "bills" })}
          onDebt={() => go({ name: "plan", tab: "debt" })}
          onOpenTx={(id) => go({ name: "tx", id })}
        />
      ) : route.name === "activity" ? (
        <ActivityScreen onOpen={(id) => go({ name: "tx", id })} />
      ) : route.name === "tx" ? (
        <TransactionScreen id={route.id} onBack={() => go({ name: "activity" })} />
      ) : route.name === "plan" ? (
        <PlanScreen tab={route.tab} onTab={(planTab) => go({ name: "plan", tab: planTab })} />
      ) : route.name === "savings" ? (
        <SavingsScreen
          onSources={() => go({ name: "page", page: "sources" })}
          onOpen={(href) => {
            if (href.startsWith("/activity")) go({ name: "activity" });
            else if (href.startsWith("/plan")) go({ name: "plan", tab: "bills" });
            else go({ name: "savings" });
          }}
        />
      ) : route.name === "you" ? (
        <YouScreen onOpen={(page) => go({ name: "page", page })} />
      ) : route.name === "page" ? (
        <YouPageScreen page={route.page} onBack={() => go({ name: "you" })} />
      ) : (
        <NotificationsScreen onBack={() => go({ name: "home" })} onOpenTx={(id) => go({ name: "tx", id })} onPlan={() => go({ name: "plan", tab: "bills" })} />
      )}
    </PhoneFrame>
  );
}
