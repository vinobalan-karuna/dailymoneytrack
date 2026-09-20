# India Money Tracker - User Journeys and Process Flows

## 1. Purpose

This document turns the product definition into observable user behaviour. It is the bridge between research and screen design: each flow states what the person is trying to achieve, what the product knows, what may go wrong, and what must be true before the flow is considered complete.

The central product loop is:

1. Establish what money exists and where it is held.
2. Capture financial events from available evidence.
3. Ask for help only when evidence is incomplete.
4. Let the person verify important or uncertain events.
5. Reconcile the record against authoritative balances or statements.
6. Explain the period in plain language.
7. Suggest one realistic action, without judgement or product-selling bias.

## 2. Shared language

### 2.1 Terms shown to users

- **Money in**: salary, business receipts, interest, gifts, refunds, and other genuine inflows.
- **Money out**: purchases, bills, fees, donations, interest, and other consumption.
- **Move**: money transferred between the person's own accounts, including cash withdrawals and card-bill payments.
- **Borrowed**: money received with an obligation to repay.
- **Repaid**: money used to reduce an obligation.
- **Saved**: money moved to an investment or savings destination.
- **Needs review**: an event that may be valid but has incomplete or conflicting evidence.
- **Matched**: two or more pieces of evidence recognized as one financial event.
- **Reconciled**: the app's closing balance agrees with authoritative evidence.

### 2.2 Information every financial event can hold

- Amount and currency.
- Event date, posting date, and import date.
- Direction and financial meaning.
- Source account and destination or counterparty.
- Category and optional tags.
- Payment channel, such as UPI, card, cash, bank transfer, wallet, cheque, or auto-debit.
- Merchant or person.
- Evidence sources: SMS, email, bank feed, statement, receipt, screenshot, or manual entry.
- Confidence and review status.
- Links to related events, such as a refund, transfer pair, EMI, or reimbursement.
- Notes and attachments.

## 3. Master lifecycle

### Stage 1 - Start securely

The person signs in using a phone number or email, verifies ownership, creates an app PIN, and optionally enables biometrics. Before any data access request, the app explains the benefit, scope, storage, revocation, and fallback.

**Done when:** the person can open the app securely and has selected a privacy mode.

### Stage 2 - Define the financial perimeter

The person lists the accounts that should be included: bank accounts, cash wallet, cards, loans, personal debts, wallets, and savings or investment accounts. Opening balances are dated, because an undated opening balance makes later reconciliation ambiguous.

**Done when:** every active source of spending, income, or debt is either represented or deliberately excluded.

### Stage 3 - Bring in evidence

The app captures supported Android messages, permitted email messages, consented Account Aggregator data, uploaded statements, shared screenshots, receipt photos, and manual entries. Raw evidence is retained only according to the selected privacy policy.

**Done when:** evidence has been parsed into candidate events without silently declaring uncertain data correct.

### Stage 4 - Resolve the review inbox

The person confirms ambiguous accounts, duplicate candidates, transfer pairs, categories, and unusual events. Repeated decisions become local rules that can be inspected and undone.

**Done when:** there are no high-impact unresolved events for the period, or the person has explicitly deferred them.

### Stage 5 - Reconcile

The app compares calculated and authoritative closing balances account by account. It searches for missing transactions, duplicates, timing differences, fees, interest, and incorrect opening balances.

**Done when:** accounts are reconciled, or each difference is visible with a reason and owner.

### Stage 6 - Understand and act

The app states money in, money out, transfers, savings, debt changes, upcoming obligations, available balance, and safe-to-spend. It shows confidence before advice and gives at most a few specific actions.

**Done when:** the person can answer where the money went, what is due, what remains, and what needs attention.

## 4. Journey A - First setup with multiple accounts

### Situation

A salaried user has two savings accounts, one salary account, cash, two credit cards, one personal loan, and several UPI apps. One phone number receives bank SMS messages; another receives card messages.

### Main flow

1. The person chooses a privacy mode: local-first, connected, or manual-only.
2. The app asks for the desired financial start date, defaulting to the first day of the current month.
3. The person adds accounts by institution and masks the account identifiers to the final four digits.
4. The app distinguishes account identity from UPI app identity. Google Pay or PhonePe is a channel; the linked bank account is the funding source.
5. The person adds each card with statement date, due date, and current outstanding balance.
6. The person adds the loan with lender, outstanding principal, EMI, interest rate when known, and next due date.
7. The app creates a cash wallet and asks for current cash on hand.
8. On Android, the person may permit financial SMS access; messages from both SIMs are attributed where technically available.
9. On iOS, the app offers statement, email, screenshot/share, and manual paths rather than promising SMS history access.
10. The app imports a small preview, shows detected institutions and date range, and asks for confirmation before saving.
11. A setup check identifies likely omissions: an active card seen in messages but not added, or an account with no opening balance.

### Recovery paths

- If two accounts share the same final digits, include institution and account type in the identity key and ask once.
- If a transaction source is unknown, keep it in review rather than attaching it to the most likely account.
- If the person skips an account, record it as excluded so reminders do not repeat without reason.
- If opening balances are unknown, allow setup to continue but label the account unreconciled.

### Acceptance scenarios

- Adding the same account through two evidence sources does not create two accounts without warning.
- Changing an opening balance recalculates later balances and preserves an audit entry.
- UPI applications never appear as bank balances unless they are actual stored-value wallets.
- A person can use the app fully in manual-only mode.
- Revoking a permission does not delete the person's existing ledger without an explicit deletion action.

## 5. Journey B - UPI purchase with duplicate evidence

### Situation

The person pays INR 860 through PhonePe from a bank account. The bank sends an SMS and email; PhonePe produces a notification. The merchant name differs across sources.

### Main flow

1. Each source produces a candidate with amount, time, reference number, account hint, and merchant text.
2. The matching engine gives strongest weight to a shared transaction reference, then amount, direction, time proximity, and account identity.
3. The candidates become one event with three evidence links.
4. The event records PhonePe as channel and the bank account as source.
5. Merchant normalization maps the raw strings to one merchant while preserving original evidence.
6. A category is proposed using merchant history and the person's prior choices.
7. High-confidence events appear in the ledger; a reversible summary says they were added automatically.
8. Low-confidence matches enter review with a side-by-side explanation.

### Recovery paths

- Same amount paid twice within minutes remains two events when reference numbers differ.
- A delayed email can attach to an existing event after the fact without changing the event date.
- A failed UPI attempt is not counted as spending unless there is a completed debit; later reversal links to it.
- If the funding account is unclear, the event remains visible but excluded from account balance calculations until resolved.

### Acceptance scenarios

- One purchase supported by three messages counts once in money out.
- The person can inspect which source produced every field.
- Splitting a grocery purchase into grocery and household items preserves the total.
- Correcting a merchant or category can optionally create a transparent future rule.

## 6. Journey C - Cash withdrawal and cash spending

### Situation

The person withdraws INR 5,000, spends INR 120 on transport, donates INR 500 at a temple, and pays INR 1,200 to a cash-only lender.

### Main flow

1. The ATM debit is detected as a transfer from bank to cash, not an expense.
2. The cash wallet increases by INR 5,000 and the bank decreases by INR 5,000 plus any ATM fee.
3. The person uses quick add for transport and donation; the last-used cash wallet is preselected.
4. The lender payment is linked to an existing debt and marked as principal, interest, fee, or unknown split.
5. Cash balance decreases as each event is entered.
6. The daily summary separates cash spending from the withdrawal.

### Recovery paths

- If the person remembers only the cash balance, cash reconciliation can create an explicit adjustment after asking whether the difference was spending, income, or an unexplained loss/gain.
- An unknown loan-payment split remains fully represented as cash outflow but is not treated as all principal or all interest.
- Repeated small commute entries may be offered as a template, never created silently.

### Acceptance scenarios

- A cash withdrawal does not increase monthly spending.
- An ATM fee does increase monthly spending.
- Donation has its own category and is not labelled wasteful.
- An unexplained adjustment lowers tracking confidence and remains searchable.

## 7. Journey D - Credit card purchase, EMI conversion, and bill payment

### Situation

The person buys a phone for INR 36,000 on a credit card, converts it to six instalments, pays a processing fee and tax, then pays the monthly card bill from a bank account.

### Main flow

1. The purchase creates an expense and increases card liability by INR 36,000.
2. EMI conversion links an instalment plan to the original purchase; it does not create another INR 36,000 expense.
3. The plan stores principal, interest, processing fee, taxes, instalment count, next due date, and remaining amount where available.
4. Processing fee, tax, and interest are costs. Principal repayment reduces liability.
5. The monthly statement is imported and matched against recorded card events.
6. The statement total is shown as an obligation, not as fresh spending.
7. Paying the card bill moves money from bank to card liability and does not duplicate the purchases as expenses.
8. The month view shows both consumption and actual cash outflow so the user can understand the distinction.

### Recovery paths

- If the issuer sends only total EMI amount, the split is marked estimated until a statement provides details.
- If a merchant EMI and issuer EMI conflict, the app asks which agreement governs and retains both documents.
- Partial bill payment updates remaining due and flags possible interest without assuming the final charge.
- Card refunds reduce the linked purchase or create card credit when they exceed current dues.

### Acceptance scenarios

- Purchase plus card-bill payment never doubles the expense.
- EMI principal and interest add up to the instalment, subject to disclosed taxes or fees.
- The person can see outstanding card balance, statement due, next due date, and available limit as distinct values.
- Late fees and finance charges appear as costs, not debt principal.

## 8. Journey E - Borrowing from a friend and repaying over months

### Situation

The person receives INR 30,000 from a friend in January and agrees to repay INR 5,000 monthly, without interest.

### Main flow

1. The incoming transfer is initially detected as money in.
2. The person changes its meaning to borrowed money and names the lender.
3. Cash increases by INR 30,000 and personal-debt liability increases by INR 30,000; income remains unchanged.
4. The person adds the expected repayment cadence and optional reminders.
5. Each repayment is linked to the debt and reduces both cash and outstanding liability.
6. The debt page shows original amount, total repaid, pending balance, next expected repayment, and full history.
7. The January summary states that cash increased partly because of borrowing.

### Recovery paths

- A missed or changed instalment edits the schedule without rewriting completed payments.
- An interest-bearing informal loan supports principal and interest splits.
- If a repayment cannot be matched, it remains a candidate instead of being silently categorized as a generic transfer.
- Debt forgiveness is recorded as a distinct event with confirmation, not as a deletion.

### Acceptance scenarios

- Borrowed money is never included in earned income.
- Repayment principal is not counted as consumption spending.
- Interest paid is included as a cost.
- The lender can be represented without a bank account or contact-book permission.

## 9. Journey F - Salary, gift, reward, reimbursement, and refund

### Situation

During one month, the person receives salary, a family gift, points from work, cash from redeeming those points, reimbursement from an employer, and a refund for a previous-month purchase.

### Main flow

1. Salary is classified as recurring earned income.
2. The family transfer is classified as a gift, preserving it as money in but excluding it from expected salary.
3. Non-cash reward points are stored as a memo asset or ignored according to preference; they are not cash income.
4. Redeeming points for cash creates a cash inflow and reduces the points balance where tracked.
5. A reimbursement is linked to the original reimbursable expense.
6. A refund is linked to the original purchase, even if it arrives in another month.
7. The month summary distinguishes earned income, gifts, borrowed funds, refunds, reimbursements, and asset transfers.

### Recovery paths

- If the original transaction cannot be found, a refund can remain unlinked with a review reminder.
- A partial refund reduces only part of the original expense.
- Store credit is not treated as bank cash; it belongs in a separate wallet or memo balance.
- Reward redemption with tax withholding records the gross reward and deduction when evidence supports both.

### Acceptance scenarios

- Mid-month income appears immediately in the current month without requiring a month restart.
- Refund attribution can update the original category while preserving both months' cash-flow history.
- Reimbursements do not make salary appear larger.
- Gift and borrowed money are never conflated.

## 10. Journey G - Recurring commitments and subscriptions

### Situation

The person has rent, electricity, OTT services, insurance, a chit contribution, school fees, and several EMIs.

### Main flow

1. Repeated transactions are proposed as recurring only after sufficient evidence or user confirmation.
2. The person confirms frequency, expected amount or range, source account, and next due date.
3. The Plan view separates essential bills, debt obligations, subscriptions, savings commitments, and informal commitments.
4. Upcoming obligations reduce safe-to-spend but do not count as spent until a real transaction occurs.
5. A detected payment is matched to the expected item.
6. Price changes and duplicate subscriptions are highlighted in plain language.
7. Cash-only commitments can be checked off with a manual payment entry and optional receipt/photo.

### Recovery paths

- Variable utility bills use an expected range rather than a false fixed amount.
- A skipped subscription remains missed or paused; the app does not manufacture a transaction.
- Chit funds are labelled high-attention informal assets/obligations, with user-entered evidence and no promise of regulated-account verification.
- Annual payments reserve money gradually only if the person opts into sinking funds.

### Acceptance scenarios

- Upcoming and completed obligations are visually and numerically distinct.
- Cancelling a recurring item does not delete its history.
- Subscription advice shows evidence and estimated impact, not a moral judgement.
- A recurring payment matched late does not create a duplicate.

## 11. Journey H - Receipt, screenshot, and statement capture

### Situation

An iPhone user pays by cash and UPI, shares payment screenshots, photographs receipts, and imports monthly bank PDFs.

### Main flow

1. The share action accepts an image or PDF and shows what was extracted before saving.
2. Receipt extraction proposes merchant, date, amount, tax, and line items when confidence permits.
3. The person selects payment source or links the receipt to an existing event.
4. A UPI screenshot is matched using amount, reference, date/time, and visible account hint.
5. Password-protected statements are processed locally where possible; the password is not retained by default.
6. Imported statement rows become candidates and pass through duplicate detection before entering the ledger.
7. The original attachment follows the person's retention setting.

### Recovery paths

- Poor OCR displays the image beside editable fields.
- Unsupported or image-only PDFs receive a useful reason and retry route.
- A receipt without payment evidence may be saved as pending until the source is selected.
- Shared images that contain unrelated sensitive information can be cropped or deleted after extraction.

### Acceptance scenarios

- Import never adds statement rows without a preview and duplicate check.
- The person can remove an attachment while retaining the verified event.
- OCR uncertainty is visible at field level.
- iOS remains useful without SMS-reading claims.

## 12. Journey I - Month-end reconciliation

### Situation

The ledger contains several weeks of SMS imports, manual cash expenses, statement rows, refunds, and a cancelled card transaction. The person wants a dependable January result.

### Main flow

1. The app marks January **live** until the person begins close review.
2. It lists every included account with opening balance, calculated closing balance, evidence closing balance, difference, and last evidence date.
3. Statement import first matches existing events, then proposes unmatched statement rows.
4. The app groups discrepancies into likely causes: missing event, duplicate, pending versus posted, wrong account, fee/interest, timing difference, or incorrect opening balance.
5. The person resolves high-value and high-confidence discrepancies first.
6. Cash is reconciled from counted cash on hand; any adjustment requires a reason.
7. The app shows remaining differences and their effect on confidence.
8. The person closes the month only after reviewing material differences, or closes with exceptions explicitly listed.
9. A closed month becomes **reconciled** with a timestamp, confidence score, and evidence coverage.
10. Later evidence may reopen only affected accounts with a visible audit trail.

### Recovery paths

- Statement dates crossing month boundaries are handled by posting date while retaining event date.
- A cancelled transaction followed by reversal is linked and nets correctly.
- Duplicate statement uploads are detected by institution, account, period, and content fingerprint.
- If statement parsing fails, CSV/manual closing balance remains available.
- If an account was intentionally omitted, summaries state that scope rather than claiming completeness.

### Acceptance scenarios

- Reconciliation is account-by-account, never only a grand-total comparison.
- A month cannot display 100% confidence while a material balance difference is unresolved.
- Closing the month never deletes unresolved items.
- Reopening preserves who changed what and why.

## 13. Journey J - Daily, weekly, and monthly summaries

### Daily summary

The person sees opening available money, money in, money out, transfers, cash entries, largest or unusual items, and items needing review. No chart is required.

### Weekly summary

The person sees total money in and out, change from their own recent baseline, category totals, recurring obligations paid or due, cash-entry freshness, and a short review list.

### Monthly summary

The person sees:

- Earned income, other income, gifts, borrowed money, and refunds separately.
- Spending by essential, flexible, debt cost, fees, donation, and other categories.
- Money moved to savings or investments.
- Debt principal repaid and interest/fees paid.
- Current balances and reconciliation status.
- Upcoming bills and safe-to-spend.
- Tracking Confidence and Money Progress, each with reasons.
- Up to three evidence-based actions.

### Acceptance scenarios

- A transfer between owned accounts never changes total income or spending.
- The same numbers can be traced to underlying transactions.
- Comparisons account for incomplete periods and changed account scope.
- Text remains useful without charts or colour interpretation.

## 14. Journey K - WhatsApp and email summaries

### Main flow

1. The person opts in separately for each delivery channel.
2. The app verifies the destination and explains what data will appear outside the app.
3. The person selects frequency, language, delivery time, and privacy level.
4. A minimal summary contains totals and a secure deep link; sensitive merchant or balance details are optional.
5. A WhatsApp business-initiated message uses an approved template and respects opt-out requirements.
6. Email delivery avoids attachments by default and links to an authenticated report.
7. Every message states the covered date range and reconciliation status.

### Recovery paths

- Delivery failure appears in notification settings without blocking in-app summaries.
- Changed phone number or email requires re-verification.
- Lock-screen notifications hide amounts by default.
- A shared household summary includes only scopes approved by each owner.

### Acceptance scenarios

- No external summary is sent before explicit channel opt-in.
- Turning off delivery takes effect immediately for future messages.
- A summary never describes an unreconciled month as final.
- The user can preview exactly what will be sent.

## 15. Journey L - Advice and scoring

### Main flow

1. Tracking Confidence determines whether personalized advice is eligible.
2. The app explains missing accounts, old evidence, unresolved items, and cash uncertainty before judging performance.
3. Money Progress evaluates obligations, savings, cash flow, debt, flexible spending, and emergency readiness.
4. Each component has its own reason and suggested action.
5. Advice uses the person's stated goals, household context, variable-income status, and life events.
6. Product recommendations or affiliate offers are excluded from the core guidance path.
7. The person can dismiss, snooze, or mark advice irrelevant; this feedback adjusts future suggestions.

### Acceptance scenarios

- Low data confidence produces a completion action, not a harsh financial score.
- High income does not automatically create a high score.
- Necessary medical, caregiving, education, or life-event costs are not labelled irresponsible.
- The person can inspect the score formula and source values.

## 16. Cross-flow failure and recovery model

Every important background process uses the same states:

1. **Waiting**: action has not started or permission is unavailable.
2. **Processing**: evidence is being parsed or matched.
3. **Ready**: completed with no material uncertainty.
4. **Needs review**: human judgement is required.
5. **Partial**: some sources or rows succeeded.
6. **Failed**: no usable result was produced; the reason and retry path are shown.

The app must never leave an import spinner indefinitely, hide partial completion, or make failure indistinguishable from an empty account.

### Common recoveries

- Reconnect or refresh an expired source.
- Upload a statement or enter a closing balance.
- Resolve duplicate candidates.
- Change account ownership or transaction meaning.
- Correct the opening balance.
- Add an evidence note and accept an unresolved difference.
- Export data and continue manually if connectivity fails.

## 17. Traceability matrix

| User pain point | Product response | Primary flow | Proof of success |
|---|---|---|---|
| Duplicate SMS/email/app notifications | Evidence-level deduplication | B | One event with multiple evidence links |
| Wrong category | Reviewable suggestion and personal rule | B | Correction persists and is reversible |
| Cash disappears from the record | Cash wallet and quick entry | C | Counted cash reconciles or difference is explicit |
| Card bill doubles spending | Liability-aware accounting | D | Purchase counted once; payment reduces liability |
| Loan receipt looks like income | Borrowing meaning and liability ledger | E | Income excludes principal borrowed |
| Rewards inflate income | Non-cash and redemption states | F | Cash income begins only at redemption |
| Recurring payment forgotten | Commitment calendar and matching | G | Due and paid states are distinct |
| iOS automation is weak | Share, receipt, email, statement paths | H | Useful setup without SMS history |
| Imported data cannot be trusted | Reconciliation workspace | I | Per-account difference is visible |
| Reports are visually busy | Text-first period summaries | J | Core questions answered without charts |
| Notifications expose finances | Channel-level privacy controls | K | Preview, consent, masked default |
| Scores feel arbitrary | Confidence gate and explainable components | L | Every point traces to a value and rule |
| App becomes a sales funnel | Neutral advice boundary | L | Guidance works without affiliate products |
| Data gets trapped | Export, deletion, and local/manual continuity | All | User can retrieve and remove their records |

## 18. MVP acceptance suite

The first release is ready for a limited pilot only when all of these pass:

1. A user can set up multiple banks, cash, cards, and debts without connecting an external account.
2. Android financial messages can be parsed under a compliant permission flow, and the app remains functional when access is denied.
3. iOS users can add, share, or import evidence through supported system paths.
4. Duplicate evidence for one event does not duplicate spending.
5. Transfers, ATM withdrawals, card payments, borrowed funds, savings transfers, and refunds have correct meanings.
6. Manual entry of a common cash expense takes only a few intentional actions.
7. Every automatic event exposes source and confidence.
8. The review inbox can resolve wrong account, category, duplicate, transfer, and transaction type.
9. A statement import can match existing events and expose unmatched rows.
10. Per-account reconciliation can close a month with explicit exceptions.
11. Daily, weekly, and monthly views agree with the same ledger.
12. Loan and friend-debt balances show original, paid, pending, and next due values.
13. Credit-card purchases and bill payments do not double count.
14. Tracking Confidence responds correctly to missing accounts, stale data, cash uncertainty, and unresolved events.
15. Money Progress is not displayed as authoritative when confidence is below its threshold.
16. WhatsApp and email summaries require explicit opt-in and can be previewed and stopped.
17. Biometric lock, concealed notifications, export, account deletion, and permission revocation work.
18. No chart is required to understand money in, money out, balance, obligations, and remaining safe-to-spend.

## 19. Design handoff

The first prototype should cover one coherent closed loop:

1. Secure setup.
2. Add a bank, cash wallet, card, and personal debt.
3. Import or enter mixed transactions.
4. Resolve five representative review items.
5. Reconcile one account and cash.
6. Read the monthly explanation and score reasons.
7. Preview an external summary.

Design should be tested with realistic Indian transaction descriptions, long merchant names, Indian numbering formats, multiple scripts, small Android screens, dynamic text sizing, weak connectivity, and partial data. Only after this loop is understandable should charts, investment depth, family collaboration, or predictive features expand the surface.

## 20. Savings, receivables, gifts, family support, and spending averages

These meanings must remain separate because combining them produces misleading spending totals.

- A mutual-fund, fixed-deposit, recurring-deposit, or gold-scheme contribution is a transfer from cash to a savings or investment destination. The app shows both the current-month contribution and the accumulated destination balance.
- Money given to a friend with an expectation of repayment creates a receivable. The record shows original amount, received amount, pending amount, expected date, and repayment history. It is cash outflow but not consumption spending.
- An item bought as a gift is spending with category **Gift purchase** and an optional recipient, occasion, and reimbursement expectation.
- Money intentionally given to an elder, child, or other family member is **Family support**. It can be one-time or recurring and stores the recipient without requiring contact-book access.
- Daily, weekly, and monthly spending averages use only true spending. Transfers, savings contributions, borrowed principal, debt principal repayments, and money lent are excluded. Partial periods are labelled and compared only with equivalent periods.

Acceptance requires that every total can be traced to its events, changing an event between gift/lending/support recalculates the affected totals, and a friend repayment reduces the receivable without being treated as ordinary income.
