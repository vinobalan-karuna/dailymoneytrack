# India Money Tracker - Research and Product Definition

Date: 20 September 2026

## 1. Executive summary

The product should be a personal money clarity application for Indian individuals
and households. It should answer five questions reliably:

1. What money came in?
2. Where did it go?
3. What is available now?
4. What is owed, due, saved, or expected?
5. Is the record complete enough to trust?

The central market problem is not the absence of expense charts. Existing apps
already provide charts, categories, and budgets. The unresolved problem is that
users must choose between automation they do not fully trust and manual tracking
they cannot sustain.

The product should therefore be built around a verified ledger, not around a
dashboard. SMS, email, Account Aggregator data, statements, receipts, payment
screenshots, and manual entries are evidence sources. They must be normalized,
matched, deduplicated, and reviewed before becoming trusted financial records.

The product's differentiating promise is:

> Know what came in, where it went, what remains, what is owed, and whether every
> rupee has been accounted for.

## 2. Research scope and caveat

The research reviewed current Google Play and Indian App Store listings, visible
reviews, product help centres, public Indian personal-finance discussions, and
official platform and regulatory material. Products reviewed include Axio, Fold,
Money Manager by Realbyte, Wallet by BudgetBakers, Money Lover, Jupiter, CRED,
INDmoney, ET Money, Monarch, Copilot Money, Mint/Credit Karma, and smaller manual
or privacy-first trackers.

Store reviews are not a statistically representative survey. Stores expose only
a selection of reviews, and some public discussions include comments from app
builders. Findings should be validated through user interviews and prototype
tests. Repeated themes across independent products are nevertheless strong
signals.

## 3. Market findings

### 3.1 What current products do well

- Account aggregation reduces the effort of checking multiple institutions.
- A review queue gives users a manageable way to confirm transactions.
- Merchant rules improve categorization after a correction.
- Recurring-payment detection exposes forgotten subscriptions and upcoming bills.
- Manual accounts fill gaps where a bank or asset cannot be connected.
- Cash-flow, net-worth, and debt views help users see beyond monthly spending.
- Flexible budgets and rollovers handle irregular or annual expenses.
- Tags, notes, split transactions, and search improve later recall.
- Shared spaces help couples and families coordinate selected finances.
- Export and backup make users feel that their history is not trapped.

### 3.2 Repeated user pain points

1. Missing transactions after an SMS format, bank connection, or permission
   changes.
2. Duplicate transactions from SMS, email, statements, or multiple alerts.
3. Wrong categories that require more correction than manual entry.
4. Transfers and card payments counted as expenses, making monthly totals wrong.
5. UPI app shown without the underlying bank account or credit-card source.
6. Cash withdrawals counted as spending while later cash purchases disappear.
7. Combined statements and add-on cards mapped to the wrong credit card.
8. Bank connections failing silently or returning stale balances.
9. Privacy discomfort with complete SMS, email, or bank access.
10. Manual-entry fatigue, especially for chai, auto, parking, tips, and donations.
11. Categories that cannot be adapted to the user's family and culture.
12. Lost history, failed backup restoration, and unreliable device sync.
13. Incomplete support for PPF, EPF, NPS, recurring deposits, post-office savings,
    physical gold/silver, land, vehicles, and informal finance.
14. Expensive subscriptions before core accuracy and coverage feel complete.
15. Clutter caused by loans, investments, offers, rewards, and promotions inside a
    tool the user opened for clarity.
16. Poor support response when the user reports missing money or an incorrect
    balance.
17. iOS users lacking the SMS automation available to approved Android apps.
18. Reports that look precise even when important accounts or cash activity are
    missing.

### 3.3 Specific evidence

- Axio reviews report undetected SMS transactions, duplicates, missing monthly
  entries, and failed export. Source:
  https://play.google.com/store/apps/details?id=com.daamitt.walnut.app
- Fold reviews request cash accounts, recurring deposits, more Indian assets,
  better card coverage, and identification of the real funding source behind a
  UPI payment. Source:
  https://play.google.com/store/apps/details?id=money.fold.marble
- Wallet reviews report incorrect categorization, rigid categories, and bank-sync
  frustration. Source:
  https://play.google.com/store/apps/details?id=com.droid4you.application.wallet
- Money Lover reviews describe transfers between linked accounts making monthly
  totals incorrect. Source:
  https://apps.apple.com/in/app/money-lover-money-manager/id486312413?see-all=reviews
- Money Manager reviews request device synchronization and describe purchase or
  backup restoration problems. Source:
  https://play.google.com/store/apps/details?id=com.realbyteapps.moneymanagerfree
- Indian user discussions repeatedly identify the tradeoff among manual effort,
  bank/SMS privacy, and unreliable automation. Sources:
  https://www.reddit.com/r/personalfinanceindia/comments/1twwl41/
  https://www.reddit.com/r/personalfinanceindia/comments/1vmelag/

## 4. Product principles

### 4.1 Accuracy before automation

Automation should create a draft when confidence is uncertain. It should not
silently create a trusted record merely because an amount was parsed.

### 4.2 Evidence, not opaque intelligence

Every transaction should show its source: SMS, email, Account Aggregator,
statement, receipt, screenshot, manual entry, or another linked transaction.

### 4.3 One event, one financial meaning

Multiple messages may describe one event. A purchase, refund, cash withdrawal,
card payment, transfer, and EMI must each have distinct accounting treatment.

### 4.4 Privacy is a selectable mode

Users should be able to choose among manual-only, local SMS parsing, statement
import, email connection, and Account Aggregator. Refusing one permission must not
make the rest of the app unusable.

### 4.5 Explain uncertainty

The app should say "two transactions need review" or "SBI has not refreshed for
three days" rather than displaying an apparently exact total.

### 4.6 Neutral, non-shaming language

Use "flexible spending" or "could have avoided" rather than "wasteful". A medical
emergency or family obligation should not be treated as irresponsible behaviour.

### 4.7 Text first

The initial product should communicate through amounts, lists, comparisons,
status labels, and short explanations. Charts can be evaluated later.

### 4.8 No commercial conflict in guidance

The app should not recommend a loan, credit card, deposit, or investment because
that product pays commission. Guidance must remain independent and explainable.

## 5. Personas

### Persona A - Salaried multi-account UPI user

Has a salary account, savings account, credit card, several UPI apps, SIPs, and
monthly EMIs. Wants to know the safe amount available until the next salary.

### Persona B - Household money manager

Tracks rent, groceries, school fees, utilities, family transfers, insurance, and
shared expenses. Needs personal and household views without exposing everything.

### Persona C - Cash-heavy user

Uses cash for transport, temple donations, local shops, informal lending, or chit
payments. Needs extremely fast entry and proof attachments.

### Persona D - Credit and EMI-heavy user

Uses multiple cards, card EMIs, BNPL, personal loans, or money borrowed from
friends. Needs principal, interest, paid amount, pending amount, and due dates.

### Persona E - Irregular-income earner

Receives freelance, business, commission, or seasonal income. A salary-based
monthly budget is not appropriate. Needs cash runway and commitment visibility.

### Persona F - Privacy-conscious user

Will not provide SMS or bank access. Accepts quick manual entry, payment sharing,
receipt scanning, or local statement import.

### Persona G - iPhone user

Cannot rely on general SMS-history access. Needs Account Aggregator, statement
import, share-to-app, email, shortcuts, receipt capture, and manual entry.

## 6. Financial model

### 6.1 Account types

- Bank: salary, savings, current, joint, overdraft
- Cash: personal wallet, household cash, petty cash
- Digital stored value: wallet or prepaid balance
- Credit card: primary, add-on, secured, RuPay UPI-linked
- Loan: home, vehicle, education, personal, gold, informal
- Receivable: money lent to a person or reimbursement expected
- Investment: mutual fund, stock, ETF, FD, RD, PPF, EPF, NPS, bonds
- Physical asset: gold, silver, land, home, vehicle, other valuables
- Reward balance: points, vouchers, employee rewards, cashback pending

UPI applications are payment channels, not normally balance-holding accounts. A
transaction can therefore contain both:

- Payment channel: GPay, PhonePe, BHIM, Paytm, bank UPI, card swipe, cash
- Funding account: SBI Savings, HDFC Salary, ICICI Card, wallet balance

### 6.2 Transaction meanings

- Earned income
- Other income
- Gift received
- Reward or cashback realized
- Expense
- Donation
- Refund
- Reversal
- Reimbursement received
- Transfer between owned accounts
- Cash withdrawal or deposit
- Borrowing received
- Loan or debt repayment
- Money lent
- Money returned by borrower
- Savings allocation
- Investment contribution, purchase, sale, dividend, or interest
- Fee, tax, penalty, or interest cost
- Balance adjustment

### 6.3 Required invariants

- A loan receipt increases cash and liability; it is not earned income.
- A transfer between owned accounts is not income or expense.
- A cash withdrawal moves value from bank to cash; it is not spending.
- A card purchase is an expense and increases card liability.
- A card-bill payment reduces bank cash and card liability; it is not a second
  expense.
- An EMI cash outflow is split into principal, interest, tax, fee, and penalty when
  details are available.
- An investment contribution is a cash outflow and asset transfer, not consumption.
- A reward point is non-cash until redeemed; cash redemption creates a reward
  receipt once.
- A refund reduces the original category spend and remains linked to the purchase.
- A reimbursement offsets the reimbursable expense rather than inflating income.
- Deleting a source record must not silently delete a confirmed transaction.

### 6.4 Transaction state

- Detected
- Pending
- Needs review
- Confirmed
- Posted
- Reversed
- Reconciled
- Excluded

The app should retain transaction date, posting date, import date, and month used
for reporting.

## 7. Data acquisition strategy

### 7.1 Android

- Optional approved financial-SMS access
- On-device filtering before any extracted fields are synchronized
- Account Aggregator where supported
- Email OAuth connection
- PDF/CSV/XLSX statement import
- Receipt and payment-screenshot sharing
- Manual, voice, widget, and quick-add entry

Google Play treats SMS access as restricted. SMS-based money management is an
eligible use but remains subject to declaration and review:
https://support.google.com/googleplay/android-developer/answer/10208820

### 7.2 iOS

- Account Aggregator where supported
- PDF/CSV/XLSX statement import
- Share extension for UPI confirmation screenshots and receipts
- Email OAuth connection
- Shortcuts, widget, voice, and quick-add entry
- Manual account and balance updates

Apple's message filtering API is not a general-purpose personal-finance SMS feed:
https://developer.apple.com/documentation/identitylookup/sms-and-mms-message-filtering

### 7.3 Account Aggregator

AA can support consent-based sharing for available financial providers and is a
strong cross-platform source. Coverage must never be presented as universal. The
app still needs manual accounts and imports for unsupported assets or institutions.
RBI explains that AA data sharing is consent-driven and can support personal
finance management and reconciliation:
https://www.rbi.org.in/commonperson/images/FAME202426022024.pdf

### 7.4 Import pipeline

1. Receive source evidence.
2. Identify institution, account, and statement period.
3. Extract amount, direction, dates, merchant, reference, balance, and card mask.
4. Normalize merchant and account identifiers.
5. Search for an existing matching transaction.
6. Assign exact, probable, or uncertain match confidence.
7. Merge evidence or create a review draft.
8. Apply user rules.
9. Recalculate account and period totals.
10. Preserve an audit history of corrections.

Password-protected statements should be decrypted locally for processing. The
password must not be stored.

## 8. End-to-end user journeys and user stories

### Epic 1 - Registration and security

**Story 1.1**
As a new user, I want to create an account with phone or email so that I can
recover and synchronize my data.

Acceptance criteria:
- Phone/email ownership is verified.
- Bank or email passwords are never collected by the app.
- The user sees what is local, synchronized, and backed up.
- Account deletion and export are discoverable in settings.

**Story 1.2**
As a user, I want biometric lock with device PIN or app PIN fallback so that my
financial information is protected without making access difficult.

### Epic 2 - Financial setup

**Story 2.1**
As a user with several accounts, I want to name and classify each account so that
salary, savings, cash, card, loan, and investment balances are not mixed.

Acceptance criteria:
- Only masked identifiers are displayed.
- Opening balance and effective date are recorded.
- An account can be included in net worth but excluded from spendable money.
- A user can mark two accounts as jointly owned or hidden from a shared space.

**Story 2.2**
As a UPI user, I want the app to distinguish the UPI app from the source account
so that I know where the money actually came from.

### Epic 3 - Transaction capture

**Story 3.1**
As an Android user, I want financial messages converted into drafts so that I do
not type the amount, date, and merchant repeatedly.

Acceptance criteria:
- Personal messages are ignored.
- Raw SMS does not leave the device by default.
- Uncertain account or type is flagged.
- Duplicate alerts update one event rather than add another expense.

**Story 3.2**
As an iPhone user, I want to share a UPI screenshot or receipt into the app so that
I can capture a transaction without SMS access.

**Story 3.3**
As a cash user, I want to record an expense in a few seconds so that small payments
are not forgotten.

Acceptance criteria:
- Amount, category, and cash account are sufficient for quick save.
- Recent merchants and categories are suggested.
- Photo, voice, person, note, and tag are optional.
- Repeated cash events can be saved as templates.

### Epic 4 - Review inbox

**Story 4.1**
As a user, I want a single inbox of uncertain money events so that I can correct
the ledger without inspecting every transaction.

Acceptance criteria:
- Each item asks one primary question.
- Bulk confirmation is available for repeated, high-confidence items.
- User correction can create a future rule.
- Confidence and evidence are visible.
- Dismissing evidence does not erase a previously confirmed transaction.

### Epic 5 - Transfers and reconciliation

**Story 5.1**
As a user moving money among my accounts, I want both sides paired so that the
movement does not inflate income or spending.

**Story 5.2**
As a user, I want to upload a monthly statement and reconcile it with the live
ledger so that I know whether anything was missed.

Acceptance criteria:
- Statement opening and closing balances are captured.
- Existing records are matched before new ones are created.
- Result groups are Matched, Possible match, Missing, Duplicate, Reversed, and
  Needs review.
- The balance equation is verified per account.
- The month remains provisional until material differences are resolved.
- A closed month can be reopened with an audit note.

### Epic 6 - Cards, loans, and personal debt

**Story 6.1**
As a credit-card user, I want purchases, refunds, EMIs, statement balance, minimum
due, total due, and payments separated so that spending is counted once.

**Story 6.2**
As a borrower, I want principal, interest, fees, amount paid, outstanding amount,
next due date, and expected completion so that I understand the true cost.

**Story 6.3**
As someone borrowing from a friend or cash lender, I want a manual repayment
timeline and proof attachments so that cash settlements are not forgotten.

**Story 6.4**
As someone who lent money, I want to track receivables and partial returns so that
incoming repayments are not mistaken for income.

### Epic 7 - Recurring commitments

**Story 7.1**
As a user, I want repeated transactions suggested as subscriptions or bills so
that I can see upcoming obligations.

Acceptance criteria:
- Monthly, weekly, quarterly, annual, and irregular patterns are supported.
- The user confirms a recurring series before it becomes authoritative.
- Amount changes and skipped periods are shown.
- Cancellation does not delete payment history.

**Story 7.2**
As a user with annual costs, I want a sinking fund so that insurance, school fees,
festivals, travel, or vehicle service do not unexpectedly break a month.

### Epic 8 - Income, gifts, rewards, refunds, and reimbursements

**Story 8.1**
As a user receiving money, I want to identify salary, business income, gift,
refund, reimbursement, reward, borrowing, and transfer so that my income total is
truthful.

**Story 8.2**
As a reward recipient, I want points and cash redemption separated so that a
benefit is not counted twice.

**Story 8.3**
As a user awaiting a cancelled purchase refund, I want it shown as pending until
the bank statement confirms it.

### Epic 9 - Savings, investments, and assets

**Story 9.1**
As a user saving for a goal, I want to connect selected accounts or contributions
to that goal so that progress reflects real money.

**Story 9.2**
As an Indian saver, I want to include FD, RD, PPF, EPF, NPS, mutual funds, gold,
silver, property, vehicles, and manually valued assets so that net worth is not
limited to connected banks.

The first version need not provide live prices for every asset. It must show value
date and whether a valuation is live, statement-derived, or manually entered.

### Epic 10 - Daily, weekly, and monthly understanding

**Story 10.1**
As a user, I want a daily summary of money in, money out, cash activity, and items
requiring review so that I remain aware without analysing charts.

**Story 10.2**
As a user, I want a weekly comparison so that I can see which spending changed,
which obligations are approaching, and whether my plan needs adjustment.

**Story 10.3**
As a user, I want a reconciled monthly statement in plain language so that I know
income, spending, savings, debt reduction, investment transfers, and closing
balances.

### Epic 11 - Safe-to-spend and recommendations

**Story 11.1**
As a user, I want to know what I can safely spend before my next expected income
so that my visible bank balance does not mislead me.

Proposed calculation:

Available liquid money
- protected savings
- bills and EMIs due before next income
- known essential spending allowance
- selected safety buffer
= safe to spend

The app must show every component and allow correction.

**Story 11.2**
As a user, I want specific suggestions based on my own data so that I can take one
realistic action rather than receive generic advice.

Good suggestion:
"Two subscriptions totaling Rs. 848 were charged but not marked as essential.
Review them before 28 September."

Bad suggestion:
"Stop wasting money and invest more."

### Epic 12 - Notifications and delivery

**Story 12.1**
As a user, I want separate consent for push, WhatsApp, and email so that I control
where sensitive summaries appear.

Acceptance criteria:
- Daily, weekly, monthly, and urgent-alert preferences are independent.
- Delivery time and language are selectable.
- Lock-screen and WhatsApp content is privacy-minimized by default.
- Full account numbers and card numbers never appear.
- Every channel has a simple pause and opt-out action.
- Delivery failure cannot alter the financial ledger.

### Epic 13 - Household collaboration

**Story 13.1**
As a household member, I want to share selected accounts, budgets, goals, or
expenses while keeping personal accounts private.

Roles should include owner, contributor, and viewer. Changes need actor and time
history. This is a post-MVP capability because permissions substantially increase
security and support complexity.

### Epic 14 - Data ownership and recovery

**Story 14.1**
As a user changing devices, I want a verified restore preview so that years of
history are not silently lost or duplicated.

**Story 14.2**
As a user, I want CSV/PDF export and complete account deletion so that I remain in
control of my data.

## 9. No-chart information architecture

### Home

- Available now
- Safe to spend
- Money received this month
- Money spent this month
- Saved or invested this month
- Debt paid and debt remaining
- Upcoming seven-day commitments
- Review inbox count
- Tracking Confidence status

### Transactions

- Searchable chronological list
- Filters for account, category, type, source, status, person, and tag
- Source and confidence visible in details
- Review action directly from the list

### Plan

- Flexible spending limit
- Fixed commitments
- Non-monthly sinking funds
- Savings goals
- Debt plan

### Accounts

- Bank and cash
- Cards and loans
- Investments and assets
- Receivables and reward balances
- Connection health and last update

### Month review

- Plain-language summary
- Account reconciliation results
- Changes from previous month
- Pending items
- Tracking Confidence Score
- Money Progress Score

## 10. Scoring

### 10.1 Tracking Confidence Score

Purpose: indicate how trustworthy the period's records are.

| Component | Weight |
| --- | ---: |
| Account/source coverage | 25 |
| Statement reconciliation | 25 |
| Transaction review completion | 20 |
| Source freshness | 15 |
| Cash tracking completeness | 15 |

Suggested labels:

- 90-100: Reconciled
- 75-89: Mostly complete
- 50-74: Important items pending
- Below 50: Insufficient information

Rules:

- A score must list missing evidence.
- Unsupported accounts reduce coverage only if the user says they are active.
- Cash completeness is based on the user's chosen cash-tracking method, not an
  unverifiable claim of perfect cash capture.
- Financial recommendations should be marked provisional below a defined
  confidence threshold.

### 10.2 Monthly Money Progress Score

Purpose: show progress against the user's own plan, not social comparison.

| Component | Default weight |
| --- | ---: |
| Bills and EMIs paid as planned | 25 |
| Savings-goal progress | 20 |
| Positive or planned cash flow | 20 |
| Debt direction | 15 |
| Flexible-spending plan | 10 |
| Emergency-buffer progress | 10 |

Rules:

- Missing data produces "not enough information," not zero.
- Components that do not apply are reweighted transparently.
- Irregular-income users are assessed over a configurable rolling period.
- Medical emergencies, major life events, and one-time purchases can be annotated
  and explained rather than treated as routine overspending.
- Income level, caste, gender, age, location, employer, and contacts must not
  influence the score.
- The score must never determine credit eligibility, loan pricing, or product
  advertising.
- Users can inspect the formula and the exact transactions affecting each part.

### 10.3 Optional later score - Financial resilience

A broader health score may later consider liquid runway, debt-service ratio,
insurance protection, retirement preparation, and net-worth direction. It should
not be launched until the product reliably captures liabilities, household
dependants, insurance, and liquid versus locked assets. A premature health score
would create false confidence.

## 11. Recommendation engine

Recommendations should follow this sequence:

1. Verify sufficient Tracking Confidence.
2. Detect a specific change or risk.
3. Explain the evidence.
4. Estimate the possible impact.
5. Offer one reversible action.
6. Let the user dismiss, snooze, or mark it irrelevant.

Recommendation families:

- Upcoming cash shortfall
- Subscription review
- Duplicate or unusual charge
- Budget recovery
- Debt-payment prioritization without product promotion
- Unclaimed refund or reimbursement
- Idle reward balance
- Savings-goal adjustment
- Annual-cost preparation
- Account or statement becoming stale

## 12. Product scope

### MVP - trustworthy monthly money record

- Login, biometric lock, recovery, and deletion
- Manual bank, cash, card, loan, receivable, investment, and asset accounts
- Manual income, expense, transfer, borrowing, repayment, refund, and investment
  entries
- Android financial-SMS drafts, subject to Play approval
- iOS/Android share-to-app for receipts and payment screenshots
- PDF/CSV/XLSX statement import for an initial supported bank set
- Deduplication, transfers, refunds, cash withdrawals, and card-payment pairing
- Custom categories, tags, notes, splits, and merchant rules
- Review inbox and source confidence
- Credit-card, EMI, formal loan, and personal-debt tracking
- Recurring bills and subscriptions
- Daily, weekly, and monthly text summaries
- Account-level month-end reconciliation
- Tracking Confidence Score
- Export and encrypted backup

### Version 1.1 - planning and action

- Safe-to-spend calculation
- Flexible budget and non-monthly sinking funds
- Savings and debt-payoff goals
- Money Progress Score
- Email and WhatsApp summaries
- Voice entry and regional-language support
- Pending refunds and reimbursements centre
- Personal inflation comparison

### Version 2 - wider financial picture

- Account Aggregator integration through an appropriate regulated arrangement
- Shared household spaces and permissions
- Broader investment and Indian-asset integrations
- Conversational "Ask My Money" with cited ledger evidence
- Financial resilience assessment
- Tax-ready exports and document vault
- Web companion

### Explicit non-goals for early releases

- Executing payments or investments
- Selling loans, cards, or investment products
- Tax filing
- Credit underwriting
- Live pricing for every physical or financial asset
- Full accounting for businesses
- Predicting markets or investment returns

## 13. Cost-conscious implementation choices

- Use deterministic parsers and user rules before paid AI processing.
- Parse sensitive SMS and standard statement formats on device where practical.
- Send only extracted, consented fields to the synchronized ledger.
- Support a small, measured set of high-volume Indian statement formats first.
- Provide transparent fallback when a format is unsupported.
- Generate text summaries from ledger calculations rather than an AI model.
- Use AI only for uncertain merchant descriptions, receipt extraction, and optional
  conversational explanation.
- Default WhatsApp to weekly/monthly concise summaries; use email for detail.
- Do not build live investment pricing or family collaboration before transaction
  accuracy and restoration are proven.

## 14. Privacy and compliance requirements

- Consent must be specific per data source and purpose.
- SMS reading, email reading, reporting delivery, analytics, and marketing are
  separate choices.
- A permission screen must explain data accessed, processing location, retention,
  and how to revoke it.
- The app must minimize raw-message storage.
- Financial data must be encrypted in transit and at rest.
- Sensitive notification content must be disabled by default.
- Access, correction, export, deletion, and consent withdrawal need complete
  workflows.
- The privacy notice should be available in English and relevant Indian languages.
- Third-party analytics and crash tools must not receive transaction descriptions,
  account identifiers, or statement content.
- Security incidents require an operational response plan, not only a privacy
  policy.

India's DPDP Act requires consent to be specific, informed, unambiguous, and
limited to necessary personal data. Source:
https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023.pdf

The DPDP Rules 2025 have staged commencement dates, so legal review must track
which obligations are in force at launch. Source:
https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf

## 15. Edge-case inventory

- Same transaction represented by bank SMS, UPI notification, email, receipt, and
  statement
- Same amount paid twice legitimately within minutes
- Pending UPI followed by success, failure, reversal, or delayed refund
- Cash withdrawal followed by partial unrecorded cash use
- Credit-card transaction posted days later or converted to EMI
- Add-on card sharing a statement with the primary card
- Rent or education payment made by credit card but settled separately
- Reward points converted to cash, voucher, or product
- Salary containing reimbursement, bonus, tax adjustment, or advance
- Family transfer that may be gift, support, loan, or shared-expense settlement
- Merchant aggregator hiding the actual merchant
- Split tender: part cash, part UPI, part reward
- Split category: groceries, medicine, and household items on one bill
- Refund arriving in a later month
- Statement cycle differing from calendar month
- Foreign-currency charge and later exchange-rate adjustment
- Bank fee or card surcharge posted separately
- Joint account transaction made by another person
- User changes category rules retroactively
- Account closes, merges, or changes masked number
- SIM or phone number changes
- Two phone numbers on separate devices
- Email connection expires
- Statement is scanned, encrypted, rotated, or has an unfamiliar layout
- Duplicate restoration after device migration
- Negative cash balance caused by missed manual entries
- User intentionally excludes a private or business account
- Informal chit or cash lender has no formal statement
- Loan is refinanced, prepaid, restructured, or partially waived
- Asset value is stale or subjective
- A closed month receives a late-posted transaction

## 16. Quality and success measures

The product should measure accuracy and usefulness, not time spent in the app.

- Percentage of imported events matched without duplication
- Percentage of active accounts reconciled monthly
- Median unresolved review items per active user
- Time required to record a cash expense
- Percentage of users completing a first monthly close
- Correction rate by source, bank template, and merchant
- Restore success in test and production-support cases
- Percentage of recommendations dismissed as irrelevant
- Subscription/recurring detection precision after user review
- Number of users who can explain their safe-to-spend calculation
- Notification opt-out, block, and complaint rate
- Support resolution time for incorrect balances or missing data

Avoid vanity metrics such as number of charts opened or notification volume.

## 17. Required validation before design

1. Interview 12-20 users across salaried, family, cash-heavy, debt-heavy,
   irregular-income, Android, and iPhone segments.
2. Ask participants to reconstruct one recent week using SMS, statements, and
   memory; observe where the evidence conflicts.
3. Prototype only four flows first: account setup, quick cash entry, review inbox,
   and monthly reconciliation.
4. Test whether users understand Money in, Spending, Transfers, Savings, and Debt
   without financial terminology.
5. Test whether Tracking Confidence is trusted and whether users can explain why
   it changed.
6. Validate willingness to pay separately for core tracking, automated imports,
   and WhatsApp delivery.
7. Test permission copy before requesting SMS, email, or AA consent.
8. Confirm Play Store SMS eligibility and the legal/contractual route for AA before
   committing either as the only acquisition path.

## 18. Open decisions

- Is the first launch individual-only, or must selected household sharing ship?
- Which Indian banks and card issuers define the initial statement-support set?
- Will synchronized transaction data be end-to-end encrypted or server-readable?
- Is email ingestion necessary for MVP after statement import and AA are assessed?
- What is the paid boundary: automation, household, storage, WhatsApp, or advanced
  planning?
- Should a user be allowed to use the app fully without registration, with optional
  backup later?
- Which languages follow English in the first release?
- How should an account be marked intentionally excluded without making the
  confidence score punitive?
- What minimum evidence is required before the app calculates safe to spend?
- Which advice features require review by a qualified financial professional?

## 19. Recommended next step

Do not begin visual screen design with the entire feature list. First create a
clickable process prototype for this closed loop:

1. User creates three accounts and one cash wallet.
2. Transactions arrive through mixed sources.
3. The app asks five short review questions.
4. User records one cash payment and one personal loan repayment.
5. User uploads a bank statement.
6. The app resolves duplicates and one missing transaction.
7. The month becomes reconciled.
8. The app presents a text summary, Tracking Confidence, and one actionable
   recommendation.

If that loop feels clear and trustworthy, the broader product has a sound
foundation. If it does not, adding investments, chat, charts, or more integrations
will only magnify the confusion.
