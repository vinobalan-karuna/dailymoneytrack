# Daily Money

India-first personal finance control center. This repository holds the product research and an interactive web preview of the Android app: what you can use today, what is coming, where savings sit, and which debt costs the most.

The preview uses Arun’s sample month (Bengaluru, September 2026). It is demo data, not a live bank connection.

## Live preview

[https://vinobalan-karuna.github.io/dailymoneytrack/](https://vinobalan-karuna.github.io/dailymoneytrack/)

GitHub Pages is already publishing the **repository root** of `main` (`Settings → Pages → Deploy from branch → /`). `npm run build` writes the static site to `docs/` and copies `index.html`, `assets/`, and the favicon to the root, so that existing setting keeps serving the app. A `.nojekyll` file is included so GitHub does not drop files that start with an underscore.

If the Pages URL is still catching up after a merge, the previous host of this same preview is [https://daily-money-arun-b601.surge.sh](https://daily-money-arun-b601.surge.sh).

Open the site and choose **See Arun's sample**. Then check:

- Home shows **Available to use ₹1,43,100** (HDFC, SBI, ICICI, and cash, minus bills already reserved).
- Needs your attention: unknown UPI, transfer to Kiran, possible Swiggy duplicate, Priya’s NEFT, and cash to count.
- Plan → Debt lists Axis Ace at 42% first (avalanche). Snowball is the alternate. Extra ₹5,000 a month is a straight interest estimate, not advice.
- Savings shows Emergency, Goal, and Investment labels, and coverage of about **78%**.
- You → Sources includes dual SIM, banks, cards, Google Pay / PhonePe / BHIM mapped to a bank, cash, and statement import. Turning **HDFC Bank** off hides financial strength.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm test
npm run build
```

`npm run build` typechecks, refreshes `docs/`, and copies the Pages files to the repository root.

## Where the source lives

The page you see in the browser is built from readable source, not only a minified bundle:

| Path | What it is |
| --- | --- |
| `web/index.html` | HTML shell |
| `web/src/screens/` | Home, Activity, Plan, Savings, You, onboarding |
| `web/src/index.css` | Colors, phone frame, cards |
| `web/src/data/sample.json` | Sample ledger |
| `web/src/lib/finance.ts` | Available balance, coverage, debt order |
| `docs/` | Static build used by Pages |

## Research documents

1. [Product brief](INDIA_MONEY_TRACKER_PRODUCT_BRIEF.md)
2. [Competitor and review evidence](COMPETITOR_REVIEW_EVIDENCE.md)
3. [Scoring specification](SCORING_SPECIFICATION.md)
4. [User journeys and process flows](USER_JOURNEYS_AND_PROCESS_FLOWS.md)
5. [MVP delivery backlog](MVP_DELIVERY_BACKLOG.md)
6. [Product gap audit](PRODUCT_GAP_AUDIT.md)

The earlier static prototype is kept in [legacy-prototype](legacy-prototype/).
