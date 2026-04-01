import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { api } from '../lib/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DESCRIPTIONS = {
  cCorp: "Olaporations C-Corp — receives NT management fees (split from Ayoola's total income), growth taxed at 21% corporate rate",
  seattle: "10737 3rd Ave NW — 50/50 co-owned rental. Both contribute $1K/mo toward costs, reduced $100/yr until breakeven. Profit split 50/50. Either party can trigger sale (other gets first dibs to buy).",
  land: "Rural land acquisitions — financed with down payment + mortgage, appreciating ~4%/year",
  ventures: "Entrepreneurship fund for side projects — conservative 1% annual return assumption",
  k401: "Ayoola's 401k + Robinhood IRA",
  freeCash: "Annual surplus after taxes, expenses, contributions, and debt service",
  netWorth: "Total assets minus liabilities (Ayoola's share only)",
  ayoolaIncome: "Ayoola's personal W2 — NT total minus C-Corp management fee",
  robinhood: "Robinhood Individual Brokerage — Ayoola's fund strategy at ~30% returns",
};

export default function PlanDashboard() {
  const [targetAge1, setTargetAge1] = useState(40);
  const [activeChart, setActiveChart] = useState('netWorth');
  const [showInputs, setShowInputs] = useState(false);
  const [settingsTab, setSettingsTab] = useState('overview');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [ntNewWorkEnabled, setNtNewWorkEnabled] = useState(false); // toggle: NT wins additional $5K/mo work

  const [liveBalancesLoaded, setLiveBalancesLoaded] = useState(false);

  const [assumptions, setAssumptions] = useState({
    // Starting Balances (real as of March 2026)
    currentAge: 31,           // Dec birthday — currently 31, turns 32 Dec 2026
    cCorpStart: 2487,         // Novo Checking (real: $2,486.58)
    k401Start: 14819,         // Human Interest 401k (real: $14,818.55)
    iraStart: 4588,           // Robinhood Traditional IRA (real: $4,588.22)
    robinhoodStart: 82168,    // Robinhood Individual Brokerage (real: $82,167.79)
    seattleEquityStart: 134633, // $1.1M value - $965,367 mortgage (Ayoola's 50% = $67,317)
    ccDebtStart: 15547,       // Chase CC $2,130 + Cap One $13,417
    cashStart: 6835,          // Chase checking $689 + KeyBank checking $3,659 + KeyBank savings $492 + Novo $2,487

    // Returns & Appreciation
    cCorpReturn: 30,          // Ayoola's fund strategy (~4.5% in 50 days, annualized ~30%)
    k401Return: 8,            // 401k in standard funds (not self-directed)
    robinhoodReturn: 30,      // individual brokerage — Ayoola's fund strategy
    iraReturn: 30,            // Robinhood IRA — same fund strategy
    entrepreneurReturn: 1,
    homeAppreciation: 6,
    newHomeAppreciation: 5,
    landAppreciation: 4,

    // Land Acquisitions — first purchase pushed to age 32
    initialAcres: 0,          // no land at start (pushed to 32)
    landPricePerAcre: 6000,
    landDownPaymentPct: 20,
    landMortgageRate: 7.5,
    landPrincipalPerAcre: 300,
    offshorePricePerAcre: 3000,
    landPurchase1Age: 32,     // initial 20 acres (was at start, now age 32)
    landPurchase1Acres: 20,
    landPurchase2Age: 34,     // offshore 15 acres
    landPurchase2Acres: 15,
    landPurchase3Age: 40,     // expansion 100 acres
    landPurchase3Acres: 100,
    equipmentCost: 65000,
    infrastructureCost: 200000,
    infrastructureAge: 38,

    // Homes — Seattle is 50/50 co-owned rental after divorce
    seattleCurrentValue: 1100000,
    seattleMortgageBalance: 965367, // real mortgage balance
    seattleMortgageRate: 3.25,
    newHomePurchasePrice: 600000,
    newHomeDownPayment: 0,
    newHomeClosingCosts: 15000,
    newHomeMortgageRate: 6.5,

    // Milestone Ages
    divorceAge: 31,           // divorce finalizes ~mid 2026
    jamieMoveOutMonth: 3,     // ~3 months from now (June/July 2026)
    moveOutAge: 32,           // Ayoola moves to own place (can be earlier)
    marginStartAge: 33,
    mortgagePaidAge: 64,
    retirementAge: 60,

    // Margin Trading
    marginRate: 4.5,
    marginRatio: 32.5,

    // Seattle Rental (50/50 with ex-wife)
    // Both contribute $1K/mo toward costs, reduced by $100/yr until breakeven
    grossRentYear1: 72000,        // ~$6K/mo market rent
    mortgagePayment: 67200,       // annual mortgage
    propertyTaxes: 12000,
    insurance: 2400,
    propertyManagement: 7200,     // ~10% of gross rent for PM company
    maintenanceRate: 10,          // % of rent for repairs
    vacancyRate: 5,
    rentGrowth: 2.5,
    seattlePrincipal: 18000,
    ayoolaRentalContrib: 12000,   // $1K/mo toward rental costs
    exWifeRentalContrib: 12000,   // $1K/mo from ex-wife
    contribReductionPerYear: 1200, // reduce by $100/mo each year as rent rises

    // New home for Ayoola
    newHomePrincipal: 15000,

    // Annual Contributions (Ayoola only — no more Jamie)
    k401Contrib: 18000,       // ~20% of Ayoola's NT gross (~$90K)
    iraContrib: 0,
    entrepreneurContrib: 50000,
    ccPaydownMonthly: 1250,   // monthly CC surplus for paydown

    // Expenses (Ayoola solo: ~$5,050/mo non-mortgage × 12 — will need to adjust post-divorce)
    livingExpenses: 60600,    // $5,050/mo non-mortgage expenses × 12
    staffExpensesBase: 50000,
    staffExpensesMax: 100000,
    healthInsurance: 12000,

    // Income Phases (Ayoola only)
    phase1AyoolaIncome: 200000,   // current NT income
    phase1CCorpContrib: 180000,

    phase2AyoolaIncome: 150000,   // transition (33-34)
    phase2CCorpContrib: 90000,

    phase3AyoolaIncome: 50000,    // gap year (35)

    phase4AyoolaIncome: 50000,    // building phase (36+)
    phase4CCorpContrib: 0,

    phase5AyoolaIncome: 50000,
    phase5BusinessIncome: 150000,
    phase5BusinessGrowth: 5000,

    // NT Additional Work (toggle)
    ntNewWorkMonthly: 5000,       // $5K/mo additional NT revenue → C-Corp
    ntNewWorkStartMonth: 7,       // July 2026

    // Withdrawal & Taxes
    safeWithdrawalRate: 4,
    effectiveTaxRate: 25,
    cCorpTaxRate: 21,
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
        // C-Corp Novo balance
        if (name.includes('olaporations') || name.includes('c-corp')) {
          updates.cCorpStart = Math.round(bal);
        }
      });

      if (Object.keys(updates).length > 0) {
        setAssumptions(prev => ({ ...prev, ...updates }));
        setLiveBalancesLoaded(true);
      }
    }).catch(() => {});
  }, [liveBalancesLoaded]);

  const toggleTooltip = (id) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const data = useMemo(() => {
    const years = [];
    let cCorp = assumptions.cCorpStart;
    let k401 = assumptions.k401Start;
    let ira = assumptions.iraStart;
    let robinhood = assumptions.robinhoodStart;
    // Seattle equity: Ayoola owns 50% of total equity
    let seattleEquity = assumptions.seattleEquityStart; // total equity, we'll track 50% in net worth
    let newHomeEquity = 0;
    let acres = assumptions.initialAcres;
    let landEquity = 0;
    let landMortgage = 0;
    let ccDebt = assumptions.ccDebtStart;
    let entrepreneur = 0;
    let marginLoan = 0;
    let marginInvested = 0;

    for (let age = assumptions.currentAge; age <= 85; age++) {
      let cCorpContrib = 0;
      let k401Contrib = assumptions.k401Contrib;
      let entrepreneurContrib = 0;
      let ayoolaIncome = 0;
      let rentalNet = 0;
      let ayoolaRentalShare = 0; // Ayoola's 50% of rental profit/loss
      let expenses = assumptions.livingExpenses;
      let staffExpenses = 0;
      let businessIncome = 0;

      // Phase 1: Current state (31-32) — Ayoola solo income, C-Corp contributions
      if (age <= 32) {
        cCorpContrib = assumptions.phase1CCorpContrib;
        ayoolaIncome = assumptions.phase1AyoolaIncome;
      }
      // Phase 2: Transition (33-34) — C-Corp continues, staff/ventures start
      else if (age <= 34) {
        cCorpContrib = assumptions.phase2CCorpContrib;
        ayoolaIncome = assumptions.phase2AyoolaIncome;
        entrepreneurContrib = 25000;
        staffExpenses = 25000;
      }
      // Phase 3: Gap year (35)
      else if (age === 35) {
        cCorpContrib = 0;
        ayoolaIncome = assumptions.phase3AyoolaIncome;
        staffExpenses = 25000;
        entrepreneurContrib = 25000;
      }
      // Phase 4: Building phase (36-45)
      else if (age <= 45) {
        cCorpContrib = 0;
        ayoolaIncome = assumptions.phase4AyoolaIncome;
        if (age <= 40) {
          staffExpenses = 35000;
          entrepreneurContrib = 35000;
        } else {
          staffExpenses = 35000 + Math.min((age - 40) * 10000, assumptions.staffExpensesMax - 35000);
          entrepreneurContrib = 35000;
        }
        businessIncome = Math.max(0, (age - 36) * 15000);
      }
      // Phase 5: Coast mode (after 45)
      else {
        cCorpContrib = 0;
        ayoolaIncome = assumptions.phase5AyoolaIncome;
        staffExpenses = assumptions.staffExpensesMax;
        entrepreneurContrib = 0;
        businessIncome = assumptions.phase5BusinessIncome + (age - 46) * assumptions.phase5BusinessGrowth;
        k401Contrib = 0;
      }

      // ─── NT Additional Work (toggle) ────────────────────────────
      // $5K/mo additional NT revenue → C-Corp for investment, starting July 2026
      let ntNewWorkIncome = 0;
      if (ntNewWorkEnabled) {
        if (age === assumptions.currentAge) {
          // First year partial: July-Dec = 6 months
          ntNewWorkIncome = assumptions.ntNewWorkMonthly * 6;
        } else {
          ntNewWorkIncome = assumptions.ntNewWorkMonthly * 12;
        }
        cCorpContrib += ntNewWorkIncome;
      }

      // ─── Seattle Rental (50/50 co-owned) ─────────────────────────
      // Rental starts once Jamie moves out (~mid 2026, modeled from age 32)
      if (age >= 32) {
        const rentYears = age - 32;
        const grossRent = assumptions.grossRentYear1 * Math.pow(1 + assumptions.rentGrowth / 100, rentYears);
        const mortgage = age < assumptions.mortgagePaidAge ? assumptions.mortgagePayment : 0;
        const maintenance = grossRent * (assumptions.maintenanceRate / 100);
        const management = assumptions.propertyManagement;
        const taxes = assumptions.propertyTaxes;
        const ins = assumptions.insurance;
        const totalCosts = mortgage + maintenance + management + taxes + ins;

        // Both contribute toward costs, reducing by $100/mo/yr until $0
        const ayoolaContrib = Math.max(0, assumptions.ayoolaRentalContrib - (rentYears * assumptions.contribReductionPerYear));
        const exWifeContrib = Math.max(0, assumptions.exWifeRentalContrib - (rentYears * assumptions.contribReductionPerYear));
        const totalContribs = ayoolaContrib + exWifeContrib;

        // Net rental P&L: rent + contributions - costs
        // Surplus goes to escrow for repairs initially, then split 50/50 when profitable
        rentalNet = grossRent + totalContribs - totalCosts;

        if (rentalNet > 0) {
          // Profitable: Ayoola gets 50% of profit (contributions stop mattering once profitable)
          ayoolaRentalShare = rentalNet * 0.5;
        } else {
          // Not yet profitable: Ayoola's cost is his contribution
          ayoolaRentalShare = -ayoolaContrib;
        }
      }

      // Investment growth
      const cCorpGrowth = cCorp * (assumptions.cCorpReturn / 100);
      const cCorpTax = cCorpGrowth * (assumptions.cCorpTaxRate / 100);
      cCorp = cCorp + cCorpGrowth - cCorpTax + cCorpContrib;

      k401 = k401 * (1 + assumptions.k401Return / 100) + k401Contrib;
      ira = ira * (1 + assumptions.iraReturn / 100);
      robinhood = robinhood * (1 + assumptions.robinhoodReturn / 100);

      // CC debt paydown
      if (ccDebt > 0) {
        const annualPaydown = assumptions.ccPaydownMonthly * 12;
        const interest = ccDebt * 0.20;
        ccDebt = Math.max(0, ccDebt + interest - annualPaydown);
      }

      // Seattle equity: appreciates, principal paydown (Ayoola owns 50%)
      seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100) + assumptions.seattlePrincipal;

      // New home equity (when Ayoola moves out)
      if (age >= assumptions.moveOutAge) {
        newHomeEquity = (newHomeEquity + assumptions.newHomePrincipal) * (1 + assumptions.newHomeAppreciation / 100);
      }

      // Land
      const totalLandValue = landEquity + landMortgage;
      const appreciatedValue = totalLandValue * (1 + assumptions.landAppreciation / 100);
      const appreciationGain = appreciatedValue - totalLandValue;
      landEquity += appreciationGain;

      if (landMortgage > 0) {
        const landPrincipalPayment = Math.min(landMortgage, acres * assumptions.landPrincipalPerAcre);
        landMortgage -= landPrincipalPayment;
        landEquity += landPrincipalPayment;
      }

      if (age === assumptions.landPurchase1Age) {
        const purchasePrice = assumptions.landPurchase1Acres * assumptions.landPricePerAcre;
        const downPayment = purchasePrice * (assumptions.landDownPaymentPct / 100);
        landEquity += downPayment;
        landMortgage += purchasePrice - downPayment;
        acres += assumptions.landPurchase1Acres;
      }
      if (age === assumptions.landPurchase2Age) {
        const purchasePrice = assumptions.landPurchase2Acres * assumptions.offshorePricePerAcre;
        const downPayment = purchasePrice * (assumptions.landDownPaymentPct / 100);
        landEquity += downPayment;
        landMortgage += purchasePrice - downPayment;
        acres += assumptions.landPurchase2Acres;
      }
      if (age === assumptions.landPurchase3Age) {
        const appreciatedPricePerAcre = assumptions.landPricePerAcre * Math.pow(1 + assumptions.landAppreciation / 100, assumptions.landPurchase3Age - assumptions.currentAge);
        const purchasePrice = assumptions.landPurchase3Acres * appreciatedPricePerAcre;
        const downPayment = purchasePrice * (assumptions.landDownPaymentPct / 100);
        landEquity += downPayment;
        landMortgage += purchasePrice - downPayment;
        acres += assumptions.landPurchase3Acres;
      }

      // Entrepreneur fund
      entrepreneur = entrepreneur * (1 + assumptions.entrepreneurReturn / 100) + entrepreneurContrib;

      // Margin trading
      if (age >= assumptions.marginStartAge) {
        const maxMargin = cCorp * (assumptions.marginRatio / 100);
        marginLoan = maxMargin;
        marginInvested = marginInvested * (1 + assumptions.cCorpReturn / 100);
        const newBorrowing = Math.max(0, maxMargin - (marginInvested / (1 + assumptions.cCorpReturn / 100)));
        marginInvested += newBorrowing;
      }

      const marginInterest = marginLoan * (assumptions.marginRate / 100);
      const marginGain = marginInvested * (assumptions.cCorpReturn / 100);
      const marginNet = marginGain - marginInterest;

      // Ayoola's personal income = total minus C-Corp
      const ayoolaPersonalIncome = ayoolaIncome - cCorpContrib;

      // Taxable income (Ayoola only + business + rental share)
      const taxableIncome = ayoolaPersonalIncome + businessIncome + Math.max(0, ayoolaRentalShare);
      const taxes = taxableIncome * (assumptions.effectiveTaxRate / 100);

      const totalIn = ayoolaPersonalIncome + Math.max(0, ayoolaRentalShare) + marginNet + businessIncome;
      const totalOut = expenses + staffExpenses + entrepreneurContrib + taxes + Math.abs(Math.min(0, ayoolaRentalShare));
      const freeCash = totalIn - totalOut;

      // Net worth: Ayoola's share only (50% of Seattle equity)
      const netWorth = cCorp + k401 + ira + robinhood + (seattleEquity * 0.5) + newHomeEquity + landEquity + entrepreneur + marginInvested - marginLoan - ccDebt;

      const safeWithdrawal = netWorth * (assumptions.safeWithdrawalRate / 100);
      const passiveIncome = ayoolaRentalShare + businessIncome + safeWithdrawal;

      years.push({
        age,
        year: 2026 + (age - assumptions.currentAge),
        cCorp: Math.round(cCorp),
        k401: Math.round(k401),
        ira: Math.round(ira),
        robinhood: Math.round(robinhood),
        ccDebt: Math.round(ccDebt),
        seattleEquity: Math.round(seattleEquity),
        seattleEquity50: Math.round(seattleEquity * 0.5),
        newHomeEquity: Math.round(newHomeEquity),
        rentalNet: Math.round(rentalNet),
        ayoolaRentalShare: Math.round(ayoolaRentalShare),
        acres,
        landEquity: Math.round(landEquity),
        landMortgage: Math.round(landMortgage),
        landValue: Math.round(landEquity + landMortgage),
        entrepreneur: Math.round(entrepreneur),
        marginLoan: Math.round(marginLoan),
        marginInvested: Math.round(marginInvested),
        marginNet: Math.round(marginNet),
        freeCash: Math.round(freeCash),
        netWorth: Math.round(netWorth),
        ayoolaIncome: Math.round(ayoolaIncome),
        businessIncome: Math.round(businessIncome),
        passiveIncome: Math.round(passiveIncome),
        safeWithdrawal: Math.round(safeWithdrawal),
        ntNewWorkIncome: Math.round(ntNewWorkIncome),
        freeCashSources: {
          ayoolaPersonalIncome,
          ayoolaTotalIncome: ayoolaIncome,
          ntNewWork: ntNewWorkIncome,
          rentalShare: ayoolaRentalShare,
          marginNet,
          businessIncome,
          expenses: -expenses,
          staffExpenses: -staffExpenses,
          taxes: -taxes,
          contributions: -entrepreneurContrib,
          cCorpContrib,
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
      { name: 'C-Corp', value: ageData.cCorp, desc: DESCRIPTIONS.cCorp },
      { name: 'Robinhood', value: ageData.robinhood, desc: DESCRIPTIONS.robinhood },
      { name: '401k/IRA', value: ageData.k401 + ageData.ira, desc: DESCRIPTIONS.k401 },
      { name: 'Seattle (50%)', value: ageData.seattleEquity50, desc: DESCRIPTIONS.seattle },
      { name: 'New Home', value: ageData.newHomeEquity, desc: 'Ayoola\'s own home' },
      { name: 'Land', value: ageData.landEquity, desc: DESCRIPTIONS.land },
      { name: 'Ventures', value: ageData.entrepreneur, desc: DESCRIPTIONS.ventures },
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
            {src.cCorpContrib > 0 && (
              <div className="text-gray-500 text-xs mb-1 pb-1 border-b border-gray-700">
                NT Total: {formatCurrency(src.ayoolaTotalIncome)} → Personal: {formatCurrency(src.ayoolaPersonalIncome)} + C-Corp: {formatCurrency(src.cCorpContrib)}
              </div>
            )}
            <div className="text-emerald-400">+ Ayoola's W2: {formatCurrency(src.ayoolaPersonalIncome)}</div>
            {src.ntNewWork > 0 && <div className="text-lime-400">+ NT New Work → C-Corp: {formatCurrency(src.ntNewWork)}</div>}
            <div className="text-blue-400">+ Rental (50%): {formatCurrency(src.rentalShare)}</div>
            <div className="text-cyan-400">+ Margin Arbitrage: {formatCurrency(src.marginNet)}</div>
            <div className="text-amber-400">+ Business Income: {formatCurrency(src.businessIncome)}</div>
            <div className="text-red-400">− Living Expenses: {formatCurrency(Math.abs(src.expenses))}</div>
            <div className="text-red-400">− Staff Expenses: {formatCurrency(Math.abs(src.staffExpenses))}</div>
            <div className="text-orange-400">− Taxes ({assumptions.effectiveTaxRate}%): {formatCurrency(Math.abs(src.taxes))}</div>
            <div className="text-red-400">− Contributions: {formatCurrency(Math.abs(src.contributions))}</div>
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
              <Area type="monotone" dataKey="cCorp" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="C-Corp" />
              <Area type="monotone" dataKey="robinhood" stackId="1" stroke="#F97316" fill="#F97316" name="Robinhood" />
              <Area type="monotone" dataKey="landEquity" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Land" />
              <Area type="monotone" dataKey="seattleEquity50" stackId="1" stroke="#10B981" fill="#10B981" name="Seattle (50%)" />
              <Area type="monotone" dataKey="k401" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="401k/IRA" />
              <Area type="monotone" dataKey="entrepreneur" stackId="1" stroke="#06B6D4" fill="#06B6D4" name="Ventures" />
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
      { label: 'C-Corp', value: d.cCorp, color: 'text-blue-400' },
      { label: 'Robinhood', value: d.robinhood, color: 'text-orange-400' },
      { label: '401k/IRA', value: d.k401 + d.ira, color: 'text-purple-400' },
      { label: 'Seattle (50%)', value: d.seattleEquity50, color: 'text-emerald-400' },
      { label: 'New Home', value: d.newHomeEquity, color: 'text-green-400' },
      { label: 'Land', value: d.landEquity, color: 'text-amber-400' },
      { label: 'Ventures', value: d.entrepreneur, color: 'text-cyan-400' },
      { label: 'Margin (net)', value: d.marginInvested - d.marginLoan, color: 'text-gray-400' },
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
      { label: "Ayoola's W2", value: src.ayoolaPersonalIncome, color: 'text-emerald-400' },
      { label: 'NT New Work → C-Corp', value: src.ntNewWork, color: 'text-lime-400' },
      { label: 'Rental (50%)', value: src.rentalShare, color: 'text-blue-400' },
      { label: 'Margin Arbitrage', value: src.marginNet, color: 'text-cyan-400' },
      { label: 'Business Income', value: src.businessIncome, color: 'text-amber-400' },
      { label: 'Living Expenses', value: src.expenses, color: 'text-red-400' },
      { label: 'Staff Expenses', value: src.staffExpenses, color: 'text-red-400' },
      { label: `Taxes (${assumptions.effectiveTaxRate}%)`, value: src.taxes, color: 'text-orange-400' },
      { label: 'Contributions', value: src.contributions, color: 'text-red-400' },
    ].filter(item => item.value !== 0);
    
    if (src.cCorpContrib > 0) {
      items.push({ label: 'NT → C-Corp', value: src.cCorpContrib, color: 'text-blue-300' });
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
          label={`Rental Equity @ ${targetAge1}`}
          value={formatCurrency(targetData1?.seattleEquity || 0)}
          breakdown={[
            { label: 'Seattle Home Equity', value: targetData1?.seattleEquity || 0, color: 'text-emerald-400' },
            { label: 'Rental Net/yr', value: targetData1?.rentalNet || 0, color: 'text-blue-400' },
          ]}
          monthly={formatMonthly(targetData1?.rentalNet || 0)}
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
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="p-2 text-left">Age</th>
              <TableHeader id="cCorp" label="C-Corp" color="text-blue-400" />
              <TableHeader id="k401" label="401k" color="text-purple-400" />
              <TableHeader id="seattle" label="Seattle" color="text-emerald-400" />
              <TableHeader id="land" label="Land" color="text-amber-400" />
              <TableHeader id="jamie" label="Jamie's" color="text-pink-400" />
              <TableHeader id="ventures" label="Ventures" color="text-cyan-400" />
              <TableHeader id="freeCash" label="Free $" color="text-gray-400" />
              <TableHeader id="netWorth" label="Net Worth" color="text-white font-bold" />
            </tr>
          </thead>
          <tbody>
            {data.filter(d => d.age <= 50 || d.age % 5 === 0).map((row) => (
              <tr 
                key={row.age} 
                className={`border-b border-gray-800/50 hover:bg-gray-800/50 
                  ${row.age === targetAge1 ? 'bg-emerald-900/30 border-emerald-700' : ''}`}
              >
                <td className={`p-2 ${row.age === targetAge1 ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>{row.age}</td>
                <td className="p-2 text-right text-blue-400">{formatCurrency(row.cCorp)}</td>
                <td className="p-2 text-right text-purple-400">{formatCurrency(row.k401 + row.jamie401k)}</td>
                <td className="p-2 text-right text-emerald-400">{formatCurrency(row.seattleEquity)}</td>
                <td className="p-2 text-right text-amber-400">{formatCurrency(row.landEquity)}</td>
                <td className="p-2 text-right text-pink-400">{formatCurrency(row.robinhood)}</td>
                <td className="p-2 text-right text-cyan-400">{formatCurrency(row.entrepreneur)}</td>
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
          <span className="text-xs text-gray-500 ml-2">+$5K/mo → C-Corp from July 2026</span>
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
                      {formatCurrency(assumptions.cCorpStart + assumptions.k401Start + assumptions.jamie401kStart + assumptions.iraStart + assumptions.seattleEquityStart + (assumptions.initialAcres * assumptions.landPricePerAcre * assumptions.landDownPaymentPct / 100))}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Total Land Investment</div>
                    <div className="text-lg font-bold text-amber-400">
                      {formatCurrency(
                        (assumptions.initialAcres * assumptions.landPricePerAcre) +
                        (assumptions.offshoreAcres * assumptions.offshorePricePerAcre) +
                        (assumptions.landPurchase2Acres * assumptions.landPricePerAcre) +
                        assumptions.equipmentCost + assumptions.infrastructureCost
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Target Retirement Age</div>
                    <div className="text-lg font-bold text-purple-400">{assumptions.retirementAge}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Total Planned Acres</div>
                    <div className="text-lg font-bold text-amber-400">{assumptions.initialAcres + assumptions.offshoreAcres + assumptions.landPurchase2Acres}</div>
                  </div>
                </div>
                
                {/* Income Phase Summary */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-3">Income Phase Summary</div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="text-center p-2 rounded bg-blue-900/30 border border-blue-800">
                      <div className="text-blue-400 font-semibold">Phase 1</div>
                      <div className="text-gray-400">Ages 31-32</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase1AyoolaIncome + assumptions.phase1JamieIncome)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-purple-900/30 border border-purple-800">
                      <div className="text-purple-400 font-semibold">Phase 2</div>
                      <div className="text-gray-400">Ages 33-34</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase2AyoolaIncome + assumptions.phase2JamieIncome)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-red-900/30 border border-red-800">
                      <div className="text-red-400 font-semibold">Gap Year</div>
                      <div className="text-gray-400">Age 35</div>
                      <div className="text-yellow-400 font-medium">{formatCurrency(assumptions.phase3AyoolaIncome)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-pink-900/30 border border-pink-800">
                      <div className="text-pink-400 font-semibold">Phase 4</div>
                      <div className="text-gray-400">Ages 36-45</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase4AyoolaIncome + assumptions.phase4JamieIncome)}/yr</div>
                    </div>
                    <div className="text-center p-2 rounded bg-emerald-900/30 border border-emerald-800">
                      <div className="text-emerald-400 font-semibold">Coast</div>
                      <div className="text-gray-400">Ages 46+</div>
                      <div className="text-emerald-400 font-medium">{formatCurrency(assumptions.phase5AyoolaIncome + assumptions.phase5BusinessIncome)}/yr</div>
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
                    <div className="text-xs text-gray-500">Jamie Peak Income</div>
                    <div className="text-pink-400 font-semibold">{formatCurrency(assumptions.phase4JamieIncome)}/yr</div>
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
                    { key: 'cCorpStart', label: 'C-Corp Balance', prefix: '$', step: 1000 },
                    { key: 'k401Start', label: "Ayoola's 401k", prefix: '$', step: 1000 },
                    { key: 'jamie401kStart', label: "Jamie's 401k/457", prefix: '$', step: 1000 },
                    { key: 'iraStart', label: 'IRA Balance', prefix: '$', step: 1000 },
                    { key: 'seattleEquityStart', label: 'Seattle Home Equity', prefix: '$', step: 1000 },
                    { key: 'initialAcres', label: 'Current Land Owned', suffix: ' acres', step: 1 },
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
                        assumptions.cCorpStart + assumptions.k401Start + assumptions.jamie401kStart + assumptions.iraStart + 
                        assumptions.seattleEquityStart + (assumptions.initialAcres * assumptions.landPricePerAcre * assumptions.landDownPaymentPct / 100)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Income Phases */}
            {settingsTab === 'income' && (
              <div className="space-y-4">
                {/* Phase 1 */}
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
                  <div className="text-xs text-blue-400 mb-2 font-semibold">Phase 1: Ages {assumptions.currentAge}-32 — Current State</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'phase1AyoolaIncome', label: "Ayoola's W2/1099" },
                      { key: 'phase1JamieIncome', label: "Jamie's Resident Salary" },
                      { key: 'phase1CCorpContrib', label: 'NT Mgmt Fee → C-Corp' },
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
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Total Household</label>
                      <div className="flex items-center bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(assumptions.phase1AyoolaIncome + assumptions.phase1JamieIncome)}/yr
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phase 2 */}
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-800">
                  <div className="text-xs text-purple-400 mb-2 font-semibold">Phase 2: Ages 33-34 — Transition Period</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'phase2AyoolaIncome', label: "Ayoola's Income" },
                      { key: 'phase2JamieIncome', label: "Jamie's Income" },
                      { key: 'phase2CCorpContrib', label: 'NT Mgmt Fee → C-Corp' },
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
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Total Household</label>
                      <div className="flex items-center bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency(assumptions.phase2AyoolaIncome + assumptions.phase2JamieIncome)}/yr
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 - Gap Year */}
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
                  <div className="text-xs text-red-400 mb-2 font-semibold">Phase 3: Age 35 — Gap Year (Jamie in Fellowship)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Ayoola's Income</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.phase3AyoolaIncome} onChange={(e) => setAssumptions({ ...assumptions, phase3AyoolaIncome: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-xs">/yr</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Jamie's Income</label>
                      <div className="flex items-center bg-gray-800 rounded px-2 text-red-400 py-2 text-sm">$0 (Training)</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">NT Mgmt Fee → C-Corp</label>
                      <div className="flex items-center bg-gray-800 rounded px-2 text-red-400 py-2 text-sm">$0 (Paused)</div>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">⚠️ Lean year — living off savings + reduced income</div>
                </div>

                {/* Phase 4 */}
                <div className="bg-pink-900/20 rounded-lg p-3 border border-pink-800">
                  <div className="text-xs text-pink-400 mb-2 font-semibold">Phase 4: Ages 36-45 — Jamie Attending Surgeon</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'phase4AyoolaIncome', label: "Ayoola's Income" },
                      { key: 'phase4JamieIncome', label: "Jamie's Attending Salary" },
                      { key: 'jamieContrib', label: "Jamie's Investment Contrib" },
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
                  <div className="mt-2 text-xs text-gray-500">C-Corp: no new contributions — only appreciates from here</div>
                  <div className="mt-1 text-xs text-emerald-400">💰 Peak earning years — {formatCurrency(assumptions.phase4AyoolaIncome + assumptions.phase4JamieIncome)}/yr household income</div>
                </div>

                {/* Phase 5 */}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Phase 5: Ages 46+ — Coast Mode</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'phase5AyoolaIncome', label: "Ayoola's Passive/Consulting" },
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
                
                {/* New Primary Home */}
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
                  <div className="text-xs text-blue-400 mb-2 font-semibold">🏡 New Primary Home — Gap Year Purchase (Age 35)</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'newHomePurchasePrice', label: 'Purchase Price', prefix: '$' },
                      { key: 'newHomeDownPayment', label: 'Down Payment', prefix: '$' },
                      { key: 'newHomeClosingCosts', label: 'Closing Costs', prefix: '$' },
                      { key: 'newHomeMortgageRate', label: 'Interest Rate', suffix: '%', step: 0.125 },
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
                        <input type="number" step="0.5" value={assumptions.newHomeAppreciation} onChange={(e) => setAssumptions({ ...assumptions, newHomeAppreciation: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%/yr</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Principal Paydown/yr</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" step="1000" value={assumptions.newHomePrincipal} onChange={(e) => setAssumptions({ ...assumptions, newHomePrincipal: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">💡 0% down strategy — only pay closing costs ({formatCurrency(assumptions.newHomeClosingCosts)})</div>
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

                {/* Initial Purchase */}
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800">
                  <div className="text-xs text-amber-400 mb-2 font-semibold">🌾 Initial Land Purchase — Age {assumptions.currentAge} (2026)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Acres</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" value={assumptions.initialAcres} onChange={(e) => setAssumptions({ ...assumptions, initialAcres: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
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
                        {formatCurrency(assumptions.initialAcres * assumptions.landPricePerAcre)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="text-xs">
                      <span className="text-gray-500">Down Payment: </span>
                      <span className="text-emerald-400">{formatCurrency(assumptions.initialAcres * assumptions.landPricePerAcre * assumptions.landDownPaymentPct / 100)}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Mortgage: </span>
                      <span className="text-red-400">{formatCurrency(assumptions.initialAcres * assumptions.landPricePerAcre * (1 - assumptions.landDownPaymentPct / 100))}</span>
                    </div>
                  </div>
                </div>
                
                {/* Equipment & Infrastructure */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-2 font-semibold">🚜 Equipment & Infrastructure</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Equipment Cost (Age 32)</label>
                      <div className="flex items-center bg-gray-700 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions.equipmentCost} onChange={(e) => setAssumptions({ ...assumptions, equipmentCost: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Infrastructure (Age {assumptions.infrastructureAge})</label>
                      <div className="flex items-center bg-gray-700 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions.infrastructureCost} onChange={(e) => setAssumptions({ ...assumptions, infrastructureCost: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offshore Land */}
                <div className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-800">
                  <div className="text-xs text-cyan-400 mb-2 font-semibold">🏝️ Offshore Land (Family) — Age {assumptions.landPurchase1Age}</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Acres</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" value={assumptions.offshoreAcres} onChange={(e) => setAssumptions({ ...assumptions, offshoreAcres: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">ac</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Price per Acre</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions.offshorePricePerAcre} onChange={(e) => setAssumptions({ ...assumptions, offshorePricePerAcre: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Total Cost</label>
                      <div className="bg-cyan-900/30 rounded px-2 py-2 text-cyan-400 font-medium">
                        {formatCurrency(assumptions.offshoreAcres * assumptions.offshorePricePerAcre)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Major Expansion */}
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800">
                  <div className="text-xs text-amber-400 mb-2 font-semibold">🌲 Major Expansion — Age {assumptions.landPurchase2Age}</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Acres</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" value={assumptions.landPurchase2Acres} onChange={(e) => setAssumptions({ ...assumptions, landPurchase2Acres: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">ac</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Est. Price per Acre</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-gray-400 text-sm">
                        ~{formatCurrency(assumptions.landPricePerAcre * Math.pow(1 + assumptions.landAppreciation/100, assumptions.landPurchase2Age - assumptions.currentAge))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Est. Total Cost</label>
                      <div className="bg-amber-900/30 rounded px-2 py-2 text-amber-400 font-medium">
                        {formatCurrency(assumptions.landPurchase2Acres * assumptions.landPricePerAcre)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Land Summary */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-2">Land Investment Summary</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Acres</span>
                        <span className="text-amber-400 font-bold">{assumptions.initialAcres + assumptions.offshoreAcres + assumptions.landPurchase2Acres} acres</span>
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
                          {formatCurrency(
                            (assumptions.initialAcres * assumptions.landPricePerAcre) +
                            (assumptions.offshoreAcres * assumptions.offshorePricePerAcre) +
                            (assumptions.landPurchase2Acres * assumptions.landPricePerAcre) +
                            assumptions.equipmentCost + assumptions.infrastructureCost
                          )}
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
                  <div className="text-xs text-blue-400 mb-2 font-semibold">Annual Contributions</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'k401Contrib', label: "Ayoola's 401k" },
                      { key: 'jamie401kContrib', label: "Jamie's 401k" },
                      { key: 'iraContrib', label: 'IRA Contribution' },
                      { key: 'entrepreneurContrib', label: 'Ventures Fund' },
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
                  <div className="mt-3">
                    <label className="text-xs text-gray-400 block mb-1">Jamie's Employer Match</label>
                    <div className="flex items-center bg-gray-800 rounded px-2 w-32">
                      <input type="number" step="0.5" value={assumptions.jamie401kMatch} onChange={(e) => setAssumptions({ ...assumptions, jamie401kMatch: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      <span className="text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                </div>
                
                {/* Return Rates */}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Expected Return Rates</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'cCorpReturn', label: 'C-Corp Portfolio' },
                      { key: 'k401Return', label: '401k Return' },
                      { key: 'jamieReturn', label: "Jamie's Portfolio" },
                      { key: 'entrepreneurReturn', label: 'Ventures Return' },
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
                
                {/* Margin Strategy */}
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-800">
                  <div className="text-xs text-purple-400 mb-2 font-semibold">Margin Trading Strategy (Starts Age {assumptions.marginStartAge})</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Margin Interest Rate</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="0.25" value={assumptions.marginRate} onChange={(e) => setAssumptions({ ...assumptions, marginRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">% of Portfolio Used</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="2.5" value={assumptions.marginRatio} onChange={(e) => setAssumptions({ ...assumptions, marginRatio: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Spread (Profit)</label>
                      <div className="bg-emerald-900/30 rounded px-2 py-2 text-emerald-400 font-medium">
                        {(assumptions.cCorpReturn - assumptions.marginRate).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">💡 Borrow at {assumptions.marginRate}%, invest at {assumptions.cCorpReturn}% = {(assumptions.cCorpReturn - assumptions.marginRate).toFixed(1)}% arbitrage</div>
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
                  <div className="text-xs text-orange-400 mb-2 font-semibold">💰 Taxes</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Personal Tax Rate</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="1" value={assumptions.effectiveTaxRate} onChange={(e) => setAssumptions({ ...assumptions, effectiveTaxRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">On W2 + Jamie + business + rental</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">C-Corp Tax Rate</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="1" value={assumptions.cCorpTaxRate} onChange={(e) => setAssumptions({ ...assumptions, cCorpTaxRate: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">On C-Corp investment growth</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Note</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-gray-500 text-xs">
                        NT income splits: personal W2 vs C-Corp mgmt fee
                      </div>
                    </div>
                  </div>
                </div>

                {/* Living Expenses */}
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
                  <div className="text-xs text-red-400 mb-2 font-semibold">Annual Living Expenses</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'livingExpenses', label: 'Base Living Expenses' },
                      { key: 'healthInsurance', label: 'Health Insurance' },
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
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Monthly Burn</label>
                      <div className="bg-red-900/30 rounded px-2 py-2 text-red-400 font-medium">
                        {formatCurrency((assumptions.livingExpenses + assumptions.healthInsurance) / 12)}/mo
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
                      { key: 'jamieStartAge', label: 'Jamie Attending Starts' },
                      { key: 'jamieEndAge', label: 'Jamie Stops Contributing' },
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
                      { key: 'marginStartAge', label: 'Margin Trading Starts' },
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'landPurchase1Age', label: 'Offshore Land Purchase' },
                      { key: 'infrastructureAge', label: 'Infrastructure Build' },
                      { key: 'landPurchase2Age', label: 'Major Expansion' },
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
                        <div className="text-pink-400">{assumptions.jamieStartAge}</div>
                        <div className="text-gray-500">Jamie</div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-400">{assumptions.landPurchase2Age}</div>
                        <div className="text-gray-500">Expand</div>
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
              icon: '🚜', 
              title: 'Equipment & Infrastructure', 
              desc: 'Tractor, basic implements, fencing',
              cost: 65000,
              status: targetAge1 >= 32 ? 'complete' : 'upcoming',
              category: 'land'
            },
            { 
              age: 34, 
              year: 2029, 
              icon: '🏝️', 
              title: '15 Acres Offshore (Family)', 
              desc: 'Land abroad to share with extended family',
              cost: 45000,
              status: targetAge1 >= 34 ? 'complete' : 'upcoming',
              category: 'land'
            },
            { 
              age: 34, 
              year: 2029, 
              icon: '🏠', 
              title: 'Seattle Home → Rental', 
              desc: 'Convert primary to rental property, begin $6k/mo income',
              cost: 0,
              income: 72000,
              status: targetAge1 >= 34 ? 'complete' : 'upcoming',
              category: 'rental'
            },
            { 
              age: 35, 
              year: 2030, 
              icon: '🏡', 
              title: 'New Primary Home (0 Down)', 
              desc: 'Gap year start — closing costs only (~$15k)',
              cost: 15000,
              status: targetAge1 >= 35 ? 'complete' : 'upcoming',
              category: 'home'
            },
            { 
              age: 35, 
              year: 2030, 
              icon: '👩‍⚕️', 
              title: "Jamie's Gap Year", 
              desc: 'Transition year before attending surgeon role',
              cost: 0,
              status: targetAge1 >= 35 ? 'complete' : 'upcoming',
              category: 'income'
            },
            { 
              age: 36, 
              year: 2031, 
              icon: '💰', 
              title: "Jamie's Attending Income Starts", 
              desc: '$300k/yr surgical income begins',
              cost: 0,
              income: 300000,
              status: targetAge1 >= 36 ? 'complete' : 'upcoming',
              category: 'income'
            },
            { 
              age: 38, 
              year: 2033, 
              icon: '🏗️', 
              title: 'Business Infrastructure', 
              desc: 'Processing facility, commercial kitchen, event space',
              cost: 200000,
              status: targetAge1 >= 38 ? 'complete' : 'upcoming',
              category: 'land'
            },
            { 
              age: 40, 
              year: 2035, 
              icon: '🌲', 
              title: '100 Acre Expansion', 
              desc: 'Major land acquisition for full operations',
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
