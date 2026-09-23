import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { freshState, STORAGE_KEY } from "../data/initial";
import { computeFinance } from "../lib/finance";
import { addEntry, markBillPaid, resolveReview, type NewEntry, type ResolveAction } from "../lib/ledger";
import type { AppState, FinanceView, IncomeStyle, ThemeChoice } from "../types";

interface Snack {
  id: number;
  message: string;
  undo?: () => void;
}

interface Store {
  state: AppState;
  theme: "light" | "dark";
  finance: FinanceView;
  snack: Snack | null;
  showSnack: (message: string, undo?: () => void) => void;
  dismissSnack: () => void;
  undoSnack: () => void;
  exploreSample: () => void;
  completeOnboarding: (profile: {
    name: string;
    incomeStyle: IncomeStyle;
    salaryDay?: number;
    savingsTarget?: number | null;
    commitments?: string[];
    startingNote?: string | null;
  }) => void;
  setTheme: (theme: ThemeChoice) => void;
  patchProfile: (patch: Partial<AppState["profile"]>) => void;
  toggleHideBalances: () => void;
  setBiometric: (on: boolean) => void;
  setNotif: (key: "notifBills" | "notifAttention" | "notifInsights" | "notifQuiet", on: boolean) => void;
  setSourceEnabled: (id: string, enabled: boolean) => void;
  dismissCashNudge: () => void;
  setCashBalance: (amount: number) => void;
  addTransaction: (entry: NewEntry) => void;
  resolveTransaction: (id: string, action: ResolveAction, category?: string) => void;
  payBill: (id: string) => void;
  markNotificationRead: (id: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<Store | null>(null);

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return freshState();
    const parsed = JSON.parse(saved) as AppState;
    if (parsed.version !== 2 || !Array.isArray(parsed.accounts)) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const [snack, setSnack] = useState<Snack | null>(null);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!snack) return;
    const timer = window.setTimeout(() => {
      setSnack((current) => (current?.id === snack.id ? null : current));
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [snack]);

  const theme = state.theme === "system" ? (systemDark ? "dark" : "light") : state.theme;
  const finance = useMemo(() => computeFinance(state), [state]);

  const showSnack = (message: string, undo?: () => void) => {
    setSnack({ id: Date.now(), message, undo });
  };

  const value: Store = {
    state,
    theme,
    finance,
    snack,
    showSnack,
    dismissSnack: () => setSnack(null),
    undoSnack: () => {
      snack?.undo?.();
      setSnack(null);
    },
    exploreSample: () => {
      setState((current) => ({
        ...current,
        onboarded: true,
        profile: { ...current.profile, name: "Arun", incomeStyle: "salaried", startingNote: null },
      }));
      showSnack("Showing Arun's sample finances");
    },
    completeOnboarding: (profile) => {
      setState((current) => ({
        ...current,
        onboarded: true,
        profile: {
          ...current.profile,
          name: profile.name.trim() || "Arun",
          incomeStyle: profile.incomeStyle,
          salaryDay: profile.salaryDay ?? current.profile.salaryDay,
          savingsTarget: profile.savingsTarget === undefined ? current.profile.savingsTarget : profile.savingsTarget,
          commitments: profile.commitments ?? current.profile.commitments,
          startingNote: profile.startingNote === undefined ? current.profile.startingNote : profile.startingNote,
        },
      }));
    },
    setTheme: (choice) => setState((current) => ({ ...current, theme: choice })),
    patchProfile: (patch) => setState((current) => ({ ...current, profile: { ...current.profile, ...patch } })),
    toggleHideBalances: () => setState((current) => ({ ...current, hideBalances: !current.hideBalances })),
    setBiometric: (on) => {
      setState((current) => ({ ...current, biometric: on }));
      showSnack(on ? "Fingerprint lock saved for this preview" : "Fingerprint lock off");
    },
    setNotif: (key, on) => setState((current) => ({ ...current, [key]: on })),
    setSourceEnabled: (id, enabled) => {
      setState((current) => ({
        ...current,
        sources: current.sources.map((source) => (source.id === id ? { ...source, enabled } : source)),
      }));
    },
    dismissCashNudge: () => {
      const previous = state.cashNudge;
      if (!previous) return;
      setState((current) => ({ ...current, cashNudge: false }));
      showSnack("Cash reminder hidden", () => setState((current) => ({ ...current, cashNudge: true })));
    },
    setCashBalance: (amount) => {
      setState((current) => ({
        ...current,
        cashNudge: false,
        accounts: current.accounts.map((account) =>
          account.id === "cash" ? { ...account, balance: amount, updated: "Today", live: false } : account,
        ),
      }));
      showSnack("Cash wallet updated");
    },
    addTransaction: (entry) => {
      const previous = state;
      setState(addEntry(state, entry));
      showSnack("Saved", () => setState(previous));
    },
    resolveTransaction: (id, action, category) => {
      const previous = state;
      const result = resolveReview(state, id, action, category);
      setState(result.state);
      if (result.message) showSnack(result.message, () => setState(previous));
    },
    payBill: (id) => {
      const previous = state;
      const result = markBillPaid(state, id);
      setState(result.state);
      if (result.message) showSnack(result.message, () => setState(previous));
    },
    markNotificationRead: (id) => {
      setState((current) =>
        current.readNotificationIds.includes(id)
          ? current
          : { ...current, readNotificationIds: [...current.readNotificationIds, id] },
      );
    },
    resetAll: () => {
      setSnack(null);
      setState(freshState());
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store missing");
  return store;
}
