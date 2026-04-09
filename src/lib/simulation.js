// Default assumptions — extracted from PlanDashboard
export const DEFAULT_ASSUMPTIONS = {
  // ═══════════════════════════════════════════════════════════════
  // STARTING BALANCES (real as of April 8, 2026)
  // Birthday: Dec 23 — currently 31, turns 32 Dec 23 2026
  // ═══════════════════════════════════════════════════════════════
  currentAge: 31,           // Dec 23 birthday — 31 now, turns 32 EOY 2026
  k401Start: 8200,          // Human Interest 401k (real: $8,200 as of Apr 8 2026)
  iraStart: 5000,           // Robinhood Traditional IRA (real: $5,000 as of Apr 8 2026)
  robinhoodStart: 96000,    // Robinhood Individual Brokerage (real: $96,000 as of Apr 8 2026)
  seattleEquityStart: 0,    // Seattle sale modeled directly via net proceeds (see below)
  ccDebtStart: 0,           // CC paid off
  ccInterestRate: 20,       // average CC APR on carried balance
  ccPayoffPct: 85,          // pay off 85% of balance each month, carry 15%
  cashStart: 0,             // no idle cash — everything deployed

  // ═══════════════════════════════════════════════════════════════
  // W2 INCOME (from Gusto pay stub: $40/hr via AAYO Tech / Nimbus Tech)
  // ═══════════════════════════════════════════════════════════════
  hourlyRate: 40,           // actual Gusto rate
  hoursPerYear: 2080,       // 40 hrs/wk × 52 (conservative; actual pace ~2,250)
  w2Gross: 80000,           // ~$40/hr × 2,000 hrs (user confirmed: high month on stub)
  k401Rate: 20,             // 20% of gross to 401k (from pay stub: $768/$3,840)
  k401ReductionAge: 32,     // age to start $1K/mo from Robinhood → ventures fund
  k401ReductionAmount: 12000, // $1K/mo = $12K/yr from Robinhood to ventures
  employerPayrollTaxRate: 8.5, // SS 6.2% + Medicare 1.45% + FUTA/SUI/WA ~0.85%

  // Tax withholding (from pay stub actuals)
  federalTaxRate: 5,        // federal income tax on W2 (after 401k deduction)
  ficaRate: 7.65,           // SS 6.2% + Medicare 1.45% (employee side)
  stateTaxRate: 0.58,       // WA LTCI only (no state income tax in WA; will change with move)
  personalTaxRate: 13.25,   // total tax as % of gross (from stub: $509/$3,840)

  // ═══════════════════════════════════════════════════════════════
  // NT REVENUE → S-CORP FLOW (pass-through)
  // Total NT revenue - W2 gross - employer payroll taxes = S-Corp distributions
  // Distributions taxed at personal rate, then flow to Robinhood
  // ═══════════════════════════════════════════════════════════════
  ntTotalRevenue: 287000,   // total NimbusTech consulting revenue/yr ($207K base + $80K additional work secured Apr 2026)
  ntAdditionalWork: 80000,  // $80K/yr additional work (secured, starts Apr 13 2026, indefinite)
  ntAdditionalWorkStartMonth: 4, // April 2026
  distributionTaxRate: 24,  // federal + state on S-Corp distributions (pass-through)

  // ═══════════════════════════════════════════════════════════════
  // S-CORP DEDUCTIBLE EXPENSES (reduce taxable distributions)
  // These are owner benefits as >2% shareholder — NOT employee perks
  // ═══════════════════════════════════════════════════════════════
  scorpHealthInsurance: 10000,    // S-Corp pays owner health/dental/vision premiums ($830/mo)
  scorpHomeOffice: 8000,          // Home office deduction (% of mortgage, utilities, insurance, repairs)
  scorpVehicle: 5000,             // Business-use vehicle (gas, insurance, maintenance, depreciation)
  scorpTravel: 8000,              // Business travel (Nigeria ops hub oversight, clients, conferences)
  scorpEquipment: 5000,           // Section 179 equipment (computers, tools, software)
  scorpWellness: 2000,            // Wellness program (home gym equipment, ergonomic gear)
  scorpPhoneInternet: 2400,       // Business-use phone + internet (80% of costs)
  // Total deductible: ~$40,400/yr — reduces taxable distributions by this amount
  // Tax savings: ~$40,400 × 24% = ~$9,700/yr

  // ═══════════════════════════════════════════════════════════════
  // SOLO 401(k) — upgraded from standard 401k at age 33
  // Employee contribution ($23K) + Employer match (25% of W2 = $20K) = $43K/yr
  // ═══════════════════════════════════════════════════════════════
  solo401kStartAge: 33,           // upgrade to Solo 401(k) at 33
  solo401kEmployeeMax: 23000,     // 2026 employee contribution limit
  solo401kEmployerMatchPct: 25,   // employer can contribute 25% of W2 ($80K × 25% = $20K)

  // ═══════════════════════════════════════════════════════════════
  // RETURNS & APPRECIATION
  // ═══════════════════════════════════════════════════════════════
  k401Return: 8,            // 401k in standard index funds
  robinhoodReturn: 25,      // individual brokerage — aggressive fund strategy (ages 31-34)
  robinhoodReturnPost35: 25, // same strategy continues (no shift)
  marginPct: 0,             // 0% — 25% return already accounts for leveraged strategy
  marginRateLow: 5,         // margin interest rate below $500K
  marginRateHigh: 4.5,      // margin interest rate at $500K+
  iraReturn: 25,            // Robinhood IRA — same fund strategy, no new contributions
  venturesReturn: 12,       // ventures invested cash return (10-15% avg, index/ETF style)
  venturesCreditRate: 9,    // business line of credit rate for ventures operations
  // V1 Staffing: ops hub handles admin — no dedicated US staff for NimbusTech
  // (US hires are on V2 agro/homestead side, see v2 staffing below)
  qozReturn: 6,             // QOZ fund — land appreciation + modest development (tax-free after 10yr)
  qozInvestAge: 42,         // age to roll Robinhood gains into QOZ fund
  qozInvestAmount: 600000,  // ~100 acres at $6K/acre via QOZ
  qozTaxFreeAge: 52,        // 10yr hold = all new gains tax-free

  // ═══════════════════════════════════════════════════════════════
  // NONPROFIT — 501(c)(3) entity, tax-exempt investment gains
  // Funded by RH pulls, invests reserves at 12%, uses credit for ops
  // ═══════════════════════════════════════════════════════════════
  nonprofitStartAge: 31,        // launch nonprofit at 31
  nonprofitRhPullPct: 5,        // 5% of RH gains → nonprofit seed funding

  // 501(c)(3) program land: donate 2 acres from the personal homestead parcel
  // to the nonprofit for use as permaculture demo / fellowship / community
  // programming site. Tax-clean: FMV deduction on appreciated real property
  // donated to a public charity (capped at 30% AGI — IRC §170(b)(1)(C)).
  // Property-tax exempt in most states once filed for exempt use.
  npLandDonationAge: 32,        // donate 1 year after land purchase (clean basis)
  npLandDonationAcres: 2,       // 2 acres carved out for NP program use
  npLandDonationAgiCapPct: 30,  // IRS 30% AGI cap for appreciated-property gifts
  npLandDonationMarginalRate: 24, // approx marginal federal rate → deduction savings
  nonprofitInvestReturn: 12,    // tax-free investment return on reserves (10-15% avg)
  nonprofitOpsLossPct: 8,       // 8% annual ops cost (overhead beyond staff — funded via credit)
  // Nonprofit Staffing: Mom as volunteer ED → hired ED transition
  npMomStipendStart: 5000,      // $5K/yr stipend for mom as volunteer ED
  npMomStipendGrowth: 20,       // 20% annual raise on stipend
  npMomYears: 10,               // mom runs it for 10 years (age 35-44)
  npMomStartAge: 35,            // mom starts when nonprofit has programs running
  npHiredEDStartAge: 45,        // hired ED replaces mom at age 45
  npHiredEDStartPay: 30000,     // ~$30K part-time start (roughly where mom's stipend lands)
  npHiredEDRaise: 10,           // 10% annual raises
  nonprofitLocRate: 7,          // nonprofit LOC rate (CDFIs offer favorable terms)
  nonprofitDonationGrowth: 10,  // annual donation/grant income growth after year 1
  nonprofitInitialDonations: 5000, // modest initial donations year 1

  // Robinhood growth pulls (tax-strategic LTCG harvesting from age 33)
  rhPullStartAge: 33,       // start pulling from Robinhood growth
  rhPullPersonalPct: 5,     // 5% of Robinhood gains → personal ($1K/mo expenses need minimal pull)
  rhPullQozPct: 20,         // 20% of Robinhood gains → QOZ fund (ongoing contributions)
  rhPullQozStartAge: 31,    // QOZ contributions start at 31
  freeCashToQozPct: 66,     // 66% of positive free cash → QOZ fund
  homeAppreciation: 6,      // Seattle home appreciation
  landAppreciation: 4,      // rural land appreciation

  // ═══════════════════════════════════════════════════════════════
  // LAND (15+ acre homestead — Ayoola lives here, farms it)
  // Ventures staff + self/family/volunteer labor keep farm costs near zero
  // Farm income from selling produce/livestock starting at 35
  // ═══════════════════════════════════════════════════════════════
  landPurchasePrice: 750000, // total land purchase price (bigger foundation)
  landDownPaymentPct: 20,
  landMortgageRate: 7.5,
  landMortgageTerm: 30,
  landPurchase1Age: 31,     // buy land after Seattle sale proceeds
  landPurchase1Acres: 15,   // at least 15 acres
  landHousingCost: 12000,   // ~$1K/mo basic living costs on land
  landDevStartAge: 31,      // start developing home/infrastructure on land
  constructionLoanAmount: 500000, // single construction loan for home/infrastructure (bigger build)
  constructionLoanAge: 32,        // taken at age 32
  constructionLoanRate: 8.5,      // construction loan rate
  landDevValueMultiplier: 1.5,    // $1 spent on home dev adds ~$1.50 in property value
  farmIncomeStartAge: 35,         // farm produces sellable income by 35
  farmIncomeAnnual: 50000,        // $50K/yr from produce/livestock sales
  farmIncomeGrowth: 3,            // 3% annual growth in farm income
  // V2 Agro sub-venture income (equipment leasing, property mgmt, landscape consulting)
  v2AgroIncomeStartAge: 36,      // sub-ventures start generating at 36
  v2AgroIncomeBase: 25000,       // $25K/yr initial (modest — equipment rental, consulting gigs)
  v2AgroIncomeGrowth: 12,        // 12%/yr growth as business matures
  venturesLocAmount: 150000,      // single ventures business LOC (reduced from $200K)
  venturesLocAge: 32,             // taken at age 32
  debtPayoffAge: 60,              // pay off remaining debts via RH (LTCG) at 20yr maturity
  familyFundStartAge: 60,          // start deploying 401k to family legacy
  familyFundPct: 80,              // target: 80% of 401k → children & family future
  familyFundMaxAnnual: 200000,    // max annual draw capped at personal income level (~$200K)
  familyFundTaxRate: 30,          // ~30% blended ordinary income tax on 401k withdrawals

  // ═══════════════════════════════════════════════════════════════
  // OFFSHORE LAND — Belize/Costa Rica (cash purchase from RH)
  // ═══════════════════════════════════════════════════════════════
  offshorePurchaseAge: 33,
  offshorePurchasePrice: 300000,  // $300K cash, bigger parcel
  offshoreMaintenance: 20000,     // $20K/yr maintenance + improvements until 40
  offshoreMaintenanceReduced: 10000, // $10K/yr after 40
  offshoreMaintenanceDropAge: 40,
  offshoreAppreciation: 4,        // annual appreciation

  // ═══════════════════════════════════════════════════════════════
  // NIGERIA LAND (cash purchase from RH)
  // ═══════════════════════════════════════════════════════════════
  nigeriaPurchaseAge: 36,
  nigeriaPurchasePrice: 300000,   // $300K cash
  nigeriaMaintenance: 20000,      // $20K/yr maintenance + improvements
  nigeriaAppreciation: 5,         // annual appreciation

  // ═══════════════════════════════════════════════════════════════
  // CITY RENTAL PROPERTIES (age 40 — 1 premium unit at $1.5M, final scope)
  // OWNED BY V2 AGRO via a dedicated rental LLC (NOT by V1 NimbusTech S-Corp).
  // Single premium property keeps V2 cash flow healthy through the debt-service window.
  // ═══════════════════════════════════════════════════════════════
  rentalPurchaseAge: 40,
  rentalPurchasePrice: 1500000,    // 1 premium property at $1.5M
  rentalDownPayment: 375000,       // $375K down (25%) — sourced from V2 reserves + V1 loan shortfall
  rentalMortgageRate: 7.0,
  rentalMortgageTerm: 30,
  rentalPropertyAppreciation: 4,   // annual property appreciation
  rentalGrossRentYear1: 72000,     // ~$6K/mo premium Airbnb/LTR ($72K/yr gross)
  rentalOccupancy: 90,             // 90% occupancy (Airbnb + long-term mix)
  rentalExpenseRate: 30,           // 30% of gross for mgmt, maintenance, insurance, taxes
  rentalRentGrowth: 3,             // annual rent growth

  // ═══════════════════════════════════════════════════════════════
  // V1 WEBULL (S-Corp entity brokerage) — funded via LOC bridge strategy
  // $14K/mo retained + $25K May bonus = $39K cash. Draw $61K from LOC at 25% APR.
  // Fund $100K Webull immediately. LOC repaid in 5 months from $14K/mo retention.
  // Total LOC interest: ~$3,646. Webull earns ~$6,000 in same period. Net +$2,354.
  // ═══════════════════════════════════════════════════════════════
  v1WebullMinimum: 100000,         // $100K Webull entity account minimum
  v1RetainedPerMonth: 14000,       // $14K/mo retained above S-Corp operating expenses
  v1BonusMonth1: 25000,            // $25K one-time payment in May 2026
  v1LocBridge: 61000,              // $61K LOC draw to bridge to $100K immediately
  v1LocBridgeRate: 25,             // 25% APR on LOC bridge (no early payment penalty)
  v1LocRepayMonths: 5,             // LOC repaid in ~5 months from $14K/mo retention

  // ═══════════════════════════════════════════════════════════════
  // VENTURE 2 — agro/land entity, funded by distribution allocations
  // Pulls 15% of distributions, generates own income, secures LOC
  // ═══════════════════════════════════════════════════════════════
  venture2StartAge: 32,           // venture 2 starts at beginning of 32
  venture2RhPullPct: 15,          // 15% of RH leveraged gains → venture 2 seed (keeps V2 non-negative)
  venture2IncomeMatch: 1.0,       // own income matches RH contribution (1:1)
  venture2LocRate: 9,             // business LOC rate
  venture2LocTerm: 7,             // revolving LOC term (years) — reborrow continuously
  venture2GrowthRate: 8,          // venture 2 own income grows 8%/yr after first year
  venture2InvestReturn: 12,       // venture 2 invested cash return (10-15% avg)
  // V2 Seed: $100K Webull entity account at age 32
  // $30K diverted from V1 business income (capital contribution)
  // $10K gift from family (under $19K annual exclusion)
  // $10K interest-free loan from family (under $10K, no imputed interest)
  // $50K from V1 LOC at 9% (penalty-free, repaid in 6 months)
  v2SeedDiverted: 30000,          // capital contribution from business income
  v2SeedGift: 10000,              // family gift (no tax)
  v2SeedLoan: 10000,              // family loan (interest-free, <$10K rule)
  v2SeedLocAmount: 50000,         // from V1 LOC at 9%
  v2SeedLocRepayMonths: 6,        // pay back LOC portion in 6 months
  v2SeedTotal: 100000,            // total Webull deposit (meets $100K minimum)
  // V2 Staffing: 3 phased US hires — halved pay (leaner US footprint, Nigeria ops hub absorbs more)
  // Hire 1: Groundskeeper — starts age 35, $7.5K/yr stipend (part-time, 0.5 FTE), 5%/yr raises
  usHire1StartAge: 35,
  usHire1StartPay: 7500,
  usHire1Raise: 5,
  // Hire 2: House Manager — starts age 38, $7.5K/yr stipend (part-time, 0.5 FTE), 5%/yr raises
  usHire2StartAge: 38,
  usHire2StartPay: 7500,
  usHire2Raise: 5,
  // Hire 3: Ops Coordinator — starts age 42, $15K/yr (part-time, 0.5 FTE), 5%/yr raises
  usHire3StartAge: 42,
  usHire3StartPay: 15000,
  usHire3Raise: 5,

  // ═══════════════════════════════════════════════════════════════
  // NIGERIA OPS HUB — V2 subsidiary, centralized back-office for ALL entities
  // Handles: HR, Accounting, Taxes, Logistics, DevOps across all orgs
  // AI-assisted operations + minimal US CPA fee to officialize
  // ═══════════════════════════════════════════════════════════════
  opsHubStartAge: 33,            // ops hub launches at 33
  opsHubInitialStaff: 2,         // 2 employees from day 1
  opsHubGrowthInterval: 2,       // add 1 employee every 2 years (measured growth)
  opsHubMaxStaff: 8,             // cap hub at 8 (lean team + AI handles the rest)
  opsHubEmployeeCostBase: 5000,   // $5K/yr starting salary per Nigerian employee
  opsHubEmployeeRaise: 7,         // 7% annual raise per employee (competitive for Nigeria)
  opsHubCpaFee: 5000,            // $5K/yr minimal US CPA fee to officialize filings
  opsHubOverheadReduction: true,  // centralizing ops reduces overhead on V1 and nonprofit
  // Inter-company billing: ops hub bills each entity for services (tax-free between related entities)
  // V1 NimbusTech carries bulk (highest revenue, most complex compliance)
  opsHubBillV1Pct: 50,            // 50% of ops hub cost billed to V1 (S-Corp, consulting, Webull)
  opsHubBillV2Pct: 20,            // 20% of ops hub cost stays with V2 (farm ops, simpler books)
  opsHubBillNpPct: 30,            // 30% of ops hub cost billed to nonprofit
  // FUTURE EXPANSION: Family members can contribute capital to the ops hub to
  // employ additional Nigerians for work that benefits them directly. Contributors
  // participate in the fund structure and reap the same benefits (investment returns,
  // tax advantages, operational leverage) — effectively a family cooperative fund
  // operating through the V2 subsidiary. Model this when family contributions begin.

  // ═══════════════════════════════════════════════════════════════
  // HARD ASSETS — Locked storage for appreciation (gold, silver, metals,
  // antiques, premium building materials). Funded by RH pulls starting at 33.
  // "In storage" — not officially generating income (wink wink)
  // ═══════════════════════════════════════════════════════════════
  hardAssetsStartAge: 33,
  hardAssetsRhPullPct: 5,           // 5% of RH gains → hard asset purchases
  hardAssetsAppreciation: 7,        // 7% avg (gold ~8%, silver ~7%, antiques ~6%, materials ~5%)
  hardAssetsInsurancePct: 1,        // 1% of value/yr for storage + insurance
  hardAssetsStorageCost: 3000,      // $3K/yr base storage facility cost

  // ═══════════════════════════════════════════════════════════════
  // VENTURE 3 — Generational wealth vehicle (starts at 60)
  // Funded by 401k draws + contributions from mature V2, nonprofit
  // Consolidates and seasons the generational operation
  // ═══════════════════════════════════════════════════════════════
  venture3StartAge: 60,
  venture3k401SeedPct: 30,        // 30% of annual 401k family draws → V3 seed
  venture3V2ContribPct: 10,       // 10% of V2 balance contributed annually from 60
  venture3NpContribPct: 10,       // 10% of nonprofit balance contributed annually from 60
  venture3InvestReturn: 12,       // invested cash return
  venture3OpsLossPct: 5,          // 5% ops cost (lean — leverages existing V1/V2 infrastructure)
  venture3EmployeeCost: 50000,    // $50K per employee fully loaded

  // ═══════════════════════════════════════════════════════════════
  // SEATTLE SALE (50/50 co-owned with ex-wife) — selling in 2026
  // $1.3M sale - $960K mortgage - $100K sell/close fees - $10K fix-up = $230K net
  // Ayoola's 50% = $115K take-home → funds land down payment
  // ═══════════════════════════════════════════════════════════════
  seattleSaleAge: 31,           // sell Seattle during age 31 (2026)
  seattleNetProceeds: 115000,   // Ayoola's 50% after all costs ($230K / 2)
  // Legacy fields (kept for any remaining references)
  seattleCurrentValue: 1300000,
  seattleMortgageBalance: 960000,
  seattleSellerFeePct: 0,       // fees already baked into net proceeds
  seattleMortgageRate: 3.25,
  grossRentYear1: 0,
  mortgagePayment: 0,
  propertyTaxes: 0,
  insurance: 0,
  propertyManagement: 0,
  maintenanceRate: 0,
  vacancyRate: 0,
  rentGrowth: 0,
  seattlePrincipal: 0,
  ayoolaRentalContrib: 0,
  exWifeRentalContrib: 0,
  contribReductionPerYear: 0,

  // ═══════════════════════════════════════════════════════════════
  // PERSONAL EXPENSES (post-divorce, all-in including land housing)
  // ═══════════════════════════════════════════════════════════════
  livingExpenses: 12000,    // $1K/mo = $12K/yr personal expenses starting May 2026
  livingExpensesPriorMonthly: 4167, // ~$50K/yr ÷ 12 for Jan-Apr 2026 before drop
  // Note: Seattle rental contrib ($12K/yr) is SEPARATE — tracked in rental section
  // Note: 401k ($18.4K) and taxes ($12.2K) deducted before take-home, NOT here

  // Future expenses (deferred — will add back when funded)
  staffExpensesBase: 50000,
  staffExpensesMax: 100000,

  // ═══════════════════════════════════════════════════════════════
  // INCOME PHASES (NT S-Corp → W2 salary + distributions)
  // Phase 1-2: NT consulting at capacity
  // Phase 3+: transitioning to land business
  // ═══════════════════════════════════════════════════════════════
  // Phase 1 (31-35): NT at full capacity + additional work ($207K + $80K)
  phase1NTRevenue: 287000,

  // TEMPORARY TOGGLE: one-time $150K pre-tax NimbusTech revenue boost,
  // spanning halfway through age 31 → halfway through age 32 (1 calendar year).
  // Flows through the normal S-Corp pipeline so the residual is fully
  // apportioned to V1 Webull / investment allocations. No personal income bump.
  ntBoostEnabled: false,
  ntBoostAmount: 150000,

  // Phase 2 (36-37): Transition — NT winds down + additional work ($150K + $80K)
  phase2NTRevenue: 230000,

  // Phase 3 (38-39): Winding down NT + additional work ($80K + $80K)
  phase3NTRevenue: 160000,

  // Phase 4 (39-45): Building phase — land business growing
  phase4NTRevenue: 80000,
  phase4BusinessIncome: 0,       // starts at 0, grows $15K/yr

  // Phase 5 (46+): Coast mode — land business mature
  phase5NTRevenue: 80000,
  phase5BusinessIncome: 150000,
  phase5BusinessGrowth: 5000,

  // QOZ fund — replaces deferred 100-acre expansion
  // Roll Robinhood gains into QOZ at age 42, 501(c)(3) operates on land

  // ═══════════════════════════════════════════════════════════════
  // MILESTONE AGES
  // ═══════════════════════════════════════════════════════════════
  moveOutAge: 32,           // moves to land
  mortgagePaidAge: 64,
  retirementAge: 60,

  // ═══════════════════════════════════════════════════════════════
  // TAXES & WITHDRAWAL
  // ═══════════════════════════════════════════════════════════════
  safeWithdrawalRate: 4,
};

// Run the wealth simulation — returns array of yearly data objects
export function runSimulation(assumptions) {
  const years = [];
  let k401 = assumptions.k401Start;
  let ira = assumptions.iraStart;
  let robinhood = assumptions.robinhoodStart;
  let seattleEquity = assumptions.seattleEquityStart; // total equity (50% counted in NW)
  let acres = 0;
  let landEquity = 0;
  let landMortgage = 0;
  let homeBuild = 0; // cumulative home development spend
  let ccDebt = assumptions.ccDebtStart;
  let cash = assumptions.cashStart; // tracks actual cash reserves
  let qozFund = 0;
  let ventures = 0;
  let venturesLocDebt = 0;   // Outstanding ventures LOC principal (liability)
  let venture2 = 0;          // V1 NimbusTech Webull — only earns returns AFTER $100K funded
  let v1WebullAccum = 0;     // Cash sitting in S-Corp checking, earning 0%, waiting for $100K
  let v1WebullActive = false; // Flips true once accumulation hits $100K minimum
  let venture2Loc = 0;       // Venture 2 outstanding LOC balance
  let venture2OwnIncome = 0; // Venture 2 self-generated income (grows over time)
  let venture3 = 0;           // Venture 3 reserves
  let venture3Employees = 0;  // Estimated employees affordable
  let v1Employees = 0;        // Venture 1 headcount
  let v2Employees = 0;        // Venture 2 headcount
  let npEmployees = 0;        // Nonprofit headcount
  let opsHubEmployees = 0;    // Nigeria ops hub headcount
  let opsHubCost = 0;         // Annual ops hub cost
  let opsHubBillV1 = 0;       // Inter-company bill to V1
  let opsHubBillV2 = 0;       // Inter-company bill to V2 (retained)
  let opsHubBillNp = 0;       // Inter-company bill to nonprofit
  // US hire cost tracking (reset each year inside loop)
  let usHire1Cost = 0;
  let usHire2Cost = 0;
  let usHire3Cost = 0;
  let npMomCost = 0;
  let npEDCost = 0;
  let nonprofit = 0;          // Nonprofit reserves (invested)
  let npAcres = 0;            // Nonprofit-owned program land (acres, separate from personal)
  let npLandValue = 0;        // Nonprofit-owned land FMV (appreciates at same rate as personal)
  let nonprofitLoc = 0;       // Nonprofit LOC balance
  let nonprofitDonations = 0; // Annual donation/grant income (grows over time)
  let offshoreEquity = 0;    // Belize/Costa Rica land equity
  let nigeriaEquity = 0;     // Nigeria land equity
  let hardAssets = 0;         // Hard assets value (gold, silver, metals, antiques, materials)
  let rentalEquity = 0;      // City rental properties equity
  let rentalMortgage = 0;    // City rental mortgage balance

  for (let age = assumptions.currentAge; age <= 60; age++) {
    // ═══════════════════════════════════════════════════════════
    // STEP 1: DETERMINE NT REVENUE FOR THIS YEAR (phase-based)
    // ═══════════════════════════════════════════════════════════
    let ntRevenue = 0;
    let businessIncome = 0;
    let staffExpenses = 0;

    if (age <= 35) {
      ntRevenue = assumptions.phase1NTRevenue;
    } else if (age <= 37) {
      ntRevenue = assumptions.phase2NTRevenue;
    } else if (age <= 39) {
      ntRevenue = assumptions.phase3NTRevenue; // $80K — last year of work is 39
    } else {
      // Age 40+: fully off consulting — RH funds make up the difference
      ntRevenue = 0;
      businessIncome = age <= 45
        ? Math.max(0, (age - 39) * 15000) + assumptions.phase4BusinessIncome
        : assumptions.phase5BusinessIncome + (age - 46) * assumptions.phase5BusinessGrowth;
      staffExpenses = age <= 40 ? 35000 : Math.min(35000 + (age - 40) * 10000, assumptions.staffExpensesMax);
    }

    // First year proration: starting Apr 8, 2026 — ~8.7 months remaining
    // All income/expenses for age 31 prorated to 8.7/12 of annual amounts
    const firstYearFraction = 8.7 / 12; // Apr 8 to Dec 31 ≈ 8.7 months
    if (age === assumptions.currentAge) {
      ntRevenue = ntRevenue * firstYearFraction;
    }

    // TEMPORARY BOOST: one-time $150K pre-tax revenue, split across the
    // halfway-31 → halfway-32 window. Applied AFTER the first-year proration
    // so the boost itself isn't cut to 8.7/12. Flows through normal S-Corp
    // taxes → distributions → V1 Webull residual (investment apportionments).
    let ntBoost = 0;
    if (assumptions.ntBoostEnabled) {
      if (age === 31) ntBoost = assumptions.ntBoostAmount * 0.5;
      if (age === 32) ntBoost = assumptions.ntBoostAmount * 0.5;
      ntRevenue += ntBoost;
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 2: SPLIT NT REVENUE → W2 + EMPLOYER COSTS + DEDUCTIONS + DISTRIBUTIONS
    // Revenue → W2 + payroll → S-Corp deductible expenses → taxable distributions
    // Deductions reduce the taxable base; remainder invested in S-Corp Webull
    // ═══════════════════════════════════════════════════════════
    const w2Gross = age >= 40 ? 0 : Math.min(assumptions.w2Gross, ntRevenue); // W2 stops at 40 (last year 39)
    const employerPayrollTax = w2Gross * (assumptions.employerPayrollTaxRate / 100);
    const ntOverhead = w2Gross + employerPayrollTax;

    // S-Corp deductible expenses: reduce taxable distributions (owner benefits, not employee perks)
    const yearFraction = age === assumptions.currentAge ? firstYearFraction : 1;
    const scorpDeductions = ntRevenue > 0 ? (
      assumptions.scorpHealthInsurance +
      assumptions.scorpHomeOffice +
      assumptions.scorpVehicle +
      assumptions.scorpTravel +
      assumptions.scorpEquipment +
      assumptions.scorpWellness +
      assumptions.scorpPhoneInternet
    ) * yearFraction : 0;

    // Solo 401(k) employer contribution (25% of W2, starts at 33)
    const solo401kEmployerContrib = (age >= assumptions.solo401kStartAge && w2Gross > 0)
      ? w2Gross * (assumptions.solo401kEmployerMatchPct / 100) // 25% of $80K = $20K
      : 0;

    const grossDistributions = Math.max(0, ntRevenue - ntOverhead - scorpDeductions - solo401kEmployerContrib);
    const distributionTax = grossDistributions * (assumptions.distributionTaxRate / 100);
    const netDistributions = grossDistributions - distributionTax; // after-tax → mostly to S-Corp Webull, minimal to personal RH

    // ═══════════════════════════════════════════════════════════
    // STEP 3: W2 → 401k + TAXES + TAKE-HOME (closed loop)
    // ═══════════════════════════════════════════════════════════
    // Solo 401(k) at 33+: employee max ($23K) + employer match ($20K) = $43K/yr
    // Before 33: standard 401(k) at 20% of W2 = $16K/yr
    let k401Contrib = 0;
    if (age <= 45 && w2Gross > 0) {
      if (age >= assumptions.solo401kStartAge) {
        k401Contrib = Math.min(assumptions.solo401kEmployeeMax, w2Gross); // $23K employee max
      } else {
        k401Contrib = w2Gross * (assumptions.k401Rate / 100); // 20% = $16K
      }
    }
    // Employer match goes directly to 401k (already deducted from revenue above)
    const total401kContrib = k401Contrib + solo401kEmployerContrib; // employee + employer
    const taxableW2 = w2Gross - k401Contrib; // employee 401k is pre-tax
    const personalTaxes = w2Gross * (assumptions.personalTaxRate / 100);
    const takeHome = w2Gross - k401Contrib - personalTaxes;

    // ═══════════════════════════════════════════════════════════
    // STEP 4: PERSONAL CASH FLOW (take-home vs expenses)
    // ═══════════════════════════════════════════════════════════
    // Personal expenses: $1K/mo = $12K/yr
    // First year: Apr 8 to Dec 31 ≈ 8.7 months at $1K/mo
    let expenses = assumptions.livingExpenses; // $12K/yr
    if (age === assumptions.currentAge) {
      expenses = 1000 * 8.7; // $8,700 (Apr 8 to Dec 31)
    }

    // Seattle rental contribution (separate from living expenses)
    let rentalNet = 0;
    let ayoolaRentalShare = 0;
    let ayoolaContrib = 0;

    // Seattle rental — only applies before sale
    if (age >= 32 && age < assumptions.seattleSaleAge) {
      const rentYears = age - 32;
      const grossRent = assumptions.grossRentYear1 * Math.pow(1 + assumptions.rentGrowth / 100, rentYears);
      const mortgage = age < assumptions.mortgagePaidAge ? assumptions.mortgagePayment : 0;
      const maintenance = grossRent * (assumptions.maintenanceRate / 100);
      const vacancy = grossRent * (assumptions.vacancyRate / 100);
      const management = assumptions.propertyManagement;
      const propTaxes = assumptions.propertyTaxes;
      const ins = assumptions.insurance;
      const totalCosts = mortgage + maintenance + vacancy + management + propTaxes + ins;

      ayoolaContrib = Math.max(0, assumptions.ayoolaRentalContrib - (rentYears * assumptions.contribReductionPerYear));
      const exWifeContrib = Math.max(0, assumptions.exWifeRentalContrib - (rentYears * assumptions.contribReductionPerYear));
      const totalContribs = ayoolaContrib + exWifeContrib;

      rentalNet = grossRent + totalContribs - totalCosts;

      if (rentalNet > 0) {
        ayoolaRentalShare = rentalNet * 0.5;
      } else {
        ayoolaRentalShare = -ayoolaContrib;
      }
    }
    // After sale: no rental income/costs (ayoolaRentalShare stays 0)

    // Land mortgage payment (amortized P&I) — only on original purchase loan
    // Construction debt is SEPARATE: interest-only, paid off at 20yr maturity from RH
    let landMortgagePayment = 0;
    let landPrincipalPaid = 0;
    if (landMortgage > 0) {
      const r = (assumptions.landMortgageRate / 100) / 12;
      const n = assumptions.landMortgageTerm * 12;
      const origLoan = assumptions.landPurchasePrice * (1 - assumptions.landDownPaymentPct / 100);
      const monthlyPayment = origLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      landMortgagePayment = monthlyPayment * 12; // annual P&I on original purchase only
      // Interest only on the original purchase portion (not construction debt)
      const origBalance = Math.min(landMortgage, origLoan); // can't exceed original loan
      const landInterest = origBalance * (assumptions.landMortgageRate / 100);
      landPrincipalPaid = Math.max(0, Math.min(origBalance, landMortgagePayment - landInterest));
    }

    // Farm income (calculated early for tax purposes)
    let farmIncomeForTax = 0;
    if (age >= assumptions.farmIncomeStartAge && acres > 0) {
      const farmYears = age - assumptions.farmIncomeStartAge;
      farmIncomeForTax = assumptions.farmIncomeAnnual * Math.pow(1 + assumptions.farmIncomeGrowth / 100, farmYears);
    }

    // Business income taxes (on rental share + farm income)
    const additionalTaxableIncome = Math.max(0, ayoolaRentalShare) + farmIncomeForTax;
    const additionalTaxes = additionalTaxableIncome * 0.15; // ~15% effective on additional income

    // Interest-only payments on credit lines
    const venturesDebtBal = Math.abs(Math.min(0, ventures));
    const venturesInterestPayment = venturesDebtBal * (assumptions.venturesCreditRate / 100);
    // Construction loan interest — $500K interest-only til payoff at 20yr
    // Split 50/50: V2 agro (farm business use) + personal (homestead residence)
    const hasConstructionDebt = age >= assumptions.constructionLoanAge && age < assumptions.constructionLoanAge + 20;
    const constructionDebt = hasConstructionDebt ? assumptions.constructionLoanAmount : 0;
    const constructionInterest = constructionDebt * (assumptions.constructionLoanRate / 100);
    const constructionInterestV2 = constructionInterest * 0.5; // farm/business portion
    const constructionInterestPersonal = constructionInterest * 0.5; // residence portion
    if (constructionInterestV2 > 0) {
      ventures -= constructionInterestV2;
    }

    // Offshore + Nigeria maintenance costs — paid by V2 agro entity (property management sub-venture)
    let offshoreMaint = 0;
    if (age >= assumptions.offshorePurchaseAge) {
      offshoreMaint = age < assumptions.offshoreMaintenanceDropAge
        ? assumptions.offshoreMaintenance
        : assumptions.offshoreMaintenanceReduced;
      ventures -= offshoreMaint; // V2 agro covers offshore land maintenance
    }
    let nigeriaMaint = 0;
    if (age >= assumptions.nigeriaPurchaseAge) {
      nigeriaMaint = assumptions.nigeriaMaintenance;
      ventures -= nigeriaMaint; // V2 agro covers Nigeria land maintenance
    }

    // City rental properties: OWNED BY V2 AGRO (rental LLC owned by V2).
    // Net income flows into V2 Agro balance (`ventures` sim var), not V1 or personal.
    let rentalNetIncome = 0;
    let rentalMortgagePayment = 0;
    if (age >= assumptions.rentalPurchaseAge && (rentalEquity > 0 || rentalMortgage > 0)) {
      const yearsOwned = age - assumptions.rentalPurchaseAge;
      const grossRent = assumptions.rentalGrossRentYear1 * Math.pow(1 + assumptions.rentalRentGrowth / 100, yearsOwned);
      const effectiveRent = grossRent * (assumptions.rentalOccupancy / 100);
      const opExpenses = grossRent * (assumptions.rentalExpenseRate / 100);
      if (rentalMortgage > 0) {
        const rr = (assumptions.rentalMortgageRate / 100) / 12;
        const rn = assumptions.rentalMortgageTerm * 12;
        const rLoan = assumptions.rentalPurchasePrice - assumptions.rentalDownPayment;
        rentalMortgagePayment = rLoan * (rr * Math.pow(1 + rr, rn)) / (Math.pow(1 + rr, rn) - 1) * 12;
      }
      rentalNetIncome = effectiveRent - opExpenses - rentalMortgagePayment;
    }

    // Total personal outflows
    // Rental income goes to Venture 2 now, not personal
    // Hard assets storage/insurance (calculated early for cash flow, value updated later)
    const hardAssetsMaintEst = age >= assumptions.hardAssetsStartAge
      ? assumptions.hardAssetsStorageCost + hardAssets * (assumptions.hardAssetsInsurancePct / 100)
      : 0;
    // Personal expenses: living + taxes + construction interest (personal 50%) + hard assets storage
    // Offshore/Nigeria maintenance now paid by V2 agro entity (property management)
    const totalPersonalOut = expenses + additionalTaxes + constructionInterestPersonal + hardAssetsMaintEst;

    // ═══════════════════════════════════════════════════════════
    // AFTER-TAX DISTRIBUTION ALLOCATIONS
    // Net distributions split: S-Corp Webull (primary), then smaller %s to other vehicles
    // Personal Robinhood gets minimal new money — it compounds on its own
    // ═══════════════════════════════════════════════════════════
    let distroToPersonal = 0;    // → personal expenses / RH
    let distroToQoz = 0;         // → QOZ fund
    let distroToV2 = 0;          // → V2 (agro/land entity) — was venture2RhPullPct
    let distroToNonprofit = 0;   // → nonprofit (tax-deductible donation)
    let distroToHardAssets = 0;  // → hard assets
    let distroToV1Webull = 0;    // → S-Corp Webull (V1 NimbusTech) — the PRIMARY vehicle
    let rhPullFreeCash = 0;      // legacy: covers personal shortfalls post-40

    if (netDistributions > 0) {
      if (age >= assumptions.rhPullStartAge) {
        distroToPersonal = netDistributions * (assumptions.rhPullPersonalPct / 100);
      }
      if (age >= assumptions.rhPullQozStartAge) {
        distroToQoz = netDistributions * (assumptions.rhPullQozPct / 100);
      }
      if (age >= assumptions.venture2StartAge) {
        distroToV2 = netDistributions * (assumptions.venture2RhPullPct / 100);
      }
      if (age >= assumptions.nonprofitStartAge) {
        distroToNonprofit = netDistributions * (assumptions.nonprofitRhPullPct / 100);
      }
      if (age >= assumptions.hardAssetsStartAge) {
        distroToHardAssets = netDistributions * (assumptions.hardAssetsRhPullPct / 100);
      }
      // Everything NOT allocated above → retained in S-Corp for V1 Webull
      const totalAllocated = distroToPersonal + distroToQoz + distroToV2 + distroToNonprofit + distroToHardAssets;
      const residual = Math.max(0, netDistributions - totalAllocated);

      if (v1WebullActive) {
        // Webull funded — residual goes straight to V1 Webull (earns returns)
        distroToV1Webull = residual;
      } else {
        // LOC BRIDGE STRATEGY: Fund V1 Webull immediately using $39K cash + $61K LOC
        // $14K/mo retained + $25K bonus = $39K. LOC bridges the remaining $61K.
        // LOC repaid in 5 months from $14K/mo. Interest cost ~$3,646 (< Webull returns of $6K)
        v1WebullActive = true;
        const cashOnHand = assumptions.v1RetainedPerMonth + assumptions.v1BonusMonth1; // $39K
        const locBridge = assumptions.v1LocBridge; // $61K
        distroToV1Webull = cashOnHand + locBridge; // $100K → Webull funded day 1
        // LOC interest cost absorbed in first year (net of Webull returns = +$2,354)
        const locInterestCost = Math.round(locBridge * (assumptions.v1LocBridgeRate / 100) * (assumptions.v1LocRepayMonths / 12));
        distroToV1Webull -= locInterestCost; // net of LOC interest
        // Remaining residual from distributions also flows to V1 Webull
        distroToV1Webull += residual;
      }
    }

    // After work stops at 40: V2 agro pays Ayoola a salary (he runs the business)
    // Plus RH covers any remaining shortfall from growth
    let v2SalaryToPersonal = 0;
    if (age >= 40 && ventures > 0) {
      // V2 pays a salary to cover personal expenses (capped at what V2 can afford: 15% of balance)
      v2SalaryToPersonal = Math.min(totalPersonalOut, ventures * 0.15);
      ventures -= v2SalaryToPersonal;
    }
    if (age >= 40 && robinhood > 0) {
      const rhReturnRate = age >= 35 ? assumptions.robinhoodReturnPost35 : assumptions.robinhoodReturn;
      const leveragedBase = robinhood * (1 + assumptions.marginPct / 100);
      const rhGrowth = leveragedBase * (rhReturnRate / 100);
      // RH covers remaining expense shortfall after V2 salary
      const remainingNeed = Math.max(0, totalPersonalOut - v2SalaryToPersonal);
      rhPullFreeCash = Math.min(remainingNeed, rhGrowth * 0.7);
    }
    // Age 32 deficit cover from RH gains
    if (age === 32 && robinhood > 0) {
      const leveragedBase = robinhood * (1 + assumptions.marginPct / 100);
      const rhGrowth = leveragedBase * ((age >= 35 ? assumptions.robinhoodReturnPost35 : assumptions.robinhoodReturn) / 100);
      rhPullFreeCash = rhGrowth * 0.15;
    }

    // Backward-compatible variable names for existing code references
    const rhPullPersonal = distroToPersonal;
    const rhPullQoz = distroToQoz;
    const rhPullVenture2 = distroToV2;
    const rhPullNonprofit = distroToNonprofit;
    const rhPullHardAssets = distroToHardAssets;

    // LTCG tax only on personal RH pulls + QOZ + hard assets (nonprofit is charitable deduction)
    const rhPullTax = rhPullFreeCash * 0.15; // only taxed when actually pulling FROM Robinhood

    // ═══════════════════════════════════════════════════════════
    // TOTAL TAX BURDEN (all sources)
    // ═══════════════════════════════════════════════════════════
    const totalTax = personalTaxes + distributionTax + additionalTaxes + rhPullTax + employerPayrollTax;
    const totalGrossIncome = w2Gross + grossDistributions + Math.max(0, ayoolaRentalShare) + rhPullPersonal + rhPullQoz + rhPullVenture2 + rhPullHardAssets + rhPullFreeCash + rhPullNonprofit + farmIncomeForTax;
    const effectiveTaxRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;

    // Farm income: land produces $50K/yr starting at 35 (ventures staff + self/family/volunteer labor)
    // Farm income flows to V2 agro entity (not personal) — it's the agro business's revenue
    let farmIncome = 0;
    if (age >= assumptions.farmIncomeStartAge && acres > 0) {
      const farmYears = age - assumptions.farmIncomeStartAge;
      farmIncome = assumptions.farmIncomeAnnual * Math.pow(1 + assumptions.farmIncomeGrowth / 100, farmYears);
      ventures += farmIncome; // V2 agro entity receives farm revenue
    }
    // V2 Agro sub-venture income: equipment leasing, property management, landscape consulting
    let v2AgroIncome = 0;
    if (age >= assumptions.v2AgroIncomeStartAge) {
      const agroYears = age - assumptions.v2AgroIncomeStartAge;
      v2AgroIncome = assumptions.v2AgroIncomeBase * Math.pow(1 + assumptions.v2AgroIncomeGrowth / 100, agroYears);
      ventures += v2AgroIncome;
    }

    // Total personal inflows: W2 take-home + V2 salary (post-40) + RH pulls
    // Farm income goes to V2 agro; V2 pays Ayoola a salary for running the business
    const totalPersonalIn = takeHome + Math.max(0, ayoolaRentalShare) + rhPullPersonal + rhPullFreeCash + v2SalaryToPersonal;

    // ═══════════════════════════════════════════════════════════
    // CREDIT CARD STRATEGY: keep money in RH, use CC for shortfalls
    // Pay off majority of balance each month; carry small balance at ~20% APR
    // Cheaper than 15% LTCG tax on RH pulls since carried balance is small
    // ═══════════════════════════════════════════════════════════
    const grossFreeCash = totalPersonalIn - totalPersonalOut;
    let freeCashToRobinhood = 0;
    const freeCashToQoz = 0;
    let freeCash = 0;

    // CC interest on carried balance from last year
    const ccInterest = ccDebt * (assumptions.ccInterestRate / 100);
    ccDebt += ccInterest; // interest accrues

    if (grossFreeCash >= 0) {
      // Surplus: pay down CC debt first, remainder → Robinhood
      const ccPaydown = Math.min(ccDebt, grossFreeCash);
      ccDebt -= ccPaydown;
      freeCashToRobinhood = grossFreeCash - ccPaydown;
      freeCash = 0; // no idle cash — everything deployed
    } else {
      // Deficit: goes on credit cards instead of pulling from RH
      ccDebt += Math.abs(grossFreeCash);
      freeCash = 0;
    }

    // Track cumulative cash position (stays near 0 — CC covers shortfalls)
    cash = 0; // no idle cash by design

    // ═══════════════════════════════════════════════════════════
    // STEP 5: INVESTMENT GROWTH (returns compound on existing balances)
    // ═══════════════════════════════════════════════════════════

    // 401k: pre-tax growth, employee + employer contributions
    // Solo 401(k) at 33+: $23K employee + $20K employer = $43K/yr tax-deferred
    k401 = k401 * (1 + assumptions.k401Return / 100) + total401kContrib;

    // 401k loan: DISABLED — user prefers borrowing bank funds at moderate interest
    // rates rather than pulling cash from investments (gains > interest costs)
    let k401LoanDeploy = 0;

    // IRA: grows on existing balance, no new contributions
    ira = ira * (1 + assumptions.iraReturn / 100);

    // Robinhood: grows on equity + margin leverage, minus margin interest + 401k loan deployment
    const rhReturn = age >= 35 ? assumptions.robinhoodReturnPost35 : assumptions.robinhoodReturn;
    const rhBase = Math.max(0, robinhood); // no margin/growth on negative balance
    const marginBalance = rhBase * (assumptions.marginPct / 100);
    const marginRate = marginBalance >= 500000 ? assumptions.marginRateHigh : assumptions.marginRateLow;
    const marginInterest = marginBalance * (marginRate / 100);
    const totalInvested = rhBase + marginBalance; // equity + borrowed
    const grossGrowth = totalInvested * (rhReturn / 100);
    // Robinhood: personal brokerage grows on its own, gets minimal new inflows
    // Distributions now go to S-Corp Webull (V1), not personal RH
    robinhood = robinhood + grossGrowth - marginInterest - rhPullFreeCash + freeCashToRobinhood + distroToPersonal;

    // V1 Webull: add distribution residual to V1 NimbusTech account
    // This runs OUTSIDE the venture2StartAge gate — V1 Webull funds from age 31 via LOC bridge
    venture2 += distroToV1Webull;

    // Construction loan: $500K single draw at age 32, builds 1.5x equity on land
    let landDevCost = 0;
    if (age === assumptions.constructionLoanAge && acres > 0) {
      landDevCost = assumptions.constructionLoanAmount;
      homeBuild += landDevCost;
      landMortgage += landDevCost; // construction loan — added to land debt
    }

    // Ventures LOC: $200K single draw at age 32
    let venturesLoanDraw = 0;
    if (age === assumptions.venturesLocAge) {
      venturesLoanDraw = assumptions.venturesLocAmount;
      venturesLocDebt += venturesLoanDraw; // track as liability
    }
    // Ventures: staff costs + overhead funded via LOC, cash stays invested
    // Investment gains offset staff/ops costs; profits pay down LOC
    // V1 (sim: ventures = V2 Agro on display) Staffing: 3 phased US hires
    usHire1Cost = 0; usHire2Cost = 0; usHire3Cost = 0;
    v1Employees = 0;
    if (age >= assumptions.usHire1StartAge) {
      const h1Years = age - assumptions.usHire1StartAge;
      usHire1Cost = assumptions.usHire1StartPay * Math.pow(1 + assumptions.usHire1Raise / 100, h1Years);
      v1Employees += 0.5; // part-time
    }
    if (age >= assumptions.usHire2StartAge) {
      const h2Years = age - assumptions.usHire2StartAge;
      usHire2Cost = assumptions.usHire2StartPay * Math.pow(1 + assumptions.usHire2Raise / 100, h2Years);
      v1Employees += 0.5; // part-time
    }
    if (age >= assumptions.usHire3StartAge) {
      const h3Years = age - assumptions.usHire3StartAge;
      usHire3Cost = assumptions.usHire3StartPay * Math.pow(1 + assumptions.usHire3Raise / 100, h3Years);
      v1Employees += 0.5; // part-time (halved footprint)
    }
    const v1StaffCost = usHire1Cost + usHire2Cost + usHire3Cost;
    // Overhead reduced once ops hub is running (handles admin/accounting/HR centrally)
    const v1OverheadRate = age >= assumptions.opsHubStartAge ? 0.01 : 0.03; // 3% → 1% with ops hub
    const venturesOpsOverhead = Math.max(0, ventures) * v1OverheadRate;
    // V1's share of ops hub inter-company bill (tax-free between related entities)
    // V2 agro entity: pays its own ops hub bill (40%), not V1's bill
    const venturesOpsLoss = v1StaffCost + venturesOpsOverhead + opsHubBillV2;
    const venturesInvestGain = Math.max(0, ventures) * (assumptions.venturesReturn / 100); // 12% on invested cash
    const venturesNetGain = venturesInvestGain - venturesOpsLoss;
    // distroToV2 = 15% of after-tax distributions allocated to V2 agro entity
    ventures = ventures + venturesLoanDraw + venturesNetGain + distroToV2;
    // Investment profits pay down LOC when net positive
    if (venturesNetGain > 0 && venturesLocDebt > 0) {
      const locPaydown = Math.min(venturesLocDebt, venturesNetGain * 0.5); // 50% of net profit → LOC paydown
      venturesLocDebt -= locPaydown;
    }

    // ═══════════════════════════════════════════════════════════
    // VENTURE 2: Webull entity account seeded at 32
    // $100K: $30K diverted + $10K gift + $10K loan + $50K V1 LOC
    // LOC portion repaid in 6 months, family loan repaid over time
    // Then: RH pull (15%) → fund growth + LOC debt service
    // ═══════════════════════════════════════════════════════════
    let v2LocDraw = 0;
    let v2DebtService = 0;
    let v2SelfIncome = 0;
    if (age >= assumptions.venture2StartAge) {
      // V2 SEED at age 32: $100K into Webull entity account
      if (age === assumptions.venture2StartAge) {
        venture2 += assumptions.v2SeedTotal; // $100K deposited
        // $50K LOC portion: borrowed from V1 LOC at 9%, repaid in 6 months
        venture2Loc += assumptions.v2SeedLocAmount;
        const v2SeedLocInterest = assumptions.v2SeedLocAmount * (assumptions.venture2LocRate / 100) * (assumptions.v2SeedLocRepayMonths / 12);
        // Repay LOC + interest from V2 balance within the year
        venture2 -= (assumptions.v2SeedLocAmount + v2SeedLocInterest);
        venture2Loc -= assumptions.v2SeedLocAmount;
      }

      // RH pull covers debt service — size LOC draw so annual P&I = rhPullVenture2
      // Amortized P&I on revolving term: monthly = P * r(1+r)^n / ((1+r)^n - 1)
      const v2r = (assumptions.venture2LocRate / 100) / 12;
      const v2n = assumptions.venture2LocTerm * 12;
      const v2AnnuityFactor = (v2r * Math.pow(1 + v2r, v2n)) / (Math.pow(1 + v2r, v2n) - 1) * 12;

      // Max new LOC draw this year: sized so annual P&I = RH pull
      if (rhPullVenture2 > 0) {
        v2LocDraw = rhPullVenture2 / v2AnnuityFactor; // principal that RH pull can service
      }

      // Debt service on existing LOC balance (amortized over term)
      v2DebtService = venture2Loc * v2AnnuityFactor;
      // RH pull covers debt service; excess reduces LOC principal
      const v2RhCoverage = Math.min(rhPullVenture2, v2DebtService);
      const v2PrincipalPaydown = Math.max(0, v2RhCoverage - venture2Loc * (assumptions.venture2LocRate / 100));

      // Venture 2 self-generated income (matches RH contribution, grows over time)
      if (age === assumptions.venture2StartAge) {
        venture2OwnIncome = rhPullVenture2 * assumptions.venture2IncomeMatch;
      } else {
        venture2OwnIncome = venture2OwnIncome * (1 + assumptions.venture2GrowthRate / 100);
      }
      v2SelfIncome = venture2OwnIncome;

      // V2 (sim: venture2 = V1 NimbusTech on display) Staffing: no dedicated US staff — ops hub handles admin
      v2Employees = 0;
      const v2StaffCost = 0;

      // Nigeria Ops Hub (V2 subsidiary): centralized back-office for all entities
      // HR, Accounting, Taxes, Logistics, DevOps — AI-assisted + minimal US CPA
      // Costs split via inter-company billing (tax-free between related entities)
      if (age >= assumptions.opsHubStartAge) {
        const hubYears = age - assumptions.opsHubStartAge;
        opsHubEmployees = Math.min(
          assumptions.opsHubMaxStaff,
          assumptions.opsHubInitialStaff + Math.floor(hubYears / assumptions.opsHubGrowthInterval)
        );
      } else {
        opsHubEmployees = 0;
      }
      // Employee cost: $5K base with 10% annual raises
      const hubYearsForCost = age - assumptions.opsHubStartAge;
      const avgEmployeeCost = assumptions.opsHubEmployeeCostBase * Math.pow(1 + assumptions.opsHubEmployeeRaise / 100, hubYearsForCost);
      opsHubCost = opsHubEmployees > 0
        ? (opsHubEmployees * avgEmployeeCost) + assumptions.opsHubCpaFee
        : 0;
      // Inter-company billing: each entity pays its share (tax-free transfers)
      opsHubBillV1 = opsHubCost * (assumptions.opsHubBillV1Pct / 100);
      opsHubBillV2 = opsHubCost * (assumptions.opsHubBillV2Pct / 100);
      opsHubBillNp = opsHubCost * (assumptions.opsHubBillNpPct / 100);

      // Venture 2 invested cash returns (12% on equity, same strategy as RH)
      const v2InvestGain = Math.max(0, venture2) * (assumptions.venture2InvestReturn / 100);

      // Update V1 NimbusTech (sim: venture2): LOC + income + distros to Webull + gains - costs
      // V1 pays its own ops hub bill (30%), not V2's bill
      venture2Loc = Math.max(0, venture2Loc + v2LocDraw - v2PrincipalPaydown);
      // distroToV1Webull already added above (outside venture2StartAge gate)
      venture2 = venture2 + v2LocDraw + v2SelfIncome + v2InvestGain - v2StaffCost - opsHubBillV1;
      // Investment profits + self income pay down LOC
      if ((v2InvestGain + v2SelfIncome) > 0 && venture2Loc > 0) {
        const v2LocPaydown = Math.min(venture2Loc, (v2InvestGain + v2SelfIncome) * 0.5); // 50% of gains → LOC paydown
        venture2Loc -= v2LocPaydown;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // NONPROFIT — 501(c)(3): tax-exempt invested reserves
    // RH pull seeds it, donations/grants grow over time
    // Reserves invested at 12% (tax-free), LOC covers program ops
    // Investment gains + donations pay down LOC
    // ═══════════════════════════════════════════════════════════
    if (age >= assumptions.nonprofitStartAge) {
      // RH pull → nonprofit reserves (tax-deductible donation)
      nonprofit += rhPullNonprofit;

      // Donations/grants grow over time
      if (age === assumptions.nonprofitStartAge) {
        nonprofitDonations = assumptions.nonprofitInitialDonations;
      } else {
        nonprofitDonations = nonprofitDonations * (1 + assumptions.nonprofitDonationGrowth / 100);
      }
      nonprofit += nonprofitDonations;

      // Invested reserves earn 12% tax-free
      const npInvestGain = Math.max(0, nonprofit) * (assumptions.nonprofitInvestReturn / 100);

      // Nonprofit Staffing: Mom as volunteer ED (age 35-44) → Hired ED (age 45+)
      npMomCost = 0;
      npEDCost = 0;
      if (age >= assumptions.npMomStartAge && age < assumptions.npHiredEDStartAge) {
        // Mom phase: $5K stipend + 20%/yr growth
        const momYears = age - assumptions.npMomStartAge;
        npMomCost = assumptions.npMomStipendStart * Math.pow(1 + assumptions.npMomStipendGrowth / 100, momYears);
        npEmployees = 0.5; // part-time unit
      } else if (age >= assumptions.npHiredEDStartAge) {
        // Hired ED phase: ~$30K start + 10%/yr raises
        const edYears = age - assumptions.npHiredEDStartAge;
        npEDCost = assumptions.npHiredEDStartPay * Math.pow(1 + assumptions.npHiredEDRaise / 100, edYears);
        npEmployees = 0.5; // part-time unit
      } else {
        npEmployees = 0;
      }
      const npStaffCost = npMomCost + npEDCost;

      // Ops costs: staff + overhead funded via LOC (programs, admin)
      // Overhead reduced once ops hub handles admin/accounting centrally
      const npOverheadRate = age >= assumptions.opsHubStartAge
        ? assumptions.nonprofitOpsLossPct / 100 * 0.5  // halved with ops hub
        : assumptions.nonprofitOpsLossPct / 100;
      const npOverhead = Math.max(0, nonprofit) * npOverheadRate;
      // Nonprofit's share of ops hub inter-company bill (tax-free)
      const npOpsCost = npStaffCost + npOverhead + opsHubBillNp;
      nonprofitLoc += npOpsCost; // ops + ops hub bill go on credit
      const npLocInterest = nonprofitLoc * (assumptions.nonprofitLocRate / 100);
      nonprofitLoc += npLocInterest;

      // Investment gains + surplus donations pay down LOC
      const npNetGain = npInvestGain;
      nonprofit += npNetGain;
      if (npNetGain > 0 && nonprofitLoc > 0) {
        const npLocPaydown = Math.min(nonprofitLoc, npNetGain * 0.5); // 50% of gains → LOC paydown
        nonprofitLoc -= npLocPaydown;
      }
    }

    // Debt payoff at 52 (20yr from 32) — construction loan is personal homestead debt → paid from RH
    // Construction is interest-only, so payoff = original draw amount ($500K)
    if (age === assumptions.constructionLoanAge + 20) {
      const constructionPayoff = assumptions.constructionLoanAmount; // $500K — interest-only, no amortization
      if (constructionPayoff > 0 && landMortgage >= constructionPayoff) {
        robinhood -= constructionPayoff * 1.08; // principal + ~8% LTCG tax (personal account)
        landMortgage -= constructionPayoff;
        landEquity += constructionPayoff;
      }
    }
    // Ventures LOC payoff: split between V1 Webull and RH based on available balances
    if (age === assumptions.venturesLocAge + 20) {
      if (venturesLocDebt > 0) {
        const v1SharePayoff = Math.min(Math.max(0, venture2 * 0.5), venturesLocDebt);
        const rhSharePayoff = venturesLocDebt - v1SharePayoff;
        venture2 -= v1SharePayoff;
        robinhood -= rhSharePayoff * 1.08; // LTCG on personal portion
        venturesLocDebt = 0;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // FAMILY LEGACY: Deploy 401k to children & family starting at 60
    // Penalty-free after 59.5 — annual draws capped at personal income level
    // Spreads withdrawals across years to stay in reasonable tax brackets
    // ═══════════════════════════════════════════════════════════
    let familyFundDeploy = 0;
    if (age >= assumptions.familyFundStartAge && k401 > 0) {
      // Keep 20% of 401k for personal use, deploy rest over time
      const k401Reserve = k401 * (1 - assumptions.familyFundPct / 100);
      const available = Math.max(0, k401 - k401Reserve);
      const grossDraw = Math.min(available, assumptions.familyFundMaxAnnual);
      const tax = grossDraw * (assumptions.familyFundTaxRate / 100);
      familyFundDeploy = grossDraw - tax;
      k401 -= grossDraw;
    }

    // ═══════════════════════════════════════════════════════════
    // VENTURE 3: Generational wealth vehicle — starts at 60
    // Funded by 401k draws + contributions from mature V2, nonprofit
    // Invests at 12%, lean ops (5%), employs family/staff
    // ═══════════════════════════════════════════════════════════
    let v3Seed = 0;
    let v3V2Contrib = 0;
    let v3NpContrib = 0;
    if (age >= assumptions.venture3StartAge) {
      // Seed from 401k family legacy draws
      v3Seed = familyFundDeploy * (assumptions.venture3k401SeedPct / 100);
      // Contributions from mature V2 and nonprofit
      v3V2Contrib = Math.max(0, venture2) * (assumptions.venture3V2ContribPct / 100);
      v3NpContrib = Math.max(0, nonprofit) * (assumptions.venture3NpContribPct / 100);
      venture2 -= v3V2Contrib;
      nonprofit -= v3NpContrib;

      // V3 grows: seed + contributions + investment returns - ops
      const v3InvestGain = Math.max(0, venture3) * (assumptions.venture3InvestReturn / 100);
      const v3OpsCost = Math.max(0, venture3) * (assumptions.venture3OpsLossPct / 100);
      venture3 = venture3 + v3Seed + v3V2Contrib + v3NpContrib + v3InvestGain - v3OpsCost;
      venture3Employees = Math.floor(venture3 * 0.15 / assumptions.venture3EmployeeCost); // 15% of reserves → payroll budget
    }

    // ═══════════════════════════════════════════════════════════
    // HARD ASSETS: gold, silver, metals, antiques, building materials
    // Purchased from RH pulls, stored for appreciation
    // Insurance + storage costs deducted from personal (via CC strategy)
    // ═══════════════════════════════════════════════════════════
    let hardAssetsPurchase = 0;
    let hardAssetsAppreciationAmt = 0;
    let hardAssetsCosts = 0;
    if (age >= assumptions.hardAssetsStartAge) {
      hardAssetsPurchase = rhPullHardAssets;
      hardAssets += hardAssetsPurchase;
      // Appreciation on existing value
      hardAssetsAppreciationAmt = hardAssets * (assumptions.hardAssetsAppreciation / 100);
      hardAssets += hardAssetsAppreciationAmt;
      // Storage + insurance costs (paid from personal cash flow via CC)
      hardAssetsCosts = assumptions.hardAssetsStorageCost + hardAssets * (assumptions.hardAssetsInsurancePct / 100);
    }

    // QOZ Fund — ongoing contributions only (no lump sum), appreciation + RH pulls + free cash
    qozFund = qozFund * (1 + assumptions.qozReturn / 100) + rhPullQoz + freeCashToQoz;

    // ═══════════════════════════════════════════════════════════
    // STEP 6: REAL ESTATE EQUITY CHANGES
    // ═══════════════════════════════════════════════════════════

    // Seattle: SOLD — direct net proceeds model
    // $1.3M - $960K mortgage - $100K fees - $10K fixup = $230K net / 2 = $115K Ayoola's share
    let seattleProceeds = 0;
    if (age === assumptions.seattleSaleAge) {
      seattleProceeds = assumptions.seattleNetProceeds; // $115K — already net of all costs
      seattleEquity = 0; // property sold
    }

    // Land: appreciation + principal paydown + development adds equity
    if (landMortgage > 0 || landEquity > 0) {
      const totalLandValue = landEquity + landMortgage;
      const appreciatedValue = totalLandValue * (1 + assumptions.landAppreciation / 100);
      const appreciationGain = appreciatedValue - totalLandValue;
      landEquity += appreciationGain + landDevCost * (assumptions.landDevValueMultiplier - 1); // dev adds 0.5x NET value (1.5x gross - 1x debt on mortgage)

      if (landMortgage > 0) {
        landMortgage -= landPrincipalPaid;
        landEquity += landPrincipalPaid;
      }
    }

    // Land purchase: Seattle sale proceeds cover down payment, remainder → Robinhood
    if (age === assumptions.landPurchase1Age) {
      const purchasePrice = assumptions.landPurchasePrice;
      const downPayment = purchasePrice * (assumptions.landDownPaymentPct / 100);
      const fromSeattle = Math.min(seattleProceeds, downPayment);
      const fromRobinhood = Math.max(0, downPayment - fromSeattle);
      robinhood -= fromRobinhood;
      robinhood += Math.max(0, seattleProceeds - fromSeattle); // leftover proceeds → Robinhood
      landEquity += downPayment;
      landMortgage += purchasePrice - downPayment;
      acres += assumptions.landPurchase1Acres;
    }

    // 501(c)(3) land donation: carve 2 acres from personal homestead to NP for
    // charitable program use. Tax-clean FMV deduction on appreciated property,
    // capped at 30% AGI (§170(b)(1)(C)). Remaining deduction carries forward
    // but we model just year-1 benefit for simplicity.
    let npLandDonationFmv = 0;
    let npLandDonationTaxSavings = 0;
    if (age === assumptions.npLandDonationAge && acres > 0 && npAcres === 0) {
      const donateAcres = Math.min(assumptions.npLandDonationAcres, acres);
      const totalLandFmv = landEquity + landMortgage;
      const donatedShare = donateAcres / acres;
      npLandDonationFmv = totalLandFmv * donatedShare;

      // Move the acreage + equity share to the nonprofit (no mortgage encumbrance —
      // the donated parcel is carved out free-and-clear; any attached debt stays
      // with the personal parcel, as is standard practice).
      acres -= donateAcres;
      landEquity = Math.max(0, landEquity - npLandDonationFmv);
      npAcres += donateAcres;
      npLandValue += npLandDonationFmv;

      // Charitable deduction benefit: FMV * marginal rate, capped at 30% AGI.
      // Approximate AGI as W2 + net distributions + farm + rental.
      const approxAgi = Math.max(
        40000, // floor to avoid zero-AGI edge case
        w2Gross + netDistributions + farmIncomeForTax + Math.max(0, ayoolaRentalShare)
      );
      const deductibleThisYear = Math.min(
        npLandDonationFmv,
        approxAgi * (assumptions.npLandDonationAgiCapPct / 100)
      );
      npLandDonationTaxSavings = deductibleThisYear * (assumptions.npLandDonationMarginalRate / 100);
      // Tax savings arrive as a refund → credited to personal Robinhood
      robinhood += npLandDonationTaxSavings;
    }
    // NP land appreciates alongside personal land
    if (npLandValue > 0) {
      npLandValue = npLandValue * (1 + assumptions.landAppreciation / 100);
    }

    // Offshore (Belize/Costa Rica): cash purchase at 33 — split between V1 Webull (primary) and RH
    if (age === assumptions.offshorePurchaseAge) {
      // V1 Webull funds up to what it can afford; RH covers the rest
      const v1CanAfford = Math.max(0, venture2 * 0.4); // use up to 40% of V1 balance
      const fromV1 = Math.min(v1CanAfford, assumptions.offshorePurchasePrice);
      const fromRH = assumptions.offshorePurchasePrice - fromV1;
      venture2 -= fromV1;
      robinhood -= fromRH;
      offshoreEquity += assumptions.offshorePurchasePrice;
    }
    if (offshoreEquity > 0) {
      offshoreEquity = offshoreEquity * (1 + assumptions.offshoreAppreciation / 100);
    }

    // Nigeria: cash purchase at 36 — split between V1 Webull (primary) and RH
    if (age === assumptions.nigeriaPurchaseAge) {
      const v1CanAffordNg = Math.max(0, venture2 * 0.4); // use up to 40% of V1 balance
      const fromV1Ng = Math.min(v1CanAffordNg, assumptions.nigeriaPurchasePrice);
      const fromRHNg = assumptions.nigeriaPurchasePrice - fromV1Ng;
      venture2 -= fromV1Ng;
      robinhood -= fromRHNg;
      nigeriaEquity += assumptions.nigeriaPurchasePrice;
    }
    if (nigeriaEquity > 0) {
      nigeriaEquity = nigeriaEquity * (1 + assumptions.nigeriaAppreciation / 100);
    }

    // City rental property: OWNED BY V2 AGRO (moved out of V1 NimbusTech S-Corp
    // — S-Corps are a poor vehicle for rental real estate: no tax-free property
    // distributions, passive loss trapping, and liability co-mingling with the
    // operating S-Corp). Down payment sourced from V2 reserves first; any
    // shortfall is lent by V1 Webull at an arm's-length rate (modeled as a
    // transfer, with V2 servicing the note through rental cash flow).
    if (age === assumptions.rentalPurchaseAge) {
      const v2AvailForRental = Math.max(0, ventures * 0.6);
      const downFromV2 = Math.min(v2AvailForRental, assumptions.rentalDownPayment);
      const shortfall = assumptions.rentalDownPayment - downFromV2;
      const v1CanLend = Math.max(0, venture2 * 0.3); // V1 can lend up to 30% of its balance
      const loanFromV1 = Math.min(v1CanLend, shortfall);
      ventures -= downFromV2;
      venture2 -= loanFromV1;
      ventures += loanFromV1; // V1 → V2 note, V2 now holds cash for down payment
      const actualDown = downFromV2 + loanFromV1;
      rentalEquity += actualDown;
      rentalMortgage += assumptions.rentalPurchasePrice - actualDown;
    }
    // Rental net income flows into V2 Agro (rental LLC owned by V2)
    if (rentalNetIncome !== 0 && age >= assumptions.rentalPurchaseAge) {
      ventures += rentalNetIncome;
    }
    if (rentalEquity > 0 || rentalMortgage > 0) {
      const rTotal = rentalEquity + rentalMortgage;
      const rAppGain = rTotal * (assumptions.rentalPropertyAppreciation / 100);
      rentalEquity += rAppGain;
      // Principal paydown (amortized)
      if (rentalMortgage > 0) {
        const rr = (assumptions.rentalMortgageRate / 100) / 12;
        const rn = assumptions.rentalMortgageTerm * 12;
        const rLoan = assumptions.rentalPurchasePrice - assumptions.rentalDownPayment;
        const rMonthly = rLoan * (rr * Math.pow(1 + rr, rn)) / (Math.pow(1 + rr, rn) - 1);
        const rInterest = rentalMortgage * (assumptions.rentalMortgageRate / 100);
        const rPrincipal = Math.min(rentalMortgage, rMonthly * 12 - rInterest);
        rentalMortgage -= rPrincipal;
        rentalEquity += rPrincipal;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 7: NET WORTH (Ayoola's share only)
    // ═══════════════════════════════════════════════════════════
    // landEquity already = net equity (down payment + appreciation + principal paid)
    // landEquity + landMortgage = total property value, so don't subtract mortgage again
    const netWorth = k401 + ira + robinhood + (seattleEquity * 0.5) + landEquity + offshoreEquity + nigeriaEquity + rentalEquity + qozFund + (ventures - venturesLocDebt) + (venture2 - venture2Loc) + venture3 + (nonprofit - nonprofitLoc) + npLandValue + hardAssets - ccDebt;

    const safeWithdrawal = netWorth * (assumptions.safeWithdrawalRate / 100);
    const passiveIncome = Math.max(0, ayoolaRentalShare) + businessIncome + safeWithdrawal;

    years.push({
      age,
      year: 2026 + (age - assumptions.currentAge),
      k401: Math.round(k401),
      ira: Math.round(ira),
      robinhood: Math.round(robinhood),
      ccDebt: Math.round(ccDebt),
      seattleEquity: Math.round(seattleEquity),
      seattleEquity50: Math.round(seattleEquity * 0.5),
      homeBuild: Math.round(homeBuild),
      landEquity: Math.round(landEquity),
      offshoreEquity: Math.round(offshoreEquity),
      nigeriaEquity: Math.round(nigeriaEquity),
      rentalEquity: Math.round(rentalEquity),
      rentalNetIncome: Math.round(rentalNetIncome),
      totalLandEquity: Math.round(landEquity + offshoreEquity + nigeriaEquity + rentalEquity),
      landMortgage: Math.round(landMortgage),
      rentalMortgage: Math.round(rentalMortgage),
      landValue: Math.round(landEquity + landMortgage),
      acres,
      rentalNet: Math.round(rentalNet),
      ayoolaRentalShare: Math.round(ayoolaRentalShare),
      qozFund: Math.round(qozFund),
      ventures: Math.round(ventures),
      venture2: Math.round(venture2),
      venture2Loc: Math.round(venture2Loc),
      venture2SelfIncome: Math.round(v2SelfIncome),
      nonprofit: Math.round(nonprofit),
      nonprofitLoc: Math.round(nonprofitLoc),
      nonprofitNet: Math.round(nonprofit - nonprofitLoc),
      npAcres: Math.round(npAcres * 10) / 10,
      npLandValue: Math.round(npLandValue),
      npLandDonationFmv: Math.round(npLandDonationFmv),
      npLandDonationTaxSavings: Math.round(npLandDonationTaxSavings),
      venture3: Math.round(venture3),
      v1Employees,
      v2Employees,
      npEmployees,
      opsHubEmployees,
      usHire1Cost: Math.round(usHire1Cost),
      usHire2Cost: Math.round(usHire2Cost),
      usHire3Cost: Math.round(usHire3Cost),
      npMomCost: Math.round(npMomCost),
      npEDCost: Math.round(npEDCost),
      opsHubCost: Math.round(opsHubCost),
      opsHubCostPerEmployee: opsHubEmployees > 0 ? Math.round((opsHubCost - assumptions.opsHubCpaFee) / opsHubEmployees) : 0,
      opsHubBillV1: Math.round(opsHubBillV1),
      opsHubBillV2: Math.round(opsHubBillV2),
      opsHubBillNp: Math.round(opsHubBillNp),
      venture3Employees,
      v3Seed: Math.round(v3Seed),
      v3V2Contrib: Math.round(v3V2Contrib),
      v3NpContrib: Math.round(v3NpContrib),
      familyFundDeploy: Math.round(familyFundDeploy),
      distroToV1Webull: Math.round(distroToV1Webull),
      scorpDeductions: Math.round(scorpDeductions),
      solo401kEmployerContrib: Math.round(solo401kEmployerContrib),
      total401kContrib: Math.round(total401kContrib),
      rhPullVenture2: Math.round(rhPullVenture2),
      rhPullHardAssets: Math.round(rhPullHardAssets),
      hardAssets: Math.round(hardAssets),
      hardAssetsPurchase: Math.round(hardAssetsPurchase || 0),
      hardAssetsAppreciation: Math.round(hardAssetsAppreciationAmt || 0),
      hardAssetsCosts: Math.round(hardAssetsCosts || 0),
      venturesContrib: 0,
      venturesInterest: Math.round(venturesInterestPayment),
      constructionInterest: Math.round(constructionInterest),
      rhPullPersonal: Math.round(rhPullPersonal),
      rhPullQoz: Math.round(rhPullQoz),
      rhPullNonprofit: Math.round(rhPullNonprofit),
      freeCashToQoz: Math.round(freeCashToQoz),
      totalTax: Math.round(totalTax),
      effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
      taxBreakdown: {
        w2Tax: Math.round(personalTaxes),
        distributionTax: Math.round(distributionTax),
        additionalTax: Math.round(additionalTaxes),
        rhPullTax: Math.round(rhPullTax),
        employerPayroll: Math.round(employerPayrollTax),
        totalGrossIncome: Math.round(totalGrossIncome),
      },
      cash: Math.round(cash),
      freeCash: Math.round(freeCash),
      netWorth: Math.round(netWorth),
      ayoolaIncome: Math.round(ntRevenue),
      w2Gross: Math.round(w2Gross),
      takeHome: Math.round(takeHome),
      k401Contrib: Math.round(k401Contrib),
      grossDistributions: Math.round(grossDistributions),
      netDistributions: Math.round(netDistributions),
      distributionTax: Math.round(distributionTax),
      businessIncome: Math.round(businessIncome),
      passiveIncome: Math.round(passiveIncome),
      safeWithdrawal: Math.round(safeWithdrawal),
      ntNewWorkIncome: 0, // now baked into phase revenues
      freeCashSources: {
        takeHome,
        w2Gross,
        ntRevenue,
        grossDistributions,
        netDistributions,
        distributionTax: -distributionTax,
        ntNewWork: 0,
        k401Contrib: -k401Contrib,
        personalTaxes: -personalTaxes,
        rentalShare: ayoolaRentalShare,
        rentalContrib: -ayoolaContrib,
        landMortgagePayment: -landMortgagePayment,
        rhPullPersonal,
        rhPullQoz: -rhPullQoz,
        rhPullNonprofit: -rhPullNonprofit,
        rhPullVenture2: -rhPullVenture2,
        rhPullHardAssets: -rhPullHardAssets,
        hardAssetsMaint: -(hardAssetsCosts || 0),
        freeCashToQoz: -freeCashToQoz,
        freeCashToRH: freeCashToRobinhood,
        businessIncome,
        expenses: -expenses,
        staffExpenses: -staffExpenses,
        additionalTaxes: -additionalTaxes,
      }
    });
  }
  return years;
}
