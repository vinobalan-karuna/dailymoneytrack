import type {
  Account,
  AppState,
  AttentionItem,
  Bill,
  BillStatus,
  DebtItem,
  FinanceView,
  Payoff,
  Transaction,
} from "../types";
import {
  MONTH,
  PREVIOUS_MONTH,
  TODAY,
  addDays,
  formatInr,
  oneDecimal,
} from "./format";

const ESSENTIALS = 75000;
const FOOD_USUAL = 4000;
const NEXT_SALARY = 148000;
const PLANNED_SAVINGS = 23000;
const TYPICAL_SPEND = 21000;
const EMERGENCY_TARGET = 450000;
const PAYOFF_CAP = 480;

const ASSET_GROUPS = ["Liquid", "Investments", "Retirement", "Gold", "Receivables", "Property"];
const LIABILITY_GROUPS = ["Cards", "Loans"];

const REVIEW_HINT: Record<string, string> = {
  unknown: "No shop name on the SMS",
  classify: "Expense, lent, transfer, or gift?",
  duplicate: "Possible duplicate — counted once so far",
  repay: "Is this a repayment?",
};

export function billStatus(bill: Bill): BillStatus {
  if (bill.paid) return "paid";
  if (bill.due === TODAY) return "due_today";
  if (bill.due < TODAY) return "overdue";
  return "upcoming";
}

export function withStatus(bills: Bill[]): Bill[] {
  return bills.map((bill) => ({ ...bill, status: billStatus(bill) }));
}

export function countsInMonth(tx: Transaction): boolean {
  return Boolean(tx.included && (tx.applied || !tx.needsConfirm));
}

export function monthFlow(transactions: Transaction[], month: string) {
  let moneyIn = 0;
  let moneyOut = 0;
  let saved = 0;
  let refunds = 0;
  for (const tx of transactions) {
    if (!tx.at.startsWith(month) || !countsInMonth(tx)) continue;
    if (tx.type === "income") moneyIn += tx.amount;
    else if (tx.type === "expense") moneyOut += tx.amount;
    else if (tx.type === "save") saved += tx.amount;
    else if (tx.type === "refund") refunds += tx.amount;
  }
  moneyOut = Math.max(0, moneyOut - refunds);
  return {
    moneyIn,
    moneyOut,
    saved,
    rate: moneyIn > 0 ? (saved / moneyIn) * 100 : 0,
  };
}

export function spendingByCategory(transactions: Transaction[], month: string) {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (!tx.at.startsWith(month) || !countsInMonth(tx)) continue;
    if (tx.type === "expense") totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
    if (tx.type === "refund") totals.set(tx.category, (totals.get(tx.category) ?? 0) - tx.amount);
  }
  return [...totals.entries()]
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function debtsOf(accounts: Account[]): DebtItem[] {
  return accounts
    .filter((account) => account.side === "liability" && account.balance > 0 && account.apr != null)
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: account.balance,
      apr: account.apr ?? 0,
      minDue: account.minDue ?? 0,
      debtKind: account.debtKind ?? "Loan",
    }));
}

export function orderDebts(debts: DebtItem[], mode: "avalanche" | "snowball"): DebtItem[] {
  const open = debts.filter((debt) => debt.balance > 0);
  if (mode === "snowball") {
    return [...open].sort((a, b) => a.balance - b.balance || b.apr - a.apr || a.name.localeCompare(b.name));
  }
  return [...open].sort((a, b) => b.apr - a.apr || a.balance - b.balance || a.name.localeCompare(b.name));
}

/** Straight monthly estimate: interest = balance × rate ÷ 12, then EMI or minimum plus extra. */
export function payoff(debt: DebtItem, extra: number): Payoff {
  let balance = debt.balance;
  let interest = 0;
  const extraPayment = Math.max(0, extra);
  for (let month = 1; month <= PAYOFF_CAP; month += 1) {
    if (balance <= 1) return { months: month - 1, interest: Math.round(interest), unfinished: false };
    const charge = (balance * debt.apr) / 100 / 12;
    interest += charge;
    balance += charge;
    const payment = Math.min(balance, debt.minDue + extraPayment);
    balance -= payment;
    if (payment <= charge && extraPayment === 0 && debt.minDue <= charge) {
      return { months: PAYOFF_CAP, interest: Math.round(interest), unfinished: true };
    }
  }
  return { months: PAYOFF_CAP, interest: Math.round(interest), unfinished: balance > 1 };
}

export function debtPlan(accounts: Account[], extra = 5000) {
  const debts = debtsOf(accounts);
  if (debts.length === 0) return null;
  const avalanche = orderDebts(debts, "avalanche");
  const snowball = orderDebts(debts, "snowball");
  const closeFirst = avalanche[0];
  const snowballFirst = snowball[0];
  if (!closeFirst || !snowballFirst) return null;
  const cheapest = [...debts].sort((a, b) => a.apr - b.apr || a.balance - b.balance)[0] ?? closeFirst;
  const baseline = payoff(closeFirst, 0);
  const withExtra = payoff(closeFirst, extra);
  const monthsSaved = baseline.unfinished || withExtra.unfinished ? 0 : Math.max(0, baseline.months - withExtra.months);
  const interestSaved = Math.max(0, baseline.interest - withExtra.interest);
  const cheapLabel = cheapest.apr === 0 ? `the 0% family loan (${cheapest.name})` : `${cheapest.name} at ${cheapest.apr}%`;
  const snowballNote =
    snowballFirst.id === closeFirst.id
      ? "Snowball picks the same loan, because it is also the smallest balance."
      : `Snowball would close ${snowballFirst.name} first — the smallest balance, ${formatInr(snowballFirst.balance)} at ${snowballFirst.apr}%. The ${closeFirst.apr}% debt would wait, so more interest builds.`;
  return {
    debts,
    closeFirst,
    avalanche,
    snowball,
    snowballNote,
    reason: `Daily Money estimates ${closeFirst.name} is the costliest debt. At ${closeFirst.apr}% a year, an extra ${formatInr(extra)} a month here reduces interest faster than paying ${cheapLabel} first. Based on the rates entered for these loans.`,
    baseline,
    withExtra,
    monthsSaved,
    interestSaved,
  };
}

export function coverageOf(state: Pick<AppState, "sources">) {
  const coverage = Math.min(
    100,
    state.sources.filter((source) => source.enabled).reduce((sum, source) => sum + source.weight, 0),
  );
  const hdfc = state.sources.find((source) => source.id === "hdfc")?.enabled ?? false;
  const second = state.sources.some((source) => (source.id === "sbi" || source.id === "groww") && source.enabled);
  if (!hdfc) {
    return {
      coverage,
      healthOn: false,
      healthReason: "Unavailable — connect HDFC bank SMS to see this.",
    };
  }
  if (!second) {
    return {
      coverage,
      healthOn: false,
      healthReason: "Unavailable — connect SBI or Groww so this is not a guess from one account.",
    };
  }
  return { coverage, healthOn: true, healthReason: "" };
}

function attentionItems(state: AppState): AttentionItem[] {
  const order = ["unknown", "classify", "duplicate", "repay"];
  const items: AttentionItem[] = state.transactions
    .filter((tx) => tx.included && tx.needsConfirm)
    .map((tx) => {
      const kind = tx.review ?? (tx.receiving ? "repay" : "unknown");
      return {
        id: tx.id,
        kind,
        title: tx.receiving ? `Money from ${tx.title}` : tx.title,
        hint: REVIEW_HINT[kind] ?? "Please check",
        amount: tx.amount,
        inflow: Boolean(tx.receiving),
        txId: tx.id,
      };
    })
    .sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  if (state.cashNudge) {
    const cash = state.accounts.find((account) => account.id === "cash");
    items.push({
      id: "cash-nudge",
      kind: "cash",
      title: "Count the cash",
      hint: cash
        ? `Wallet says ${formatInr(cash.balance)}. The last ATM was ₹10,000. Write down anything spent in notes.`
        : "The cash wallet has not been counted.",
      amount: cash?.balance,
    });
  }
  return items;
}

function healthCard(
  flow: FinanceView["snapshot"],
  bills: Bill[],
  openReviews: number,
  emergencyMonths: number,
  available: number,
): NonNullable<FinanceView["health"]> {
  const overdue = bills.filter((bill) => bill.status === "overdue");
  const cardBill = bills.find((bill) => bill.id === "bill-cc" && !bill.paid);
  let status: "Tight" | "Stable" | "Strong" = "Stable";
  if (available < 15000) status = "Tight";
  if (emergencyMonths >= 6 && flow.rate >= 30 && overdue.length === 0) status = "Strong";
  const doing = [
    flow.rate >= 15 ? `You saved ${Math.round(flow.rate)}% of this month's income` : null,
    "Both EMIs this month went through",
    "Salary landed on the 1st, as usual",
  ].filter((line): line is string => Boolean(line));
  const needs = [
    emergencyMonths < 6 ? `Emergency fund covers ${oneDecimal(emergencyMonths)} months, not 6` : null,
    overdue[0] ? `${overdue[0].name} is overdue` : null,
    openReviews > 0 ? (openReviews === 1 ? "1 payment still needs a check" : `${openReviews} payments still need a check`) : null,
  ].filter((line): line is string => Boolean(line));
  let next = "After rent, move ₹12,000 to the emergency fund.";
  let action = "See the emergency fund";
  let href = "/savings";
  if (overdue[0]) {
    next = `Pay ${overdue[0].name} — ${formatInr(overdue[0].amount)} is overdue.`;
    action = "Review bills";
    href = "/plan";
  } else if (openReviews > 0) {
    next = "Confirm the unnamed UPI payment so this month stays accurate.";
    action = "Review activity";
    href = "/activity";
  } else if (cardBill) {
    next = "Pay the Axis card bill due 28 Sep, then top up the emergency fund.";
    action = "Review bills";
    href = "/plan";
  }
  return { status, doing, needs, next, action, href };
}

function insight(transactions: Transaction[], emergencyMonths: number): FinanceView["insight"] {
  const food = transactions
    .filter((tx) => countsInMonth(tx) && tx.at.startsWith(MONTH) && tx.type === "expense" && tx.category === "Food delivery")
    .reduce((sum, tx) => sum + tx.amount, 0);
  if (food === 0) {
    return { body: `Your emergency fund covers ${oneDecimal(emergencyMonths)} months of essentials. Six months would be ${formatInr(EMERGENCY_TARGET)}.` };
  }
  if (food < FOOD_USUAL) {
    return {
      category: "Food delivery",
      body: `Food delivery is ${formatInr(food)} this month — ${formatInr(FOOD_USUAL - food)} under your usual pace by today. The Europe trip still needs ₹11,500 a month.`,
    };
  }
  return {
    category: "Food delivery",
    body: `Food delivery is ${formatInr(food)} this month, past your usual ${formatInr(FOOD_USUAL)} by today.`,
  };
}

export function groupAccounts(accounts: Account[], side: "asset" | "liability") {
  const groups = side === "asset" ? ASSET_GROUPS : LIABILITY_GROUPS;
  return groups
    .map((group) => ({ group, items: accounts.filter((account) => account.side === side && account.group === group) }))
    .filter((group) => group.items.length > 0);
}

export function computeFinance(state: AppState, extra = 5000): FinanceView {
  const bills = withStatus(state.bills);
  const reserved = bills.filter((bill) => bill.reserved && !bill.paid).reduce((sum, bill) => sum + bill.amount, 0);
  const liquid = state.accounts.filter((account) => account.liquid).reduce((sum, account) => sum + account.balance, 0);
  const available = liquid - reserved;
  const snapshot = monthFlow(state.transactions, MONTH);
  const previous = monthFlow(state.transactions, PREVIOUS_MONTH);
  const soon = bills.filter((bill) => !bill.paid && bill.due >= TODAY && bill.due <= addDays(TODAY, 14));
  const pool = soon.some((bill) => bill.reserved) ? soon.filter((bill) => bill.reserved) : soon;
  const upcoming = [...pool].sort((a, b) => b.amount - a.amount)[0] ?? null;
  const alsoToday = bills.filter((bill) => !bill.paid && bill.due === TODAY && bill.id !== upcoming?.id);
  const attention = attentionItems(state);
  const horizon = addDays(TODAY, 30);
  const forecastBills = bills
    .filter((bill) => !bill.paid && bill.due <= horizon)
    .sort((a, b) => a.due.localeCompare(b.due) || b.amount - a.amount);
  const billsTotal = forecastBills.reduce((sum, bill) => sum + bill.amount, 0);
  const assetsTotal = state.accounts.filter((account) => account.side === "asset").reduce((sum, account) => sum + account.balance, 0);
  const liabilitiesTotal = state.accounts.filter((account) => account.side === "liability").reduce((sum, account) => sum + account.balance, 0);
  const emergencySaved = state.accounts.find((account) => account.id === "emergency")?.balance ?? 0;
  const emergencyMonths = emergencySaved / ESSENTIALS;
  const { coverage, healthOn, healthReason } = coverageOf(state);
  const goals = state.goals.map((goal) => ({
    ...goal,
    saved: goal.linkedAccountId
      ? (state.accounts.find((account) => account.id === goal.linkedAccountId)?.balance ?? goal.saved)
      : goal.saved,
  }));
  const plan = debtPlan(state.accounts, extra);
  const closeFirst = plan?.closeFirst;
  const debtLine =
    closeFirst && closeFirst.debtKind === "Revolving card" && closeFirst.apr >= 20
      ? `${closeFirst.name} is the costliest debt at ${closeFirst.apr}% — see the payoff plan.`
      : null;
  const openReviews = attention.filter((item) => item.kind !== "cash").length;
  return {
    available,
    reserved,
    liquid,
    snapshot,
    previous,
    upcoming,
    alsoToday,
    attention,
    bills,
    forecast: {
      income: NEXT_SALARY,
      incomeDate: "2026-10-01",
      bills: forecastBills,
      billsTotal,
      savings: PLANNED_SAVINGS,
      typical: TYPICAL_SPEND,
      surplus: NEXT_SALARY - (billsTotal + PLANNED_SAVINGS + TYPICAL_SPEND),
    },
    assetsTotal,
    liabilitiesTotal,
    netWorth: assetsTotal - liabilitiesTotal,
    coverage,
    healthOn,
    healthReason,
    health: healthOn ? healthCard(snapshot, bills, openReviews, emergencyMonths, available) : null,
    emergencySaved,
    emergencyTarget: EMERGENCY_TARGET,
    emergencyMonths,
    goals,
    insight: insight(state.transactions, emergencyMonths),
    debt: plan,
    debtLine,
    manualGap: Math.max(0, 100 - coverage),
    categories: spendingByCategory(state.transactions, MONTH),
    receivables: state.accounts.filter((account) => account.kind === "receivable"),
  };
}

export const TYPE_MEANING: Record<string, string> = {
  expense: "This is spending.",
  income: "Money that came in.",
  transfer: "This only moves money between your accounts. It is not spending.",
  save: "This left your bank and went into savings.",
  lend: "This is money someone owes you. It is not spending.",
  borrow: "Your cash went up, and so did what you owe. This is not income.",
  refund: "This reverses an earlier spend. It is not income.",
  repayment: "This pays what you already owe. It is not a new expense.",
};

export function typeMeaning(tx: Transaction): string {
  if (tx.type === "repayment" && tx.receiving) return "Money you lent is coming back. It is not new income.";
  return TYPE_MEANING[tx.type] ?? "Recorded in this month.";
}

export function confidenceCopy(tx: Transaction): { title: string; body: string } {
  if (tx.needsConfirm || tx.confidence === "low") {
    return { title: "Please check", body: "We are not sure enough to file this on our own." };
  }
  if (tx.confidence === "medium") {
    return { title: "Likely", body: "More than one source described this, and they agree." };
  }
  return { title: "Matched", body: "The source was clear, so we filed it without asking." };
}
