import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPercent, initials } from "../lib/format";
import { Toggle, cx } from "../components/ui";
import { useStore } from "../state/store";
import type { IncomeStyle, ThemeChoice } from "../types";

export type YouPage =
  | "profile"
  | "accounts"
  | "sources"
  | "categories"
  | "appearance"
  | "security"
  | "notifications"
  | "export"
  | "privacy"
  | "premium"
  | "help";

const INCOME: Record<IncomeStyle, string> = {
  salaried: "Salaried",
  variable: "Variable",
  unsure: "Not sure yet",
};

export function YouScreen({ onOpen }: { onOpen: (page: YouPage) => void }) {
  const { state } = useStore();
  const name = state.profile.name || "Arun";
  return (
    <div>
      <h1 className="screen-title">You</h1>
      <p className="screen-sub">How your money setup is configured</p>
      <button type="button" className="card row" style={{ marginTop: 16 }} onClick={() => onOpen("profile")}>
        <span className="avatar">{initials(name)}</span>
        <span className="copy">
          <strong>{name}</strong>
          <small>
            {INCOME[state.profile.incomeStyle]} · {state.profile.city}
          </small>
          <em>Sample preview</em>
        </span>
        <ChevronRight size={18} />
      </button>
      <Menu title="Money">
        <Item label="Connected accounts" onClick={() => onOpen("accounts")} />
        <Item label="Sources and connections" detail="SMS, banks, UPI, cards" onClick={() => onOpen("sources")} />
        <Item label="Categories" onClick={() => onOpen("categories")} />
      </Menu>
      <Menu title="App">
        <Item label="Appearance" detail={state.theme === "light" ? "Light" : state.theme === "dark" ? "Dark" : "System"} onClick={() => onOpen("appearance")} />
        <Item label="Security" detail={state.biometric ? "Fingerprint on" : "Fingerprint off"} onClick={() => onOpen("security")} />
        <Item label="Notifications" onClick={() => onOpen("notifications")} />
      </Menu>
      <Menu title="Your data">
        <Item label="Export" onClick={() => onOpen("export")} />
        <Item label="Privacy" onClick={() => onOpen("privacy")} />
      </Menu>
      <Menu title="More">
        <Item label="Daily Money Plus" detail="A preview of what's later" onClick={() => onOpen("premium")} />
        <Item label="Help" onClick={() => onOpen("help")} />
      </Menu>
      <p className="faint" style={{ textAlign: "center", fontSize: 12 }}>
        Preview · September 2026 · stays on this device
      </p>
    </div>
  );
}

function Menu({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="section-label">{title}</h2>
      <div className="card">{children}</div>
    </section>
  );
}

function Item({ label, detail, onClick }: { label: string; detail?: string; onClick: () => void }) {
  return (
    <button type="button" className="row" onClick={onClick}>
      <span className="copy">
        <strong>{label}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <ChevronRight size={16} />
    </button>
  );
}

export function YouPageScreen({ page, onBack }: { page: YouPage; onBack: () => void }) {
  const title: Record<YouPage, string> = {
    profile: "Profile",
    accounts: "Connected accounts",
    sources: "Data sources",
    categories: "Categories",
    appearance: "Appearance",
    security: "Security",
    notifications: "Notifications",
    export: "Export",
    privacy: "Privacy",
    premium: "Daily Money Plus",
    help: "Help",
  };
  return (
    <div>
      <div className="backbar">
        <button type="button" aria-label="Back" onClick={onBack}>
          <ChevronLeft />
        </button>
        <strong>{title[page]}</strong>
      </div>
      {page === "profile" && <ProfilePage />}
      {page === "accounts" && <AccountsPage />}
      {page === "sources" && <SourcesPage />}
      {page === "categories" && <CategoriesPage />}
      {page === "appearance" && <AppearancePage />}
      {page === "security" && <SecurityPage />}
      {page === "notifications" && <NotificationSettings />}
      {page === "export" && <ExportPage />}
      {page === "privacy" && <PrivacyPage />}
      {page === "premium" && <PremiumPage />}
      {page === "help" && <HelpPage />}
    </div>
  );
}

function ProfilePage() {
  const { state, patchProfile } = useStore();
  const [name, setName] = useState(state.profile.name);
  return (
    <div>
      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="field">
        <span>City</span>
        <input value={state.profile.city} onChange={(event) => patchProfile({ city: event.target.value })} />
      </label>
      <label className="field">
        <span>Income pattern</span>
        <select value={state.profile.incomeStyle} onChange={(event) => patchProfile({ incomeStyle: event.target.value as IncomeStyle })}>
          <option value="salaried">Monthly salary</option>
          <option value="variable">Variable or freelance</option>
          <option value="unsure">Family support, or not sure yet</option>
        </select>
      </label>
      <button type="button" className="btn" style={{ marginTop: 16 }} onClick={() => patchProfile({ name: name.trim() || "Arun" })}>
        Save profile
      </button>
    </div>
  );
}

function AccountsPage() {
  const { state } = useStore();
  const groups = ["Liquid", "Investments", "Retirement", "Gold", "Receivables", "Property", "Cards", "Loans"];
  return (
    <div>
      {groups.map((group) => {
        const items = state.accounts.filter((account) => account.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group}>
            <h2 className="section-label">{group}</h2>
            <div className="card">
              {items.map((account) => (
                <div key={account.id} className="row">
                  <span className="copy">
                    <strong>{account.name}</strong>
                    <small>
                      {account.live ? "Live" : "Manual"} · {account.updated}
                    </small>
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function SourcesPage() {
  const { state, finance, setSourceEnabled } = useStore();
  const groups = ["SIM", "Banks", "Cards", "UPI", "Cash", "Investments", "Import"];
  return (
    <div>
      <p className="muted">
        Automation is the default. Manual entry is the fallback when a source is off. Coverage is {formatPercent(finance.coverage)}. Turning HDFC SMS off hides financial strength, because the month would be a guess.
      </p>
      {groups.map((group) => {
        const items = state.sources.filter((source) => source.group === group);
        if (items.length === 0) return null;
        const heading = group === "UPI" ? "UPI apps · mapped to a bank" : group === "SIM" ? "Dual SIM SMS" : group;
        return (
          <section key={group}>
            <h2 className="section-label">{heading}</h2>
            <div className="card">
              {items.map((source) => (
                <div key={source.id} className="row">
                  <span className="copy">
                    <strong>{source.name}</strong>
                    <small>
                      {source.detail} · {source.fresh}
                    </small>
                  </span>
                  <Toggle on={source.enabled} label={source.name} onChange={(on) => setSourceEnabled(source.id, on)} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
      <p className="muted">UPI apps do not add a second balance. Cash, EPF, NPS, post office, gold, and the house stay manual until you type them.</p>
    </div>
  );
}

function CategoriesPage() {
  const { finance } = useStore();
  return (
    <div className="card" style={{ marginTop: 8 }}>
      {finance.categories.map((row) => (
        <div key={row.category} className="row">
          <span className="copy">
            <strong>{row.category}</strong>
            <small>September spending, after refunds</small>
          </span>
          <strong className="num">{row.amount.toLocaleString("en-IN")}</strong>
        </div>
      ))}
    </div>
  );
}

function AppearancePage() {
  const { state, setTheme, toggleHideBalances } = useStore();
  const choices: ThemeChoice[] = ["light", "dark", "system"];
  return (
    <div>
      <div className="seg">
        {choices.map((choice) => (
          <button key={choice} type="button" className={cx(state.theme === choice && "active")} onClick={() => setTheme(choice)}>
            {choice === "light" ? "Light" : choice === "dark" ? "Dark" : "System"}
          </button>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="row">
          <span className="copy">
            <strong>Hide balances</strong>
            <small>Amounts become dots until you show them again</small>
          </span>
          <Toggle on={state.hideBalances} label="Hide balances" onChange={() => toggleHideBalances()} />
        </div>
      </div>
    </div>
  );
}

function SecurityPage() {
  const { state, setBiometric } = useStore();
  return (
    <div className="card">
      <div className="row">
        <span className="copy">
          <strong>Fingerprint lock</strong>
          <small>Saved for this preview only. The phone is not actually locked.</small>
        </span>
        <Toggle on={state.biometric} label="Fingerprint lock" onChange={setBiometric} />
      </div>
    </div>
  );
}

function NotificationSettings() {
  const { state, setNotif } = useStore();
  const rows = [
    ["notifBills", "Bills", "Example: House rent in 2 days, even late at night."] as const,
    ["notifAttention", "Needs a check", "Example: One UPI has no shop name. Open when you can."] as const,
    ["notifInsights", "Useful notes", "Example: SIP went through. Nothing to do."] as const,
    ["notifQuiet", "Quiet hours", "After 9 pm, only a bill due tomorrow gets through."] as const,
  ];
  return (
    <div className="card">
      {rows.map(([key, label, detail]) => (
        <div key={key} className="row">
          <span className="copy">
            <strong>{label}</strong>
            <small>{detail}</small>
          </span>
          <Toggle on={state[key]} label={label} onChange={(on) => setNotif(key, on)} />
        </div>
      ))}
    </div>
  );
}

function ExportPage() {
  const { state } = useStore();
  return (
    <div>
      <p className="muted">Download September activity as a CSV. This preview does not upload it.</p>
      <button
        type="button"
        className="btn"
        onClick={() => {
          const header = ["Date", "Time", "Type", "Title", "Category", "Amount", "Account", "Channel", "Source", "Confidence", "Notes"];
          const rows = state.transactions
            .filter((tx) => tx.included && tx.at.startsWith("2026-09"))
            .map((tx) => [tx.at.slice(0, 10), tx.at.slice(11, 16), tx.type, tx.title, tx.category, String(tx.amount), tx.accountId, tx.channel, tx.source, tx.confidence, tx.notes ?? ""]);
          const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "daily-money-2026-09.csv";
          link.click();
          URL.revokeObjectURL(url);
        }}
      >
        Export September
      </button>
    </div>
  );
}

function PrivacyPage() {
  const { resetAll } = useStore();
  return (
    <div>
      <p>Sample finances stay in this browser. SMS, statements, and UPI apps are not read.</p>
      <p className="muted">Reset clears decisions you made in the preview and brings Arun’s sample month back.</p>
      <button type="button" className="btn line" onClick={resetAll}>
        Reset sample data
      </button>
    </div>
  );
}

function PremiumPage() {
  return (
    <div className="card card-pad">
      <strong>Later, not now</strong>
      <p className="muted">Shared households, a quieter month-end note, and a longer forecast. The free preview already includes the ledger, sources, and debt order.</p>
    </div>
  );
}

function HelpPage() {
  const items = [
    ["What is available to use?", "Bank and cash balances, minus bills already reserved. It is not the raw bank balance."],
    ["Why isn’t PhonePe a balance?", "PhonePe, Google Pay, and BHIM pay from a bank. Counting the app again would double the money."],
    ["What does coverage mean?", "It is how much of this picture can refresh from a connected source. It is not a score. Cash, EPF, NPS, and gold stay yours even when they are typed in."],
    ["Which loan should be paid first?", "Plan → Debt ranks loans by the interest rate you entered. The highest rate is listed first. Snowball, smallest balance first, is there if you want to compare. The months and interest are a straight estimate, not a bank quote."],
  ];
  return (
    <div className="card">
      {items.map(([q, a]) => (
        <div key={q} className="row" style={{ alignItems: "flex-start" }}>
          <span className="copy">
            <strong>{q}</strong>
            <small style={{ whiteSpace: "normal" }}>{a}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
