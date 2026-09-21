# Daily Money Track: Product Gap Audit

## Product Position

Daily Money Track should answer five questions quickly: what is available now, what came in or went out, what bills are due, what has been saved and where, and how trustworthy the record is.

The product is not a UPI tracker. It is a personal money ledger for bank accounts, cards, cash, loans, savings, gifts, family support, and informal borrowing or lending.

## Decisions Applied To The Prototype

- Removed WhatsApp summaries and renamed the email option to Monthly email.
- Added first-time setup, editable profile details, and System, Light, and Dark appearance choices.
- Added user-managed categories and savings destinations.
- Added month and year selection to the screens where history is used. Settings is not the primary history path.
- Replaced Home's recent activity with daily, weekly, and monthly spending averages.
- Added total savings and savings-rate progress to Home.
- Added Savings as an Activity filter and as its own primary tab.
- Renamed Plan to Bills & Dues, with recurring payouts, paid status, editing, and balance coverage.

## P0 Gaps Before A Native Build

### Trust And Accuracy

- Every imported item needs provenance: SMS, statement, email, manual entry, or linked provider.
- The app must show uncertainty instead of silently guessing an account, category, duplicate, or transaction type.
- Pending card transactions, reversals, refunds, chargebacks, failed UPI payments, and duplicate notifications need explicit states.
- Credit-card purchases and card-bill payments must not be counted twice as spending.
- Cash withdrawals are transfers; later cash purchases are spending. Cash balances need periodic reconciliation.
- Savings contributions are asset transfers, lending creates a receivable, and borrowing creates a liability. None should inflate income or spending.
- Category renames must retain historical meaning and support undo.
- Reconciliation needs an audit trail: opening balance, closing balance, unresolved difference, and what changed it.

### Onboarding Drop-Off

- Asking for SMS, email, account, profile, and biometric permissions at once will cause abandonment.
- Users need value before permission: let them add one account manually or explore sample data first.
- iOS cannot offer Android-style blanket SMS reading, so the promise must be platform-specific.
- Users will leave if the first import creates a noisy ledger. Initial duplicate review and account matching must be short.
- Statement import must explain password-protected PDFs, supported banks, and what data is retained.
- A user with irregular income needs a different starting experience from a salaried user.

### Security And Privacy

- Store the minimum raw SMS or email content needed; derived transaction data should be separable from source text.
- Encrypt sensitive data in transit and at rest, and protect local caches and backups.
- Biometric failure needs a secure fallback, rate limiting, and device-loss recovery.
- Hide balances in notifications, app switcher previews, screenshots where supported, and logs.
- Email access should be narrowly scoped or replaced with statement import where practical.
- Users need clear export, full deletion, retention, consent withdrawal, and source revocation.
- Shared or joint accounts need ownership and visibility boundaries.
- Never send detailed financial summaries through third-party messaging by default.

## Critical Accounting Edge Cases

- Multiple bank accounts tied to different mobile numbers or email addresses.
- One UPI app using several funding accounts; one account used by several UPI apps.
- Joint accounts, add-on cards, and household expenses paid by another person.
- Salary advances, reimbursements, office rewards converted to cash, bonuses, gifts, interest, dividends, and refunds.
- EMI conversion after a card purchase, zero-cost EMI fees, foreclosure, partial repayments, and changing interest.
- Money borrowed from or lent to a person, partial settlement, waived balance, and no fixed due date.
- Chit funds and cash-only lenders where all records are manual.
- Donations, family support, gifts, and shared bills that need separate reporting.
- Split transactions containing groceries, medicine, and a gift.
- Foreign currency, travel cash, bank fees, taxes, and exchange-rate differences.
- Closed accounts, migrated phone numbers, delayed SMS, and duplicate statement uploads.
- Backdated entries, partial first months, and months with missing data.

## Reasons An Unconvinced User Will Leave

- “The total is wrong and I cannot see why.”
- “It counted my transfer, savings, or card payment as spending.”
- “Setup asks for too much private access before proving value.”
- “Correcting categories takes longer than tracking manually.”
- “My cash and family transactions are still missing.”
- “I cannot check last month quickly.”
- “The app warns me often but does not tell me what action to take.”
- “It gives a score or average even when half my accounts are missing.”
- “I cannot undo a bulk change or recover data on a new phone.”

## Product Safeguards

- Attach a confidence level and source to every automated entry.
- Suppress advice, averages, and savings rates when coverage is too low; explain what is missing.
- Provide bulk review, multi-select categorisation, undo, and merchant rules.
- Make alerts actionable and quiet: overdue bill, low coverage, suspected duplicate, or balance shortfall only.
- Separate available, reserved for bills, emergency savings, credit available, and net worth.
- Validate English, Hindi, and priority regional languages with users instead of translating financial jargon literally.
- Meet accessible contrast, text scaling, screen-reader, and touch-target requirements from the first native build.

## MVP Boundary

### Must Have

- Accounts, cash wallet, cards, manual transactions, and statement import.
- Money in, money out, transfers, savings, borrowing, and lending as distinct transaction types.
- Editable categories, source evidence, duplicate review, search, period history, and reconciliation.
- Bills & Dues with recurring rules, paid status, reminders, and balance sufficiency.
- Savings destinations, contribution totals, savings rate, and emergency-fund exclusion.
- Biometric lock, hidden sensitive previews, export, and delete account.

### Later

- Direct bank aggregation, inbox connection, family collaboration, investment market values, automatic financial advice, and web access.
- WhatsApp summaries should remain out unless research proves demand and privacy, consent, and delivery costs are acceptable.

## Validation Gates

- Run 8 to 12 moderated tests across salaried, variable-income, multi-account, cash-heavy, and family-budget users.
- At least 80% can add one account and reach a trustworthy first-month view without help.
- At least 90% correctly understand spending versus transfer, saving, lending, and borrowing.
- Users can find last month, mark a bill paid, and correct a category in under 30 seconds each.
- Measure imported-ledger precision separately from coverage. A high-looking score must never hide missing accounts.
- Require no P0 security findings and a documented deletion and recovery test before public beta.

## Recommended Next Step

Use the revised prototype to test four workflows before engineering the native app: first-time setup, fixing an imported transaction, managing recurring bills, and checking savings across destinations. The prototype is ready for this validation round; new feature expansion should wait until those workflows are understood.
