import raw from "./sample.json";
import type { Account, AppState, Bill, Goal, Source, Transaction } from "../types";

const sample = raw as {
  accounts: Account[];
  transactions: Transaction[];
  bills: Bill[];
  goals: Goal[];
  sources: Source[];
};

export function freshState(): AppState {
  return {
    version: 2,
    onboarded: false,
    profile: {
      name: "Arun",
      incomeStyle: "salaried",
      city: "Bengaluru",
      salaryDay: 1,
      savingsTarget: null,
      commitments: ["Rent", "EMIs", "SIPs", "Family support"],
      startingNote: null,
    },
    theme: "system",
    hideBalances: false,
    biometric: false,
    notifBills: true,
    notifAttention: true,
    notifInsights: true,
    notifQuiet: true,
    cashNudge: true,
    readNotificationIds: [],
    transactions: sample.transactions.map((tx) => ({ ...tx })),
    bills: sample.bills.map((bill) => ({ ...bill })),
    accounts: sample.accounts.map((account) => ({ ...account })),
    goals: sample.goals.map((goal) => ({ ...goal })),
    sources: sample.sources.map((source) => ({ ...source })),
  };
}

export const STORAGE_KEY = "daily-money-preview";
