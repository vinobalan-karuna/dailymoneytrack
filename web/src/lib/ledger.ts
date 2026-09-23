import type { Account, AppState, Bill, Transaction, TxType } from "../types";
import { TODAY } from "./format";

export function applyTransaction(accounts: Account[], tx: Transaction, direction: 1 | -1): Account[] {
  const next = accounts.map((account) => ({ ...account }));
  const move = (id: string | undefined, delta: number) => {
    if (!id) return;
    const account = next.find((item) => item.id === id);
    if (account) account.balance = Math.round(account.balance + delta);
  };
  const signed = tx.amount * direction;
  const account = next.find((item) => item.id === tx.accountId);
  switch (tx.type) {
    case "expense":
      account?.side === "liability" ? move(tx.accountId, signed) : move(tx.accountId, -signed);
      break;
    case "income":
      move(tx.accountId, signed);
      break;
    case "refund":
      account?.side === "liability" ? move(tx.accountId, -signed) : move(tx.accountId, signed);
      break;
    case "transfer":
    case "save":
    case "lend":
      move(tx.accountId, -signed);
      move(tx.counterAccountId, signed);
      break;
    case "borrow":
      move(tx.accountId, signed);
      move(tx.counterAccountId, signed);
      break;
    case "repayment":
      if (tx.receiving) {
        move(tx.accountId, signed);
        move(tx.counterAccountId, -signed);
      } else {
        move(tx.accountId, -signed);
        move(tx.counterAccountId, -signed);
      }
      break;
    default:
      break;
  }
  return next;
}

export function touchAccounts(accounts: Account[], ids: Array<string | undefined>): Account[] {
  const fresh = new Set(ids.filter((id): id is string => Boolean(id)));
  return accounts.map((account) => (fresh.has(account.id) ? { ...account, updated: "Today" } : account));
}

function findPerson(accounts: Account[], name: string, side: "asset" | "liability") {
  const needle = name.trim().toLowerCase();
  if (needle.length < 2) return undefined;
  return accounts.find((account) => {
    if (account.side !== side) return false;
    if (account.kind !== "receivable" && account.kind !== "borrow") return false;
    return account.name.toLowerCase().includes(needle);
  });
}

let stamp = 0;
export function nowStamp(): string {
  stamp = (stamp + 1) % 1000;
  const date = new Date();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${TODAY}T${hh}:${mm}:${ss}.${String(stamp).padStart(3, "0")}+05:30`;
}

export function billPayment(bill: Bill): Transaction {
  return {
    id: `tx-${crypto.randomUUID()}`,
    type: bill.kind,
    amount: bill.amount,
    at: nowStamp(),
    title: bill.name,
    category: bill.category,
    accountId: bill.accountId,
    counterAccountId: bill.counterAccountId,
    channel: bill.autopay ? "Auto-debit" : "UPI",
    source: "Manual",
    confidence: "high",
    needsConfirm: false,
    included: true,
    applied: true,
    receiving: false,
    notes:
      bill.kind === "repayment"
        ? "Marked paid. This settles a bill. It is not a new expense."
        : "Marked paid in Daily Money.",
  };
}

export interface NewEntry {
  type: TxType;
  amount: number;
  title: string;
  category: string;
  accountId: string;
  counterAccountId?: string;
  person?: string;
  channel: string;
  notes?: string;
}

export function addEntry(state: AppState, entry: NewEntry): AppState {
  let accounts = state.accounts.map((account) => ({ ...account }));
  let counterAccountId = entry.counterAccountId;
  if ((entry.type === "lend" || entry.type === "borrow") && entry.person) {
    const side = entry.type === "lend" ? "asset" : "liability";
    const existing = findPerson(accounts, entry.person, side);
    if (existing) counterAccountId = existing.id;
    else {
      const id = `person-${crypto.randomUUID().slice(0, 8)}`;
      accounts.push({
        id,
        name: entry.type === "lend" ? `${entry.person} owes you` : `Owed to ${entry.person}`,
        institution: "Person",
        group: entry.type === "lend" ? "Receivables" : "Loans",
        side,
        kind: entry.type === "lend" ? "receivable" : "borrow",
        balance: 0,
        liquid: false,
        detail: "Added by you just now.",
        updated: "Today",
        live: false,
      });
      counterAccountId = id;
    }
  }
  const tx: Transaction = {
    id: `tx-${crypto.randomUUID()}`,
    type: entry.type,
    amount: entry.amount,
    at: nowStamp(),
    title: entry.title.trim() || entry.category,
    category: entry.category,
    accountId: entry.accountId,
    counterAccountId,
    person: entry.person,
    channel: entry.channel,
    source: "Manual",
    confidence: "high",
    notes: entry.notes,
    needsConfirm: false,
    included: true,
    applied: true,
  };
  accounts = touchAccounts(applyTransaction(accounts, tx, 1), [tx.accountId, tx.counterAccountId]);
  return { ...state, accounts, transactions: [tx, ...state.transactions] };
}

export type ResolveAction = "exclude" | "lend" | "gift" | "expense" | "transfer" | "income" | "confirm";

export function resolveReview(state: AppState, id: string, action: ResolveAction, category?: string): { state: AppState; message: string } {
  const current = state.transactions.find((tx) => tx.id === id);
  if (!current) return { state, message: "" };
  let accounts = state.accounts.map((account) => ({ ...account }));
  let next: Transaction = { ...current, needsConfirm: false, confidence: "high" };
  let message = "Payment confirmed";

  if (action === "exclude") {
    next = { ...next, included: false, applied: false };
    if (current.applied) accounts = applyTransaction(accounts, current, -1);
    message = "Removed from your month";
  } else if (action === "lend" || action === "gift" || action === "expense" || action === "transfer") {
    const person = current.person ?? current.title;
    let counter = current.counterAccountId;
    if (action === "lend") {
      const existing = findPerson(accounts, person, "asset");
      if (existing) counter = existing.id;
      else {
        const personId = `person-${person.toLowerCase().replace(/\s+/g, "-")}`;
        accounts = [
          ...accounts,
          {
            id: personId,
            name: `${person} owes you`,
            institution: "Person",
            group: "Receivables",
            side: "asset",
            kind: "receivable",
            balance: 0,
            liquid: false,
            detail: "You marked this as money lent.",
            updated: "Today",
            live: false,
          },
        ];
        counter = personId;
      }
    }
    if (action === "transfer") counter = counter ?? "sbi";
    const type = action === "gift" || action === "expense" ? "expense" : action;
    next = {
      ...next,
      type,
      category: action === "gift" ? "Gift" : action === "lend" ? "Money lent" : action === "transfer" ? "Transfer" : "Family",
      person: action === "transfer" ? undefined : person,
      counterAccountId: action === "expense" || action === "gift" ? undefined : counter,
      applied: true,
      notes:
        action === "lend"
          ? `You marked this as money lent to ${person}. It is not spending.`
          : action === "gift"
            ? `You marked this as a gift to ${person}.`
            : action === "transfer"
              ? "You marked this as a move between your accounts. It is not spending."
              : `You marked this as spending on ${person}.`,
    };
    if (!current.applied) accounts = applyTransaction(accounts, next, 1);
    message = action === "lend" ? "Saved as money lent" : action === "gift" ? "Saved as a gift" : action === "transfer" ? "Saved as a transfer" : "Saved as an expense";
  } else if (action === "income") {
    next = {
      ...next,
      type: "income",
      category: "Other",
      receiving: false,
      counterAccountId: undefined,
      applied: true,
      notes: "You marked this as income, not a repayment.",
    };
    if (!current.applied) accounts = applyTransaction(accounts, next, 1);
    message = "Counted as income";
  } else {
    next = {
      ...next,
      category: category && category !== "Uncategorised" ? category : current.category,
      applied: true,
      notes: current.receiving ? "Marked as a repayment." : current.notes,
    };
    if (!current.applied) accounts = applyTransaction(accounts, next, 1);
    message = next.category === "Uncategorised" ? "Payment confirmed" : `Saved as ${next.category}`;
  }

  accounts = touchAccounts(accounts, [next.accountId, current.counterAccountId, next.counterAccountId]);
  return {
    state: {
      ...state,
      accounts,
      transactions: state.transactions.map((tx) => (tx.id === id ? next : tx)),
    },
    message,
  };
}

export function markBillPaid(state: AppState, billId: string): { state: AppState; message: string } {
  const bill = state.bills.find((item) => item.id === billId);
  if (!bill || bill.paid) return { state, message: "" };
  const tx = billPayment(bill);
  const accounts = touchAccounts(applyTransaction(state.accounts, tx, 1), [tx.accountId, tx.counterAccountId]);
  return {
    message: bill.reserved ? `${bill.name} paid. What you can use stays the same.` : `${bill.name} marked paid`,
    state: {
      ...state,
      accounts,
      bills: state.bills.map((item) => (item.id === billId ? { ...item, paid: true, paidOn: tx.at.slice(0, 10) } : item)),
      transactions: [tx, ...state.transactions],
    },
  };
}
