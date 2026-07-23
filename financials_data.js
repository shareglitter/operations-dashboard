// financials_data.js — QB actuals + pro forma forecast
// Updated: July 2026 (covers Jan–Jun 2026 actuals)
// Source: QuickBooks P&L by month, mapped to 6 FC buckets
// Note: June 6812 Bonuses ($61,209) is an annual payout — normalized in run-rate calcs

const FINANCIALS = {

  months: ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06'],

  // ─── REVENUE (QB actuals) ───
  revenue: {
    // 4010 Subscription Income (core neighbor subscriptions via Stripe)
    subscription:     [43533, 40632, 43104, 47035, 46150, 50698],

    // 4005 Project Income — SPLIT into project (Stripe) vs grant (QB-invoiced)
    // Project: Area 32 (23 blocks) — Impact Services (13) + Philly Safe (10) = ~$4,600/mo via Stripe
    // Grant: remainder of QB 4005 — DCED (~$40K), Parks (~$15K), unencumbered, one-offs
    // Old projects tapered off ~May 2026
    project:          [4600, 4600, 4600, 4600, 4600, 4600],
    grant:            [153514, 130011, 139698, 126790, 97746, 161826],

    // 4020 Impact Fund Contribution (neighbor donations on top of subscription)
    impactFund:       [1156, 226, 233, 236, 231, 230],
    // 4015 Billable Expense Income (grant-related reimbursements)
    billableExpense:  [521, 446, 262, 2647, 3889, 422],
    // 4900 Discounts given
    discounts:        [-326, -615, -294, -608, -58, -250],
  },

  // ─── COGS (QB actuals) ───
  cogs: {
    // 5010 + 5011 Cleaner labor + bonuses
    labor:      [68438, 61846, 66658, 47294, 36269, 37328],
    // 5013 Workers' compensation insurance
    workersComp:[3832, 3434, 1458, 490, 0, 4357],
    // 5050 Supplies & materials
    supplies:   [2376, 1828, 2531, 975, 1680, 2130],
  },

  // ─── FIXED COSTS — 6 buckets (QB actuals) ───
  // Bucket mapping from QB chart of accounts:
  fixedCosts: {

    // 1. HQ Compensation: 6811 Salaries + 6812 Bonuses + 6816-6818 Benefits
    //    + 6819 Payroll Tax + 6822 Payroll Fees + 6823 401k
    //    NOTE: Jun includes $61,209 annual bonus spike
    compensation: [43142, 43211, 44429, 46018, 57134, 117852],

    // 2. Insurance: 6833 Business insurance
    insurance: [3350, 2952, 3185, 2217, 1766, 1766],

    // 3. Facilities & Software: 6877 Rent + 6882 Software & apps
    facilitiesSoftware: [3823, 3663, 3890, 4690, 4260, 4251],

    // 4. Professional Services: 6843 Contract labor + 6846 Accounting + 6849 Legal
    professional: [2295, 3985, 4796, 6650, 5977, 3672],

    // 5. Stripe Fees: 6871
    stripeFees: [1858, 1794, 1929, 1975, 1976, 1965],

    // 6. Operations: 6310-6320 Sales & Marketing + 6873-6889 Office misc
    //    + 6890 Bad debt + 6891 Employee rec + 6900 Travel + uncategorized
    operations: [1581, 1835, 3864, 6412, 2846, 2310],
  },

  // ─── PRO FORMA GO-FORWARD (monthly budget) ───
  // Source: Owner's pro forma model, ~$61,390/mo total FC
  proForma: {
    total: 61390,
    buckets: {
      compensation: 46378,
      // Breakdown: CEO $10,500 + Ops Dir $9,583 + Cleaner Mgr $6,250
      //   + Customer Mgr $6,450 + Bonuses $2,590 + Payroll Tax $2,934
      //   + Health $3,000 + 401k $971 + Payroll Fee $650
      insurance: 1474,       // GL $1,132 + New $342
      facilitiesSoftware: 4791, // Rent $1,750 + Software $3,041
      professional: 4331,    // Accounting $1,181 + Legal $250 + HR $900 + Tech $2,000
      stripeFees: 2016,
      operations: 4900,      // Marketing $500 + Auditing $2,400 + Office $950 + Travel $500 + Other $550
    },
    // Net adjustments
    interestEarned: 400,   // offsets ~$400/mo
    taxes: 900,            // ~$900/mo provision
  },

  // ─── FORWARD REVENUE ASSUMPTIONS ───
  forwardAssumptions: {
    // Monthly subscription revenue (AT-derived, grows with block growth)
    // Latest QB actuals: $50,698 (Jun 2026). AT MRR snapshot overrides this at runtime.
    subscriptionMonthly: 50700,
    subscriptionGrowthPct: 2.0,   // % monthly growth assumption — adjust as needed

    // Core project revenue (continues indefinitely via Stripe)
    // Area 32: 23 blocks, Impact Services (13) + Philly Safe (10)
    projectMonthly: 4600,

    // Gross margin on subscription + project revenue (Stripe blocks)
    // 47.5% = cleaner pay ~50% of revenue + ~2.5% tools/supplies
    subscriptionGMPct: 47.5,

    // ─── GRANT/PROJECT SCHEDULES (month-specific) ───
    // Revenue and Gross Margin $ from actual contract schedules
    // Months not listed = $0
    // June values already captured in QB actuals — only Jul–Oct used in forward projection

    // DCED SSNE: Jun–Oct 2026
    dced: {
      '2026-06': { rev: 41566, gm: 32566 },  // in QB actuals
      '2026-07': { rev: 41566, gm: 32566 },
      '2026-08': { rev: 41566, gm: 32566 },
      '2026-09': { rev: 32116, gm: 27616 },
      '2026-10': { rev: 13000, gm: 11000 },
    },

    // Parks: Jun–Oct 2026
    parks: {
      '2026-06': { rev: 10004, gm: 9488 },   // in QB actuals
      '2026-07': { rev: 9938, gm: 9488 },
      '2026-08': { rev: 9938, gm: 9488 },
      '2026-09': { rev: 9938, gm: 9488 },
      '2026-10': { rev: 4264, gm: 4000 },
    },

    // SSNW: Apr–Nov 2027 (8 months, $500K total revenue)
    ssnw: {
      '2027-04': { rev: 62500, gm: 35000 },
      '2027-05': { rev: 62500, gm: 35000 },
      '2027-06': { rev: 62500, gm: 35000 },
      '2027-07': { rev: 62500, gm: 35000 },
      '2027-08': { rev: 62500, gm: 35000 },
      '2027-09': { rev: 62500, gm: 35000 },
      '2027-10': { rev: 62500, gm: 35000 },
      '2027-11': { rev: 62500, gm: 35000 },
    },

    // Starting cash position (end of June 2026, POST share buyback)
    // Pre-buyback: $463K (end of May) → buyback ~$275K + bonuses + taxes → $197K
    startingCash: 197000,

    // ─── CASH ADJUSTMENTS (below-the-line items that hit cash) ───
    // These are NOT in operating income but affect cash position.
    // Negative = cash out, Positive = cash in.
    cashAdjustments: {
      '2026-07': [
        { label: 'Unexpected insurance charges', amount: -22000 },
      ],
      '2026-08': [
        { label: 'Video production (contracted)', amount: -12500 },
      ],
      '2026-09': [
        { label: 'Estimated tax payment', amount: -20000 },
        { label: 'Legal fees (contracted)', amount: -12500 },
      ],
      '2026-12': [
        { label: 'Estimated tax payment', amount: -20000 },
      ],
      '2027-04': [
        { label: 'Tax return', amount: 61000 },
      ],
    },

    // User's loose actual/expected cash numbers for validation:
    // Jun: $197K, Jul: $194K, Aug: $213K, Sep: $208K,
    // Oct: $203K, Nov: $183K, Dec: $144K
  },

  // ─── LABELS ───
  bucketLabels: {
    compensation: 'HQ Compensation',
    insurance: 'Insurance',
    facilitiesSoftware: 'Facilities & Software',
    professional: 'Professional Services',
    stripeFees: 'Stripe Fees',
    operations: 'Operations & Admin',
  },

  bucketColors: {
    compensation: '#6366f1',
    insurance: '#f59e0b',
    facilitiesSoftware: '#06b6d4',
    professional: '#8b5cf6',
    stripeFees: '#ec4899',
    operations: '#10b981',
  },
};