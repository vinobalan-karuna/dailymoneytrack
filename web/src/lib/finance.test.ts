import { describe, expect, it } from "vitest";
import { freshState } from "../data/initial";
import { computeFinance, debtPlan, orderDebts } from "./finance";
import { markBillPaid } from "./ledger";

describe("Arun sample finances", () => {
  const state = { ...freshState(), onboarded: true };

  it("shows ₹1,43,100 available to use", () => {
    const finance = computeFinance(state);
    expect(finance.liquid).toBe(167710);
    expect(finance.reserved).toBe(24610);
    expect(finance.available).toBe(143100);
  });

  it("covers about 78% from connected sources", () => {
    const finance = computeFinance(state);
    expect(finance.coverage).toBe(78);
    expect(finance.healthOn).toBe(true);
    expect(finance.health?.status).toBe("Stable");
  });

  it("hides financial strength when HDFC SMS is off", () => {
    const next = {
      ...state,
      sources: state.sources.map((source) => (source.id === "hdfc" ? { ...source, enabled: false } : source)),
    };
    const finance = computeFinance(next);
    expect(finance.healthOn).toBe(false);
    expect(finance.health).toBeNull();
    expect(finance.healthReason).toMatch(/HDFC/);
    expect(finance.coverage).toBe(54);
  });

  it("asks to close Axis Ace first and offers snowball", () => {
    const plan = debtPlan(state.accounts, 5000);
    expect(plan).not.toBeNull();
    expect(plan?.closeFirst.name).toBe("Axis Ace");
    expect(plan?.closeFirst.apr).toBe(42);
    expect(plan?.avalanche.map((debt) => debt.apr)).toEqual([42, 36, 13, 9.2, 8.5, 0]);
    expect(orderDebts(plan?.debts ?? [], "snowball")[0]?.name).toBe("SBI SimplySAVE");
    expect(plan?.baseline.months).toBe(35);
    expect(plan?.withExtra.months).toBe(11);
    expect(plan?.monthsSaved).toBe(24);
    expect(plan?.interestSaved).toBe(42471);
    expect(plan?.reason).toMatch(/costliest debt/);
    expect(plan?.reason).not.toMatch(/you should invest|advisory|recommend you buy/i);
  });

  it("keeps available money the same when a reserved bill is paid", () => {
    const before = computeFinance(state).available;
    const paid = markBillPaid(state, "bill-rent").state;
    expect(computeFinance(paid).available).toBe(before);
    expect(paid.bills.find((bill) => bill.id === "bill-rent")?.paid).toBe(true);
  });

  it("lists the five things that need attention", () => {
    const titles = computeFinance(state).attention.map((item) => item.title);
    expect(titles).toEqual(["987321@okaxis", "Kiran", "Swiggy", "Money from Priya K", "Count the cash"]);
  });
});
