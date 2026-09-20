# Scoring Specification

Date: 20 September 2026

## 1. Why two scores are required

A finance app can produce a polished behavioural score from incomplete records.
That is dangerous. The product must first answer whether its data is complete and
then, separately, how the user progressed against their own plan.

The two scores are:

1. Tracking Confidence Score: Can this period be trusted?
2. Money Progress Score: How closely did the user follow their own plan?

Neither score is a credit score. Neither may be used for underwriting, pricing,
eligibility, marketing segmentation, or comparison with other users.

## 2. Tracking Confidence Score

### 2.1 Formula

Each component is calculated from 0 to 100.

```text
Tracking Confidence =
  Account Coverage x 0.25
  + Reconciliation x 0.25
  + Review Completion x 0.20
  + Source Freshness x 0.15
  + Cash Confidence x 0.15
```

Round only the final result.

### 2.2 Account Coverage

The user declares which accounts were active during the period. Each account has a
coverage state:

| State | Component value |
| --- | ---: |
| Complete statement or continuous AA feed | 100 |
| Current feed plus verified opening/closing balance | 90 |
| Current feed without balance verification | 75 |
| Manual ledger with a recent balance check | 60 |
| Balance only, no transactions | 35 |
| Active but no usable data | 0 |

Account Coverage is the activity-weighted average. Activity weight should use the
larger of transaction count share and absolute money-movement share, with a floor
so a low-volume salary or loan account cannot disappear from the calculation.

An intentionally excluded account remains visible in the scope statement:

> Score covers 4 of 5 declared active accounts. SBI Joint Account was excluded by
> you.

The score must never say "complete financial picture" when active accounts are
excluded.

### 2.3 Reconciliation

For each account, test the relevant equation.

Bank or cash account:

```text
opening balance + confirmed credits - confirmed debits = closing balance
```

Credit card:

```text
opening outstanding + purchases + fees + interest
- payments - refunds - reversals = closing outstanding
```

Loan:

```text
opening principal + new disbursement + capitalized charges
- principal repaid - principal waived = closing principal
```

Account values:

| Result | Component value |
| --- | ---: |
| Exact or within institution rounding tolerance | 100 |
| Explained difference awaiting posting | 85 |
| Difference below user-approved materiality threshold | 70 |
| Material unresolved difference | 25 |
| No opening/closing evidence | 0 |

Reconciliation is weighted by account activity. A user may approve a known
difference only by recording an explanation; approval must not silently create a
balance adjustment.

### 2.4 Review Completion

Review Completion blends transaction count and transaction value so that neither
one large event nor hundreds of tiny events dominate.

```text
count completion = reviewed events / reviewable events
value completion = reviewed absolute value / reviewable absolute value
Review Completion = (count completion + value completion) / 2 x 100
```

High-confidence recurring rules may mark items reviewed automatically only after
the user has explicitly enabled that rule. Borrowing, transfers, card payments,
refunds, and transactions above the user's review threshold always remain
reviewable.

### 2.5 Source Freshness

Freshness is calculated against each source's expected update rhythm.

| Source state | Component value |
| --- | ---: |
| Updated inside expected window | 100 |
| Slightly delayed, no missing sequence detected | 80 |
| Permission/session expiring or materially delayed | 50 |
| Disconnected or stopped unexpectedly | 0 |

The expected window differs by source. A monthly statement is not stale during the
month merely because it has not yet been issued. The live ledger should instead
say it is provisional.

### 2.6 Cash Confidence

Cash cannot be proven from digital sources. The component is based on the user's
chosen tracking method:

- Age of the last cash-balance confirmation
- Unallocated ATM withdrawals
- Number/value of pending cash reminders
- Difference between expected and confirmed cash balance

Suggested values:

| State | Component value |
| --- | ---: |
| Cash balance confirmed in period and difference resolved | 100 |
| Recent confirmation with small explained difference | 80 |
| Cash entries exist but balance has not been checked | 55 |
| ATM withdrawals exist with no cash usage or balance check | 25 |
| User states cash is active but provides no records | 0 |
| User confirms cash was not used in period | Not applicable |

If cash is not applicable, redistribute its weight proportionally among the other
four components and display that choice.

### 2.7 Score caps and gates

- An active high-materiality account with no usable data caps the score at 74.
- Any material unresolved reconciliation difference caps the score at 74.
- A disconnected primary source caps the live score at 74 until another source
  covers the same account.
- An unreconciled month can score no higher than 89.
- A reconciled month with intentionally excluded active accounts must be labelled
  "reconciled within selected scope."
- Recommendations that depend on total income, total spending, or safe-to-spend
  require a score of at least 75 and no missing primary income account.

### 2.8 User-facing presentation

Good:

```text
Tracking Confidence: 82/100 - Mostly complete

Complete:
- HDFC Salary Account reconciled
- ICICI Card reconciled
- 91% of transactions reviewed

Still needed:
- Confirm cash balance
- Review two transfers totaling Rs. 18,000
- SBI statement is due on 28 September
```

Bad:

```text
Your accuracy score is 82%. Improve it now.
```

The score should explain evidence, not pressure the user.

## 3. Money Progress Score

### 3.1 Eligibility

The score is available only when:

- Tracking Confidence is at least 75.
- At least one income or funding pattern is known.
- Fixed obligations for the period are confirmed or explicitly marked unknown.
- The user has selected a plan or asked the app to create a draft plan.

Otherwise show the missing inputs rather than an estimated score.

### 3.2 Default formula

Each applicable component is calculated from 0 to 100.

```text
Money Progress =
  Obligations x 0.25
  + Savings Progress x 0.20
  + Cash-flow Progress x 0.20
  + Debt Progress x 0.15
  + Flexible Spending x 0.10
  + Emergency Progress x 0.10
```

Non-applicable components are removed and the remaining weights are normalized.
The app must show the resulting weights.

### 3.3 Obligations

Includes rent, utilities, insurance, taxes, EMIs, card dues, school fees, and
user-designated essential commitments.

Suggested calculation:

- 100 when all due obligations are paid on time.
- Reduce according to criticality and lateness, not merely rupee amount.
- A disputed or deferred obligation is excluded only with user confirmation.
- Paying only a card minimum due is not the same as satisfying the user's total-due
  plan.

### 3.4 Savings Progress

```text
Savings Progress = min(actual qualifying savings / planned savings, 1) x 100
```

Qualifying savings are net contributions after withdrawals during the period.
Transfers among savings accounts do not count again. Investment market gains do
not count as the user's monthly contribution.

### 3.5 Cash-flow Progress

For salaried users, compare actual remaining cash flow with the user's plan after
excluding internal transfers.

For irregular-income users, use a rolling period selected from 60, 90, or 180 days
and compare essential commitments with conservative realized income. Do not score
one low-income month as failure when the user's work is seasonal.

### 3.6 Debt Progress

Use principal reduction rather than total EMI paid.

```text
Debt Progress = min(actual principal reduction / planned principal reduction, 1)
  x 100
```

Interest and fees remain visible as cost. New borrowing reduces the component only
when it increases net debt beyond the user's plan. Emergency borrowing can be
annotated so the explanation remains humane without changing the arithmetic.

### 3.7 Flexible Spending

Flexible spending is compared with the user's selected allowance.

- At or below allowance: 100
- Up to 5% above: 85
- 5-10% above: 70
- 10-20% above: 50
- More than 20% above: scale toward 0

Spending below the allowance does not produce bonus points. The product should not
encourage deprivation merely to increase a score.

### 3.8 Emergency Progress

Before a target is set, show runway rather than score:

```text
liquid emergency resources / average essential monthly spending
```

After the user chooses a target, score net contribution against the planned
contribution. Locked retirement money, credit-card limits, and unapproved loans
must not be described as emergency cash.

### 3.9 Life-event handling

The user can tag a period with a major event such as medical treatment, wedding,
job transition, relocation, education payment, or family emergency. The score does
not erase the event. It adds context:

> Spending exceeded the plan because Rs. 42,000 was marked as a medical emergency.
> Your regular flexible spending remained within plan.

### 3.10 Presentation

```text
Money Progress: 72/100 - On track with two items to address

Strong:
- All bills and EMIs were paid on time
- Debt principal reduced by Rs. 8,200

Behind plan:
- Saved Rs. 6,000 of the planned Rs. 10,000
- Flexible dining spend was Rs. 1,600 above plan

Next useful action:
- Review two renewals due before 28 September
```

The score should always be accompanied by its strongest positive, largest gap,
and one next action.

## 4. Optional Financial Resilience Score

Do not launch this in the MVP. A resilience score requires information that a
transaction tracker may not know reliably:

- Liquid emergency runway
- Income stability
- Debt-service ratio
- Secured versus unsecured debt
- Health and life protection
- Dependants
- Retirement preparation
- Access and liquidity of assets

If introduced, it must remain separate from monthly behaviour and have a visible
methodology. Missing insurance or dependant information should produce an
incomplete component, not an invented assumption.

## 5. Anti-patterns

- One score that mixes missing data and overspending
- Hidden weights or unexplained AI scoring
- Comparing users by income or wealth
- Rewarding additional borrowing or product purchases
- Treating an investment market gain as disciplined saving
- Penalizing essential medical or family support without context
- Using the score in loan or insurance offers
- Sending the exact score to WhatsApp without explicit consent
- Showing a score before the user can inspect or correct its inputs
- Changing methodology without versioning and explanation

## 6. Methodology versioning

Every stored score should include:

- Score type
- Period
- Formula version
- Applicable components and weights
- Input-data snapshot identifier
- Tracking Confidence at calculation time
- User annotations

If the methodology changes, historical scores should retain the original version
or be explicitly recalculated with a visible notice. Silent historical rewriting
would undermine trust.

## 7. Validation tests

1. A user transfers Rs. 50,000 between two owned accounts. Progress and spending
   must not change.
2. A user pays a Rs. 20,000 card bill containing previously counted purchases.
   Spending must not increase by Rs. 20,000.
3. A bank account is stale for seven days. Confidence must fall before advice is
   generated.
4. A cash withdrawal is recorded but no cash balance is confirmed. Cash Confidence
   must identify the gap.
5. A user has no debt. Debt weight must be redistributed and displayed.
6. A freelancer receives no income in one calendar month but has healthy 90-day
   cash flow. The score must use the selected rolling period.
7. A medical expense exceeds the plan. Arithmetic remains accurate while the
   explanation separates the life event from routine flexible spending.
8. One active account is intentionally excluded. The score must describe its
   limited scope.
9. A refund arrives in the following month. The ledger links it to the purchase and
   both monthly explanations remain understandable.
10. A scoring formula is updated. Previously stored scores retain their formula
    version.
