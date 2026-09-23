export type Side = "asset" | "liability";
export type Destination = "emergency" | "goal" | "investment";
export type TxType =
  | "expense"
  | "income"
  | "transfer"
  | "save"
  | "lend"
  | "borrow"
  | "repayment"
  | "refund";
export type ReviewKind = "unknown" | "classify" | "duplicate" | "repay";
export type Confidence = "high" | "medium" | "low";
export type IncomeStyle = "salaried" | "variable" | "unsure";
export type ThemeChoice = "system" | "light" | "dark";
export type BillStatus = "upcoming" | "due_today" | "overdue" | "paid";

export interface Account {
  id: string;
  name: string;
  institution: string;
  group: string;
  side: Side;
  kind: string;
  balance: number;
  liquid: boolean;
  mask?: string;
  detail: string;
  updated: string;
  live: boolean;
  destination?: Destination;
  apr?: number;
  minDue?: number;
  debtKind?: string;
}

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  at: string;
  title: string;
  category: string;
  accountId: string;
  counterAccountId?: string;
  person?: string;
  channel: string;
  source: string;
  notes?: string;
  confidence: Confidence;
  needsConfirm: boolean;
  included: boolean;
  applied: boolean;
  review?: ReviewKind;
  upiApp?: string;
  linkedId?: string;
  receiving?: boolean;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  due: string;
  paid: boolean;
  paidOn?: string;
  accountId: string;
  counterAccountId?: string;
  payLabel: string;
  category: string;
  reserved: boolean;
  autopay: boolean;
  kind: "expense" | "repayment";
  note?: string;
  section?: "renewal" | "subscription";
  status?: BillStatus;
}

export interface Goal {
  id: string;
  name: string;
  why: string;
  saved: number;
  target: number;
  monthly: number;
  by: string;
  linkedAccountId?: string;
}

export interface Source {
  id: string;
  name: string;
  detail: string;
  kind: string;
  group: string;
  mapsTo?: string;
  enabled: boolean;
  fresh: string;
  weight: number;
}

export interface Profile {
  name: string;
  incomeStyle: IncomeStyle;
  city: string;
  salaryDay: number;
  savingsTarget: number | null;
  commitments: string[];
  startingNote: string | null;
}

export interface AppState {
  version: 2;
  onboarded: boolean;
  profile: Profile;
  theme: ThemeChoice;
  hideBalances: boolean;
  biometric: boolean;
  notifBills: boolean;
  notifAttention: boolean;
  notifInsights: boolean;
  notifQuiet: boolean;
  cashNudge: boolean;
  readNotificationIds: string[];
  transactions: Transaction[];
  bills: Bill[];
  accounts: Account[];
  goals: Goal[];
  sources: Source[];
}

export interface AttentionItem {
  id: string;
  kind: ReviewKind | "cash";
  title: string;
  hint: string;
  amount?: number;
  inflow?: boolean;
  txId?: string;
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minDue: number;
  debtKind: string;
}

export interface Payoff {
  months: number;
  interest: number;
  unfinished: boolean;
}

export interface FinanceView {
  available: number;
  reserved: number;
  liquid: number;
  snapshot: { moneyIn: number; moneyOut: number; saved: number; rate: number };
  previous: { moneyIn: number; moneyOut: number; saved: number; rate: number };
  upcoming: Bill | null;
  alsoToday: Bill[];
  attention: AttentionItem[];
  bills: Bill[];
  forecast: {
    income: number;
    incomeDate: string;
    bills: Bill[];
    billsTotal: number;
    savings: number;
    typical: number;
    surplus: number;
  };
  assetsTotal: number;
  liabilitiesTotal: number;
  netWorth: number;
  coverage: number;
  healthOn: boolean;
  healthReason: string;
  health: {
    status: "Tight" | "Stable" | "Strong";
    doing: string[];
    needs: string[];
    next: string;
    action: string;
    href: string;
  } | null;
  emergencySaved: number;
  emergencyTarget: number;
  emergencyMonths: number;
  goals: Goal[];
  insight: { category?: string; body: string };
  debt: {
    debts: DebtItem[];
    closeFirst: DebtItem;
    avalanche: DebtItem[];
    snowball: DebtItem[];
    snowballNote: string;
    reason: string;
    baseline: Payoff;
    withExtra: Payoff;
    monthsSaved: number;
    interestSaved: number;
  } | null;
  debtLine: string | null;
  manualGap: number;
  categories: { category: string; amount: number }[];
  receivables: Account[];
}
