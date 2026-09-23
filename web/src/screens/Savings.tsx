import { destinationLabel, formatPercent, oneDecimal } from "../lib/format";
import { groupAccounts } from "../lib/finance";
import { Money, Progress, cx } from "../components/ui";
import { useStore } from "../state/store";

export function SavingsScreen({
  onSources,
  onOpen,
}: {
  onSources: () => void;
  onOpen: (href: string) => void;
}) {
  const { state, finance } = useStore();
  const assets = groupAccounts(state.accounts, "asset");
  const liabilities = groupAccounts(state.accounts, "liability");
  const emergencyPct = finance.emergencyTarget > 0 ? (finance.emergencySaved / finance.emergencyTarget) * 100 : 0;
  const health = finance.health;

  return (
    <div>
      <h1 className="screen-title">Savings</h1>
      <p className="screen-sub">What you own, and what you owe</p>
      <section className="hero">
        <p className="eyebrow">Net worth</p>
        <p className="figure" style={{ fontSize: 36 }}>
          <Money value={finance.netWorth} />
        </p>
        <p className="sub">What you own minus what you owe</p>
        <div className="hero-split">
          <div className="hero-chip">
            <small>Assets</small>
            <Money value={finance.assetsTotal} />
          </div>
          <div className="hero-chip">
            <small>Liabilities</small>
            <Money value={finance.liabilitiesTotal} />
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        {health ? (
          <article className="card card-pad">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Financial strength</h2>
              <span className={cx("pill", health.status === "Tight" && "due", health.status === "Strong" && "good", health.status === "Stable" && "emergency")}>
                {health.status}
              </span>
            </div>
            <p className="muted">A status from the month, not a score.</p>
            <p className="in" style={{ fontWeight: 650, fontSize: 13, marginBottom: 4 }}>Doing well</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {health.doing.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="attention" style={{ fontWeight: 650, fontSize: 13, marginBottom: 4 }}>Needs a look</p>
            {health.needs.length === 0 ? (
              <p>Nothing urgent right now.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {health.needs.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
            <p style={{ fontWeight: 650, fontSize: 13, marginBottom: 4 }}>Next</p>
            <p style={{ marginTop: 0 }}>{health.next}</p>
            <button type="button" className="link" onClick={() => onOpen(health.href)}>
              {health.action}
            </button>
          </article>
        ) : (
          <article className="card card-pad">
            <h2 style={{ margin: 0, fontSize: 16 }}>Financial strength</h2>
            <p className="muted">{finance.healthReason}</p>
            <button type="button" className="link" onClick={onSources}>
              Manage sources
            </button>
          </article>
        )}
      </section>

      <section className="card card-pad" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16 }}>How much we can see</h2>
            <p className="muted">Live sources, not a score</p>
          </div>
          <p className="num" style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "var(--dm-primary)" }}>
            {formatPercent(finance.coverage)}
          </p>
        </div>
        <Progress value={finance.coverage} />
        <p className="muted">
          Connected sources cover {formatPercent(finance.coverage)}. The other {formatPercent(finance.manualGap)} is entered by you — cash, EPF, NPS, post office, gold, and the house.
        </p>
        <button type="button" className="link" onClick={onSources}>
          Manage sources
        </button>
      </section>

      <section className="card card-pad" style={{ marginTop: 16 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Emergency fund</h2>
        <p className="muted">{oneDecimal(finance.emergencyMonths)} months of essentials · target is 6</p>
        <Progress value={emergencyPct} tone="teal" />
        <p style={{ marginBottom: 0 }}>
          <Money value={finance.emergencySaved} /> of <Money value={finance.emergencyTarget} />
        </p>
      </section>

      {assets.map((group) => (
        <section key={group.group}>
          <h2 className="section-label">{group.group}</h2>
          <div className="card">
            {group.items.map((account) => {
              const label = destinationLabel(account.destination);
              return (
                <div key={account.id} className="row">
                  <span className="copy">
                    <strong>
                      {account.name}{" "}
                      {label && <span className={cx("pill", label === "Emergency" ? "emergency" : label === "Goal" ? "goal" : "investment")}>{label}</span>}
                    </strong>
                    <small>
                      {account.detail} · {account.live ? "Live" : "Entered by you"} · Updated {account.updated}
                    </small>
                  </span>
                  <Money value={account.balance} />
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {liabilities.map((group) => (
        <section key={group.group}>
          <h2 className="section-label">{group.group}</h2>
          <div className="card">
            {group.items.map((account) => (
              <div key={account.id} className="row">
                <span className="copy">
                  <strong>{account.name}</strong>
                  <small>
                    {account.debtKind ?? account.detail}
                    {account.apr != null ? ` · ${account.apr}%` : ""}
                    {account.minDue ? ` · EMI ${formatInrSafe(account.minDue, state.hideBalances)}` : " · no monthly EMI"}
                  </small>
                </span>
                <Money value={account.balance} tone="out" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function formatInrSafe(value: number, hidden: boolean) {
  return hidden ? "hidden" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
