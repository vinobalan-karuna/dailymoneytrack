import { useState } from "react";
import { useStore } from "../state/store";
import type { IncomeStyle } from "../types";

const STEPS = ["welcome", "profile", "source", "baseline"] as const;

export function OnboardingScreen() {
  const { exploreSample, completeOnboarding } = useStore();
  const [step, setStep] = useState<(typeof STEPS)[number]>("welcome");
  const [name, setName] = useState("Arun");
  const [style, setStyle] = useState<IncomeStyle>("salaried");
  const index = STEPS.indexOf(step);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", paddingBottom: 12 }}>
      <div className="steps" aria-hidden>
        {STEPS.map((item, i) => (
          <i key={item} className={i <= index ? "on" : ""} />
        ))}
      </div>
      {step === "welcome" && (
        <>
          <p className="muted" style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: 12 }}>DAILY MONEY</p>
          <h1 className="screen-title">See what you can use, not just what the bank shows.</h1>
          <p>One place for spending, savings, debts, and what is coming — built for UPI, cash, EMIs, and family money.</p>
          <div style={{ marginTop: "auto", display: "grid", gap: 8 }}>
            <button type="button" className="btn" onClick={exploreSample}>
              See Arun's sample
            </button>
            <button type="button" className="btn ghost" onClick={() => setStep("profile")}>
              Set up a preview
            </button>
          </div>
        </>
      )}
      {step === "profile" && (
        <>
          <h1 className="screen-title">Who is this for?</h1>
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          {([
            ["salaried", "Salaried", "Salary on a regular date"],
            ["variable", "Variable", "Freelance, business, or mixed"],
            ["unsure", "Not sure yet", "Family support, or still figuring it out"],
          ] as const).map(([id, label, detail]) => (
            <button key={id} type="button" className={style === id ? "choice active" : "choice"} onClick={() => setStyle(id)}>
              <strong>{label}</strong>
              <small>{detail}</small>
            </button>
          ))}
          <div style={{ marginTop: "auto" }}>
            <button type="button" className="btn" onClick={() => setStep("source")}>Continue</button>
          </div>
        </>
      )}
      {step === "source" && (
        <>
          <h1 className="screen-title">Start with one source</h1>
          <p className="muted">Manual entry is the fallback. Nothing else is asked now. In Arun’s sample, HDFC SMS, a second SIM, cards, and UPI apps are already mapped.</p>
          <button type="button" className="choice active"><strong>HDFC Salary · 4412</strong><small>SMS on SIM 1</small></button>
          <button type="button" className="choice"><strong>Cash wallet</strong><small>You count notes when you can</small></button>
          <div style={{ marginTop: "auto", display: "grid", gap: 4 }}>
            <button type="button" className="btn" onClick={() => setStep("baseline")}>Continue</button>
            <button type="button" className="btn ghost" onClick={exploreSample}>Skip for now</button>
          </div>
        </>
      )}
      {step === "baseline" && (
        <>
          <h1 className="screen-title">A light monthly picture</h1>
          <p className="muted">Rent, EMIs, SIPs, and family support. You can change these later. The sample month is already filled in.</p>
          <div style={{ marginTop: "auto", display: "grid", gap: 4 }}>
            <button
              type="button"
              className="btn"
              onClick={() =>
                completeOnboarding({
                  name,
                  incomeStyle: style,
                  salaryDay: 1,
                  commitments: ["Rent", "EMIs", "SIPs", "Family support"],
                  startingNote: null,
                })
              }
            >
              Open Home
            </button>
            <button type="button" className="btn ghost" onClick={exploreSample}>
              Use sample data
            </button>
          </div>
        </>
      )}
    </div>
  );
}
