import { useState } from "react";
import { dueLabel, formatInr, shortDate } from "../lib/format";
import { debtPlan } from "../lib/finance";
import { Money, Progress, Sheet, cx } from "../components/ui";
import { useStore } from "../state/store";
import type { Bill } from "../types";

const TABS = [
  { id: "bills", label: "Bills" },
  { id: "goals", label: "Goals" },
  { id: "debt", label: "Debt" },
  { id: "incoming", label: "Owed" },
  { id: "forecast", label: "30 days" },
] as const;

export type PlanTab = (typeof TABS)[number]["id"];

const STATUS = { upcoming: "Upcoming", due_today: "Due today", overdue: "Overdue", paid: "Paid" } as const;

export function PlanScreen({ tab, onTab }: { tab: PlanTab; onTab: (tab: PlanTab) => void }) {
  const { finance, payBill, state } = useStore();
  const [billId, setBillId] = useState<string | null>(null);
  const bill = finance.bills.find((item) => item.id === billId) ?? null;
  const groups = {
    overdue: finance.bills.filter((item) => item.status === "overdue"),
    due_today: finance.bills.filter((item) => item.status === "due_today"),
    upcoming: finance.bills.filter((item) => item.status === "upcoming" && item.section !== "subscription" && item.section !== "renewal"),
    paid: finance.bills.filter((item) => item.status === "paid"),
    subscriptions: finance.bills.filter((item) => item.section === "subscription"),
    renewals: finance.bills.filter((item) => item.section === "renewal" && item.status !== "overdue"),
  };

  return (
    <div>
      <h1 className="screen-title">Plan</h1>
      <p className="screen-sub">What is coming, and what you are preparing for</p>
      <div className="seg" style={{ marginTop: 14 }}>
        {TABS.map((item) => (
          <button key={item.id} type="button" className={cx(tab === item.id && "active")} onClick={() => onTab(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === "bills" && (
        <div>
          <BillGroup title="Overdue" bills={groups.overdue} onOpen={setBillId} />
          <BillGroup title="Due today" bills={groups.due_today} onOpen={setBillId} />
          <BillGroup title="Upcoming" bills={groups.upcoming} onOpen={setBillId} />
          <BillGroup title="Paid" bills={groups.paid} onOpen={setBillId} />
          <Described title="Subscriptions" body="These renew on their own. They are not new surprises." bills={groups.subscriptions} onOpen={setBillId} />
          <Described title="Renewals" body="Annual bills. A sinking fund is a small amount each month so the full bill is already there." bills={groups.renewals} onOpen={setBillId} />
          <article className="notice">
            <strong>Set a little aside</strong>
            <p>
              Amazon Prime is {state.hideBalances ? "an annual bill" : formatInr(1499)} in November — about {state.hideBalances ? "a small amount" : formatInr(125)} a month. Bike insurance is {state.hideBalances ? "due in December" : `${formatInr(4800)} in December`} — about {state.hideBalances ? "a bit more" : formatInr(400)} a month.
            </p>
          </article>
        </div>
      )}

      {tab === "goals" && (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {finance.goals.map((goal) => {
            const pct = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
            return (
              <article key={goal.id} className="card card-pad">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <strong>{goal.name}</strong>
                    <p className="muted" style={{ margin: "4px 0 0" }}>{goal.why}</p>
                  </div>
                  <Money value={goal.saved} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <Progress value={pct} />
                </div>
                <p className="muted" style={{ marginBottom: 0 }}>
                  {formatInr(goal.monthly)} a month · {formatInr(goal.target)} by {goal.by}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {tab === "debt" && <DebtPanel />}
      {tab === "incoming" && <OwedPanel />}
      {tab === "forecast" && <ForecastPanel />}

      {bill && (
        <Sheet title={bill.name} onClose={() => setBillId(null)}>
          <p className="num" style={{ fontSize: 32, fontWeight: 700 }}>
            <Money value={bill.amount} />
          </p>
          <p className="muted">
            {shortDate(bill.due)} · {dueLabel(bill.due)} · {bill.payLabel}
            {bill.autopay ? " · Auto-debit" : " · Manual"}
          </p>
          {bill.note && <p>{bill.note}</p>}
          <p className={bill.reserved ? "in" : "attention"} style={{ fontWeight: 600 }}>
            {bill.paid ? "Already paid." : bill.reserved ? "Covered. This is already reserved, so what you can use stays the same." : "Not reserved yet."}
          </p>
          {!bill.paid && (
            <button type="button" className="btn" style={{ marginTop: 12 }} onClick={() => { payBill(bill.id); setBillId(null); }}>
              Mark paid
            </button>
          )}
        </Sheet>
      )}
    </div>
  );
}

function BillGroup({ title, bills, onOpen }: { title: string; bills: Bill[]; onOpen: (id: string) => void }) {
  if (bills.length === 0) return null;
  return (
    <section>
      <h2 className="section-label">{title}</h2>
      <div className="card">
        {bills.map((bill) => (
          <button key={bill.id} type="button" className="row" onClick={() => onOpen(bill.id)}>
            <span className="copy">
              <strong>{bill.name}</strong>
              <small>
                {shortDate(bill.due)} · {dueLabel(bill.due)}
              </small>
            </span>
            <span style={{ textAlign: "right" }}>
              <Money value={bill.amount} />
              <small className={cx("pill", bill.status)} style={{ marginTop: 4 }}>{STATUS[bill.status ?? "upcoming"]}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Described({ title, body, bills, onOpen }: { title: string; body: string; bills: Bill[]; onOpen: (id: string) => void }) {
  if (bills.length === 0) return null;
  return (
    <section>
      <h2 className="section-label">{title}</h2>
      <p className="muted" style={{ marginTop: 0 }}>{body}</p>
      <div className="card">
        {bills.map((bill) => (
          <button key={bill.id} type="button" className="row" onClick={() => onOpen(bill.id)}>
            <span className="copy">
              <strong>{bill.name}</strong>
              <small>{shortDate(bill.due)}{bill.note ? ` · ${bill.note}` : ""}</small>
            </span>
            <Money value={bill.amount} />
          </button>
        ))}
      </div>
    </section>
  );
}

function DebtPanel() {
  const { state } = useStore();
  const [mode, setMode] = useState<"avalanche" | "snowball">("avalanche");
  const [extraText, setExtraText] = useState("5000");
  const extra = Math.max(0, Number(extraText.replace(/\D/g, "")) || 0);
  const plan = debtPlan(state.accounts, extra || 0);

  if (!plan) return <p className="empty">Add an interest rate on a loan to see which one costs the most.</p>;
  const list = mode === "avalanche" ? plan.avalanche : plan.snowball;
  return (
    <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
      <article className="card card-pad">
        <p className="muted" style={{ margin: 0, fontSize: 13, fontWeight: 650 }}>Close first</p>
        <h2 style={{ margin: "4px 0 0", fontSize: 22 }}>{plan.closeFirst.name}</h2>
        <p style={{ lineHeight: 1.5 }}>{plan.reason}</p>
        <p className="muted" style={{ marginBottom: 0 }}>
          {plan.closeFirst.debtKind} · {plan.closeFirst.apr}% a year · {state.hideBalances ? "balance hidden" : formatInr(plan.closeFirst.balance)} left
          {plan.closeFirst.minDue > 0
            ? ` · ${plan.closeFirst.debtKind === "Revolving card" ? "minimum" : "EMI"} ${state.hideBalances ? "hidden" : formatInr(plan.closeFirst.minDue)}`
            : " · no EMI"}
        </p>
      </article>
      <div>
        <p className="muted" style={{ fontSize: 13, fontWeight: 650 }}>Two ways to order them</p>
        <div className="seg">
          <button type="button" className={cx(mode === "avalanche" && "active")} onClick={() => setMode("avalanche")}>Avalanche</button>
          <button type="button" className={cx(mode === "snowball" && "active")} onClick={() => setMode("snowball")}>Snowball</button>
        </div>
        <p className="muted">
          {mode === "avalanche"
            ? "Avalanche pays extra to the highest rate first. Daily Money estimates this from the rates you entered."
            : plan.snowballNote}
        </p>
      </div>
      <div className="card">
        {list.map((debt, index) => (
          <div key={debt.id} className="row">
            <span className="copy">
              <strong>
                {index + 1}. {debt.name}
              </strong>
              <small>
                {debt.debtKind} · {debt.apr}% APR
                {debt.minDue > 0 ? ` · ${debt.debtKind === "Revolving card" ? "min" : "EMI"} ${formatInr(debt.minDue)}` : " · no EMI"}
              </small>
            </span>
            <Money value={debt.balance} />
          </div>
        ))}
      </div>
      <article className="card card-pad">
        <strong>If I pay extra each month</strong>
        <label className="field">
          <span>Extra rupees, on top of EMIs</span>
          <input inputMode="numeric" value={extraText} onChange={(event) => setExtraText(event.target.value.replace(/\D/g, "").slice(0, 7))} />
        </label>
        <p>
          {plan.baseline.unfinished
            ? "The minimum does not shrink this balance. Extra payment is what brings it down."
            : `Minimums only: about ${plan.baseline.months} months and ${state.hideBalances ? "interest hidden" : formatInr(plan.baseline.interest)} interest on ${plan.closeFirst.name}.`}
        </p>
        {extra > 0 && (
          <p>
            With {state.hideBalances ? "an extra amount" : formatInr(extra)} extra, Daily Money estimates {plan.withExtra.months} months
            {plan.monthsSaved > 0 ? ` — ${plan.monthsSaved} months sooner` : ""}
            {state.hideBalances ? "." : ` and about ${formatInr(plan.interestSaved)} less interest on this loan.`}
          </p>
        )}
        <p className="muted" style={{ marginBottom: 0 }}>
          This is a straight estimate: each month adds balance × rate ÷ 12, then subtracts the EMI or minimum plus any extra. Other loans keep their own EMIs. It is not a bank quote.
        </p>
      </article>
      <button type="button" className="btn ghost" onClick={() => setMode("avalanche")}>
        Use highest rate first
      </button>
    </div>
  );
}

function OwedPanel() {
  const { finance } = useStore();
  if (finance.receivables.length === 0) {
    return <p className="empty">No one owes you right now. When you lend money, it shows up here until it comes back.</p>;
  }
  return (
    <div className="card" style={{ marginTop: 16 }}>
      {finance.receivables.map((item) => (
        <div key={item.id} className="row">
          <span className="copy">
            <strong>{item.name}</strong>
            <small>{item.detail}</small>
          </span>
          <Money value={item.balance} tone="in" />
        </div>
      ))}
    </div>
  );
}

function ForecastPanel() {
  const { finance } = useStore();
  const { forecast } = finance;
  return (
    <div style={{ marginTop: 16 }}>
      <article className="hero">
        <p className="eyebrow">Left after the next 30 days</p>
        <p className="figure" style={{ fontSize: 34 }}>
          <Money value={forecast.surplus} />
        </p>
        <p className="sub">Salary on 1 Oct, minus bills already on the calendar, planned savings, and a typical month of spending.</p>
      </article>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="row"><span className="copy"><strong>Salary</strong><small>{shortDate(forecast.incomeDate)}</small></span><Money value={forecast.income} tone="in" /></div>
        <div className="row"><span className="copy"><strong>Bills due</strong><small>{forecast.bills.length} payments</small></span><Money value={forecast.billsTotal} tone="out" /></div>
        <div className="row"><span className="copy"><strong>Planned savings</strong><small>SIPs, emergency, deposits</small></span><Money value={forecast.savings} /></div>
        <div className="row"><span className="copy"><strong>Typical other spending</strong><small>Food, travel, household</small></span><Money value={forecast.typical} /></div>
      </div>
    </div>
  );
}
