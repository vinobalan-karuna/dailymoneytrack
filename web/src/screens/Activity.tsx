import { useMemo, useState } from "react";
import { ChevronLeft, Plus, Search } from "lucide-react";
import { AddSheet } from "./Home";
import { Money, cx } from "../components/ui";
import { clockTime, monthTitle, relativeDay } from "../lib/format";
import { confidenceCopy, countsInMonth, typeMeaning } from "../lib/finance";
import { useStore } from "../state/store";
import type { ResolveAction } from "../lib/ledger";
import type { Transaction } from "../types";

const MONTHS = ["2026-07", "2026-08", "2026-09", "2026-10"];
const FILTERS = [
  { id: "all", label: "All" },
  { id: "in", label: "In" },
  { id: "out", label: "Out" },
  { id: "savings", label: "Savings" },
  { id: "moves", label: "Moves" },
] as const;

function matchesFilter(tx: Transaction, filter: (typeof FILTERS)[number]["id"]) {
  if (filter === "all") return true;
  if (filter === "in") return tx.type === "income" || tx.type === "refund" || (tx.type === "repayment" && tx.receiving);
  if (filter === "out") return tx.type === "expense";
  if (filter === "savings") return tx.type === "save";
  return tx.type === "transfer" || tx.type === "lend" || tx.type === "borrow" || (tx.type === "repayment" && !tx.receiving);
}

export function ActivityScreen({ onOpen }: { onOpen: (id: string) => void }) {
  const { state } = useStore();
  const [month, setMonth] = useState("2026-09");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.transactions
      .filter((tx) => tx.included && tx.at.startsWith(month))
      .filter((tx) => matchesFilter(tx, filter))
      .filter((tx) => !q || `${tx.title} ${tx.category} ${tx.amount} ${tx.notes ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) => b.at.localeCompare(a.at));
  }, [state.transactions, month, filter, query]);

  const groups = new Map<string, Transaction[]>();
  for (const tx of rows) {
    const day = tx.at.slice(0, 10);
    groups.set(day, [...(groups.get(day) ?? []), tx]);
  }

  return (
    <div>
      <h1 className="screen-title">Activity</h1>
      <p className="screen-sub">What happened to your money</p>
      <div className="chips" style={{ marginTop: 12 }}>
        {MONTHS.map((item) => (
          <button key={item} type="button" className={cx(month === item && "active")} onClick={() => setMonth(item)}>
            {monthTitle(item)}
          </button>
        ))}
      </div>
      <label className="search" style={{ marginTop: 12 }}>
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search merchant or amount" />
      </label>
      <div className="seg" style={{ marginTop: 12 }}>
        {FILTERS.map((item) => (
          <button key={item.id} type="button" className={cx(filter === item.id && "active")} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {month === "2026-10" && rows.length === 0 ? (
        <p className="empty">October has not started. Bills that are coming sit in Plan.</p>
      ) : rows.length === 0 ? (
        <p className="empty">Nothing matches. Try another month, or clear the filters.</p>
      ) : (
        [...groups.entries()].map(([day, items]) => (
          <section key={day}>
            <div className="day-total">
              <span>{relativeDay(day)}</span>
            </div>
            <div className="card">
              {items.map((tx) => (
                <button key={tx.id} type="button" className="row" onClick={() => onOpen(tx.id)}>
                  <span className="copy">
                    <strong>{tx.title}</strong>
                    <small>
                      {tx.category} · {tx.channel}
                      {tx.needsConfirm ? " · Needs a check" : ""} · {clockTime(tx.at)}
                    </small>
                  </span>
                  <Amount tx={tx} />
                </button>
              ))}
            </div>
          </section>
        ))
      )}
      <button type="button" className="fab" aria-label="Add" onClick={() => setAddOpen(true)}>
        <Plus />
      </button>
      {addOpen && <AddSheet onClose={() => setAddOpen(false)} />}
    </div>
  );
}

function Amount({ tx }: { tx: Transaction }) {
  const positive = tx.type === "income" || tx.type === "refund" || (tx.type === "repayment" && Boolean(tx.receiving));
  const pending = tx.needsConfirm && !tx.applied;
  if (tx.type === "save") return <strong className="teal">Saved</strong>;
  if (tx.type === "transfer") return <strong className="muted">Moved</strong>;
  return <Money value={positive ? tx.amount : -tx.amount} sign tone={pending ? "attention" : positive ? "in" : "out"} />;
}

export function TransactionScreen({ id, onBack }: { id: string; onBack: () => void }) {
  const { state, resolveTransaction } = useStore();
  const tx = state.transactions.find((item) => item.id === id);
  const account = state.accounts.find((item) => item.id === tx?.accountId);
  const counter = state.accounts.find((item) => item.id === tx?.counterAccountId);
  if (!tx) {
    return (
      <div>
        <Back title="Activity" onBack={onBack} />
        <p className="empty">That payment is not in this preview.</p>
      </div>
    );
  }
  const confidence = confidenceCopy(tx);
  const act = (action: ResolveAction) => resolveTransaction(tx.id, action);

  return (
    <div>
      <Back title="Activity" onBack={onBack} />
      <p className="muted" style={{ marginBottom: 0 }}>
        {tx.needsConfirm ? "Needs a check" : countsInMonth(tx) ? "In this month" : "Not counted"}
      </p>
      <h1 className="screen-title">{tx.title}</h1>
      <p className="num" style={{ fontSize: 34, fontWeight: 700, margin: "8px 0" }}>
        <Amount tx={tx} />
      </p>
      <p>{typeMeaning(tx)}</p>
      {tx.notes && <p className="muted">{tx.notes}</p>}
      <div className="card card-pad" style={{ marginTop: 12 }}>
        <strong>{confidence.title}</strong>
        <p className="muted" style={{ marginBottom: 0 }}>{confidence.body}</p>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <Line label="When" value={`${relativeDay(tx.at)} · ${clockTime(tx.at)}`} />
        <Line label="Type" value={tx.type} />
        <Line label="Category" value={tx.category} />
        <Line label="Account" value={account?.name ?? tx.accountId} />
        {counter && <Line label="Linked to" value={counter.name} />}
        <Line label="Channel" value={tx.upiApp ? `${tx.channel} · ${tx.upiApp}` : tx.channel} />
        <Line label="Source" value={tx.source} />
      </div>
      {tx.needsConfirm && (
        <div className="actions">
          {tx.review === "classify" && (
            <>
              <button type="button" className="btn" onClick={() => act("expense")}>Expense</button>
              <button type="button" className="btn line" onClick={() => act("lend")}>Money lent</button>
              <button type="button" className="btn line" onClick={() => act("transfer")}>Transfer</button>
              <button type="button" className="btn line" onClick={() => act("gift")}>Gift</button>
            </>
          )}
          {tx.review === "duplicate" && (
            <>
              <button type="button" className="btn" onClick={() => act("confirm")}>Count this twice</button>
              <button type="button" className="btn line" onClick={() => act("exclude")}>Don't count it</button>
            </>
          )}
          {tx.review === "repay" && (
            <>
              <button type="button" className="btn" onClick={() => act("confirm")}>Yes, this is a repayment</button>
              <button type="button" className="btn line" onClick={() => act("income")}>It's new income</button>
            </>
          )}
          {(tx.review === "unknown" || !tx.review) && (
            <>
              <button type="button" className="btn" onClick={() => act("confirm")}>Confirm this payment</button>
              <button type="button" className="btn line" onClick={() => act("exclude")}>Don't count it</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="row">
      <span className="copy">
        <small>{label}</small>
        <strong style={{ textTransform: "capitalize" }}>{value}</strong>
      </span>
    </div>
  );
}

function Back({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="backbar">
      <button type="button" aria-label="Back" onClick={onBack}>
        <ChevronLeft />
      </button>
      <strong>{title}</strong>
    </div>
  );
}

export { Back };
