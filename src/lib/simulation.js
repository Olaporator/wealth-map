// Default assumptions — extracted from PlanDashboard
export const DEFAULT_ASSUMPTIONS = {
  // ═══════════════════════════════════════════════════════════════
  // STARTING BALANCES (real as of April 2026, post-divorce settlement)
  // ═══════════════════════════════════════════════════════════════
  currentAge: 31,           // Dec birthday — currently 31, turns 32 Dec 2026
  k401Start: 14819,         // Human Interest 401k (real: $14,818.55)
  iraStart: 4588,           // Robinhood Traditional IRA (real: $4,588.22)
  robinhoodStart: 82168,    // Robinhood Individual Brokerage (real: $82,167.79)
  seattleEquityStart: 290000, // $1.25M value - $960K mortgage (total equity; 50% counted)
  ccDebtStart: 0,           // Chase CC paid off, Cap One split 50/50 in divorce → $0
  ccInterestRate: 20,       // average CC APR on carried balance
  ccPayoffPct: 85,          // pay off 85% of balance each month, carry 15%
  cashStart: 135,           // $6,835 - $6,700 (CC settlement from savings) ≈ $135

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
  ntTotalRevenue: 207000,   // total NimbusTech consulting revenue/yr
  distributionTaxRate: 24,  // federal + state on S-Corp distributions (pass-through)

  // NT Additional Work (toggle): extra $5K/mo revenue → distributions
  ntNewWorkMonthly: 5000,
  ntNewWorkStartMonth: 7,   // July 2026

  // ═══════════════════════════════════════════════════════════════
  // RETURNS & APPRECIATION
  // ═══════════════════════════════════════════════════════════════
  k401Return: 8,            // 401k in standard index funds
  robinhoodReturn: 30,      // individual brokerage — aggressive fund strategy (ages 31-34)
  robinhoodReturnPost35: 15, // modest growth from age 35+ (shift to safer allocation)
  marginPct: 35,            // 35% of Robinhood equity used as margin
  marginRateLow: 5,         // margin interest rate below $500K
  marginRateHigh: 4.5,      // margin interest rate at $500K+
  iraReturn: 30,            // Robinhood IRA — same fund strategy
  venturesReturn: 12,       // ventures invested cash return (10-15% avg, index/ETF style)
  venturesCreditRate: 9,    // business line of credit rate for ventures operations
  // V1 Staffing
  v1StaffStartAge: 33,      // first hire 1 year after LOC
  v1StaffInitial: 1,        // start with 1 employee
  v1StaffGrowthInterval: 3, // add 1 employee every 3 years
  v1EmployeeCost: 50000,    // $50K fully loaded per employee
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
  nonprofitInvestReturn: 12,    // tax-free investment return on reserves (10-15% avg)
  nonprofitOpsLossPct: 8,       // 8% annual ops cost (overhead beyond staff — funded via credit)
  // Nonprofit Staffing
  npStaffStartAge: 32,          // first program hire at 32
  npStaffInitial: 1,            // start with 1 program staff
  npStaffGrowthInterval: 4,     // add 1 every 4 years
  npEmployeeCost: 50000,        // $50K fully loaded
  nonprofitLocRate: 7,          // nonprofit LOC rate (CDFIs offer favorable terms)
  nonprofitDonationGrowth: 10,  // annual donation/grant income growth after year 1
  nonprofitInitialDonations: 5000, // modest initial donations year 1

  // Robinhood growth pulls (tax-strategic LTCG harvesting from age 33)
  rhPullStartAge: 33,       // start pulling from Robinhood growth
  rhPullPersonalPct: 20,    // 20% of Robinhood gains → personal (covers expenses)
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
  venturesLocAmount: 200000,      // single ventures business LOC
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
  // CITY RENTAL PROPERTIES (age 40 — 2-3 units totaling $3M, V2-owned, Airbnb/rental @ 90%)
  // ═══════════════════════════════════════════════════════════════
  rentalPurchaseAge: 40,
  rentalPurchasePrice: 2500000,    // 2-3 properties totaling $2.5M
  rentalDownPayment: 625000,       // $625K from V2 balance (25% down)
  rentalMortgageRate: 7.0,
  rentalMortgageTerm: 30,
  rentalPropertyAppreciation: 4,   // annual property appreciation
  rentalGrossRentYear1: 150000,    // ~$5K/mo avg per unit × 2-3 = $12.5K/mo ($150K/yr gross)
  rentalOccupancy: 90,             // 90% occupancy (Airbnb + long-term mix)
  rentalExpenseRate: 30,           // 30% of gross for mgmt, maintenance, insurance, taxes
  rentalRentGrowth: 3,             // annual rent growth

  // ═══════════════════════════════════════════════════════════════
  // VENTURE 2 — RH-funded operating business (equipment/services)
  // Pulls 5% of RH gains, generates matching own income, secures
  // revolving LOC where RH pull covers debt service (P&I)
  // ═══════════════════════════════════════════════════════════════
  venture2StartAge: 32,           // venture 2 starts at 32
  venture2RhPullPct: 10,          // 10% of RH leveraged gains → venture 2 seed
  venture2IncomeMatch: 1.0,       // own income matches RH contribution (1:1)
  venture2LocRate: 9,             // business LOC rate
  venture2LocTerm: 7,             // revolving LOC term (years) — reborrow continuously
  venture2GrowthRate: 8,          // venture 2 own income grows 8%/yr after first year
  venture2InvestReturn: 12,       // venture 2 invested cash return (10-15% avg)
  // V2 Staffing (US-based operations staff)
  v2StaffStartAge: 33,           // first hire 1 year after V2 starts
  v2StaffInitial: 1,             // start with 1 employee
  v2StaffGrowthInterval: 3,      // add 1 employee every 3 years
  v2EmployeeCost: 50000,         // $50K fully loaded per employee

  // ═══════════════════════════════════════════════════════════════
  // NIGERIA OPS HUB — V2 subsidiary, centralized back-office for ALL entities
  // Handles: HR, Accounting, Taxes, Logistics, DevOps across all orgs
  // AI-assisted operations + minimal US CPA fee to officialize
  // ═══════════════════════════════════════════════════════════════
  opsHubStartAge: 33,            // ops hub launches at 33
  opsHubInitialStaff: 5,         // 5 employees from day 1 (HR, Accounting, Tax, Logistics, DevOps)
  opsHubGrowthInterval: 2,       // add 1 employee every 2 years
  opsHubEmployeeCost: 7000,      // $7K/yr fully loaded per Nigerian employee
  opsHubCpaFee: 5000,            // $5K/yr minimal US CPA fee to officialize filings
  opsHubOverheadReduction: true,  // centralizing ops reduces overhead on V1 and nonprofit

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
  // SEATTLE RENTAL (50/50 co-owned with ex-wife)
  // Both contribute $1K/mo toward costs, reduced $100/mo/yr until breakeven
  // ═══════════════════════════════════════════════════════════════
  seattleCurrentValue: 1250000,
  seattleMortgageBalance: 960000,
  seattleSaleAge: 31,           // sell Seattle by end of year 31
  seattleSellerFeePct: 6,       // 6% closing costs (agent ~5% + title/excise ~1%)
  seattleMortgageRate: 3.25,
  grossRentYear1: 72000,        // ~$6K/mo market rent
  mortgagePayment: 67200,       // annual mortgage (P&I)
  propertyTaxes: 10000,
  insurance: 2400,
  propertyManagement: 7200,     // ~10% of gross rent
  maintenanceRate: 7,           // % of rent
  vacancyRate: 3,
  rentGrowth: 2.5,
  seattlePrincipal: 18000,      // annual principal paydown (builds equity)
  ayoolaRentalContrib: 12000,   // $1K/mo toward rental costs
  exWifeRentalContrib: 12000,   // $1K/mo from ex-wife
  contribReductionPerYear: 1200, // reduce by $100/mo each year

  // ═══════════════════════════════════════════════════════════════
  // PERSONAL EXPENSES (post-divorce, all-in including land housing)
  // ═══════════════════════════════════════════════════════════════
  livingExpenses: 50000,    // $50K/yr all-in (housing on land, bills, utilities, food, travel)
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
  // Phase 1 (31-35): NT at full capacity
  phase1NTRevenue: 207000,

  // Phase 2 (36-37): Transition — NT winds down, land ramps up
  phase2NTRevenue: 150000,

  // Phase 3 (38): Gap year — W2 maintained at $80K
  phase3NTRevenue: 80000,

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
export function runSimulation(assumptions, ntNewWorkEnabled = false) {
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
  let venture2 = 0;          // Venture 2 net equity (assets - LOC debt)
  let venture2Loc = 0;       // Venture 2 outstanding LOC balance
  let venture2OwnIncome = 0; // Venture 2 self-generated income (grows over time)
  let venture3 = 0;           // Venture 3 reserves
  let venture3Employees = 0;  // Estimated employees affordable
  let v1Employees = 0;        // Venture 1 headcount
  let v2Employees = 0;        // Venture 2 headcount
  let npEmployees = 0;        // Nonprofit headcount
  let opsHubEmployees = 0;    // Nigeria ops hub headcount
  let opsHubCost = 0;         // Annual ops hub cost
  let nonprofit = 0;          // Nonprofit reserves (invested)
  let nonprofitLoc = 0;       // Nonprofit LOC balance
  let nonprofitDonations = 0; // Annual donation/grant income (grows over time)
  let offshoreEquity = 0;    // Belize/Costa Rica land equity
  let nigeriaEquity = 0;     // Nigeria land equity
  let hardAssets = 0;         // Hard assets value (gold, silver, metals, antiques, materials)
  let rentalEquity = 0;      // City rental properties equity
  let rentalMortgage = 0;    // City rental mortgage balance

  for (let age = assumptions.currentAge; age <= 85; age++) {
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

    // NT additional work toggle: extra revenue → all to distributions
    let ntNewWorkIncome = 0;
    if (ntNewWorkEnabled && age <= 33) {
      if (age === assumptions.currentAge) {
        ntNewWorkIncome = assumptions.ntNewWorkMonthly * 6; // Jul-Dec partial year
      } else {
        ntNewWorkIncome = assumptions.ntNewWorkMonthly * 12;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 2: SPLIT NT REVENUE → W2 + EMPLOYER COSTS + DISTRIBUTIONS (S-Corp)
    // Every dollar of NT revenue goes somewhere:
    //   W2 gross → employee (taxes + 401k + take-home)
    //   Employer payroll taxes → government
    //   Remainder → S-Corp distributions (taxed at personal rate, flows to Robinhood)
    // ═══════════════════════════════════════════════════════════
    const w2Gross = age >= 40 ? 0 : Math.min(assumptions.w2Gross, ntRevenue); // W2 stops at 40 (last year 39)
    const employerPayrollTax = w2Gross * (assumptions.employerPayrollTaxRate / 100);
    const ntOverhead = w2Gross + employerPayrollTax;
    const grossDistributions = Math.max(0, ntRevenue - ntOverhead) + ntNewWorkIncome;
    const distributionTax = grossDistributions * (assumptions.distributionTaxRate / 100);
    const netDistributions = grossDistributions - distributionTax; // after-tax → flows to Robinhood

    // ═══════════════════════════════════════════════════════════
    // STEP 3: W2 → 401k + TAXES + TAKE-HOME (closed loop)
    // ═══════════════════════════════════════════════════════════
    let k401Contrib = age <= 45 ? w2Gross * (assumptions.k401Rate / 100) : 0;
    const taxableW2 = w2Gross - k401Contrib; // 401k is pre-tax
    const personalTaxes = w2Gross * (assumptions.personalTaxRate / 100);
    const takeHome = w2Gross - k401Contrib - personalTaxes;

    // ═══════════════════════════════════════════════════════════
    // STEP 4: PERSONAL CASH FLOW (take-home vs expenses)
    // ═══════════════════════════════════════════════════════════
    let expenses = assumptions.livingExpenses; // $50K all-in

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

    // Interest-only payments on credit lines — paid from personal cash
    const venturesDebtBal = Math.abs(Math.min(0, ventures));
    const venturesInterestPayment = venturesDebtBal * (assumptions.venturesCreditRate / 100);
    // Construction loan interest — $500K interest-only til payoff from RH at 20yr
    // Only applies after construction loan age and before payoff
    const hasConstructionDebt = age >= assumptions.constructionLoanAge && age < assumptions.constructionLoanAge + 20;
    const constructionDebt = hasConstructionDebt ? assumptions.constructionLoanAmount : 0;
    const constructionInterest = constructionDebt * (assumptions.constructionLoanRate / 100);

    // Offshore + Nigeria maintenance costs (paid from personal cash)
    let offshoreMaint = 0;
    if (age >= assumptions.offshorePurchaseAge) {
      offshoreMaint = age < assumptions.offshoreMaintenanceDropAge
        ? assumptions.offshoreMaintenance
        : assumptions.offshoreMaintenanceReduced;
    }
    let nigeriaMaint = 0;
    if (age >= assumptions.nigeriaPurchaseAge) {
      nigeriaMaint = assumptions.nigeriaMaintenance;
    }

    // City rental properties: owned by Venture 2 — income flows into V2, not personal
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
    const totalPersonalOut = expenses + additionalTaxes + constructionInterest + offshoreMaint + nigeriaMaint + hardAssetsMaintEst;

    // Robinhood growth-based pulls (tax-strategic LTCG harvesting) — based on leveraged gains
    let rhPullPersonal = 0;
    let rhPullQoz = 0;
    let rhPullVenture2 = 0;
    let rhPullNonprofit = 0;
    let rhPullHardAssets = 0;
    let rhPullFreeCash = 0;
    if (robinhood > 0) {
      const rhReturn = age >= 35 ? assumptions.robinhoodReturnPost35 : assumptions.robinhoodReturn;
      const leveragedBase = robinhood * (1 + assumptions.marginPct / 100);
      const rhGrowth = leveragedBase * (rhReturn / 100);
      // Age 32 only: one-time RH pull to cover deficit (~$16K)
      if (age === 32) {
        rhPullFreeCash = rhGrowth * 0.15;
      }
      if (age >= assumptions.rhPullStartAge) {
        rhPullPersonal = rhGrowth * (assumptions.rhPullPersonalPct / 100);
      }
      // After work stops at 40: RH covers lost take-home (~$53K/yr)
      // Pull enough to replace W2 take-home that no longer exists
      if (age >= 40) {
        const lostTakeHome = assumptions.w2Gross - assumptions.w2Gross * (assumptions.k401Rate / 100) - assumptions.w2Gross * (assumptions.personalTaxRate / 100);
        rhPullFreeCash = Math.min(lostTakeHome, rhGrowth * 0.15); // cap at 15% of gains
      }
      // QOZ contributions start at 35
      if (age >= assumptions.rhPullQozStartAge) {
        rhPullQoz = rhGrowth * (assumptions.rhPullQozPct / 100);
      }
      if (age >= assumptions.venture2StartAge) {
        rhPullVenture2 = rhGrowth * (assumptions.venture2RhPullPct / 100);
      }
      // Nonprofit contributions start at 31
      if (age >= assumptions.nonprofitStartAge) {
        rhPullNonprofit = rhGrowth * (assumptions.nonprofitRhPullPct / 100);
      }
      // Hard assets purchases start at 33
      if (age >= assumptions.hardAssetsStartAge) {
        rhPullHardAssets = rhGrowth * (assumptions.hardAssetsRhPullPct / 100);
      }
    }

    // LTCG tax on Robinhood pulls (15% rate)
    // Nonprofit donations are tax-deductible — offset LTCG on that portion
    const rhPullTax = (rhPullPersonal + rhPullQoz + rhPullVenture2 + rhPullHardAssets + rhPullFreeCash) * 0.15; // nonprofit pull is a charitable deduction, no LTCG

    // ═══════════════════════════════════════════════════════════
    // TOTAL TAX BURDEN (all sources)
    // ═══════════════════════════════════════════════════════════
    const totalTax = personalTaxes + distributionTax + additionalTaxes + rhPullTax + employerPayrollTax;
    const totalGrossIncome = w2Gross + grossDistributions + Math.max(0, ayoolaRentalShare) + rhPullPersonal + rhPullQoz + rhPullVenture2 + rhPullHardAssets + rhPullFreeCash + rhPullNonprofit + farmIncomeForTax;
    const effectiveTaxRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;

    // Farm income: land produces $50K/yr starting at 35 (ventures staff + self/family/volunteer labor)
    // No additional expense — labor covered by existing ventures overhead + sweat equity
    let farmIncome = 0;
    if (age >= assumptions.farmIncomeStartAge && acres > 0) {
      const farmYears = age - assumptions.farmIncomeStartAge;
      farmIncome = assumptions.farmIncomeAnnual * Math.pow(1 + assumptions.farmIncomeGrowth / 100, farmYears);
    }

    // Total personal inflows (includes Robinhood pulls for expenses + farm income)
    // Ventures handles its own P&L (10% net loss); no profit distributed to personal
    const totalPersonalIn = takeHome + Math.max(0, ayoolaRentalShare) + rhPullPersonal + rhPullFreeCash + farmIncome;

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

    // 401k: pre-tax growth, contributions come from W2 deduction (already subtracted from take-home)
    k401 = k401 * (1 + assumptions.k401Return / 100) + k401Contrib;

    // 401k loan: borrow max available (50% of balance, cap $50K) → deploy to Robinhood
    // No tax, no penalty — interest paid back to yourself. Repaid over 5 years.
    let k401LoanDeploy = 0;
    if (age >= assumptions.currentAge && k401 > 0) {
      const maxLoan = Math.min(k401 * 0.5, 50000);
      k401LoanDeploy = maxLoan;
      k401 -= k401LoanDeploy; // borrowed out (repayment modeled via continued contributions)
    }

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
    robinhood = robinhood + grossGrowth - marginInterest + netDistributions - rhPullPersonal - rhPullQoz - rhPullVenture2 - rhPullNonprofit - rhPullHardAssets - rhPullFreeCash + k401LoanDeploy + freeCashToRobinhood;

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
    // V1 Staffing: grows on schedule starting at v1StaffStartAge
    if (age >= assumptions.v1StaffStartAge) {
      const yearsHiring = age - assumptions.v1StaffStartAge;
      v1Employees = assumptions.v1StaffInitial + Math.floor(yearsHiring / assumptions.v1StaffGrowthInterval);
    } else {
      v1Employees = 0;
    }
    const v1StaffCost = v1Employees * assumptions.v1EmployeeCost;
    // Overhead reduced once ops hub is running (handles admin/accounting/HR centrally)
    const v1OverheadRate = age >= assumptions.opsHubStartAge ? 0.01 : 0.03; // 3% → 1% with ops hub
    const venturesOpsOverhead = Math.max(0, ventures) * v1OverheadRate;
    const venturesOpsLoss = v1StaffCost + venturesOpsOverhead;
    const venturesInvestGain = Math.max(0, ventures) * (assumptions.venturesReturn / 100); // 12% on invested cash
    const venturesNetGain = venturesInvestGain - venturesOpsLoss;
    ventures = ventures + venturesLoanDraw + venturesNetGain;
    // Investment profits pay down LOC when net positive
    if (venturesNetGain > 0 && venturesLocDebt > 0) {
      const locPaydown = Math.min(venturesLocDebt, venturesNetGain * 0.5); // 50% of net profit → LOC paydown
      venturesLocDebt -= locPaydown;
    }

    // ═══════════════════════════════════════════════════════════
    // VENTURE 2: RH-funded operating business with revolving LOC
    // RH pull (10% of gains) → covers LOC debt service (P&I)
    // Venture generates matching own income → reinvested for growth
    // LOC sized so P&I = RH pull; venture keeps borrowing indefinitely
    // ═══════════════════════════════════════════════════════════
    let v2LocDraw = 0;
    let v2DebtService = 0;
    let v2SelfIncome = 0;
    if (age >= assumptions.venture2StartAge) {
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

      // V2 Staffing: grows on schedule starting at v2StaffStartAge
      if (age >= assumptions.v2StaffStartAge) {
        const v2YearsHiring = age - assumptions.v2StaffStartAge;
        v2Employees = assumptions.v2StaffInitial + Math.floor(v2YearsHiring / assumptions.v2StaffGrowthInterval);
      } else {
        v2Employees = 0;
      }
      const v2StaffCost = v2Employees * assumptions.v2EmployeeCost;

      // Nigeria Ops Hub (V2 subsidiary): centralized back-office for all entities
      // HR, Accounting, Taxes, Logistics, DevOps — AI-assisted + minimal US CPA
      if (age >= assumptions.opsHubStartAge) {
        const hubYears = age - assumptions.opsHubStartAge;
        opsHubEmployees = assumptions.opsHubInitialStaff + Math.floor(hubYears / assumptions.opsHubGrowthInterval);
      } else {
        opsHubEmployees = 0;
      }
      opsHubCost = opsHubEmployees > 0
        ? (opsHubEmployees * assumptions.opsHubEmployeeCost) + assumptions.opsHubCpaFee
        : 0;

      // Venture 2 invested cash returns (12% on equity, same strategy as RH)
      const v2InvestGain = Math.max(0, venture2) * (assumptions.venture2InvestReturn / 100);

      // Update venture 2: new LOC draw + own income + investment gains - staff - ops hub
      venture2Loc = Math.max(0, venture2Loc + v2LocDraw - v2PrincipalPaydown);
      venture2 = venture2 + v2LocDraw + v2SelfIncome + v2InvestGain - v2StaffCost - opsHubCost;
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

      // Nonprofit Staffing: grows on schedule
      if (age >= assumptions.npStaffStartAge) {
        const npYearsHiring = age - assumptions.npStaffStartAge;
        npEmployees = assumptions.npStaffInitial + Math.floor(npYearsHiring / assumptions.npStaffGrowthInterval);
      } else {
        npEmployees = 0;
      }
      const npStaffCost = npEmployees * assumptions.npEmployeeCost;

      // Ops costs: staff + overhead funded via LOC (programs, admin)
      // Overhead reduced once ops hub handles admin/accounting centrally
      const npOverheadRate = age >= assumptions.opsHubStartAge
        ? assumptions.nonprofitOpsLossPct / 100 * 0.5  // halved with ops hub
        : assumptions.nonprofitOpsLossPct / 100;
      const npOverhead = Math.max(0, nonprofit) * npOverheadRate;
      const npOpsCost = npStaffCost + npOverhead;
      nonprofitLoc += npOpsCost; // ops go on credit
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

    // Debt payoff at 52 (20yr from 32) — construction loan paid from RH (LTCG)
    // Construction is interest-only, so payoff = original draw amount ($500K)
    if (age === assumptions.constructionLoanAge + 20) {
      const constructionPayoff = assumptions.constructionLoanAmount; // $500K — interest-only, no amortization
      if (constructionPayoff > 0 && landMortgage >= constructionPayoff) {
        robinhood -= constructionPayoff * 1.08; // principal + ~8% LTCG tax
        landMortgage -= constructionPayoff;
        landEquity += constructionPayoff;
      }
    }
    if (age === assumptions.venturesLocAge + 20) {
      if (venturesLocDebt > 0) {
        robinhood -= venturesLocDebt * 1.08; // principal + ~8% LTCG tax estimate
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

    // Seattle: appreciates + principal paydown, OR sell at target age
    let seattleProceeds = 0;
    if (age === assumptions.seattleSaleAge && seattleEquity > 0) {
      // Sell: home value = equity + remaining mortgage
      seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100) + assumptions.seattlePrincipal;
      const remainingMortgage = assumptions.seattleMortgageBalance - (age - assumptions.currentAge) * assumptions.seattlePrincipal;
      const homeValue = seattleEquity + Math.max(0, remainingMortgage);
      const sellerFees = homeValue * (assumptions.seattleSellerFeePct / 100);
      const netProceeds = homeValue - Math.max(0, remainingMortgage) - sellerFees;
      seattleProceeds = netProceeds / 2; // 50% split — used for land down payment first
      seattleEquity = 0; // property sold
    } else if (seattleEquity > 0) {
      seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100) + assumptions.seattlePrincipal;
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

    // Offshore (Belize/Costa Rica): cash purchase from RH at 33
    if (age === assumptions.offshorePurchaseAge) {
      robinhood -= assumptions.offshorePurchasePrice;
      offshoreEquity += assumptions.offshorePurchasePrice;
    }
    if (offshoreEquity > 0) {
      offshoreEquity = offshoreEquity * (1 + assumptions.offshoreAppreciation / 100);
    }

    // Nigeria: cash purchase from RH at 35
    if (age === assumptions.nigeriaPurchaseAge) {
      robinhood -= assumptions.nigeriaPurchasePrice;
      nigeriaEquity += assumptions.nigeriaPurchasePrice;
    }
    if (nigeriaEquity > 0) {
      nigeriaEquity = nigeriaEquity * (1 + assumptions.nigeriaAppreciation / 100);
    }

    // City rental property: owned by Venture 2 — $300K down from V2 balance at 40
    if (age === assumptions.rentalPurchaseAge) {
      venture2 -= assumptions.rentalDownPayment; // V2 funds the down payment
      rentalEquity += assumptions.rentalDownPayment;
      rentalMortgage += assumptions.rentalPurchasePrice - assumptions.rentalDownPayment;
    }
    // Rental net income flows into Venture 2 (not personal)
    if (rentalNetIncome !== 0 && age >= assumptions.rentalPurchaseAge) {
      venture2 += rentalNetIncome;
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
    const netWorth = k401 + ira + robinhood + (seattleEquity * 0.5) + landEquity + offshoreEquity + nigeriaEquity + rentalEquity + qozFund + (ventures - venturesLocDebt) + (venture2 - venture2Loc) + venture3 + (nonprofit - nonprofitLoc) + hardAssets - ccDebt;

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
      venture3: Math.round(venture3),
      v1Employees,
      v2Employees,
      npEmployees,
      opsHubEmployees,
      opsHubCost: Math.round(opsHubCost),
      venture3Employees,
      v3Seed: Math.round(v3Seed),
      v3V2Contrib: Math.round(v3V2Contrib),
      v3NpContrib: Math.round(v3NpContrib),
      familyFundDeploy: Math.round(familyFundDeploy),
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
      ntNewWorkIncome: Math.round(ntNewWorkIncome),
      freeCashSources: {
        takeHome,
        w2Gross,
        ntRevenue,
        grossDistributions,
        netDistributions,
        distributionTax: -distributionTax,
        ntNewWork: ntNewWorkIncome,
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
