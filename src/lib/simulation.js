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
  robinhoodReturn: 44,      // individual brokerage — aggressive fund strategy (ages 31-34)
  robinhoodReturnPost35: 15, // 15% avg after 35 (diversified, less hands-on)
  rhConsolidateToV1Age: 31, // port RH funds → V1 Alpaca at end of May 2026 (age 31)
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
  // Personal RH capped at $100K — once reached, new inflows redirect to V1 Alpaca
  robinhoodCap: 250000,     // keep RH liquid up to $250K before overflow → V1 Alpaca
  rhPullStartAge: 36,       // delay pulls until 36 — keep liquid through build + STR ramp
  rhPullPersonalPct: 5,     // 5% of Robinhood gains → personal
  rhPullQozPct: 15,         // 15% of Robinhood gains → QOZ (down from 20% — prioritize liquidity)
  rhPullQozStartAge: 36,    // QOZ contributions start at 36 (not 31 — keep liquid early)
  freeCashToQozPct: 40,     // 40% of positive free cash → QOZ (down from 66% — rest stays liquid)
  homeAppreciation: 6,      // Seattle home appreciation
  landAppreciation: 4,      // rural land appreciation

  // ═══════════════════════════════════════════════════════════════
  // GA HOMESTEAD (25 acres middle GA — primary + ADU farmstay/Airbnb)
  // $300K land (20% down) + $350K build (20% down on construction-to-perm)
  // Year 1 on land (age 31-32): getting to know the property, minimal spend
  // Construction at 33, build done at 34, property value → $650K, then 4%/yr
  // ADU STR rental income starts at 35: $14K stabilized NOI, 3%/yr growth
  // ═══════════════════════════════════════════════════════════════
  landPurchasePrice: 300000, // GA land purchase price (25 acres)
  landDownPaymentPct: 20,
  landMortgageRate: 7.0,    // land loan rate
  landMortgageTerm: 20,     // 20yr land loan
  landPurchase1Age: 31,     // buy land at age 31
  landPurchase1Acres: 25,   // 25 acres in middle GA
  landHousingCost: 12000,   // ~$1K/mo basic living costs on land
  landDevStartAge: 31,      // start developing home/infrastructure on land
  constructionLoanAmount: 350000, // primary + ADU natural-built ($300-400K range)
  constructionLoanAge: 33,        // construction loan drawn at 33 (1yr getting to know land first)
  constructionLoanRate: 7.5,      // construction-to-perm rate
  gaPropertyValueAtCompletion: 650000, // appraised value post-build (age 34)
  gaBuildCompleteAge: 34,         // build done at 34
  gaAppreciation: 4,              // 4%/yr after completion
  landDevValueMultiplier: 1.5,    // $1 spent on home dev adds ~$1.50 in property value
  // STR rental income (ADU farmstay/Airbnb) replaces old farm income
  farmIncomeStartAge: 35,         // ADU rented from age 35 (1yr after build to get STR running)
  farmIncomeAnnual: 22000,        // stabilized STR NOI (~$22K/yr — dedicated house mgr drives occupancy)
  farmIncomeGrowth: 5,            // 5% annual NOI growth (better reviews → pricing power)
  strNOIYear1: 16000,             // yr 1 NOI (~$16K — ramp-up with house mgr handling guest ops)
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
  // V1 ALPACA (S-Corp entity brokerage) — funded via LOC bridge strategy
  // $14K/mo retained + $25K May bonus = $39K cash. Draw $61K from LOC at 25% APR.
  // Fund $100K Alpaca immediately. LOC repaid in 5 months from $14K/mo retention.
  // Total LOC interest: ~$3,646. Alpaca earns ~$6,000 in same period. Net +$2,354.
  // ═══════════════════════════════════════════════════════════════
  v1WebullMinimum: 100000,         // $100K Alpaca entity account minimum
  v1WebullReturn: 44,              // V1 Alpaca return til 33 (aggressive early — Bayesian/momentum regime)
  v1WebullReturnPost33: 15,        // 15% avg after 34 (scaling down as balance grows)
                                   // (includes 35% margin leverage net of interest, already baked in)
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
  // V2 Seed: $100K Alpaca entity account at age 32
  // $30K diverted from V1 business income (capital contribution)
  // $10K gift from family (under $19K annual exclusion)
  // $10K interest-free loan from family (under $10K, no imputed interest)
  // $50K from V1 LOC at 9% (penalty-free, repaid in 6 months)
  v2SeedDiverted: 30000,          // capital contribution from business income
  v2SeedGift: 10000,              // family gift (no tax)
  v2SeedLoan: 10000,              // family loan (interest-free, <$10K rule)
  v2SeedLocAmount: 50000,         // from V1 LOC at 9%
  v2SeedLocRepayMonths: 6,        // pay back LOC portion in 6 months
  v2SeedTotal: 100000,            // total Alpaca deposit (meets $100K minimum)
  // V2 Staffing: 2 part-time US hires (10hrs/wk each = 0.25 FTE per person)
  // 3:2:1 ratio — Nigeria:V2 Agro:Nonprofit
  // Hire 1: Groundskeeper/Caretaker — starts age 33 (construction year), 10hrs/wk
  usHire1StartAge: 33,
  usHire1StartPay: 8000,     // ~$15/hr × 10hrs × 52wks
  usHire1Raise: 5,
  // Hire 2: House Manager/STR Ops — starts age 35 (STR launch), 10hrs/wk
  usHire2StartAge: 35,
  usHire2StartPay: 8000,     // ~$15/hr × 10hrs × 52wks
  usHire2Raise: 5,
  // Hire 3: N/A — removed (lean 10:2:1 ratio pre-40)
  usHire3StartAge: 999,      // effectively disabled
  usHire3StartPay: 0,
  usHire3Raise: 0,
  // POST-40 STAFFING GROWTH PHASE (10:2:1 ratio maintained)
  // Funded by V1→V2 and V1→NP inter-company transfers
  staffGrowthPhase2Age: 40,       // when scaling ramps up
  opsHubGrowthRatePhase2: 2,      // +2 Nigeria staff/yr after 40
  opsHubMaxStaffPhase2: 50,       // uncapped growth through 60 (up to 50)
  v2AgroHirePayBase: 8000,        // new PT hires after 40 start at same $8K (10hrs/wk)
  v2AgroHireRaise: 5,             // 5% annual raise
  npHirePayBase: 6000,            // NP hires (Nigeria-based, same cost structure)
  npHireRaise: 7,                 // 7% annual raise (matches ops hub)
  // V1→V2/NP transfer: fund expanded staff costs from V1 NimbusTech
  v1TransferToV2Pct: 3,           // up to 3% of V1 balance → V2 for staff
  v1TransferToNpPct: 1.5,         // up to 1.5% of V1 balance → NP for staff

  // ═══════════════════════════════════════════════════════════════
  // NIGERIA OPS HUB — V2 subsidiary, centralized back-office for ALL entities
  // Handles: HR, Accounting, Taxes, Logistics, DevOps across all orgs
  // AI-assisted operations + minimal US CPA fee to officialize
  // ═══════════════════════════════════════════════════════════════
  opsHubStartAge: 32,            // ops hub launches at 32 (year 1 on land — admin from day 1)
  opsHubInitialStaff: 3,         // 3 employees from day 1 (admin, bookkeeping, social/marketing)
  opsHubGrowthInterval: 1,       // add 1 employee every year
  opsHubMaxStaff: 10,            // cap hub at 10 (10:2:1 ratio with V2 Agro + Nonprofit)
  opsHubEmployeeCostBase: 6000,   // $6K/yr starting salary per Nigerian employee
  opsHubEmployeeRaise: 7,         // 7% annual raise per employee (competitive for Nigeria)
  opsHubCpaFee: 5000,            // $5K/yr minimal US CPA fee to officialize filings
  opsHubOverheadReduction: true,  // centralizing ops reduces overhead on V1 and nonprofit
  // Inter-company billing: ops hub bills each entity for services (tax-free between related entities)
  // V1 NimbusTech carries bulk (highest revenue, most complex compliance)
  opsHubBillV1Pct: 50,            // 50% of ops hub cost billed to V1 (S-Corp, consulting, Alpaca)
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
  hardAssetsStartAge: 36,        // delay hard assets until 36 — prioritize liquidity early
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
  // Consulting ends at 35 — fully off W2 after that
  // ═══════════════════════════════════════════════════════════════
  // Phase 1 (31, first half of 32): NT base + $80K additional ($207K + $80K)
  phase1NTRevenue: 287000,

  // Phase 2 (end of 32 through 35): NT base + $80K + $70K new project ($207K + $80K + $70K)
  phase2NTRevenue: 357000,

  // Phase 3: N/A — consulting done at 35
  phase3NTRevenue: 0,

  // Phase 4 (36-45): Off consulting — land business growing
  phase4NTRevenue: 0,
  phase4BusinessIncome: 0,       // starts at 0, grows $15K/yr

  // Phase 5 (46+): Coast mode — land business mature
  phase5NTRevenue: 0,
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
  let venture2 = 0;          // V1 NimbusTech Alpaca — only earns returns AFTER $100K funded
  let v1WebullAccum = 0;     // Cash sitting in S-Corp checking, earning 0%, waiting for $100K
  let v1WebullActive = false; // Flips true once accumulation hits $100K minimum
  let venture2Loc = 0;       // Venture 2 outstanding LOC balance
  let venture2OwnIncome = 0; // Venture 2 self-generated income (grows over time)
  let venture3 = 0;           // Venture 3 reserves
  let venture3Employees = 0;  // Estimated employees affordable
  let v2AgroUSHires = 0;      // V2 Agro US headcount (groundskeeper, house mgr, ops coord)
  let v1NtUSHires = 0;        // V1 NimbusTech US headcount (always 0 — ops hub handles admin)
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

    if (age <= 31) {
      ntRevenue = assumptions.phase1NTRevenue; // $287K (base $207K + $80K additional)
    } else if (age <= 35) {
      ntRevenue = assumptions.phase2NTRevenue; // $357K (+ $70K new project from end of 32)
    } else {
      // Age 36+: fully off consulting
      ntRevenue = 0;
      businessIncome = age <= 45
        ? Math.max(0, (age - 35) * 15000) + assumptions.phase4BusinessIncome
        : assumptions.phase5BusinessIncome + (age - 46) * assumptions.phase5BusinessGrowth;
      staffExpenses = age <= 36 ? 35000 : Math.min(35000 + (age - 36) * 10000, assumptions.staffExpensesMax);
    }

    // First year proration: starting Apr 8, 2026 — ~8.7 months remaining
    // All income/expenses for age 31 prorated to 8.7/12 of annual amounts
    const firstYearFraction = 8.7 / 12; // Apr 8 to Dec 31 ≈ 8.7 months
    if (age === assumptions.currentAge) {
      ntRevenue = ntRevenue * firstYearFraction;
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 2: SPLIT NT REVENUE → W2 + EMPLOYER COSTS + DEDUCTIONS + DISTRIBUTIONS
    // Revenue → W2 + payroll → S-Corp deductible expenses → taxable distributions
    // Deductions reduce the taxable base; remainder invested in S-Corp Alpaca
    // ═══════════════════════════════════════════════════════════
    const w2Gross = age >= 36 ? 0 : Math.min(assumptions.w2Gross, ntRevenue); // W2 stops at 36 (last year 35)
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
    const netDistributions = grossDistributions - distributionTax; // after-tax → mostly to S-Corp Alpaca, minimal to personal RH

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
    // Construction loan interest — $350K interest-only til payoff at 20yr
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
    // Net distributions split: S-Corp Alpaca (primary), then smaller %s to other vehicles
    // Personal Robinhood gets minimal new money — it compounds on its own
    // ═══════════════════════════════════════════════════════════
    let distroToPersonal = 0;    // → personal expenses / RH
    let distroToQoz = 0;         // → QOZ fund
    let distroToV2 = 0;          // → V2 (agro/land entity) — was venture2RhPullPct
    let distroToNonprofit = 0;   // → nonprofit (tax-deductible donation)
    let distroToHardAssets = 0;  // → hard assets
    let distroToV1Webull = 0;    // → S-Corp Alpaca (V1 NimbusTech) — the PRIMARY vehicle
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
      // Everything NOT allocated above → retained in S-Corp for V1 Alpaca
      const totalAllocated = distroToPersonal + distroToQoz + distroToV2 + distroToNonprofit + distroToHardAssets;
      const residual = Math.max(0, netDistributions - totalAllocated);

      if (v1WebullActive) {
        // Alpaca funded — residual goes straight to V1 Alpaca (earns returns)
        distroToV1Webull = residual;
      } else {
        // LOC BRIDGE STRATEGY: Fund V1 Alpaca immediately using $39K cash + $61K LOC
        // $14K/mo retained + $25K bonus = $39K. LOC bridges the remaining $61K.
        // LOC repaid in 5 months from $14K/mo. Interest cost ~$3,646 (< Alpaca returns of $6K)
        v1WebullActive = true;
        const cashOnHand = assumptions.v1RetainedPerMonth + assumptions.v1BonusMonth1; // $39K
        const locBridge = assumptions.v1LocBridge; // $61K
        distroToV1Webull = cashOnHand + locBridge; // $100K → Alpaca funded day 1
        // LOC interest cost absorbed in first year (net of Alpaca returns = +$2,354)
        const locInterestCost = Math.round(locBridge * (assumptions.v1LocBridgeRate / 100) * (assumptions.v1LocRepayMonths / 12));
        distroToV1Webull -= locInterestCost; // net of LOC interest
        // Remaining residual from distributions also flows to V1 Alpaca
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
    // Distributions now go to S-Corp Alpaca (V1), not personal RH
    // CAP: once RH hits cap (or after consolidation to V1), new inflows redirect to V1 Alpaca
    // After RH→V1 consolidation, all inflows go straight to V1 (effective cap = 0)
    const effectiveRhCap = age > assumptions.rhConsolidateToV1Age ? 0 : assumptions.robinhoodCap;
    let rhNewInflows = freeCashToRobinhood + distroToPersonal;
    let rhOverflowToV1 = 0;
    const rhBeforeInflows = robinhood + grossGrowth - marginInterest - rhPullFreeCash;
    if (rhBeforeInflows >= effectiveRhCap && rhNewInflows > 0) {
      // Already at/above cap — redirect ALL new inflows to V1
      rhOverflowToV1 = rhNewInflows;
      rhNewInflows = 0;
    } else if (rhBeforeInflows + rhNewInflows > effectiveRhCap && rhNewInflows > 0) {
      // Inflows would push past cap — take only what's needed to reach cap
      const room = Math.max(0, effectiveRhCap - rhBeforeInflows);
      rhOverflowToV1 = rhNewInflows - room;
      rhNewInflows = room;
    }
    robinhood = rhBeforeInflows + rhNewInflows;

    // V1 Alpaca: add distribution residual + any RH overflow to V1 NimbusTech account
    // This runs OUTSIDE the venture2StartAge gate — V1 Alpaca funds from age 31 via LOC bridge
    venture2 += distroToV1Webull + rhOverflowToV1;

    // Construction loan: $350K single draw at age 32 (construction-to-perm)
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
    // V2 Agro Staffing: 2 base PT US hires + dynamic scaling after 40 (10:2:1 ratio)
    usHire1Cost = 0; usHire2Cost = 0; usHire3Cost = 0;
    v2AgroUSHires = 0;
    let v2AgroPhase2Cost = 0; // cost of additional hires after 40
    if (age >= assumptions.usHire1StartAge) {
      const h1Years = age - assumptions.usHire1StartAge;
      usHire1Cost = assumptions.usHire1StartPay * Math.pow(1 + assumptions.usHire1Raise / 100, h1Years);
      v2AgroUSHires += 1; // 1 person, 10hrs/wk (0.25 FTE)
    }
    if (age >= assumptions.usHire2StartAge) {
      const h2Years = age - assumptions.usHire2StartAge;
      usHire2Cost = assumptions.usHire2StartPay * Math.pow(1 + assumptions.usHire2Raise / 100, h2Years);
      v2AgroUSHires += 1; // 1 person, 10hrs/wk (0.25 FTE)
    }
    if (age >= assumptions.usHire3StartAge) {
      const h3Years = age - assumptions.usHire3StartAge;
      usHire3Cost = assumptions.usHire3StartPay * Math.pow(1 + assumptions.usHire3Raise / 100, h3Years);
      v2AgroUSHires += 1; // disabled (age 999)
    }
    // Phase 2 scaling: 10:2:1 ratio → for every 10 Nigeria, 2 V2 Agro PT US hires
    // Base ratio has 2 hires at 10 Nigeria. After 40, add 2 more per 10 new Nigeria staff
    if (age >= assumptions.staffGrowthPhase2Age) {
      const phase2Years = age - assumptions.staffGrowthPhase2Age;
      const totalNigeria = Math.min(
        assumptions.opsHubMaxStaffPhase2,
        assumptions.opsHubMaxStaff + phase2Years * assumptions.opsHubGrowthRatePhase2
      );
      // V2 Agro target = totalNigeria / 5 (10:2 ratio = 5:1)
      const v2AgroTarget = Math.floor(totalNigeria / 5);
      const extraV2Hires = Math.max(0, v2AgroTarget - 2); // subtract the 2 base hires
      // Cost for extra hires: each starts at $8K with 5% raises from their hire year
      for (let i = 0; i < extraV2Hires; i++) {
        // Stagger: hire i started (i * 2.5) years after phase 2 began (every 5 Nigeria = 1 new V2)
        const hireAge = assumptions.staffGrowthPhase2Age + Math.floor((i + 1) * 5 / assumptions.opsHubGrowthRatePhase2);
        if (age >= hireAge) {
          const yearsActive = age - hireAge;
          v2AgroPhase2Cost += assumptions.v2AgroHirePayBase * Math.pow(1 + assumptions.v2AgroHireRaise / 100, yearsActive);
          // Only count headcount for hires that have actually started
          if (i >= 0) v2AgroUSHires += 1;
        }
      }
    }
    const v1StaffCost = usHire1Cost + usHire2Cost + usHire3Cost + v2AgroPhase2Cost;
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

    // V2 CAPITAL BACKSTOP: if V2 dips below $10K, inject from V1 NimbusTech (inter-company
    // transfer — tax-free between related entities). Keeps V2 solvent so investment gains
    // continue working. V1 is the most tax-effective source (no taxable event on transfer).
    const v2Floor = 10000;
    if (ventures < v2Floor && venture2 > v2Floor) {
      const v2Injection = Math.min(venture2 * 0.05, Math.max(0, v2Floor - ventures) * 2); // inject up to 5% of V1, sized to 2x the shortfall
      venture2 -= v2Injection;
      ventures += v2Injection;
    }

    // POST-40 INTER-COMPANY TRANSFERS: V1 funds V2 Agro + Nonprofit staff expansion
    // Tax-free between related entities. Sized to cover phase 2 staff costs.
    let v1ToV2Transfer = 0;
    let v1ToNpTransfer = 0;
    if (age >= assumptions.staffGrowthPhase2Age && venture2 > 50000) {
      // V1→V2: cover phase 2 V2 Agro staff costs (capped at % of V1 balance)
      if (v2AgroPhase2Cost > 0) {
        v1ToV2Transfer = Math.min(v2AgroPhase2Cost * 1.2, venture2 * (assumptions.v1TransferToV2Pct / 100));
        venture2 -= v1ToV2Transfer;
        ventures += v1ToV2Transfer;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // VENTURE 2: Alpaca entity account seeded at 32
    // $100K: $30K diverted + $10K gift + $10K loan + $50K V1 LOC
    // LOC portion repaid in 6 months, family loan repaid over time
    // Then: RH pull (15%) → fund growth + LOC debt service
    // ═══════════════════════════════════════════════════════════
    let v2LocDraw = 0;
    let v2DebtService = 0;
    let v2SelfIncome = 0;
    if (age >= assumptions.venture2StartAge) {
      // V2 SEED at age 32: $100K into Alpaca entity account
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
      v1NtUSHires = 0;
      const v2StaffCost = 0;

      // Nigeria Ops Hub (V2 subsidiary): centralized back-office for all entities
      // HR, Accounting, Taxes, Logistics, DevOps — AI-assisted + minimal US CPA
      // Costs split via inter-company billing (tax-free between related entities)
      if (age >= assumptions.opsHubStartAge) {
        const hubYears = age - assumptions.opsHubStartAge;
        // Phase 1: grow from 3 → 10 (1/yr) until staffGrowthPhase2Age
        const phase1Staff = Math.min(
          assumptions.opsHubMaxStaff,
          assumptions.opsHubInitialStaff + Math.floor(hubYears / assumptions.opsHubGrowthInterval)
        );
        // Phase 2: after 40, accelerate growth at +2/yr from 10
        if (age >= assumptions.staffGrowthPhase2Age) {
          const phase2Years = age - assumptions.staffGrowthPhase2Age;
          opsHubEmployees = Math.min(
            assumptions.opsHubMaxStaffPhase2,
            assumptions.opsHubMaxStaff + phase2Years * assumptions.opsHubGrowthRatePhase2
          );
        } else {
          opsHubEmployees = phase1Staff;
        }
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

      // V1 Alpaca invested cash returns: 44% til 34, 15% avg thereafter
      const v1Equity = Math.max(0, venture2);
      const v1ReturnRate = age <= 34 ? assumptions.v1WebullReturn : assumptions.v1WebullReturnPost33;
      const v2InvestGain = v1Equity * (v1ReturnRate / 100);

      // Update V1 NimbusTech (sim: venture2): LOC + income + distros to Alpaca + gains - costs
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
      // + Phase 2 scaling after 40 (10:2:1 ratio → 1 NP hire per 10 Nigeria)
      npMomCost = 0;
      npEDCost = 0;
      let npPhase2Cost = 0;
      let npPhase2Hires = 0;
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
      // Phase 2 NP scaling: 10:2:1 ratio → 1 NP hire per 10 Nigeria staff
      if (age >= assumptions.staffGrowthPhase2Age) {
        const phase2Years = age - assumptions.staffGrowthPhase2Age;
        const totalNigeria = Math.min(
          assumptions.opsHubMaxStaffPhase2,
          assumptions.opsHubMaxStaff + phase2Years * assumptions.opsHubGrowthRatePhase2
        );
        const npTarget = Math.floor(totalNigeria / 10);
        const extraNpHires = Math.max(0, npTarget - 1); // subtract the 1 base NP (mom/ED)
        for (let i = 0; i < extraNpHires; i++) {
          const hireAge = assumptions.staffGrowthPhase2Age + Math.floor((i + 1) * 10 / assumptions.opsHubGrowthRatePhase2);
          if (age >= hireAge) {
            const yearsActive = age - hireAge;
            npPhase2Cost += assumptions.npHirePayBase * Math.pow(1 + assumptions.npHireRaise / 100, yearsActive);
            npPhase2Hires += 1;
          }
        }
        npEmployees += npPhase2Hires;
      }
      const npStaffCost = npMomCost + npEDCost + npPhase2Cost;

      // V1→NP TRANSFER: fund phase 2 NP staff expansion from V1 NimbusTech
      if (age >= assumptions.staffGrowthPhase2Age && npPhase2Cost > 0 && venture2 > 50000) {
        v1ToNpTransfer = Math.min(npPhase2Cost * 1.2, venture2 * (assumptions.v1TransferToNpPct / 100));
        venture2 -= v1ToNpTransfer;
        nonprofit += v1ToNpTransfer;
      }

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

    // Debt payoff at 52 (20yr from 32) — construction loan is personal homestead debt
    // Construction is interest-only, so payoff = original draw amount ($350K)
    // After RH→V1 consolidation, payoff comes from V1 Alpaca (entity account, LTCG still applies)
    if (age === assumptions.constructionLoanAge + 20) {
      const constructionPayoff = assumptions.constructionLoanAmount; // $350K — interest-only, no amortization
      if (constructionPayoff > 0 && landMortgage >= constructionPayoff) {
        const payoffWithTax = constructionPayoff * 1.08; // principal + ~8% LTCG tax
        if (robinhood >= payoffWithTax) {
          robinhood -= payoffWithTax;
        } else {
          // RH consolidated → pull from V1 Alpaca
          venture2 -= payoffWithTax;
        }
        landMortgage -= constructionPayoff;
        landEquity += constructionPayoff;
      }
    }
    // Ventures LOC payoff: from V1 Alpaca (RH consolidated into V1)
    if (age === assumptions.venturesLocAge + 20) {
      if (venturesLocDebt > 0) {
        venture2 -= venturesLocDebt * 1.08; // full payoff from V1 + LTCG
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

    // Land: At build completion (age 33), property value snaps to $650K appraised value.
    // Before completion: appreciation on purchase price + dev multiplier.
    // After completion: 4%/yr appreciation on total property value.
    if (landMortgage > 0 || landEquity > 0) {
      let totalLandValue = landEquity + landMortgage;

      if (age === assumptions.gaBuildCompleteAge) {
        // Build complete — property appraised at $650K. Snap total value to appraisal.
        const appraisedValue = assumptions.gaPropertyValueAtCompletion;
        const valueJump = appraisedValue - totalLandValue;
        if (valueJump > 0) {
          landEquity += valueJump; // all new value goes to equity
        }
        totalLandValue = appraisedValue;
      } else if (age > assumptions.gaBuildCompleteAge) {
        // Post-completion: appreciate at gaAppreciation rate (4%/yr)
        const appreciationGain = totalLandValue * (assumptions.gaAppreciation / 100);
        landEquity += appreciationGain;
      } else {
        // Pre-completion: modest appreciation on raw land + dev multiplier
        const appreciationGain = totalLandValue * (assumptions.landAppreciation / 100);
        landEquity += appreciationGain + landDevCost * (assumptions.landDevValueMultiplier - 1);
      }

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
      // Leftover Seattle proceeds: fill RH to cap, overflow → V1 Alpaca
      const seattleLeftover = Math.max(0, seattleProceeds - fromSeattle);
      const rhRoom = Math.max(0, assumptions.robinhoodCap - robinhood);
      robinhood += Math.min(seattleLeftover, rhRoom);
      venture2 += Math.max(0, seattleLeftover - rhRoom);
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
      // Tax savings arrive as a refund → V1 Alpaca (RH consolidated into V1)
      venture2 += npLandDonationTaxSavings;
    }
    // NP land appreciates alongside personal land
    if (npLandValue > 0) {
      npLandValue = npLandValue * (1 + assumptions.landAppreciation / 100);
    }

    // Offshore (Belize/Costa Rica): cash purchase at 33 — funded from V1 Alpaca
    // (RH consolidated into V1 at 31, so V1 is the primary capital source)
    if (age === assumptions.offshorePurchaseAge) {
      venture2 -= assumptions.offshorePurchasePrice;
      offshoreEquity += assumptions.offshorePurchasePrice;
    }
    if (offshoreEquity > 0) {
      offshoreEquity = offshoreEquity * (1 + assumptions.offshoreAppreciation / 100);
    }

    // Nigeria: cash purchase at 36 — funded from V1 Alpaca
    if (age === assumptions.nigeriaPurchaseAge) {
      venture2 -= assumptions.nigeriaPurchasePrice;
      nigeriaEquity += assumptions.nigeriaPurchasePrice;
    }
    if (nigeriaEquity > 0) {
      nigeriaEquity = nigeriaEquity * (1 + assumptions.nigeriaAppreciation / 100);
    }

    // City rental property: OWNED BY V2 AGRO (moved out of V1 NimbusTech S-Corp
    // — S-Corps are a poor vehicle for rental real estate: no tax-free property
    // distributions, passive loss trapping, and liability co-mingling with the
    // operating S-Corp). Down payment sourced from V2 reserves first; any
    // shortfall is lent by V1 Alpaca at an arm's-length rate (modeled as a
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

    // RH → V1 CONSOLIDATION: port Robinhood funds to V1 Alpaca (end of May 2026)
    // After transfer, RH balance = 0 and V1 gets the capital (invested at 44% til 34)
    // Placed at end of year to capture all land purchases, Seattle proceeds, etc. first
    if (age === assumptions.rhConsolidateToV1Age && robinhood > 0) {
      venture2 += robinhood; // V1 Alpaca gets RH funds
      robinhood = 0;
    }

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
      v1Employees: v1NtUSHires,     // V1 NimbusTech US headcount (always 0)
      v2Employees: v2AgroUSHires,   // V2 Agro US headcount (groundskeeper, house mgr, ops coord)
      npEmployees,
      opsHubEmployees,
      usHire1Cost: Math.round(usHire1Cost),
      usHire2Cost: Math.round(usHire2Cost),
      usHire3Cost: Math.round(usHire3Cost),
      npMomCost: Math.round(npMomCost),
      npEDCost: Math.round(npEDCost),
      v1ToV2Transfer: Math.round(v1ToV2Transfer),
      v1ToNpTransfer: Math.round(v1ToNpTransfer),
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
      freeCashToRH: Math.round(freeCashToRobinhood),
      rhOverflowToV1: Math.round(rhOverflowToV1),
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
        rhOverflowToV1: rhOverflowToV1,
        businessIncome,
        expenses: -expenses,
        staffExpenses: -staffExpenses,
        additionalTaxes: -additionalTaxes,
      }
    });
  }
  return years;
}
