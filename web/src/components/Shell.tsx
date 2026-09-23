import type { ReactNode } from "react";
import { CalendarCheck2, House, PiggyBank, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "./ui";

export type Tab = "home" | "activity" | "plan" | "savings" | "you";

const TABS: { id: Tab; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "activity", label: "Activity", icon: House },
  { id: "plan", label: "Plan", icon: CalendarCheck2 },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "you", label: "You", icon: UserRound },
];

function useKolkataClock() {
  const format = () =>
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(format()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}

export function PhoneFrame({
  theme,
  tab,
  onTab,
  fab,
  snack,
  overlay,
  children,
}: {
  theme: "light" | "dark";
  tab: Tab | null;
  onTab: (tab: Tab) => void;
  fab?: ReactNode;
  snack?: ReactNode;
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const time = useKolkataClock();
  return (
    <div className="desk">
      <div className="desk-layout">
        <aside className="guide">
          <h2>Daily Money</h2>
          <p>Arun’s sample finances for September 2026. The large number is what he can use today, not a raw bank balance.</p>
          <ol>
            <li>
              <strong>1. Home.</strong> Available to use is banks plus cash, minus money already reserved.
            </li>
            <li>
              <strong>2. Needs you.</strong> Confirm the unnamed UPI payment, Kiran, the possible duplicate, and Priya’s NEFT.
            </li>
            <li>
              <strong>3. Plan.</strong> Mark house rent paid and open Debt to see why Axis Ace is listed first.
            </li>
            <li>
              <strong>4. You.</strong> Turn HDFC SMS off to see financial strength disappear.
            </li>
          </ol>
          <p className="guide-note">Sample data stays on this device. Nothing here is a bank connection.</p>
        </aside>
        <div className="phone" data-theme={theme}>
          <div className="phone-top">
            <span className="num">{time}</span>
            <span aria-hidden>LTE</span>
          </div>
          <div className="phone-body">
            <div className="scroll">{children}</div>
            {fab}
            {snack}
            {tab && (
              <nav className="nav" aria-label="Primary">
                {TABS.map((item) => {
                  const Icon = item.id === "activity" ? ActivityIcon : item.icon;
                  return (
                    <button key={item.id} type="button" className={cx(tab === item.id && "active")} onClick={() => onTab(item.id)}>
                      <Icon />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}
            {overlay}
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}
