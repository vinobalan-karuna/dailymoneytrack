import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { Money, Sheet, cx } from "../components/ui";
import { dueLabel, formatInr, formatPercent, initials, monthTitle, shortDate } from "../lib/format";
import { MONTH } from "../lib/format";
import { useStore } from "../state/store";
import type { Bill } from "../types";

const STATUS_LABEL = { upcoming: "Upcoming", due_today: "Due today", overdue: "Overdue", paid: "Paid" } as const;

export function HomeScreen({
  onNotifications,
  onProfile,
  onActivity,
  onPlan,
  onDebt,
  onOpenTx,
}: {
  onNotifications: () => void;
  onProfile: () => void;
  onActivity: () => void;
  onPlan: () => void;
  onDebt: () => void;
  onOpenTx: (id: string) => void;
}) {
  const { state, finance, payBill, dismissCashNudge, setCashBalance } = useStore();
  const [billId, setBillId] = useState<string | null>(null);
  const [cashOpen, setCashOpen] = useState(false);
  const [flowOpen, setFlowOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const name = state.profile.name || "Arun";
  const bill = finance.bills.find((item) => item.id === billId) ?? null;
  const unread = notificationsExist(state, finance);

  return (
    <div>
      <header className="header-row">
        <h1 className="screen-title">
          Hello {name},
          <br />
          Welcome!
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="icon-round" aria-label="Notifications" onClick={onNotifications}>
            <Bell size={18} />
            {unread && <span className="dot" />}
          </button>
          <button type="button" className="avatar" aria-label="Profile" onClick={onProfile}>
            {initials(name)}
          </button>
        </div>
      </header>

      <section className="hero" aria-label="Available to use">
        <p className="eyebrow">Available to use</p>
        <p className="figure num">
          <Money value={finance.available} />
        </p>
        <p className="sub">
          {state.hideBalances ? "Reserved amount hidden" : `${formatInr(finance.reserved)} reserved for upcoming commitments`}
        </p>
        <p className="fine">Filled in from SMS and statements. You step in only when something looks off.</p>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="section-label">{monthTitle(MONTH)}</h2>
          <button type="button" className="link" onClick={() => setFlowOpen(true)}>
            Cash flow
          </button>
        </div>
        <button type="button" className="card grid-2" style={{ width: "100%" }} onClick={() => setFlowOpen(true)}>
          <span className="metric">
            <small>Money in</small>
            <strong>
              <Money value={finance.snapshot.moneyIn} tone="in" />
            </strong>
          </span>
          <span className="metric">
            <small>Money out</small>
            <strong>
              <Money value={finance.snapshot.moneyOut} tone="out" />
            </strong>
          </span>
          <span className="metric top">
            <small>Saved</small>
            <strong>
              <Money value={finance.snapshot.saved} />
            </strong>
          </span>
          <span className="metric top">
            <small>Savings rate</small>
            <strong>{state.hideBalances ? "••" : formatPercent(finance.snapshot.rate)}</strong>
          </span>
        </button>
      </section>

      {finance.upcoming && (
        <section>
          <button type="button" className="card card-pad" style={{ width: "100%", textAlign: "left", marginTop: 16 }} onClick={() => setBillId(finance.upcoming?.id ?? null)}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p className="muted" style={{ margin: 0, fontSize: 13, fontWeight: 650 }}>
                Next commitment
              </p>
              <span className={cx("pill", finance.upcoming.status)}>{STATUS_LABEL[finance.upcoming.status ?? "upcoming"]}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8, gap: 12 }}>
              <div>
                <strong style={{ fontSize: 17 }}>{finance.upcoming.name}</strong>
                <p className="muted" style={{ margin: "4px 0 0" }}>
                  {shortDate(finance.upcoming.due)} · {dueLabel(finance.upcoming.due)}
                </p>
              </div>
              <Money value={finance.upcoming.amount} className="num" />
            </div>
            <p className={finance.upcoming.reserved ? "in" : "attention"} style={{ margin: "12px 0 0", fontWeight: 600, fontSize: 14 }}>
              {finance.upcoming.reserved ? "Covered. This payment is already reserved." : "Not reserved yet."}
            </p>
            {finance.alsoToday.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {finance.alsoToday.map((item) => (
                  <span key={item.id} className="pill due">
                    Also due · {item.name}
                    {!state.hideBalances && ` · ${formatInr(item.amount)}`}
                  </span>
                ))}
              </div>
            )}
          </button>
        </section>
      )}

      {finance.attention.length > 0 && (
        <section>
          <h2 className="section-label attention">Needs your attention</h2>
          <div className="card">
            {finance.attention.map((item) => (
              <button
                key={item.id}
                type="button"
                className="row"
                onClick={() => {
                  if (item.kind === "cash") setCashOpen(true);
                  else if (item.txId) onOpenTx(item.txId);
                }}
              >
                <span className="copy">
                  <strong>{item.title}</strong>
                  <small>{item.hint}</small>
                </span>
                {item.amount != null && item.kind !== "cash" && (
                  <Money value={item.inflow ? item.amount : -item.amount} sign tone={item.inflow ? "in" : "attention"} />
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="notice">
        <strong>One thing we noticed</strong>
        <p>{finance.insight.body}</p>
        {finance.insight.category && (
          <button type="button" className="link" style={{ marginTop: 10 }} onClick={onActivity}>
            See these payments
          </button>
        )}
      </section>

      {finance.debtLine && (
        <button type="button" className="card card-pad" style={{ width: "100%", textAlign: "left", marginTop: 12 }} onClick={onDebt}>
          <p className="attention" style={{ margin: 0, fontSize: 13, fontWeight: 650 }}>
            Costliest debt
          </p>
          <p style={{ margin: "6px 0 0", lineHeight: 1.45 }}>{finance.debtLine}</p>
        </button>
      )}

      <button type="button" className="fab" aria-label="Add" onClick={() => setAddOpen(true)}>
        <Plus />
      </button>

      {bill && <BillSheet bill={bill} onClose={() => setBillId(null)} onPay={() => { payBill(bill.id); setBillId(null); }} onPlan={onPlan} />}
      {cashOpen && <CashSheet onClose={() => setCashOpen(false)} onSave={setCashBalance} onHide={dismissCashNudge} />}
      {flowOpen && <FlowSheet onClose={() => setFlowOpen(false)} />}
      {addOpen && <AddSheet onClose={() => setAddOpen(false)} />}
    </div>
  );
}

function notificationsExist(state: ReturnType<typeof useStore>["state"], finance: ReturnType<typeof useStore>["finance"]) {
  if (state.notifBills && finance.bills.some((bill) => !bill.paid && (bill.id === "bill-rent" || bill.due < "2026-09-22"))) return true;
  if (state.notifAttention && state.transactions.some((tx) => tx.included && tx.needsConfirm)) return true;
  return state.notifInsights;
}

function BillSheet({ bill, onClose, onPay, onPlan }: { bill: Bill; onClose: () => void; onPay: () => void; onPlan: () => void }) {
  return (
    <Sheet title={bill.name} onClose={onClose}>
      <p className="num" style={{ fontSize: 32, fontWeight: 700, margin: "8px 0" }}>
        <Money value={bill.amount} />
      </p>
      <p className="muted">
        {shortDate(bill.due)} · {dueLabel(bill.due)} · {bill.payLabel}
      </p>
      {bill.note && <p style={{ lineHeight: 1.5 }}>{bill.note}</p>}
      <p className={bill.reserved ? "in" : "attention"} style={{ fontWeight: 600 }}>
        {bill.reserved ? "Covered. This is already reserved, so what you can use stays the same." : "Short. Move money before you pay this."}
      </p>
      <div className="actions">
        {!bill.paid && (
          <button type="button" className="btn" onClick={onPay}>
            Mark paid
          </button>
        )}
        <button type="button" className="btn ghost" onClick={onPlan}>
          Open Plan
        </button>
      </div>
    </Sheet>
  );
}

function CashSheet({ onClose, onSave, onHide }: { onClose: () => void; onSave: (amount: number) => void; onHide: () => void }) {
  const [value, setValue] = useState("8000");
  return (
    <Sheet title="Count the cash" onClose={onClose}>
      <p className="muted">Notes in hand. ATM withdrawals land here. This is not spending until you spend the notes.</p>
      <label className="field">
        <span>Cash you can count</span>
        <input inputMode="numeric" value={value} onChange={(event) => setValue(event.target.value.replace(/\D/g, "").slice(0, 7))} />
      </label>
      <div className="actions">
        <button
          type="button"
          className="btn"
          onClick={() => {
            onSave(Number(value) || 0);
            onClose();
          }}
        >
          Save count
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            onHide();
            onClose();
          }}
        >
          Hide reminder
        </button>
      </div>
    </Sheet>
  );
}

function FlowSheet({ onClose }: { onClose: () => void }) {
  const { finance } = useStore();
  return (
    <Sheet title="September cash flow" onClose={onClose}>
      <div className="kv">
        <div>
          <span>Money in</span>
          <Money value={finance.snapshot.moneyIn} tone="in" />
        </div>
        <div>
          <span>Money out</span>
          <Money value={finance.snapshot.moneyOut} tone="out" />
        </div>
        <div>
          <span>Saved</span>
          <Money value={finance.snapshot.saved} />
        </div>
        <div>
          <span>Savings rate</span>
          <strong>{formatPercent(finance.snapshot.rate)}</strong>
        </div>
      </div>
      <h3 className="section-label">Where spending went</h3>
      {finance.categories.map((row) => (
        <div key={row.category} className="kv" style={{ marginTop: 8 }}>
          <div>
            <span>{row.category}</span>
            <Money value={row.amount} />
          </div>
        </div>
      ))}
      <p className="muted" style={{ marginTop: 12 }}>
        Transfers, savings, lending, and loan repayments are not counted as spending.
      </p>
    </Sheet>
  );
}

export function AddSheet({ onClose }: { onClose: () => void }) {
  const { state, addTransaction } = useStore();
  const [type, setType] = useState<"expense" | "income" | "transfer" | "save" | "lend" | "borrow">("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [accountId, setAccountId] = useState("hdfc");
  const [person, setPerson] = useState("");
  const accounts = state.accounts.filter((account) => account.liquid || account.kind === "credit");
  const ready = Number(amount) > 0 && (type === "lend" || type === "borrow" ? person.trim().length > 1 : true);

  return (
    <Sheet title="Add money activity" onClose={onClose}>
      <div className="seg" style={{ marginTop: 8 }}>
        {(
          [
            ["expense", "Out"],
            ["income", "In"],
            ["transfer", "Move"],
            ["save", "Save"],
            ["lend", "Lend"],
            ["borrow", "Borrow"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={cx(type === id && "active")} onClick={() => setType(id)}>
            {label}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Amount</span>
        <input inputMode="decimal" placeholder="0" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))} />
      </label>
      <label className="field">
        <span>{type === "lend" ? "Who did you lend to?" : type === "borrow" ? "Who lent you this?" : "What was it?"}</span>
        <input value={type === "lend" || type === "borrow" ? person : title} placeholder={type === "lend" || type === "borrow" ? "Name" : "Swiggy, rent, cab"} onChange={(event) => (type === "lend" || type === "borrow" ? setPerson(event.target.value) : setTitle(event.target.value))} />
      </label>
      <label className="field">
        <span>Account</span>
        <select value={accountId} onChange={(event) => setAccountId(event.target.value)}>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </label>
      {(type === "expense" || type === "income" || type === "save") && (
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {["Groceries", "Food delivery", "Transport", "Shopping", "Bills", "Family", "Health", "Subscriptions", "Salary", "Mutual fund", "Emergency", "Other"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      )}
      <p className="muted">
        {type === "transfer" && "This only moves money between your accounts. It is not spending."}
        {type === "save" && "This left your bank and went into savings."}
        {type === "lend" && "This is not spending. They will owe you this amount."}
        {type === "borrow" && "Your cash goes up, and so does what you owe. This is not income."}
        {type === "expense" && "Something you spent."}
        {type === "income" && "Money that came in."}
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn"
          disabled={!ready}
          onClick={() => {
            addTransaction({
              type,
              amount: Number(amount),
              title: title || person || category,
              category: type === "lend" ? "Money lent" : type === "borrow" ? "Family" : type === "transfer" ? "Transfer" : type === "save" ? category : category,
              accountId,
              counterAccountId: type === "transfer" ? "sbi" : type === "save" ? "emergency" : undefined,
              person: person || undefined,
              channel: "UPI",
            });
            onClose();
          }}
        >
          Add
        </button>
      </div>
    </Sheet>
  );
}
