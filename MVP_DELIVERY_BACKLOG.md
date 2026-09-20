# India Money Tracker - MVP Delivery Backlog

## 1. MVP outcome

The pilot user can create a trustworthy monthly record across bank, cash, card,
loan, and savings activity, understand what remains, and see exactly where the
record may be incomplete.

The MVP is not judged by the number of integrations. It is judged by whether a
person can recover from missing automation and still close the month accurately.

## 2. Priority definitions

- **P0**: required for the first controlled pilot.
- **P1**: required before a broad public launch.
- **P2**: valuable after accuracy and retention are established.

## 3. P0 workstreams

### P0.1 Secure account and privacy controls

Deliver:

- Sign-in, recovery, app PIN, and biometric unlock.
- Separate consent for SMS, email/import, analytics, and external summaries.
- Hidden financial details in notifications by default.
- Device/session list, sign-out, export, and deletion workflow.
- Local/manual mode that does not require banking permissions.

Done when:

- Permission denial never blocks manual tracking.
- Consent withdrawal stops future collection and explains retained data.
- Export and deletion are tested on a realistic multi-account profile.

Depends on: privacy model, retention policy, threat model.

### P0.2 Account and opening-balance setup

Deliver:

- Bank, cash, card, loan, personal debt, receivable, savings/investment, and
  stored-value wallet account types.
- Institution, nickname, masked identifier, ownership, currency, and opening
  balance date.
- Card statement/due dates and loan/EMI details.
- Included, excluded, inactive, and closed account states.

Done when:

- One person can represent the full test profile without misusing categories as
  accounts.
- Duplicate account candidates are detected.
- Every balance has an effective date and audit history.

Depends on: ledger model.

### P0.3 Ledger and financial meanings

Deliver:

- Income, expense, transfer, borrowing, repayment, refund, reimbursement,
  savings/investment transfer, fee, interest, and adjustment meanings.
- Split transactions and linked event groups.
- Draft, confirmed, needs-review, reconciled, reversed, and excluded states.
- Event date, posting date, import date, and evidence provenance.

Done when:

- The canonical accounting scenario suite passes.
- Editing one linked event preserves balanced totals or requests resolution.
- Deleting evidence does not silently delete a confirmed event.

Depends on: none; this is the foundation for all other workstreams.

### P0.4 Fast manual capture

Deliver:

- Quick money-in, money-out, move, borrow, repay, and cash entry.
- Recent accounts/categories, templates, notes, tags, and receipt attachment.
- Cash-balance confirmation and explained adjustment.
- Offline entry with later synchronization.

Done when:

- Frequent cash spending can be recorded quickly on a small Android device.
- Offline-created and server-created items do not duplicate after sync.
- Manual entries participate in matching and reconciliation like imported items.

Depends on: account setup, ledger.

### P0.5 Android financial-message import

Deliver:

- Compliant permission education and request flow.
- Local parsing for an initial measured set of Indian bank/card templates.
- Sender allowlist, parser version, raw-field provenance, and confidence.
- Parser-health monitoring that does not upload raw messages by default.
- Rescan and failure explanation.

Done when:

- Non-financial messages are not imported.
- Template changes fail visibly into review rather than disappearing.
- Accuracy is measured per institution and event type, not only globally.

Depends on: policy review, ledger, matching.

### P0.6 Share, receipt, and statement import

Deliver:

- iOS and Android share-to-app for screenshots and receipts.
- PDF and CSV import for a small supported institution set.
- Password-protected statement handling without retaining the password.
- Import preview, unsupported-format message, row-level result, and rollback.

Done when:

- Reimporting the same file produces no duplicate events.
- A partially parsed statement reports accepted and rejected rows.
- Low-confidence extracted fields remain editable drafts.

Depends on: ledger, file security, matching.

### P0.7 Matching and deduplication

Deliver:

- Evidence-to-event matching based on reference, amount, direction, account,
  date/time, and merchant.
- Transfer-pair, card-payment, refund, reversal, and ATM-withdrawal recognition.
- Merge, keep separate, unlink, and undo actions.
- Explanation of why items were matched.

Done when:

- SMS plus email plus statement row can support one event.
- Equal amounts close in time remain separate when references differ.
- A wrong automatic match can be fully undone.

Depends on: ledger, imports.

### P0.8 Review inbox

Deliver:

- Queues for unknown account, duplicate, uncertain type/category, transfer,
  refund, and high-value event.
- Bulk confirmation only for low-risk homogeneous items.
- Personal rules with preview, scope, and undo.
- Snooze and explicit exclusion.

Done when:

- Every uncertain automatic decision has a visible destination.
- Resolving an item updates all affected balances and summaries.
- The queue is ordered by financial impact and confidence.

Depends on: matching, ledger.

### P0.9 Cards, EMIs, loans, and personal debts

Deliver:

- Card purchase, outstanding, statement, due, limit, payment, refund, and fee.
- EMI schedule with principal, interest, taxes/fees, paid, pending, and next due.
- Formal loan and informal person-to-person debt.
- Partial, missed, extra, waived, and rescheduled repayments.

Done when:

- Purchase and bill payment do not double-count expense.
- Borrowed principal does not inflate income.
- Debt balances can be reconciled independently of cash accounts.

Depends on: ledger, recurring obligations.

### P0.10 Recurring obligations

Deliver:

- Rent, bills, subscriptions, insurance, school fees, EMIs, and informal
  commitments.
- Fixed amount, expected range, cadence, next due, autopay, and payment match.
- Active, paused, cancelled, due, paid, missed, and changed states.

Done when:

- Expected items affect safe-to-spend planning but not actual spending.
- Cancellation retains history.
- Variable bills do not generate false transactions.

Depends on: ledger, matching.

### P0.11 Text summaries

Deliver:

- Daily, weekly, and monthly views from one ledger calculation service.
- Money in, money out, moves, savings, debt changes, obligations, balances, and
  review count.
- Scope, freshness, and reconciliation status on every summary.
- Drill-down from every total to included events.

Done when:

- The three time views agree for equivalent date ranges.
- No transfer or card-payment double counting occurs.
- Summary remains understandable without charts or colour.

Depends on: ledger, accounts, review.

### P0.12 Month-end reconciliation

Deliver:

- Opening, calculated closing, evidence closing, difference, and freshness for
  each account.
- Guided resolution for missing, duplicate, timing, fee, interest, account, and
  opening-balance differences.
- Cash count and explained adjustment.
- Live, closed-with-exceptions, reconciled, and reopened period states.

Done when:

- Material unresolved differences cannot yield maximum confidence.
- Duplicate statement upload is harmless.
- Reopening a period preserves a complete audit trail.

Depends on: all acquisition sources, ledger, matching.

### P0.13 Tracking Confidence

Deliver:

- Account Coverage, Reconciliation, Review Completion, Source Freshness, and Cash
  Confidence components.
- Plain-language score explanation and improvement actions.
- Scope and materiality controls.
- Methodology version stored with each period score.

Done when:

- The validation cases in `SCORING_SPECIFICATION.md` pass.
- Missing scope cannot appear as perfect confidence.
- Users can reproduce the result from displayed values.

Depends on: reconciliation, review, source health.

### P0.14 Data portability and recovery

Deliver:

- Human-readable CSV export and complete machine-readable backup.
- Encrypted backup/restore with preview and duplicate protection.
- Account deletion and local-cache clearing.
- Migration version checks.

Done when:

- A restored profile matches original balances, links, and reconciliation states.
- Failed restore leaves the existing profile intact.
- Export includes categories, account identities, links, and audit data.

Depends on: stable ledger schema.

## 4. P1 public-launch workstreams

- Safe-to-spend based on cleared money, reserved obligations, expected essential
  spend, and a user-set buffer.
- Flexible budgets, annual sinking funds, savings goals, and debt-payoff goals.
- Money Progress Score with confidence eligibility gate.
- Email and WhatsApp summaries with verified destinations, preview, opt-out, and
  privacy levels.
- Regional-language content for onboarding, common categories, and summaries.
- Accessibility testing and low-end-device performance work.
- Household roles and explicitly shared accounts without exposing private ones.
- Pending refund and reimbursement workspace.
- Parser expansion driven by measured unsupported volume.
- Support console that can diagnose imports without exposing unnecessary raw
  financial content.

## 5. P2 expansion

- Account Aggregator integration through a suitable regulated partner or role.
- Broader investments, provident funds, gold, property, vehicles, and net worth.
- Voice entry and optional evidence-grounded money questions.
- Financial resilience assessment.
- Tax-oriented exports and document vault.
- Web companion.

## 6. Dependencies and sequence

Recommended build sequence:

1. Ledger model and invariant test suite.
2. Accounts, security, privacy, and manual capture.
3. Import evidence model and matching.
4. Review inbox and parser health.
5. Cards, loans, debt, and recurring commitments.
6. Summaries and reconciliation.
7. Tracking Confidence.
8. Portability, restore, and deletion hardening.
9. Controlled pilot and parser expansion.
10. Planning, progress scoring, and external summaries.

Do not build the summary UI independently from the ledger calculations. One
calculation layer should serve account balances, time views, reconciliation, and
score inputs.

## 7. Pilot test cohort

Recruit 20-30 participants across these profiles:

- Salaried multi-bank Android user with high UPI use.
- iPhone user who relies on statements and screenshots.
- Cash-heavy household manager.
- User with two cards and at least one EMI.
- Person repaying informal debt.
- Irregular-income worker or small independent professional.
- Privacy-conscious manual-only user.
- User who switches between English and an Indian language.

The cohort should include different banks, UPI applications, statement formats,
phone price ranges, and levels of financial confidence.

## 8. Launch gates

### Accuracy gate

- No known double-counting in canonical transfer, card, loan, refund, or savings
  scenarios.
- Institution-specific import quality is visible and meets the pilot threshold.
- All critical automatic decisions are reversible.

### Trust gate

- Participants understand why an item was added and where its data came from.
- Participants can identify incomplete account coverage.
- No permission or notification surprises occur in pilot interviews.

### Continuity gate

- Manual fallback works when every external source is disabled.
- Backup and restore pass repeated destructive-environment tests.
- Offline entry and synchronization pass conflict tests.

### Usefulness gate

- Most pilot users can close a month without staff intervention.
- Users can correctly answer where money went, what remains, and what is due.
- The weekly summary prompts review without creating notification fatigue.

### Compliance gate

- SMS access path has policy and legal review before distribution.
- Consent records, retention, deletion, and vendor contracts are reviewed.
- WhatsApp/email delivery has compliant opt-in and template operations.
- Public claims accurately describe platform and institution coverage.

## 9. Measures for the first 90 days

- Setup completion by privacy mode and platform.
- Declared active accounts with usable coverage.
- Imported-event precision and recall by institution/template.
- Duplicate rate and false-merge rate.
- Median unresolved review count and age.
- Percentage of active users completing a cash check.
- Percentage of eligible users closing or reconciling a month.
- Difference magnitude before and after reconciliation.
- Manual-entry completion time and abandonment.
- Four- and twelve-week retention by capture mode.
- Export, restore, permission revocation, and deletion success.
- Support contacts per 1,000 imports and their root causes.

Do not optimize engagement time. The desired result is a short, successful review
followed by confidence that the record is under control.

## 10. Decisions required before visual design is finalized

- Whether the initial pilot is Android-first or simultaneous Android/iOS.
- Which institutions and statement formats make the supported launch set.
- Whether email is device-parsed, server-connected, or import-only in MVP.
- Exact raw-evidence retention defaults.
- Whether cloud sync is optional or required for account creation.
- Materiality defaults for reconciliation.
- Which Indian languages enter the first public release.
- Whether WhatsApp belongs in P1 or remains an experiment due to cost and privacy.

These decisions change flows and system boundaries; they should be resolved with
user interviews, policy review, and a small technical spike before polished
screens are produced.
