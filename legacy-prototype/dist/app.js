const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const transactions = [
  { id:1, merchant:"A2B Restaurant", meta:"Food • UPI from HDFC", amount:-860, icon:"utensils", tone:"food", type:"money-out", time:"1:42 PM" },
  { id:2, merchant:"Namma Metro", meta:"Travel • UPI from SBI", amount:-120, icon:"train-front", tone:"travel", type:"money-out", time:"9:14 AM" },
  { id:3, merchant:"Mutual fund SIP", meta:"Mutual fund • HDFC Salary", amount:8000, icon:"sprout", tone:"income", type:"savings", time:"7:30 AM", display:"Saved" },
  { id:4, merchant:"Cash withdrawal", meta:"HDFC to Cash wallet", amount:2000, icon:"arrow-left-right", tone:"move", type:"moves", time:"Yesterday", display:"Moved" },
  { id:5, merchant:"Salary", meta:"Income • HDFC Salary", amount:75000, icon:"briefcase-business", tone:"income", type:"money-in", time:"19 Sep" },
  { id:6, merchant:"BigBasket", meta:"Groceries • ICICI Card", amount:-3190, icon:"shopping-basket", tone:"food", type:"money-out", time:"19 Sep" },
  { id:7, merchant:"Bank interest", meta:"Interest • SBI Savings", amount:310, icon:"landmark", tone:"income", type:"money-in", time:"19 Sep" },
  { id:8, merchant:"Birthday gift for Anu", meta:"Gift purchase • ICICI Card", amount:-2450, icon:"gift", tone:"food", type:"money-out", time:"18 Sep" },
  { id:9, merchant:"Support for Amma and Appa", meta:"Family support • HDFC Salary", amount:-8000, icon:"heart-handshake", tone:"income", type:"money-out", time:"15 Sep" }
];
const reviewItems = [
  { title:"Possible duplicate payment", detail:"A2B Restaurant • Today, 1:42 PM", amount:-860, evidence:"The bank SMS and PhonePe message share the same UPI reference.", secondary:"Keep both", confirm:"Merge as one" },
  { title:"Which account paid this?", detail:"Namma Metro • Today, 9:14 AM", amount:-120, evidence:"The UPI message confirms payment but does not reveal the funding bank.", secondary:"Choose HDFC", confirm:"Use SBI" },
  { title:"Is this borrowed money?", detail:"Transfer from Arun • 18 Sep", amount:5000, evidence:"Incoming transfers from this person were previously marked as debt, not income.", secondary:"It is income", confirm:"Add to debt" }
];
const averages = {
  daily:{ amount:"&#8377;1,758", unit:"per day", note:"Based on 20 tracked days. Transfers, savings and money lent are excluded." },
  weekly:{ amount:"&#8377;12,306", unit:"per week", note:"Average across the last 8 complete weeks. This week is 6% lower." },
  monthly:{ amount:"&#8377;52,760", unit:"per month", note:"Average across the last 6 reconciled months. September is still in progress." }
};
const onboardingSteps = [
  { title:"See your complete money picture", body:"Track bank accounts, cards, cash, loans, savings and money shared with people in one private place.", benefits:[["shield-check","Your raw financial messages stay protected"],["scan-search","Every imported entry shows its source and confidence"]] },
  { title:"Choose what to connect", body:"Start with one account or cash wallet. SMS, statement and email imports are optional and can be added later.", benefits:[["message-square-text","Financial SMS on supported Android devices"],["file-text","Bank and card statement import on iOS and Android"]] },
  { title:"Keep your totals trustworthy", body:"We will ask you to review duplicates, unknown accounts and cash balances. Nothing uncertain is silently treated as fact.", benefits:[["list-checks","A short review inbox for exceptions"],["calendar-check-2","Monthly reconciliation with visible differences"]] },
  { title:"Set your first money period", body:"Begin with this month, then add older statements whenever you are ready. You can browse every month and year from the main screens.", benefits:[["calendar-days","September 2026 selected"],["lock-keyhole","Biometric lock enabled"]] }
];
let currentFilter="all", reviewDone=0, balancesHidden=false, currentEntryType="expense", onboardingIndex=0, editingBillRow=null;
let categories=["Food","Groceries","Travel","Medicine","Gift purchase","Family support","Donation","Mutual fund","Fixed deposit","Gold scheme"];

function icon(name){ return `<i data-lucide="${name}"></i>`; }
function refreshIcons(){ if(window.lucide) window.lucide.createIcons({attrs:{"stroke-width":1.8}}); }
function renderTransaction(item){
  const positive=item.amount>0&&item.type==="money-in";
  const amountText=item.display||`${positive?"+":""}${money.format(item.amount)}`;
  return `<button class="transaction-row" data-transaction="${item.id}"><span class="merchant-icon ${item.tone}">${icon(item.icon)}</span><span class="row-copy"><strong>${item.merchant}</strong><small>${item.meta} • ${item.time}</small></span><span class="row-amount ${positive?"positive":""}">${amountText}</span></button>`;
}
function matches(item){
  const query=document.querySelector("#activity-search")?.value.trim().toLowerCase()||"";
  return (currentFilter==="all"||item.type===currentFilter)&&(!query||`${item.merchant} ${item.meta} ${Math.abs(item.amount)}`.toLowerCase().includes(query));
}
function renderTransactions(){
  const filtered=transactions.filter(matches);
  document.querySelector("#activity-transactions").innerHTML=filtered.slice(0,3).map(renderTransaction).join("")||'<p class="empty-state">No activity matches this view.</p>';
  document.querySelector("#older-transactions").innerHTML=filtered.slice(3).map(renderTransaction).join("");
  refreshIcons();
}
function renderReview(){
  const remaining=reviewItems.slice(reviewDone);
  document.querySelector("#review-progress-bar").style.width=`${reviewDone/reviewItems.length*100}%`;
  document.querySelector("#review-cards").innerHTML=remaining.map((item,index)=>`<article class="review-card" style="${index?"opacity:.72":""}"><div class="review-card-head"><div><h3>${item.title}</h3><p>${item.detail}</p></div><strong>${item.amount>0?"+":""}${money.format(item.amount)}</strong></div><p class="evidence-note">${item.evidence}</p><div class="review-actions"><button class="secondary-button" data-review-action="secondary">${item.secondary}</button><button class="confirm-button" data-review-action="confirm">${item.confirm}</button></div></article>`).join("");
  const complete=reviewDone>=reviewItems.length;
  document.querySelector("#review-complete").hidden=!complete;
  document.querySelector("#review-cards").hidden=complete;
  refreshIcons();
}
function renderCategories(){
  document.querySelector("#category-list").innerHTML=categories.map((name,index)=>`<div class="category-row"><input value="${name}" aria-label="Category ${name}"><button data-rename-category="${index}">Save</button></div>`).join("");
  refreshIcons();
}
function showScreen(name){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===`screen-${name}`));
  const active=document.querySelector(`#screen-${name}`); if(!active)return;
  document.querySelector("#screen-title").textContent=active.dataset.title;
  document.querySelector("#eyebrow").textContent=active.dataset.eyebrow;
  document.querySelectorAll("[data-screen]").forEach(b=>b.classList.toggle("active",b.dataset.screen===name));
  document.querySelector(".fab").hidden=!["home","activity"].includes(name);
  active.scrollTop=0;
}
function openSheet(id){ document.querySelector("#modal-backdrop").hidden=false; document.querySelector(`#${id}`).hidden=false; document.body.style.overflow="hidden"; setTimeout(()=>document.querySelector(`#${id} input`)?.focus(),30); }
function closeSheets(){ document.querySelector("#modal-backdrop").hidden=true; document.querySelectorAll(".bottom-sheet").forEach(s=>s.hidden=true); document.body.style.overflow=""; }
function toast(message){ const el=document.querySelector("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2200); }
function detail(title,amount,lines){ document.querySelector("#detail-title").textContent=title; document.querySelector("#detail-content").innerHTML=`<p class="detail-amount">${amount}</p><p class="detail-sub">Recorded in the selected period</p><div class="detail-grid">${lines.map(([a,b])=>`<div class="detail-line"><span>${a}</span><strong>${b}</strong></div>`).join("")}</div>`; openSheet("detail-sheet"); }
function renderOnboarding(){
  const step=onboardingSteps[onboardingIndex];
  document.querySelector("#onboarding-step").textContent=`STEP ${onboardingIndex+1} OF ${onboardingSteps.length}`;
  document.querySelector("#onboarding-copy").innerHTML=`<h2>${step.title}</h2><p>${step.body}</p>${step.benefits.map(([i,t])=>`<div class="onboarding-benefit">${icon(i)}<span>${t}</span></div>`).join("")}`;
  document.querySelectorAll(".onboarding-progress span").forEach((el,i)=>el.classList.toggle("active",i<=onboardingIndex));
  document.querySelector('[data-action="onboarding-next"]').textContent=onboardingIndex===onboardingSteps.length-1?"Start tracking":"Continue";
  refreshIcons();
}
function openOnboarding(){ onboardingIndex=0; renderOnboarding(); document.querySelector("#onboarding").hidden=false; }
function setTheme(value){ document.documentElement.dataset.theme=value; localStorage.setItem("dmt-theme",value); document.querySelectorAll("[data-theme-choice]").forEach(b=>b.classList.toggle("active",b.dataset.themeChoice===value)); }

document.addEventListener("click",event=>{
  const screen=event.target.closest("[data-screen]"); if(screen){showScreen(screen.dataset.screen);return;}
  const filter=event.target.closest("[data-filter]"); if(filter){currentFilter=filter.dataset.filter;document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===filter));renderTransactions();return;}
  const billTab=event.target.closest("[data-bill-tab]"); if(billTab){document.querySelectorAll("[data-bill-tab]").forEach(b=>b.classList.toggle("active",b===billTab));document.querySelectorAll(".plan-pane").forEach(p=>p.classList.toggle("active",p.id===`bills-${billTab.dataset.billTab}`));return;}
  const entry=event.target.closest("[data-entry]"); if(entry){currentEntryType=entry.dataset.entry;document.querySelectorAll("[data-entry]").forEach(b=>b.classList.toggle("active",b===entry));return;}
  const average=event.target.closest("[data-average]"); if(average){const v=averages[average.dataset.average];document.querySelectorAll("[data-average]").forEach(b=>b.classList.toggle("active",b===average));document.querySelector("#average-title").innerHTML=`${v.amount} <span>${v.unit}</span>`;document.querySelector("#average-note").textContent=v.note;return;}
  const period=event.target.closest("[data-period-value]"); if(period){document.querySelectorAll("[data-period-label]").forEach(el=>el.textContent=period.dataset.periodValue);closeSheets();toast(`Showing ${period.dataset.periodValue}`);return;}
  const theme=event.target.closest("[data-theme-choice]"); if(theme){setTheme(theme.dataset.themeChoice);return;}
  const rename=event.target.closest("[data-rename-category]"); if(rename){const row=rename.closest(".category-row");categories[Number(rename.dataset.renameCategory)]=row.querySelector("input").value.trim()||categories[Number(rename.dataset.renameCategory)];toast("Category renamed everywhere");return;}
  const transaction=event.target.closest("[data-transaction]"); if(transaction){const tx=transactions.find(x=>x.id===Number(transaction.dataset.transaction));detail(tx.merchant,tx.display||money.format(tx.amount),[["Category",tx.meta.split(" • ")[0]],["Account",tx.meta.split(" • ")[1]||"Cash wallet"],["Status","Confirmed"]]);return;}
  const review=event.target.closest("[data-review-action]"); if(review){reviewDone+=1;renderReview();toast("Decision saved and ledger updated");return;}
  const action=event.target.closest("[data-action]")?.dataset.action; if(!action)return;
  if(action==="quick-add")openSheet("quick-add-sheet");
  if(action==="close-sheet")closeSheets();
  if(action==="period")openSheet("period-sheet");
  if(action==="profile")showScreen("settings");
  if(action==="edit-profile")openSheet("profile-sheet");
  if(action==="manage-categories"){renderCategories();openSheet("category-sheet");}
  if(action==="preview-onboarding")openOnboarding();
  if(action==="add-bill"){editingBillRow=null;document.querySelector("#bill-title").textContent="Add a recurring payout";document.querySelector("#bill-name").value="";document.querySelector("#bill-amount").value="";document.querySelector("#bill-paid").checked=false;openSheet("bill-sheet");}
  if(action==="edit-bill"){editingBillRow=event.target.closest(".bill-row");document.querySelector("#bill-title").textContent="Edit recurring payout";document.querySelector("#bill-name").value=editingBillRow.querySelector(".row-copy strong").textContent;document.querySelector("#bill-amount").value=editingBillRow.querySelector(".row-actions strong").textContent.replace(/\D/g,"");document.querySelector("#bill-paid").checked=editingBillRow.querySelector(".status-pill")?.classList.contains("paid")||false;openSheet("bill-sheet");}
  if(action==="save-bill"){
    const name=document.querySelector("#bill-name").value.trim(),amount=Number(document.querySelector("#bill-amount").value),paid=document.querySelector("#bill-paid").checked;
    if(!name||!amount){toast("Add a name and amount");return;}
    if(editingBillRow){editingBillRow.querySelector(".row-copy strong").textContent=name;editingBillRow.querySelector(".row-actions strong").textContent=money.format(amount);const status=editingBillRow.querySelector(".status-pill");status.textContent=paid?"Paid on time":"Not paid";status.className=`status-pill ${paid?"paid":"due"}`;if(paid)document.querySelector("#paid-bills").append(editingBillRow);}
    else {const row=document.createElement("article");row.className="obligation-row bill-row";row.innerHTML=`<span class="obligation-icon green">${icon("calendar-check-2")}</span><span class="row-copy"><strong>${name}</strong><small>${document.querySelector("#bill-day").value||"5"} Oct, monthly</small><span class="status-pill ${paid?"paid":"due"}">${paid?"Paid on time":"Not paid"}</span></span><span class="row-actions"><strong>${money.format(amount)}</strong><button class="mini-icon" data-action="edit-bill">${icon("pencil")}</button></span>`;document.querySelector(paid?"#paid-bills":"#due-bills").append(row);}
    closeSheets();refreshIcons();toast(`${name} saved${paid?" as paid":" with a monthly reminder"}`);
  }
  if(action==="save-profile"){const name=document.querySelector("#profile-name").value.trim()||"Your profile";document.querySelector("#profile-name-label").textContent=name;document.querySelector(".avatar-button").textContent=name.split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();closeSheets();toast("Profile updated");}
  if(action==="add-category"){const input=document.querySelector("#new-category"),value=input.value.trim();if(!value){toast("Enter a category name");return;}categories.push(value);input.value="";renderCategories();toast("Category added");}
  if(action==="onboarding-next"){if(onboardingIndex<onboardingSteps.length-1){onboardingIndex+=1;renderOnboarding();}else{document.querySelector("#onboarding").hidden=true;localStorage.setItem("dmt-onboarded","yes");toast("Setup complete. Sample data is ready to explore.");}}
  if(action==="onboarding-skip"){document.querySelector("#onboarding").hidden=true;localStorage.setItem("dmt-onboarded","yes");}
  if(action==="review")showScreen("review");
  if(action==="reconcile")showScreen("reconcile");
  if(action==="confidence")detail("Tracking confidence","82%",[["Account coverage","90%"],["Balances matched","50%"],["Review complete","76%"],["Cash confidence","55%"]]);
  if(action==="open-income")detail("Money in",money.format(86240),[["Salary",money.format(75000)],["Other income",money.format(11240)],["Borrowed money","Shown separately"]]);
  if(action==="open-spending")detail("Money out",money.format(52760),[["Essentials",money.format(36120)],["Flexible",money.format(12640)],["Fees and interest",money.format(4000)]]);
  if(action==="notifications")toast("No urgent alerts. Two bills are due this week.");
  if(action==="filters")toast("Account, category, confidence and amount filters");
  if(action==="data-history")toast("Export, backup, account deletion and audit history live here");
  if(action==="add-account")toast("Account setup starts with ownership and opening balance");
  if(action==="add-saving")toast("Add MF, FD, gold, PPF, NPS or your own destination");
  if(action==="saving-detail")toast("Contribution history and current value are kept separately");
  if(action==="friend-payment")toast("Repayment recorded against Ravi's receivable");
  if(action==="lend-money"){currentEntryType="lend";openSheet("quick-add-sheet");document.querySelector('[data-entry="lend"]').click();}
  if(action==="account")toast("Account activity, source health and reconciliation open here");
  if(action==="cash-check")toast(`Cash balance confirmed at ${money.format(5450)}`);
  if(action==="card-check")toast(`Found an ${money.format(860)} duplicate`);
  if(action==="close-month"){toast("September closed with 2 visible exceptions");setTimeout(()=>showScreen("home"),800);}
  if(action==="toggle-balance"){balancesHidden=!balancesHidden;document.querySelector(".balance-heading h2").textContent=balancesHidden?"••••••":money.format(124680);event.target.closest("button").innerHTML=icon(balancesHidden?"eye-off":"eye");refreshIcons();}
  if(action==="save-entry"){
    const value=Number(document.querySelector("#entry-amount").value);if(!value){toast("Enter an amount first");return;}
    const category=document.querySelector("#entry-category").value,person=document.querySelector("#entry-person").value.trim(),note=document.querySelector("#entry-note").value.trim();
    const settings={expense:{type:"money-out",amount:-value,icon:category==="Gift purchase"?"gift":category==="Family support"?"heart-handshake":"receipt-text",tone:"food"},income:{type:"money-in",amount:value,icon:"arrow-down-left",tone:"income"},move:{type:"moves",amount:value,display:"Moved",icon:"arrow-left-right",tone:"move"},save:{type:"savings",amount:value,display:"Saved",icon:"sprout",tone:"income"},lend:{type:"moves",amount:-value,display:"Lent",icon:"hand-coins",tone:"move"}}[currentEntryType];
    transactions.unshift({id:Date.now(),merchant:note||person||category,meta:`${category} • ${document.querySelector("#entry-account").value}${person?` • For ${person}`:""}`,...settings,time:"Just now"});renderTransactions();closeSheets();toast("Transaction added");
  }
});
document.querySelector("#modal-backdrop").addEventListener("click",closeSheets);
document.querySelector("#activity-search").addEventListener("input",renderTransactions);
window.addEventListener("offline",()=>document.querySelector("#offline-banner").hidden=false);
window.addEventListener("online",()=>document.querySelector("#offline-banner").hidden=true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSheets();document.querySelector("#onboarding").hidden=true;}});
setTheme(localStorage.getItem("dmt-theme")||"system");renderTransactions();renderReview();refreshIcons();
if(!localStorage.getItem("dmt-onboarded"))openOnboarding();
