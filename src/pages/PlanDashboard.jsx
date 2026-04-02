import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { api } from '../lib/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DESCRIPTIONS = {
  seattle: "10737 3rd Ave NW — 50/50 co-owned rental. Both contribute $1K/mo toward costs, reduced $100/yr until breakeven. Profit split 50/50. Either party can trigger sale (other gets first dibs to buy).",
  land: "Rural land acquisitions — financed with down payment + mortgage, appreciating ~4%/year",
  qoz: "Qualified Opportunity Zone Fund — Robinhood gains rolled in tax-deferred, 501(c)(3) operates permaculture/community programs on OZ land. After 10yr hold, all new appreciation is tax-free.",
  k401: "Ayoola's 401k + Robinhood IRA",
  freeCash: "Annual surplus after taxes, expenses, contributions, and debt service",
  netWorth: "Total assets minus liabilities (Ayoola's share only)",
  ayoolaIncome: "Ayoola's W2 salary from NimbusTech S-Corp",
  robinhood: "Robinhood Individual Brokerage — receives S-Corp distributions + Ayoola's fund strategy at ~30% returns",
  distributions: "S-Corp distributions — NT revenue minus W2 salary and employer payroll taxes, taxed as personal income, flows to Robinhood",
  w2: "W2 salary from NimbusTech S-Corp — $40/hr via Gusto",
};

export default function PlanDashboard() {
  const [targetAge1, setTargetAge1] = useState(40);
  const [activeChart, setActiveChart] = useState('netWorth');
  const [showInputs, setShowInputs] = useState(false);
  const [settingsTab, setSettingsTab] = useState('overview');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [ntNewWorkEnabled, setNtNewWorkEnabled] = useState(false); // toggle: NT wins additional $5K/mo work
  const tableContainerRef = useRef(null);

  const [liveBalancesLoaded, setLiveBalancesLoaded] = useState(false);

  const [assumptions, setAssumptions] = useState({
    // ═══════════════════════════════════════════════════════════════
    // STARTING BALANCES (real as of April 2026, post-divorce settlement)
    // ═══════════════════════════════════════════════════════════════
    currentAge: 31,           // Dec birthday — currently 31, turns 32 Dec 2026
    k401Start: 14819,         // Human Interest 401k (real: $14,818.55)
    iraStart: 4588,           // Robinhood Traditional IRA (real: $4,588.22)
    robinhoodStart: 82168,    // Robinhood Individual Brokerage (real: $82,167.79)
    seattleEquityStart: 134633, // $1.1M value - $965,367 mortgage (total equity; 50% counted)
    ccDebtStart: 0,           // Chase CC paid off, Cap One split 50/50 in divorce → $0
    cashStart: 135,           // $6,835 - $6,700 (CC settlement from savings) ≈ $135

    // ═══════════════════════════════════════════════════════════════
    // W2 INCOME (from Gusto pay stub: $40/hr via AAYO Tech / Nimbus Tech)
    // ═══════════════════════════════════════════════════════════════
    hourlyRate: 40,           // actual Gusto rate
    hoursPerYear: 2080,       // 40 hrs/wk × 52 (conservative; actual pace ~2,250)
    w2Gross: 80000,           // ~$40/hr × 2,000 hrs (user confirmed: high month on stub)
    k401Rate: 20,             // 20% of gross to 401k (from pay stub: $768/$3,840)
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
    iraReturn: 30,            // Robinhood IRA — same fund strategy
    qozReturn: 6,             // QOZ fund — land appreciation + modest development (tax-free after 10yr)
    qozInvestAge: 42,         // age to roll Robinhood gains into QOZ fund
    qozInvestAmount: 600000,  // ~100 acres at $6K/acre via QOZ
    qozTaxFreeAge: 52,        // 10yr hold = all new gains tax-free
    homeAppreciation: 6,      // Seattle home appreciation
    landAppreciation: 4,      // rural land appreciation

    // ═══════════════════════════════════════════════════════════════
    // LAND (first 20-acre purchase — Ayoola will live on this land)
    // Equipment, infrastructure, offshore, expansion DEFERRED
    // ═══════════════════════════════════════════════════════════════
    landPricePerAcre: 6000,
    landDownPaymentPct: 20,
    landMortgageRate: 7.5,
    landPrincipalPerAcre: 300,
    landPurchase1Age: 31,     // initial 20 acres (live on this, mortgage included in living expenses)
    landPurchase1Acres: 20,
    landHousingCost: 12000,   // ~$1K/mo for basic structure on land

    // ═══════════════════════════════════════════════════════════════
    // SEATTLE RENTAL (50/50 co-owned with ex-wife)
    // Both contribute $1K/mo toward costs, reduced $100/mo/yr until breakeven
    // ═══════════════════════════════════════════════════════════════
    seattleCurrentValue: 1100000,
    seattleMortgageBalance: 965367,
    seattleMortgageRate: 3.25,
    grossRentYear1: 72000,        // ~$6K/mo market rent
    mortgagePayment: 67200,       // annual mortgage (P&I)
    propertyTaxes: 12000,
    insurance: 2400,
    propertyManagement: 7200,     // ~10% of gross rent
    maintenanceRate: 10,          // % of rent
    vacancyRate: 5,
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

    // Phase 3 (38): Gap year — minimal NT work
    phase3NTRevenue: 50000,

    // Phase 4 (36-45): Building phase — land business growing
    phase4NTRevenue: 50000,
    phase4BusinessIncome: 0,       // starts at 0, grows $15K/yr

    // Phase 5 (46+): Coast mode — land business mature
    phase5NTRevenue: 50000,
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
  });

  // Pull live account balances from Supabase to sync with projections
  useEffect(() => {
    if (liveBalancesLoaded) return;
    api.getAccounts(false).then(data => {
      if (!data.accounts || data.accounts.length === 0) return;
      const updates = {};
      data.accounts.forEach(a => {
        const bal = Math.abs(a.current_balance || 0);
        const id = a.account_id;
        const sub = a.subtype || '';
        const name = (a.name || '').toLowerCase();

        // Map live accounts to plan assumptions (Ayoola's only)
        if (id === 'manual_ayoola_401k' || sub === '401k') {
          if (name.includes('ayoola') || a.owner === 'Ayoola') updates.k401Start = Math.round(bal);
        }
      });

      if (Object.keys(updates).length > 0) {
        setAssumptions(prev => ({ ...prev, ...updates }));
        setLiveBalancesLoaded(true);
      }
    }).catch(() => {});
  }, [liveBalancesLoaded]);

  // Auto-scroll table to selected age row when ticker/slider changes
  useEffect(() => {
    if (!tableContainerRef.current) return;
    const row = tableContainerRef.current.querySelector(`tr[data-age="${targetAge1}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [targetAge1]);

  const toggleTooltip = (id) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const data = useMemo(() => {
    const years = [];
    let k401 = assumptions.k401Start;
    let ira = assumptions.iraStart;
    let robinhood = assumptions.robinhoodStart;
    let seattleEquity = assumptions.seattleEquityStart; // total equity (50% counted in NW)
    let acres = 0;
    let landEquity = 0;
    let landMortgage = 0;
    let ccDebt = assumptions.ccDebtStart;
    let cash = assumptions.cashStart; // tracks actual cash reserves
    let qozFund = 0;

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
      } else if (age === 38) {
        ntRevenue = assumptions.phase3NTRevenue;
      } else if (age <= 45) {
        ntRevenue = assumptions.phase4NTRevenue;
        businessIncome = Math.max(0, (age - 39) * 15000) + assumptions.phase4BusinessIncome;
        staffExpenses = age <= 40 ? 35000 : 35000 + Math.min((age - 40) * 10000, assumptions.staffExpensesMax - 35000);
      } else {
        ntRevenue = assumptions.phase5NTRevenue;
        businessIncome = assumptions.phase5BusinessIncome + (age - 46) * assumptions.phase5BusinessGrowth;
        staffExpenses = assumptions.staffExpensesMax;
      }

      // NT additional work toggle: extra revenue → all to distributions
      let ntNewWorkIncome = 0;
      if (ntNewWorkEnabled) {
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
      const w2Gross = Math.min(assumptions.w2Gross, ntRevenue); // can't pay more than NT earns
      const employerPayrollTax = w2Gross * (assumptions.employerPayrollTaxRate / 100);
      const ntOverhead = w2Gross + employerPayrollTax;
      const grossDistributions = Math.max(0, ntRevenue - ntOverhead) + ntNewWorkIncome;
      const distributionTax = grossDistributions * (assumptions.distributionTaxRate / 100);
      const netDistributions = grossDistributions - distributionTax; // after-tax → flows to Robinhood

      // ═══════════════════════════════════════════════════════════
      // STEP 3: W2 → 401k + TAXES + TAKE-HOME (closed loop)
      // ═══════════════════════════════════════════════════════════
      const k401Contrib = age <= 45 ? w2Gross * (assumptions.k401Rate / 100) : 0;
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

      if (age >= 32) {
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
          ayoolaRentalShare = rentalNet * 0.5; // 50% of profit
        } else {
          ayoolaRentalShare = -ayoolaContrib; // cost is his contribution
        }
      }

      // Land mortgage payment (principal + interest) — comes from personal cash
      let landMortgagePayment = 0;
      if (landMortgage > 0) {
        const landInterest = landMortgage * (assumptions.landMortgageRate / 100);
        const landPrincipal = Math.min(landMortgage, acres * assumptions.landPrincipalPerAcre);
        landMortgagePayment = landInterest + landPrincipal;
      }

      // Business income taxes (on rental share + business income)
      const additionalTaxableIncome = Math.max(0, ayoolaRentalShare) + businessIncome;
      const additionalTaxes = additionalTaxableIncome * 0.15; // ~15% effective on additional income

      // Total personal outflows
      // Note: ayoolaContrib ($1K/mo rental) is INCLUDED in livingExpenses ($50K) — do NOT add separately
      // Note: landMortgagePayment (~$1K/mo) is INCLUDED in livingExpenses ($50K) — Ayoola lives on the land
      const totalPersonalOut = expenses + staffExpenses + additionalTaxes;

      // Total personal inflows
      const totalPersonalIn = takeHome + Math.max(0, ayoolaRentalShare) + businessIncome;

      // Free cash = what's left after everything
      const freeCash = totalPersonalIn - totalPersonalOut;

      // Track cumulative cash position
      cash += freeCash;

      // ═══════════════════════════════════════════════════════════
      // STEP 5: INVESTMENT GROWTH (returns compound on existing balances)
      // ═══════════════════════════════════════════════════════════

      // 401k: pre-tax growth, contributions come from W2 deduction (already subtracted from take-home)
      k401 = k401 * (1 + assumptions.k401Return / 100) + k401Contrib;

      // IRA: grows on existing balance, no new contributions
      ira = ira * (1 + assumptions.iraReturn / 100);

      // Robinhood: grows on existing balance + receives S-Corp distributions (after-tax)
      const rhReturn = age >= 35 ? assumptions.robinhoodReturnPost35 : assumptions.robinhoodReturn;
      robinhood = robinhood * (1 + rhReturn / 100) + netDistributions;

      // QOZ Fund — roll Robinhood gains in at target age, grows tax-free after 10yr hold
      if (age === assumptions.qozInvestAge) {
        const qozAmount = Math.min(assumptions.qozInvestAmount, robinhood);
        robinhood -= qozAmount; // capital gains rolled out of Robinhood (tax-deferred)
        qozFund += qozAmount;
      }
      qozFund = qozFund * (1 + assumptions.qozReturn / 100); // appreciation (tax-free after 10yr hold)

      // ═══════════════════════════════════════════════════════════
      // STEP 6: REAL ESTATE EQUITY CHANGES
      // ═══════════════════════════════════════════════════════════

      // Seattle: appreciates + principal paydown (50% of equity counted in NW)
      seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100) + assumptions.seattlePrincipal;

      // Land: appreciation + principal paydown (mortgage payment already expensed above)
      if (landMortgage > 0 || landEquity > 0) {
        const totalLandValue = landEquity + landMortgage;
        const appreciatedValue = totalLandValue * (1 + assumptions.landAppreciation / 100);
        const appreciationGain = appreciatedValue - totalLandValue;
        landEquity += appreciationGain;

        if (landMortgage > 0) {
          const landPrincipal = Math.min(landMortgage, acres * assumptions.landPrincipalPerAcre);
          landMortgage -= landPrincipal;
          landEquity += landPrincipal;
        }
      }

      // Land purchase: down payment from Robinhood (personal brokerage)
      if (age === assumptions.landPurchase1Age) {
        const purchasePrice = assumptions.landPurchase1Acres * assumptions.landPricePerAcre;
        const downPayment = purchasePrice * (assumptions.landDownPaymentPct / 100);
        robinhood -= downPayment; // DOWN PAYMENT FROM ROBINHOOD
        landEquity += downPayment;
        landMortgage += purchasePrice - downPayment;
        acres += assumptions.landPurchase1Acres;
      }

      // ═══════════════════════════════════════════════════════════
      // STEP 7: NET WORTH (Ayoola's share only)
      // ═══════════════════════════════════════════════════════════
      const netWorth = k401 + ira + robinhood + (seattleEquity * 0.5) + landEquity + qozFund - landMortgage;

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
        landEquity: Math.round(landEquity),
        landMortgage: Math.round(landMortgage),
        landValue: Math.round(landEquity + landMortgage),
        acres,
        rentalNet: Math.round(rentalNet),
        ayoolaRentalShare: Math.round(ayoolaRentalShare),
        qozFund: Math.round(qozFund),
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
          businessIncome,
          expenses: -expenses,
          staffExpenses: -staffExpenses,
          additionalTaxes: -additionalTaxes,
        }
      });
    }
    return years;
  }, [assumptions, ntNewWorkEnabled]);

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatMonthly = (value) => {
    return formatCurrency(Math.round(value / 12));
  };

  const getDataAtAge = (age) => data.find(d => d.age === age);
  const targetData1 = getDataAtAge(targetAge1);

  const getPieData = (ageData) => {
    if (!ageData) return [];
    return [
      { name: 'Robinhood', value: ageData.robinhood, desc: DESCRIPTIONS.robinhood },
      { name: '401k/IRA', value: ageData.k401 + ageData.ira, desc: DESCRIPTIONS.k401 },
      { name: 'Seattle (50%)', value: ageData.seattleEquity50, desc: DESCRIPTIONS.seattle },
      { name: 'Land', value: ageData.landEquity, desc: DESCRIPTIONS.land },
      { name: 'QOZ Fund', value: ageData.qozFund, desc: DESCRIPTIONS.qoz },
    ].filter(d => d.value > 0);
  };

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const row = data.find(d => d.age === label);
    
    if (activeChart === 'freeCash' && row) {
      const src = row.freeCashSources;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs">
          <div className="font-bold text-white mb-2">Age {label} — Free Cash: {formatCurrency(row.freeCash)}</div>
          <div className="space-y-1">
            <div className="text-gray-500 text-xs mb-1 pb-1 border-b border-gray-700">
              NT Revenue: {formatCurrency(src.ntRevenue)} → W2: {formatCurrency(src.w2Gross)} + Distrib: {formatCurrency(src.netDistributions)} (→ Robinhood)
            </div>
            <div className="text-emerald-400">+ Take-Home Pay: {formatCurrency(src.takeHome)}</div>
            {src.ntNewWork > 0 && <div className="text-lime-400">+ NT New Work → Distributions: {formatCurrency(src.ntNewWork)}</div>}
            {src.rentalShare !== 0 && <div className="text-blue-400">+ Rental (50%): {formatCurrency(src.rentalShare)}</div>}
            {src.businessIncome > 0 && <div className="text-amber-400">+ Business Income: {formatCurrency(src.businessIncome)}</div>}
            <div className="text-red-400">− Living (incl ${Math.round(Math.abs(src.rentalContrib)/1000)}K rental): {formatCurrency(Math.abs(src.expenses))}</div>
            {src.landMortgagePayment < 0 && <div className="text-red-400">− Land Mortgage: {formatCurrency(Math.abs(src.landMortgagePayment))}</div>}
            {src.staffExpenses < 0 && <div className="text-red-400">− Staff: {formatCurrency(Math.abs(src.staffExpenses))}</div>}
            {src.additionalTaxes < 0 && <div className="text-orange-400">− Add'l Taxes: {formatCurrency(Math.abs(src.additionalTaxes))}</div>}
            <div className="text-gray-500 text-xs mt-1 pt-1 border-t border-gray-700">
              401k: {formatCurrency(Math.abs(src.k401Contrib))}/yr | W2 Tax: {formatCurrency(Math.abs(src.personalTaxes))}/yr (pre-deducted)
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs">
        <div className="font-bold text-white mb-1">Age {label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</div>
        ))}
      </div>
    );
  };

  const milestones = [
    { age: 31, label: 'Divorce / Reset', icon: '🔄' },
    { age: 32, label: '20 Acres + Rent House', icon: '🌱' },
    { age: 33, label: 'Own Place', icon: '🏠' },
    { age: 35, label: 'Gap Year', icon: '⏸️' },
    { age: 40, label: '100 Acres', icon: '🌾' },
    { age: 45, label: 'Coast', icon: '⛵' },
    { age: 60, label: 'Retire', icon: '👑' },
  ];

  const chartButtons = [
    { id: 'netWorth', label: 'Net Worth' },
    { id: 'assets', label: 'Assets' },
    { id: 'freeCash', label: 'Free Cash' },
    { id: 'pieChart', label: 'Pie Chart' },
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'netWorth':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomChartTooltip />} />
              <ReferenceLine x={targetAge1} stroke="#10B981" strokeDasharray="5 5" strokeWidth={2} />
              <Area type="monotone" dataKey="netWorth" stroke="#10B981" fill="url(#netWorthGradient)" strokeWidth={2} name="Net Worth" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'assets':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomChartTooltip />} />
              <ReferenceLine x={targetAge1} stroke="#10B981" strokeDasharray="5 5" strokeWidth={2} />
              <Area type="monotone" dataKey="robinhood" stackId="1" stroke="#F97316" fill="#F97316" name="Robinhood" />
              <Area type="monotone" dataKey="landEquity" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Land" />
              <Area type="monotone" dataKey="seattleEquity50" stackId="1" stroke="#10B981" fill="#10B981" name="Seattle (50%)" />
              <Area type="monotone" dataKey="k401" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="401k/IRA" />
              <Area type="monotone" dataKey="qozFund" stackId="1" stroke="#06B6D4" fill="#06B6D4" name="QOZ Fund" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'freeCash':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.filter(d => d.age <= 55)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomChartTooltip />} />
              <ReferenceLine x={targetAge1} stroke="#10B981" strokeDasharray="5 5" />
              <Bar dataKey="freeCash" radius={[4, 4, 0, 0]} name="Free Cash">
                {data.filter(d => d.age <= 55).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.freeCash < 0 ? '#EF4444' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pieChart':
        return (
          <div>
            <h2 className="text-sm text-emerald-400 mb-2 text-center font-semibold">Age {targetAge1} Allocation</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={getPieData(targetData1)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {getPieData(targetData1).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload;
                    return (
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs max-w-xs">
                        <div className="font-bold text-white mb-1">{item.name}: {formatCurrency(item.value)}</div>
                        <div className="text-gray-400">{item.desc}</div>
                        <div className="text-emerald-400 mt-1">Monthly: {formatMonthly(item.value * 0.04)}</div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-emerald-400 font-bold text-xl">{formatCurrency(targetData1?.netWorth || 0)}</div>
          </div>
        );
      default:
        return null;
    }
  };

  const InfoBadge = ({ id, label, color = 'gray' }) => {
    const isActive = activeTooltip === id;
    const colorClasses = {
      blue: 'text-blue-400 border-blue-700',
      purple: 'text-purple-400 border-purple-700',
      emerald: 'text-emerald-400 border-emerald-700',
      amber: 'text-amber-400 border-amber-700',
      pink: 'text-pink-400 border-pink-700',
      cyan: 'text-cyan-400 border-cyan-700',
      gray: 'text-gray-400 border-gray-700',
    };
    
    return (
      <div className="relative">
        <button
          onClick={() => toggleTooltip(id)}
          className={`text-xs px-2 py-1 rounded border ${colorClasses[color]} ${isActive ? 'bg-gray-700' : 'bg-transparent'} hover:bg-gray-700 transition`}
        >
          {label} ⓘ
        </button>
        {isActive && (
          <div className="absolute z-50 left-0 top-full mt-2 w-72 p-3 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-200 shadow-xl">
            {DESCRIPTIONS[id]}
            <button 
              onClick={() => setActiveTooltip(null)}
              className="absolute top-1 right-2 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  };

  // Table Header with tooltip
  const TableHeader = ({ id, label, color = 'text-gray-400', align = 'right' }) => {
    const isActive = activeTooltip === id;
    return (
      <th className={`p-2 text-${align} ${color} relative`}>
        <button 
          onClick={() => toggleTooltip(id)}
          className="hover:underline cursor-help"
        >
          {label}
        </button>
        {isActive && DESCRIPTIONS[id] && (
          <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 w-64 p-3 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-200 shadow-xl text-left font-normal">
            {DESCRIPTIONS[id]}
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }}
              className="absolute top-1 right-2 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </th>
    );
  };

  // Stat Card with hover breakdown
  const StatCard = ({ id, label, value, breakdown, monthly, borderColor = 'gray-800' }) => {
    const isActive = activeCard === id;
    
    return (
      <div 
        className={`bg-gray-900 rounded-xl p-4 border border-${borderColor} relative cursor-pointer transition hover:bg-gray-800`}
        onMouseEnter={() => setActiveCard(id)}
        onMouseLeave={() => setActiveCard(null)}
        onClick={() => setActiveCard(isActive ? null : id)}
      >
        <div className="text-gray-400 text-xs">{label}</div>
        <div className="text-2xl font-bold" style={{ color: borderColor.includes('emerald') ? '#10B981' : borderColor.includes('blue') ? '#3B82F6' : borderColor.includes('amber') ? '#F59E0B' : borderColor.includes('purple') ? '#A855F7' : '#fff' }}>
          {value}
        </div>
        
        {isActive && breakdown && (
          <div className="absolute z-50 left-0 top-full mt-2 w-80 p-4 bg-gray-800 border border-gray-600 rounded-lg text-xs shadow-xl">
            <div className="font-bold text-white mb-2 border-b border-gray-700 pb-2">
              {label} Breakdown
            </div>
            <div className="space-y-1">
              {breakdown.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className={item.color}>{item.label}</span>
                  <span className="text-white">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
            {monthly && (
              <div className="mt-3 pt-2 border-t border-gray-700">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-400">Monthly</span>
                  <span className="text-emerald-400">{monthly}/mo</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Generate breakdowns for cards
  const getNetWorthBreakdown = (d) => {
    if (!d) return [];
    return [
      { label: 'Robinhood', value: d.robinhood, color: 'text-orange-400' },
      { label: '401k/IRA', value: d.k401 + d.ira, color: 'text-purple-400' },
      { label: 'Seattle (50%)', value: d.seattleEquity50, color: 'text-emerald-400' },
      { label: 'Land', value: d.landEquity, color: 'text-amber-400' },
      { label: 'QOZ Fund', value: d.qozFund, color: 'text-cyan-400' },
    ].filter(item => item.value !== 0);
  };

  const getPassiveIncomeBreakdown = (d) => {
    if (!d) return [];
    return [
      { label: '4% Safe Withdrawal', value: d.safeWithdrawal, color: 'text-emerald-400' },
      { label: 'Rental (50%)', value: d.ayoolaRentalShare, color: 'text-blue-400' },
      { label: 'Business Income', value: d.businessIncome, color: 'text-amber-400' },
    ].filter(item => item.value !== 0);
  };

  const getFreeCashBreakdown = (d) => {
    if (!d) return [];
    const src = d.freeCashSources;
    const items = [
      { label: 'Take-Home Pay', value: src.takeHome, color: 'text-green-400' },
      { label: 'Rental (50%)', value: src.rentalShare, color: 'text-blue-400' },
      { label: 'Business Income', value: src.businessIncome, color: 'text-amber-400' },
      { label: 'Living Expenses', value: src.expenses, color: 'text-red-400' },
      { label: 'Staff Expenses', value: src.staffExpenses, color: 'text-red-400' },
      { label: 'Additional Taxes', value: src.additionalTaxes, color: 'text-orange-300' },
    ].filter(item => item.value !== undefined && item.value !== 0);

    if (src.netDistributions > 0) {
      items.push({ label: `S-Corp Distrib → Robinhood`, value: src.netDistributions, color: 'text-blue-400' });
    }
    return items;
  };

  return (
    <div className="text-white p-4" onClick={(e) => {
      if (e.target === e.currentTarget) {
        setActiveTooltip(null);
        setActiveCard(null);
      }
    }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Ayoola's Wealth Map
        </h1>
        <p className="text-gray-400 text-sm mt-1">Ages 31 → 85</p>
      </div>

      {/* Age Selector */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <div className="flex flex-wrap gap-6 items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-semibold">Target Age:</span>
            <input
              type="range"
              min="31"
              max="85"
              value={targetAge1}
              onChange={(e) => setTargetAge1(parseInt(e.target.value))}
              className="w-48 accent-emerald-400"
            />
            <span className="text-3xl font-bold text-emerald-400 w-12">{targetAge1}</span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <StatCard 
          id="nw1"
          label={`Net Worth @ ${targetAge1}`}
          value={formatCurrency(targetData1?.netWorth || 0)}
          breakdown={getNetWorthBreakdown(targetData1)}
          monthly={formatMonthly(targetData1?.netWorth * 0.04 || 0)}
          borderColor="emerald-800"
        />
        <StatCard 
          id="fc1"
          label={`Free Cash @ ${targetAge1}`}
          value={formatCurrency(targetData1?.freeCash || 0)}
          breakdown={getFreeCashBreakdown(targetData1)}
          monthly={formatMonthly(targetData1?.freeCash || 0)}
          borderColor="gray-800"
        />
        <StatCard 
          id="pi1"
          label={`Passive Income @ ${targetAge1}`}
          value={`${formatCurrency(targetData1?.passiveIncome || 0)}/yr`}
          breakdown={getPassiveIncomeBreakdown(targetData1)}
          monthly={formatMonthly(targetData1?.passiveIncome || 0)}
          borderColor="cyan-800"
        />
        <StatCard 
          id="land1"
          label={`Land @ ${targetAge1}`}
          value={`${targetData1?.acres || 0} acres`}
          breakdown={[
            { label: 'Land Value', value: targetData1?.landValue || 0, color: 'text-amber-300' },
            { label: 'Land Equity', value: targetData1?.landEquity || 0, color: 'text-amber-400' },
            { label: 'Land Mortgage', value: -(targetData1?.landMortgage || 0), color: 'text-red-400' },
          ]}
          borderColor="amber-800"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <StatCard
          id="rental"
          label={`Seattle 50% Equity @ ${targetAge1}`}
          value={formatCurrency(targetData1?.seattleEquity50 || 0)}
          breakdown={[
            { label: 'Total Home Equity', value: targetData1?.seattleEquity || 0, color: 'text-gray-400' },
            { label: 'Your 50% Share', value: targetData1?.seattleEquity50 || 0, color: 'text-emerald-400' },
            { label: 'Your Rental Share/yr', value: targetData1?.ayoolaRentalShare || 0, color: 'text-blue-400' },
            { label: 'Total Rental Net/yr', value: targetData1?.rentalNet || 0, color: 'text-gray-500' },
          ]}
          monthly={formatMonthly(targetData1?.ayoolaRentalShare || 0)}
          borderColor="emerald-800"
        />
        <StatCard 
          id="year"
          label={`Calendar Year @ ${targetAge1}`}
          value={`${2026 + (targetAge1 - 31)}`}
          breakdown={[
            { label: 'Years from now', value: targetAge1 - 31, color: 'text-gray-400' },
          ]}
          borderColor="gray-800"
        />
      </div>

      {/* Combined Chart Widget */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <div className="flex gap-2 mb-4">
          {chartButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveChart(btn.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeChart === btn.id 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {renderChart()}
      </div>

      {/* Data Table */}
      <div ref={tableContainerRef} className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="p-2 text-left">Age</th>
              <TableHeader id="w2" label="W2" color="text-green-400" />
              <TableHeader id="distributions" label="Distrib" color="text-blue-400" />
              <TableHeader id="robinhood" label="Robinhood" color="text-orange-400" />
              <TableHeader id="k401" label="401k/IRA" color="text-purple-400" />
              <TableHeader id="seattle" label="Seattle 50%" color="text-emerald-400" />
              <TableHeader id="land" label="Land" color="text-amber-400" />
              <TableHeader id="qoz" label="QOZ Fund" color="text-cyan-400" />
              <TableHeader id="freeCash" label="Free $" color="text-gray-400" />
              <TableHeader id="netWorth" label="Net Worth" color="text-white font-bold" />
            </tr>
          </thead>
          <tbody>
            {data.filter(d => d.age <= 50 || d.age % 5 === 0).map((row) => (
              <tr
                key={row.age}
                data-age={row.age}
                onClick={() => setTargetAge1(row.age)}
                className={`border-b border-gray-800/50 cursor-pointer transition-colors
                  ${row.age === targetAge1
                    ? 'bg-emerald-900/30 border-emerald-700 ring-1 ring-emerald-600/50'
                    : 'hover:bg-gray-800/50'}`}
              >
                <td className={`p-2 ${row.age === targetAge1 ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>{row.age}</td>
                <td className="p-2 text-right text-green-400">{formatCurrency(row.w2Gross)}</td>
                <td className="p-2 text-right text-blue-400">{formatCurrency(row.netDistributions)}</td>
                <td className="p-2 text-right text-orange-400">{formatCurrency(row.robinhood)}</td>
                <td className="p-2 text-right text-purple-400">{formatCurrency(row.k401 + row.ira)}</td>
                <td className="p-2 text-right text-emerald-400">{formatCurrency(row.seattleEquity50)}</td>
                <td className="p-2 text-right text-amber-400">{formatCurrency(row.landEquity)}</td>
                <td className="p-2 text-right text-cyan-400">{formatCurrency(row.qozFund)}</td>
                <td className={`p-2 text-right ${row.freeCash < 0 ? 'text-red-400' : 'text-gray-400'}`}>{formatCurrency(row.freeCash)}</td>
                <td className="p-2 text-right font-bold text-white">{formatCurrency(row.netWorth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6 mt-6 overflow-x-auto">
        <div className="flex justify-between min-w-[500px]">
          {milestones.map((m, i) => (
            <div key={i} className={`flex flex-col items-center ${m.age === targetAge1 ? 'scale-110' : ''}`}>
              <span className="text-2xl">{m.icon}</span>
              <span className={`text-xs mt-1 ${m.age === targetAge1 ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}>{m.age}</span>
              <span className="text-xs text-gray-500">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded mt-3" />
      </div>

      {/* Scenario Toggles */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-white font-medium">NT Wins Additional Work</span>
          <span className="text-xs text-gray-500 ml-2">+$5K/mo → S-Corp distributions from July 2026</span>
        </div>
        <button
          onClick={() => setNtNewWorkEnabled(!ntNewWorkEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${ntNewWorkEnabled ? 'bg-emerald-500' : 'bg-gray-700'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${ntNewWorkEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Settings Panel */}
      <button
        onClick={() => setShowInputs(!showInputs)}
        className="w-full bg-gray-800 rounded-xl p-3 border border-gray-700 mb-4 text-sm text-gray-400 hover:bg-gray-700 transition"
      >
        {showInputs ? '▼ Hide' : '⚙️ Setup &'} Settings
      </button>

      {showInputs && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6 overflow-hidden">
          {/* Settings Tabs */}
          <div className="flex flex-wrap border-b border-gray-800">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'balances', label: '💰 Balances' },
              { id: 'income', label: '💵 Income' },
              { id: 'homes', label: '🏠 Homes' },
              { id: 'rental', label: '🏘️ Rental' },
              { id: 'land', label: '🌾 Land' },
              { id: 'investments', label: '📈 Investments' },
              { id: 'expenses', label: '💸 Expenses' },
              { id: 'milestones', label: '🎯 Timeline' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSettingsTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium transition ${
                  settingsTab === tab.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="p-4">
            
            {/* Overview */}
            {settingsTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Starting Net Worth</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {formatCurrency(assumptions.robinhoodStart + assumptions.k401Start + assumptions.iraStart + (assumptions.seattleEquityStart * 0.5) - assumptions.ccDebtStart)}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Annual Take-Home</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {formatCurrency(assumptions.w2Gross - assumptions.w2Gross * assumptions.k401Rate / 100 - assumptions.w2Gross * assumptions.personalTaxRate / 100)}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Target Retirement Age</div>
                    <div className="text-lg font-bold text-purple-400">{assumptions.retirementAge}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Initial Land Purchase</div>
                    <div className="text-lg font-bold text-amber-400">{assumptions.landPurchase1Acres} acres</div>
                  </div>
                </div>
                
                {/* Income Phase Summary */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-3">NT Revenue by Phase (W2: {formatCurrency(assumptions.w2Gross)} + distributions for remainder)</div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="text-center p-2 rounded bg-blue-900/30 border border-blue-800">
                      <div className="text-blue-400 font-semibold">Phase 1</div>
                      <div className="text-gray-400">Ages 31-35</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase1NTRevenue)}/yr</div>
                      <div className="text-gray-500">→ Distrib: {formatCurrency(Math.max(0, assumptions.phase1NTRevenue - assumptions.w2Gross - assumptions.w2Gross * assumptions.employerPayrollTaxRate / 100))}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-purple-900/30 border border-purple-800">
                      <div className="text-purple-400 font-semibold">Phase 2</div>
                      <div className="text-gray-400">Ages 36-37</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase2NTRevenue)}/yr</div>
                      <div className="text-gray-500">→ Distrib: {formatCurrency(Math.max(0, assumptions.phase2NTRevenue - assumptions.w2Gross - assumptions.w2Gross * assumptions.employerPayrollTaxRate / 100))}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-red-900/30 border border-red-800">
                      <div className="text-red-400 font-semibold">Gap Year</div>
                      <div className="text-gray-400">Age 38</div>
                      <div className="text-yellow-400 font-medium">{formatCurrency(assumptions.phase3NTRevenue)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-emerald-900/30 border border-emerald-800">
                      <div className="text-emerald-400 font-semibold">Phase 4</div>
                      <div className="text-gray-400">Ages 39-45</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase4NTRevenue)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-emerald-900/30 border border-emerald-800">
                      <div className="text-emerald-400 font-semibold">Coast</div>
                      <div className="text-gray-400">Ages 46+</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase5NTRevenue + assumptions.phase5BusinessIncome)}/yr</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Seattle Home Value</div>
                    <div className="text-emerald-400 font-semibold">{formatCurrency(assumptions.seattleCurrentValue)}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Est. Rental Income</div>
                    <div className="text-blue-400 font-semibold">{formatCurrency(assumptions.grossRentYear1)}/yr</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Robinhood Brokerage</div>
                    <div className="text-orange-400 font-semibold">{formatCurrency(assumptions.robinhoodStart)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Starting Balances */}
            {settingsTab === 'balances' && (
              <div className="space-y-4">
                <div className="text-xs text-emerald-400 font-semibold mb-2">Current Account Balances</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'currentAge', label: 'Current Age', suffix: ' yrs', step: 1 },
                    { key: 'robinhoodStart', label: 'Robinhood Brokerage', prefix: '$', step: 1000 },
                    { key: 'k401Start', label: "401k Balance", prefix: '$', step: 1000 },
                    { key: 'iraStart', label: 'IRA Balance', prefix: '$', step: 1000 },
                    { key: 'seattleEquityStart', label: 'Seattle Total Equity (50% counted)', prefix: '$', step: 1000 },
                    { key: 'ccDebtStart', label: 'CC Debt (post-divorce)', prefix: '$', step: 100 },
                    { key: 'cashStart', label: 'Cash Reserves', prefix: '$', step: 100 },
                  ].map(({ key, label, prefix, suffix, step }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{label}</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                        <input
                          type="number"
                          step={step}
                          value={assumptions[key]}
                          onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })}
                          className="bg-transparent w-full py-2 text-white text-sm outline-none"
                        />
                        {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Calculated Summary */}
                <div className="bg-gray-800 rounded-lg p-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Starting Net Worth (Calculated)</span>
                    <span className="text-emerald-400 font-bold">
                      {formatCurrency(
                        assumptions.robinhoodStart + assumptions.k401Start + assumptions.iraStart +
                        (assumptions.seattleEquityStart * 0.5) - assumptions.ccDebtStart
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Income Phases */}
            {settingsTab === 'income' && (
              <div className="space-y-4">
                {/* W2 Structure (from pay stub) */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2 font-semibold">W2 Structure (from Gusto pay stub)</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">W2 Gross/yr</label>
                      <div className="flex items-center bg-gray-700 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.w2Gross} onChange={(e) => setAssumptions({ ...assumptions, w2Gross: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">401k Rate</label>
                      <div className="flex items-center bg-gray-700 rounded px-2">
                        <input type="number" step="1" value={assumptions.k401Rate} onChange={(e) => setAssumptions({ ...assumptions, k401Rate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tax Withholding</label>
                      <div className="flex items-center bg-gray-700 rounded px-2">
                        <input type="number" step="0.25" value={assumptions.personalTaxRate} onChange={(e) => setAssumptions({ ...assumptions, personalTaxRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Take-Home/yr</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(assumptions.w2Gross - assumptions.w2Gross * assumptions.k401Rate / 100 - assumptions.w2Gross * assumptions.personalTaxRate / 100)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">401k: {formatCurrency(assumptions.w2Gross * assumptions.k401Rate / 100)}/yr | Taxes: {formatCurrency(assumptions.w2Gross * assumptions.personalTaxRate / 100)}/yr (deducted before take-home)</div>
                </div>

                {/* Phase 1 */}
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
                  <div className="text-xs text-blue-400 mb-2 font-semibold">Phase 1: Ages {assumptions.currentAge}-35 — NT Full Capacity</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">NT Total Revenue</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.phase1NTRevenue} onChange={(e) => setAssumptions({ ...assumptions, phase1NTRevenue: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ Your W2</label>
                      <div className="bg-blue-900/30 rounded px-2 py-2 text-blue-400 font-medium">{formatCurrency(assumptions.w2Gross)}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ Distributions</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">{formatCurrency(Math.max(0, assumptions.phase1NTRevenue - assumptions.w2Gross - assumptions.w2Gross * assumptions.employerPayrollTaxRate / 100))}</div>
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-800">
                  <div className="text-xs text-purple-400 mb-2 font-semibold">Phase 2: Ages 36-37 — Transition</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">NT Total Revenue</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.phase2NTRevenue} onChange={(e) => setAssumptions({ ...assumptions, phase2NTRevenue: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ Your W2</label>
                      <div className="bg-purple-900/30 rounded px-2 py-2 text-purple-400 font-medium">{formatCurrency(Math.min(assumptions.w2Gross, assumptions.phase2NTRevenue))}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ Distributions</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">{formatCurrency(Math.max(0, assumptions.phase2NTRevenue - assumptions.w2Gross - assumptions.w2Gross * assumptions.employerPayrollTaxRate / 100))}</div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
                  <div className="text-xs text-red-400 mb-2 font-semibold">Phase 3: Age 38 — Gap Year</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">NT Revenue (reduced)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.phase3NTRevenue} onChange={(e) => setAssumptions({ ...assumptions, phase3NTRevenue: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ Your W2</label>
                      <div className="bg-red-900/30 rounded px-2 py-2 text-yellow-400 font-medium">{formatCurrency(Math.min(assumptions.w2Gross, assumptions.phase3NTRevenue))}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ Distributions</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-red-400 font-medium">{formatCurrency(Math.max(0, assumptions.phase3NTRevenue - assumptions.w2Gross - assumptions.w2Gross * assumptions.employerPayrollTaxRate / 100))}</div>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">Lean year — NT winds down, land business starting</div>
                </div>

                {/* Phase 4 */}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Phase 4: Ages 39-45 — Building</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">NT Revenue (maintenance)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.phase4NTRevenue} onChange={(e) => setAssumptions({ ...assumptions, phase4NTRevenue: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Business Income Growth</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 text-sm">+$15K/yr from age 39</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">S-Corp distributions flow to Robinhood. Land business income ramps $15K/yr.</div>
                </div>

                {/* Phase 5 */}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Phase 5: Ages 46+ — Coast Mode</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'phase5NTRevenue', label: 'NT Revenue (consulting)' },
                      { key: 'phase5BusinessIncome', label: 'Business Income (Start)' },
                      { key: 'phase5BusinessGrowth', label: 'Business Growth/yr' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 block mb-1">{label}</label>
                        <div className="flex items-center bg-gray-800 rounded px-2">
                          <span className="text-gray-500 text-sm">$</span>
                          <input type="number" step="1000" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                          <span className="text-gray-500 text-xs">/yr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Homes */}
            {settingsTab === 'homes' && (
              <div className="space-y-4">
                {/* Seattle Home */}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">🏠 Seattle Home — 10737 3rd Ave NW</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'seattleCurrentValue', label: 'Current Value', prefix: '$' },
                      { key: 'seattleMortgageBalance', label: 'Mortgage Balance', prefix: '$' },
                      { key: 'seattleMortgageRate', label: 'Interest Rate', suffix: '%', step: 0.125 },
                      { key: 'seattlePrincipal', label: 'Principal Paydown/yr', prefix: '$' },
                    ].map(({ key, label, prefix, suffix, step }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 block mb-1">{label}</label>
                        <div className="flex items-center bg-gray-800 rounded px-2">
                          {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                          <input type="number" step={step || 1000} value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                          {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Appreciation Rate</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="0.5" value={assumptions.homeAppreciation} onChange={(e) => setAssumptions({ ...assumptions, homeAppreciation: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%/yr</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Current Equity</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(assumptions.seattleCurrentValue - assumptions.seattleMortgageBalance)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-400 mt-2">→ Converts to rental property at age {assumptions.moveOutAge}</div>
                </div>
                
                {/* Land Housing */}
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800">
                  <div className="text-xs text-amber-400 mb-2 font-semibold">🏡 Living on First 20-Acre Land Purchase (Age {assumptions.landPurchase1Age})</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Monthly Housing Cost</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="100" value={Math.round(assumptions.landHousingCost / 12)} onChange={(e) => setAssumptions({ ...assumptions, landHousingCost: (parseFloat(e.target.value) || 0) * 12 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-xs">/mo</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Annual</label>
                      <div className="bg-amber-900/30 rounded px-2 py-2 text-amber-400 font-medium">
                        {formatCurrency(assumptions.landHousingCost)}/yr
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Included In</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-gray-400 text-xs">
                        $50K living expenses
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">💡 No mortgage — housing cost included in $50K/yr living expenses</div>
                </div>
              </div>
            )}

            {/* Rental Property */}
            {settingsTab === 'rental' && (
              <div className="space-y-4">
                <div className="text-xs text-blue-400 font-semibold mb-2">Seattle Rental Income (Starting Age {assumptions.moveOutAge})</div>
                
                {/* Income */}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Rental Income</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Gross Rent (Year 1)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.grossRentYear1} onChange={(e) => setAssumptions({ ...assumptions, grossRentYear1: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-xs">/yr</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Monthly Rent</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(assumptions.grossRentYear1 / 12)}/mo
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Annual Rent Increase</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="0.5" value={assumptions.rentGrowth} onChange={(e) => setAssumptions({ ...assumptions, rentGrowth: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expenses */}
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
                  <div className="text-xs text-red-400 mb-2 font-semibold">Rental Expenses</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'mortgagePayment', label: 'Mortgage Payment/yr', prefix: '$' },
                      { key: 'propertyTaxes', label: 'Property Taxes/yr', prefix: '$' },
                      { key: 'insurance', label: 'Insurance/yr', prefix: '$' },
                      { key: 'maintenanceRate', label: 'Maintenance Reserve', suffix: '%' },
                      { key: 'vacancyRate', label: 'Vacancy Rate', suffix: '%' },
                      { key: 'propertyManagement', label: 'Management Fee', suffix: '%' },
                    ].map(({ key, label, prefix, suffix }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 block mb-1">{label}</label>
                        <div className="flex items-center bg-gray-800 rounded px-2">
                          {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                          <input type="number" step={suffix === '%' ? 0.5 : 100} value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                          {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Net Income Calculation */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-2">Net Rental Income Calculation (Year 1)</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gross Rent</span>
                      <span className="text-emerald-400">+{formatCurrency(assumptions.grossRentYear1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mortgage</span>
                      <span className="text-red-400">-{formatCurrency(assumptions.mortgagePayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Property Taxes</span>
                      <span className="text-red-400">-{formatCurrency(assumptions.propertyTaxes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Insurance</span>
                      <span className="text-red-400">-{formatCurrency(assumptions.insurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maintenance ({assumptions.maintenanceRate}%)</span>
                      <span className="text-red-400">-{formatCurrency(assumptions.grossRentYear1 * assumptions.maintenanceRate / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vacancy ({assumptions.vacancyRate}%)</span>
                      <span className="text-red-400">-{formatCurrency(assumptions.grossRentYear1 * assumptions.vacancyRate / 100)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-1 mt-1 flex justify-between font-semibold">
                      <span className="text-white">Net Cash Flow</span>
                      <span className={`${(assumptions.grossRentYear1 - assumptions.mortgagePayment - assumptions.propertyTaxes - assumptions.insurance - (assumptions.grossRentYear1 * (assumptions.maintenanceRate + assumptions.vacancyRate) / 100)) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(assumptions.grossRentYear1 - assumptions.mortgagePayment - assumptions.propertyTaxes - assumptions.insurance - (assumptions.grossRentYear1 * (assumptions.maintenanceRate + assumptions.vacancyRate) / 100))}/yr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Land */}
            {settingsTab === 'land' && (
              <div className="space-y-4">
                {/* Land Financing Terms */}
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
                  <div className="text-xs text-blue-400 mb-2 font-semibold">💰 Land Financing Terms</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Down Payment</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="5" value={assumptions.landDownPaymentPct} onChange={(e) => setAssumptions({ ...assumptions, landDownPaymentPct: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Mortgage Rate</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="0.25" value={assumptions.landMortgageRate} onChange={(e) => setAssumptions({ ...assumptions, landMortgageRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Principal/Acre/yr</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="50" value={assumptions.landPrincipalPerAcre} onChange={(e) => setAssumptions({ ...assumptions, landPrincipalPerAcre: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 20 Acre Purchase */}
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800">
                  <div className="text-xs text-amber-400 mb-2 font-semibold">🌾 20-Acre Land Purchase — Age {assumptions.landPurchase1Age} (your new home)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Acres</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" value={assumptions.landPurchase1Acres} onChange={(e) => setAssumptions({ ...assumptions, landPurchase1Acres: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">ac</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Price per Acre</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions.landPricePerAcre} onChange={(e) => setAssumptions({ ...assumptions, landPricePerAcre: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Total Cost</label>
                      <div className="bg-amber-900/30 rounded px-2 py-2 text-amber-400 font-medium">
                        {formatCurrency(assumptions.landPurchase1Acres * assumptions.landPricePerAcre)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="text-xs">
                      <span className="text-gray-500">Down Payment (from Robinhood): </span>
                      <span className="text-emerald-400">{formatCurrency(assumptions.landPurchase1Acres * assumptions.landPricePerAcre * assumptions.landDownPaymentPct / 100)}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Mortgage: </span>
                      <span className="text-red-400">{formatCurrency(assumptions.landPurchase1Acres * assumptions.landPricePerAcre * (1 - assumptions.landDownPaymentPct / 100))}</span>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">Down payment sourced from Robinhood brokerage. Mortgage included in $50K living expenses.</div>
                </div>

                {/* QOZ Expansion */}
                <div className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-800">
                  <div className="text-xs text-cyan-400 mb-2 font-semibold">QOZ Fund — 100-Acre Expansion (Age {assumptions.qozInvestAge})</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Investment Amount</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="10000" value={assumptions.qozInvestAmount} onChange={(e) => setAssumptions({ ...assumptions, qozInvestAmount: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Investment Age</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">Age</span>
                        <input type="number" step="1" value={assumptions.qozInvestAge} onChange={(e) => setAssumptions({ ...assumptions, qozInvestAge: parseInt(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none text-right" />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Roll Robinhood capital gains into QOZ fund (tax-deferred). 501(c)(3) operates permaculture/community programs on OZ land. After 10yr hold (age {assumptions.qozTaxFreeAge}), all new appreciation is tax-free.</div>
                </div>

                {/* Deferred Items */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-500 mb-2 font-semibold">Deferred (not yet in model)</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Equipment & Infrastructure — will add when funded</div>
                    <div>Offshore Land (Family) — financing TBD</div>
                  </div>
                </div>
                
                {/* Land Summary */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-2">Land Investment Summary</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Planned Acres</span>
                        <span className="text-amber-400 font-bold">{assumptions.landPurchase1Acres} acres</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Appreciation Rate</span>
                        <span className="text-amber-400">{assumptions.landAppreciation}%/yr</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Investment</span>
                        <span className="text-amber-400 font-bold">
                          {formatCurrency(assumptions.landPurchase1Acres * assumptions.landPricePerAcre)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Investments */}
            {settingsTab === 'investments' && (
              <div className="space-y-4">
                {/* Annual Contributions */}
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
                  <div className="text-xs text-blue-400 mb-2 font-semibold">Annual Contributions (auto-calculated from W2)</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">401k ({assumptions.k401Rate}% of W2)</label>
                      <div className="bg-blue-900/30 rounded px-2 py-2 text-blue-400 font-medium">
                        {formatCurrency(assumptions.w2Gross * assumptions.k401Rate / 100)}/yr
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">S-Corp Distrib → Robinhood</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(Math.max(0, assumptions.phase1NTRevenue - assumptions.w2Gross - assumptions.w2Gross * assumptions.employerPayrollTaxRate / 100) * (1 - assumptions.distributionTaxRate / 100))}/yr (after {assumptions.distributionTaxRate}% tax)
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">QOZ Fund (age {assumptions.qozInvestAge})</label>
                      <div className="bg-cyan-900/30 rounded px-2 py-2 text-cyan-400 font-medium">
                        {formatCurrency(assumptions.qozInvestAmount)} (from Robinhood)
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">No employer 401k match (confirmed from pay stub)</div>
                </div>
                
                {/* Return Rates */}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Expected Return Rates</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'robinhoodReturn', label: 'Robinhood (31-34)' },
                      { key: 'robinhoodReturnPost35', label: 'Robinhood (35+)' },
                      { key: 'k401Return', label: '401k Return' },
                      { key: 'iraReturn', label: 'IRA Return' },
                      { key: 'qozReturn', label: 'QOZ Fund Return' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 block mb-1">{label}</label>
                        <div className="flex items-center bg-gray-800 rounded px-2">
                          <input type="number" step="0.5" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                          <span className="text-gray-500 text-sm">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* S-Corp Distribution Tax */}
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
                  <div className="text-xs text-blue-400 mb-2 font-semibold">S-Corp Distributions</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Distribution Tax Rate</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="1" value={assumptions.distributionTaxRate} onChange={(e) => setAssumptions({ ...assumptions, distributionTaxRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">Federal + state on pass-through income</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">After-Tax to Robinhood</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(Math.max(0, assumptions.phase1NTRevenue - assumptions.w2Gross - assumptions.w2Gross * assumptions.employerPayrollTaxRate / 100) * (1 - assumptions.distributionTaxRate / 100))}/yr
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">NT surplus after W2 + payroll taxes → taxed as personal income → deposited to Robinhood brokerage</div>
                </div>
                
                {/* Withdrawal Strategy */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-2 font-semibold">Retirement Withdrawal</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Safe Withdrawal Rate</label>
                      <div className="flex items-center bg-gray-700 rounded px-2">
                        <input type="number" step="0.25" value={assumptions.safeWithdrawalRate} onChange={(e) => setAssumptions({ ...assumptions, safeWithdrawalRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Annual from $1M</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(1000000 * assumptions.safeWithdrawalRate / 100)}/yr
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expenses */}
            {settingsTab === 'expenses' && (
              <div className="space-y-4">
                {/* Taxes */}
                <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-800">
                  <div className="text-xs text-orange-400 mb-2 font-semibold">💰 Taxes (closed loop from pay stub)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">W2 Tax Withholding</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="0.25" value={assumptions.personalTaxRate} onChange={(e) => setAssumptions({ ...assumptions, personalTaxRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">Fed + FICA + WA LTCI (from stub)</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">S-Corp Distribution Tax</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="1" value={assumptions.distributionTaxRate} onChange={(e) => setAssumptions({ ...assumptions, distributionTaxRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">Federal + state on pass-through income</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Annual Tax Burden</label>
                      <div className="bg-orange-900/30 rounded px-2 py-2 text-orange-400 text-sm">
                        W2: {formatCurrency(assumptions.w2Gross * assumptions.personalTaxRate / 100)}/yr
                      </div>
                    </div>
                  </div>
                </div>

                {/* Living Expenses */}
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
                  <div className="text-xs text-red-400 mb-2 font-semibold">Annual Living Expenses (all-in)</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Total Living (all-in)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.livingExpenses} onChange={(e) => setAssumptions({ ...assumptions, livingExpenses: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-xs">/yr</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Includes</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-gray-400 text-xs">
                        Land housing, bills, utilities, food, travel, Seattle rental contrib ({formatCurrency(assumptions.ayoolaRentalContrib)}/yr)
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Monthly Burn</label>
                      <div className="bg-red-900/30 rounded px-2 py-2 text-red-400 font-medium">
                        {formatCurrency(assumptions.livingExpenses / 12)}/mo
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Staff & Operations */}
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800">
                  <div className="text-xs text-amber-400 mb-2 font-semibold">Staff & Operations (Land Business)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Staff Base (Ages 33-45)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.staffExpensesBase} onChange={(e) => setAssumptions({ ...assumptions, staffExpensesBase: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-xs">/yr</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Staff Max (Ages 46+)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.staffExpensesMax} onChange={(e) => setAssumptions({ ...assumptions, staffExpensesMax: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-xs">/yr</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Scales from → to</label>
                      <div className="bg-amber-900/30 rounded px-2 py-2 text-amber-400 text-sm">
                        {formatCurrency(assumptions.staffExpensesBase)} → {formatCurrency(assumptions.staffExpensesMax)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expense Summary */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-2">Annual Expense Summary by Phase</div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 rounded bg-blue-900/30">
                      <div className="text-blue-400 text-xs">Phase 1-2</div>
                      <div className="text-white font-medium">{formatCurrency(assumptions.livingExpenses)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-purple-900/30">
                      <div className="text-purple-400 text-xs">Phase 3-4</div>
                      <div className="text-white font-medium">{formatCurrency(assumptions.livingExpenses + assumptions.staffExpensesBase)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-emerald-900/30">
                      <div className="text-emerald-400 text-xs">Phase 5+</div>
                      <div className="text-white font-medium">{formatCurrency(assumptions.livingExpenses + assumptions.staffExpensesMax)}/yr</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Milestones / Timeline */}
            {settingsTab === 'milestones' && (
              <div className="space-y-4">
                {/* Life Milestones */}
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-800">
                  <div className="text-xs text-purple-400 mb-2 font-semibold">Key Life Milestones (Ages)</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'moveOutAge', label: 'Move Out / Rent Starts' },
                      { key: 'retirementAge', label: 'Target Retirement' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 block mb-1">{label}</label>
                        <div className="flex items-center bg-gray-800 rounded px-2">
                          <span className="text-gray-500 text-sm">Age</span>
                          <input type="number" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseInt(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none text-right" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Investment Milestones */}
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
                  <div className="text-xs text-blue-400 mb-2 font-semibold">Investment Milestones</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'mortgagePaidAge', label: 'Seattle Mortgage Paid' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 block mb-1">{label}</label>
                        <div className="flex items-center bg-gray-800 rounded px-2">
                          <span className="text-gray-500 text-sm">Age</span>
                          <input type="number" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseInt(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none text-right" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Land Milestones */}
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800">
                  <div className="text-xs text-amber-400 mb-2 font-semibold">Land Purchase Timeline</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'landPurchase1Age', label: '20-Acre Purchase + Move' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 block mb-1">{label}</label>
                        <div className="flex items-center bg-gray-800 rounded px-2">
                          <span className="text-gray-500 text-sm">Age</span>
                          <input type="number" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseInt(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none text-right" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Visual Timeline */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-3">Visual Timeline</div>
                  <div className="relative">
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-full" />
                    <div className="flex justify-between mt-2 text-xs">
                      <div className="text-center">
                        <div className="text-blue-400">{assumptions.currentAge}</div>
                        <div className="text-gray-500">Now</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400">{assumptions.moveOutAge}</div>
                        <div className="text-gray-500">Move</div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-400">{assumptions.landPurchase1Age}</div>
                        <div className="text-gray-500">Land</div>
                      </div>
                      <div className="text-center">
                        <div className="text-emerald-400">{assumptions.retirementAge}</div>
                        <div className="text-gray-500">Retire</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Major Moves Timeline */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mt-6">
        <h3 className="text-sm font-semibold text-emerald-400 mb-4">📋 Major Moves</h3>
        <div className="space-y-3">
          {[
            { 
              age: 31, 
              year: 2026, 
              icon: '🌾', 
              title: '20 Acre Land Purchase', 
              desc: 'Initial rural land acquisition',
              cost: assumptions.landPricePerAcre * 20,
              status: targetAge1 >= 31 ? 'complete' : 'upcoming',
              category: 'land'
            },
            {
              age: 32,
              year: 2027,
              icon: '🏠',
              title: 'Seattle → Rental + Move to Land',
              desc: 'Seattle becomes 50/50 rental. Ayoola moves to 20 acres.',
              cost: 0,
              income: 72000,
              status: targetAge1 >= 32 ? 'complete' : 'upcoming',
              category: 'rental'
            },
            {
              age: 45,
              year: 2040,
              icon: '🌲',
              title: 'Future Expansion (TBD)',
              desc: 'Equipment, infrastructure, offshore land — financing TBD',
              cost: assumptions.landPricePerAcre * 100,
              status: targetAge1 >= 40 ? 'complete' : 'upcoming',
              category: 'land'
            },
            { 
              age: 45, 
              year: 2040, 
              icon: '🎯', 
              title: 'Full Operations Mode', 
              desc: 'All business units running, staff in place',
              cost: 0,
              income: 150000,
              status: targetAge1 >= 45 ? 'complete' : 'upcoming',
              category: 'milestone'
            },
            { 
              age: 60, 
              year: 2055, 
              icon: '👑', 
              title: 'Retirement Target', 
              desc: 'Coast on investments + passive income',
              cost: 0,
              status: targetAge1 >= 60 ? 'complete' : 'upcoming',
              category: 'milestone'
            },
          ].map((move, i) => (
            <div 
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border transition ${
                move.age === targetAge1 
                  ? 'bg-emerald-900/30 border-emerald-700' 
                  : move.status === 'complete' 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-gray-800/20 border-gray-800'
              }`}
            >
              <div className="text-2xl">{move.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium ${move.age === targetAge1 ? 'text-emerald-400' : 'text-white'}`}>
                    {move.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    move.category === 'land' ? 'bg-amber-900/50 text-amber-400' :
                    move.category === 'rental' ? 'bg-emerald-900/50 text-emerald-400' :
                    move.category === 'home' ? 'bg-blue-900/50 text-blue-400' :
                    move.category === 'income' ? 'bg-pink-900/50 text-pink-400' :
                    'bg-purple-900/50 text-purple-400'
                  }`}>
                    {move.category}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{move.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-xs ${move.status === 'complete' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Age {move.age} • {move.year}
                </div>
                {move.cost > 0 && (
                  <div className="text-sm text-red-400">-{formatCurrency(move.cost)}</div>
                )}
                {move.income > 0 && (
                  <div className="text-sm text-emerald-400">+{formatCurrency(move.income)}/yr</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">Total Land Cost</div>
            <div className="text-amber-400 font-semibold">
              {formatCurrency(assumptions.landPricePerAcre * 135 + 65000 + 45000 + 200000)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Target Acres</div>
            <div className="text-amber-400 font-semibold">135+</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">New Income Streams</div>
            <div className="text-emerald-400 font-semibold">+{formatCurrency(522000)}/yr</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Years to Retirement</div>
            <div className="text-purple-400 font-semibold">{Math.max(0, 60 - targetAge1)}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
