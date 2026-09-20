const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const transactions = [
  { id: 1, merchant: "A2B Restaurant", meta: "Food • UPI from HDFC", amount: -860, icon: "utensils", tone: "food", type: "money-out", time: "1:42 PM" },
  { id: 2, merchant: "Namma Metro", meta: "Travel • UPI from SBI", amount: -120, icon: "train-front", tone: "travel", type: "money-out", time: "9:14 AM" },
  { id: 3, merchant: "Cash withdrawal", meta: "HDFC to Cash wallet", amount: 2000, icon: "arrow-left-right", tone: "move", type: "moves", time: "8:30 AM", display: "Moved" },
  { id: 4, merchant: "Salary", meta: "Income • HDFC Salary", amount: 75000, icon: "briefcase-business", tone: "income", type: "money-in", time: "19 Sep" },
  { id: 5, merchant: "BigBasket", meta: "Groceries • ICICI Card", amount: -3190, icon: "shopping-basket", tone: "food", type: "money-out", time: "19 Sep" },
  { id: 6, merchant: "Bank interest", meta: "Interest • SBI Savings", amount: 310, icon: "landmark", tone: "income", type: "money-in", time: "19 Sep" },
  { id: 7, merchant: "Birthday gift for Anu", meta: "Gift purchase • ICICI Card", amount: -2450, icon: "gift", tone: "food", type: "money-out", time: "18 Sep" },
  { id: 8, merchant: "Support for Amma and Appa", meta: "Family support • HDFC Salary", amount: -8000, icon: "heart-handshake", tone: "income", type: "money-out", time: "15 Sep" },
];

const reviewItems = [
  { id: "duplicate", title: "Possible duplicate payment", detail: "A2B Restaurant • Today, 1:42 PM", amount: -860, evidence: "The bank SMS and PhonePe message share the same UPI reference. They probably describe one payment.", secondary: "Keep both", confirm: "Merge as one" },
  { id: "account", title: "Which account paid this?", detail: "Namma Metro • Today, 9:14 AM", amount: -120, evidence: "The UPI message confirms payment but does not reveal whether HDFC or SBI funded it.", secondary: "Choose HDFC", confirm: "Use SBI" },
  { id: "meaning", title: "Is this borrowed money?", detail: "Transfer from Arun • 18 Sep", amount: 5000, evidence: "Incoming transfers from this person were previously marked as personal debt, not income.", secondary: "It is income", confirm: "Add to Arun debt" },
];

let currentFilter = "all";
let reviewDone = 0;
let balancesHidden = false;
let currentEntryType = "expense";

const averages = {
  daily: { amount: "&#8377;1,758", unit: "per day", note: "Based on 20 tracked days in September. Transfers, savings and money lent are excluded." },
  weekly: { amount: "&#8377;12,306", unit: "per week", note: "Average across the last 8 complete weeks. This week is 6% lower than your usual week." },
  monthly: { amount: "&#8377;52,760", unit: "per month", note: "Average across the last 6 reconciled months. September is still in progress." },
};

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function renderTransaction(item) {
  const positive = item.amount > 0 && item.type !== "moves";
  const amountText = item.display || `${positive ? "+" : ""}${money.format(item.amount)}`;
  return `<button class="transaction-row" data-transaction="${item.id}">
    <span class="merchant-icon ${item.tone}">${icon(item.icon)}</span>
    <span class="row-copy"><strong>${item.merchant}</strong><small>${item.meta} • ${item.time}</small></span>
    <span class="row-amount ${positive ? "positive" : ""}">${amountText}</span>
  </button>`;
}

function renderTransactions() {
  document.querySelector("#home-transactions").innerHTML = transactions.slice(0, 3).map(renderTransaction).join("");
  document.querySelector("#activity-transactions").innerHTML = transactions.slice(0, 3).filter(matchesCurrentFilter).map(renderTransaction).join("");
  document.querySelector("#older-transactions").innerHTML = transactions.slice(3).filter(matchesCurrentFilter).map(renderTransaction).join("");
  refreshIcons();
}

function matchesCurrentFilter(item) {
  const query = document.querySelector("#activity-search")?.value.trim().toLowerCase() || "";
  const filterMatch = currentFilter === "all" || item.type === currentFilter;
  const searchMatch = !query || `${item.merchant} ${item.meta} ${Math.abs(item.amount)}`.toLowerCase().includes(query);
  return filterMatch && searchMatch;
}

function renderReview() {
  const remaining = reviewItems.slice(reviewDone);
  document.querySelector("#review-progress-bar").style.width = `${(reviewDone / reviewItems.length) * 100}%`;
  document.querySelector("#review-cards").innerHTML = remaining.map((item, index) => `<article class="review-card" data-review-card="${item.id}" style="${index ? "opacity:.72" : ""}">
    <div class="review-card-head"><div><h3>${item.title}</h3><p>${item.detail}</p></div><strong>${item.amount > 0 ? "+" : ""}${money.format(item.amount)}</strong></div>
    <p class="evidence-note">${item.evidence}</p>
    <div class="review-actions"><button class="secondary-button" data-review-action="secondary">${item.secondary}</button><button class="confirm-button" data-review-action="confirm">${item.confirm}</button></div>
  </article>`).join("");
  const complete = reviewDone >= reviewItems.length;
  document.querySelector("#review-complete").hidden = !complete;
  document.querySelector("#review-cards").hidden = complete;
  refreshIcons();
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === `screen-${name}`));
  const active = document.querySelector(`#screen-${name}`);
  if (!active) return;
  document.querySelector("#screen-title").textContent = active.dataset.title;
  document.querySelector("#eyebrow").textContent = active.dataset.eyebrow;
  document.querySelectorAll("[data-screen]").forEach((button) => button.classList.toggle("active", button.dataset.screen === name));
  const showFab = ["home", "activity"].includes(name);
  document.querySelector(".fab").hidden = !showFab;
  active.scrollTop = 0;
}

function openSheet(id) {
  document.querySelector("#modal-backdrop").hidden = false;
  document.querySelector(`#${id}`).hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => document.querySelector(`#${id} input`)?.focus(), 30);
}

function closeSheets() {
  document.querySelector("#modal-backdrop").hidden = true;
  document.querySelectorAll(".bottom-sheet").forEach((sheet) => sheet.hidden = true);
  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function showDetail(title, amount, lines) {
  document.querySelector("#detail-title").textContent = title;
  document.querySelector("#detail-content").innerHTML = `<p class="detail-amount">${amount}</p><p class="detail-sub">Recorded in September</p><div class="detail-grid">${lines.map(([label, value]) => `<div class="detail-line"><span>${label}</span><strong>${value}</strong></div>`).join("")}</div>`;
  openSheet("detail-sheet");
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
}

document.addEventListener("click", (event) => {
  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) { showScreen(screenButton.dataset.screen); return; }

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    currentFilter = filterButton.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((button) => button.classList.toggle("active", button === filterButton));
    renderTransactions();
    return;
  }

  const planTab = event.target.closest("[data-plan-tab]");
  if (planTab) {
    document.querySelectorAll("[data-plan-tab]").forEach((button) => button.classList.toggle("active", button === planTab));
    document.querySelectorAll(".plan-pane").forEach((pane) => pane.classList.toggle("active", pane.id === `plan-${planTab.dataset.planTab}`));
    return;
  }

  const entryType = event.target.closest("[data-entry]");
  if (entryType) {
    currentEntryType = entryType.dataset.entry;
    document.querySelectorAll("[data-entry]").forEach((button) => button.classList.toggle("active", button === entryType));
    return;
  }

  const averageButton = event.target.closest("[data-average]");
  if (averageButton) {
    const value = averages[averageButton.dataset.average];
    document.querySelectorAll("[data-average]").forEach((button) => button.classList.toggle("active", button === averageButton));
    document.querySelector("#average-title").innerHTML = `${value.amount} <span>${value.unit}</span>`;
    document.querySelector("#average-note").textContent = value.note;
    return;
  }

  const txButton = event.target.closest("[data-transaction]");
  if (txButton) {
    const tx = transactions.find((item) => item.id === Number(txButton.dataset.transaction));
    showDetail(tx.merchant, tx.display || money.format(tx.amount), [["Category", tx.meta.split(" • ")[0]], ["Account", tx.meta.split(" • ")[1] || "Cash wallet"], ["Evidence", tx.type === "moves" ? "Bank SMS" : "SMS + payment message"], ["Status", "Confirmed"]]);
    return;
  }

  const reviewAction = event.target.closest("[data-review-action]");
  if (reviewAction) {
    reviewDone += 1;
    renderReview();
    showToast(reviewAction.dataset.reviewAction === "confirm" ? "Confirmed and ledger updated" : "Choice saved");
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "quick-add") openSheet("quick-add-sheet");
  if (action === "close-sheet") closeSheets();
  if (action === "review") showScreen("review");
  if (action === "reconcile") showScreen("reconcile");
  if (action === "open-savings") {
    showScreen("plan");
    const savingsTab = document.querySelector('[data-plan-tab="savings"]');
    savingsTab.click();
  }
  if (action === "confidence") showDetail("Tracking confidence", "82%", [["Account coverage", "90%"], ["Balances matched", "50%"], ["Review complete", "76%"], ["Cash confidence", "55%"]]);
  if (action === "open-income") showDetail("Money in", money.format(86240), [["Salary", money.format(75000)], ["Other income", money.format(11240)], ["Borrowed money", "Shown separately"]]);
  if (action === "open-spending") showDetail("Money out", money.format(52760), [["Essentials", money.format(36120)], ["Flexible", money.format(12640)], ["Fees and interest", money.format(4000)]]);
  if (action === "month-menu") showToast("August and October are available in the full app");
  if (action === "notifications") showToast("No urgent alerts. Two bills are due this week.");
  if (action === "filters") showToast("More filters will appear here");
  if (action === "profile") showScreen("settings");
  if (action === "add-account") showToast("Account setup flow will open here");
  if (action === "add-saving") showToast("Choose mutual fund, FD, gold scheme or another destination");
  if (action === "saving-detail") showToast("Savings contribution and current total are kept separately");
  if (action === "friend-payment") showToast("Repayment recorded against Ravi's pending amount");
  if (action === "lend-money") { currentEntryType = "lend"; openSheet("quick-add-sheet"); document.querySelector('[data-entry="lend"]').click(); }
  if (["account", "commitment"].includes(action)) showToast("Detailed account view will open here");
  if (action === "cash-check") showToast("Cash balance confirmed at " + money.format(5450));
  if (action === "card-check") showToast("Found: A2B duplicate for " + money.format(860));
  if (action === "close-month") { showToast("September closed with 2 visible exceptions"); setTimeout(() => showScreen("home"), 800); }
  if (action === "toggle-balance") {
    balancesHidden = !balancesHidden;
    document.querySelector(".balance-heading h2").textContent = balancesHidden ? "••••••" : money.format(124680);
    event.target.closest("button").innerHTML = icon(balancesHidden ? "eye-off" : "eye");
    refreshIcons();
  }
  if (action === "save-entry") {
    const value = Number(document.querySelector("#entry-amount").value);
    if (!value) { showToast("Enter an amount first"); return; }
    const category = document.querySelector("#entry-category").value;
    const person = document.querySelector("#entry-person").value.trim();
    const note = document.querySelector("#entry-note").value.trim();
    const entrySettings = {
      expense: { type: "money-out", amount: -value, display: null, icon: category === "Gift purchase" ? "gift" : category === "Family support" ? "heart-handshake" : "receipt-text", tone: "food" },
      income: { type: "money-in", amount: value, display: null, icon: "arrow-down-left", tone: "income" },
      move: { type: "moves", amount: value, display: "Moved", icon: "arrow-left-right", tone: "move" },
      save: { type: "moves", amount: value, display: "Saved", icon: "sprout", tone: "income" },
      lend: { type: "moves", amount: -value, display: "Lent", icon: "hand-coins", tone: "move" },
    }[currentEntryType];
    const merchant = note || person || category;
    const recipient = person ? ` • For ${person}` : "";
    transactions.unshift({ id: Date.now(), merchant, meta: `${category} • ${document.querySelector("#entry-account").value}${recipient}`, ...entrySettings, time: "Just now" });
    renderTransactions(); closeSheets(); showToast("Transaction added");
  }
});

document.querySelector("#modal-backdrop").addEventListener("click", closeSheets);
document.querySelector("#activity-search").addEventListener("input", renderTransactions);
window.addEventListener("offline", () => document.querySelector("#offline-banner").hidden = false);
window.addEventListener("online", () => document.querySelector("#offline-banner").hidden = true);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSheets(); });

renderTransactions();
renderReview();
refreshIcons();
