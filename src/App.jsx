import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DESCRIPTIONS = {
  cCorp: "Olaporations C-Corp holding company that takes management fee from NT at 21% C-Corp tax rate to invest in diversified securities",
  seattle: "10737 3rd Ave NW, Seattle WA 98177 — appreciating ~6%/year with 2-3% rent increases annually once rented (starting age 34)",
  land: "Rural land acquisitions — appreciating ~4%/year",
  jamie: "Jamie's surgical income invested in diversified portfolio at ~10% returns — contributions start when she begins attending role",
  ventures: "Entrepreneurship fund for side projects — conservative 1% annual return assumption",
  k401: "Tax-advantaged retirement account with $12k annual contributions at 8% average returns",
  freeCash: "Annual surplus after all expenses, contributions, and debt service",
  netWorth: "Total assets minus liabilities"
};

export default function FinancialDashboard() {
  const [targetAge1, setTargetAge1] = useState(40);
  const [activeChart, setActiveChart] = useState('netWorth');
  const [showInputs, setShowInputs] = useState(false);
  const [settingsTab, setSettingsTab] = useState('balances');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const [assumptions, setAssumptions] = useState({
    // Starting Balances
    currentAge: 31,
    cCorpStart: 100000,
    k401Start: 15000,
    iraStart: 5000,
    seattleEquityStart: 30000,
    
    // Returns & Appreciation
    cCorpReturn: 10,
    k401Return: 8,
    jamieReturn: 10,
    entrepreneurReturn: 1,
    homeAppreciation: 6,
    newHomeAppreciation: 5,
    landAppreciation: 4,
    
    // Land
    initialAcres: 20,
    landPricePerAcre: 6000,
    landPurchase1Age: 34,
    landPurchase1Acres: 15,
    landPurchase2Age: 40,
    landPurchase2Acres: 100,
    
    // Milestone Ages
    moveOutAge: 34,
    jamieStartAge: 36,
    jamieEndAge: 45,
    marginStartAge: 36,
    mortgagePaidAge: 64,
    
    // Margin
    marginRate: 4.5,
    marginRatio: 32.5,
    
    // Rental Property
    grossRentYear1: 72000,
    mortgagePayment: 67200,
    maintenanceRate: 10,
    rentGrowth: 2.5,
    seattlePrincipal: 18000,
    newHomePrincipal: 15000,
    
    // Annual Contributions
    k401Contrib: 12000,
    jamieContrib: 70000,
    entrepreneurContrib: 50000,
    
    // Expenses
    livingExpenses: 60000,
    staffExpensesBase: 50000,
    staffExpensesMax: 100000,
    
    // Income Phases
    phase1AyoolaIncome: 200000,
    phase1JamieIncome: 100000,
    phase1CCorpContrib: 180000,
    
    phase2AyoolaIncome: 150000,
    phase2JamieIncome: 100000,
    phase2CCorpContrib: 90000,
    
    phase3AyoolaIncome: 50000,
    
    phase4AyoolaIncome: 50000,
    phase4JamieIncome: 300000,
    phase4CCorpContrib: 100000,
    
    phase5AyoolaIncome: 50000,
    phase5BusinessIncome: 150000,
    phase5BusinessGrowth: 5000,
    
    // Withdrawal
    safeWithdrawalRate: 4,
  });

  const toggleTooltip = (id) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const data = useMemo(() => {
    const years = [];
    let cCorp = assumptions.cCorpStart;
    let k401 = assumptions.k401Start;
    let ira = assumptions.iraStart;
    let seattleEquity = assumptions.seattleEquityStart;
    let newHomeEquity = 0;
    let acres = assumptions.initialAcres;
    let landEquity = acres * assumptions.landPricePerAcre;
    let jamieInvestments = 0;
    let entrepreneur = 0;
    let marginLoan = 0;
    let marginInvested = 0;

    for (let age = assumptions.currentAge; age <= 85; age++) {
      let cCorpContrib = 0;
      let k401Contrib = assumptions.k401Contrib;
      let jamieContrib = 0;
      let entrepreneurContrib = 0;
      let ayoolaIncome = 0;
      let jamieIncome = 0;
      let rentalNet = 0;
      let expenses = assumptions.livingExpenses;
      let staffExpenses = 0;
      let businessIncome = 0;

      // Phase 1: Current state (current age to 32)
      if (age <= 32) {
        cCorpContrib = assumptions.phase1CCorpContrib;
        ayoolaIncome = assumptions.phase1AyoolaIncome;
        jamieIncome = assumptions.phase1JamieIncome;
      } 
      // Phase 2: Transition (33 to gap year - 1)
      else if (age < assumptions.jamieStartAge - 1) {
        cCorpContrib = assumptions.phase2CCorpContrib;
        ayoolaIncome = assumptions.phase2AyoolaIncome;
        jamieIncome = assumptions.phase2JamieIncome;
        entrepreneurContrib = assumptions.entrepreneurContrib;
        staffExpenses = assumptions.staffExpensesBase;
      }
      // Phase 3: Gap year (jamie start - 1)
      else if (age === assumptions.jamieStartAge - 1) {
        cCorpContrib = 0;
        ayoolaIncome = assumptions.phase3AyoolaIncome;
        jamieIncome = 0;
        staffExpenses = assumptions.staffExpensesBase;
        entrepreneurContrib = assumptions.entrepreneurContrib;
      } 
      // Phase 4: Jamie earning (jamieStartAge to jamieEndAge)
      else if (age <= assumptions.jamieEndAge) {
        cCorpContrib = assumptions.phase4CCorpContrib;
        ayoolaIncome = assumptions.phase4AyoolaIncome;
        jamieIncome = assumptions.phase4JamieIncome;
        jamieContrib = assumptions.jamieContrib;
        staffExpenses = assumptions.staffExpensesBase + Math.min((age - assumptions.jamieStartAge) * 10000, assumptions.staffExpensesMax - assumptions.staffExpensesBase);
        entrepreneurContrib = assumptions.entrepreneurContrib;
        businessIncome = Math.max(0, (age - assumptions.jamieStartAge) * 15000);
      } 
      // Phase 5: Coast mode (after jamieEndAge)
      else {
        cCorpContrib = 0;
        ayoolaIncome = assumptions.phase5AyoolaIncome;
        jamieIncome = 0;
        jamieContrib = 0;
        staffExpenses = assumptions.staffExpensesMax;
        entrepreneurContrib = 0;
        businessIncome = assumptions.phase5BusinessIncome + (age - assumptions.jamieEndAge - 1) * assumptions.phase5BusinessGrowth;
        k401Contrib = 0;
      }

      // Rental income (after move out)
      if (age >= assumptions.moveOutAge) {
        const rentYears = age - assumptions.moveOutAge;
        const grossRent = assumptions.grossRentYear1 * Math.pow(1 + assumptions.rentGrowth / 100, rentYears);
        const mortgage = age < assumptions.mortgagePaidAge ? assumptions.mortgagePayment : 0;
        const maintenance = grossRent * (assumptions.maintenanceRate / 100);
        rentalNet = grossRent - mortgage - maintenance;
      }

      // Investment growth
      cCorp = cCorp * (1 + assumptions.cCorpReturn / 100) + cCorpContrib;
      k401 = k401 * (1 + assumptions.k401Return / 100) + k401Contrib;
      ira = ira * (1 + assumptions.cCorpReturn / 100);
      
      // Seattle equity (principal paydown after rental)
      if (age >= assumptions.moveOutAge) {
        seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100) + assumptions.seattlePrincipal;
      } else {
        seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100);
      }

      // New home equity
      if (age >= assumptions.moveOutAge) {
        newHomeEquity = (newHomeEquity + assumptions.newHomePrincipal) * (1 + assumptions.newHomeAppreciation / 100);
      }

      // Land purchases
      let newAcres = 0;
      if (age === assumptions.landPurchase1Age) newAcres = assumptions.landPurchase1Acres;
      if (age === assumptions.landPurchase2Age) newAcres = assumptions.landPurchase2Acres;
      acres += newAcres;
      landEquity = landEquity * (1 + assumptions.landAppreciation / 100);
      if (age === assumptions.landPurchase1Age) {
        landEquity += assumptions.landPurchase1Acres * assumptions.landPricePerAcre * Math.pow(1 + assumptions.landAppreciation / 100, assumptions.landPurchase1Age - assumptions.currentAge);
      }
      if (age === assumptions.landPurchase2Age) {
        landEquity += assumptions.landPurchase2Acres * assumptions.landPricePerAcre * Math.pow(1 + assumptions.landAppreciation / 100, assumptions.landPurchase2Age - assumptions.currentAge);
      }

      // Jamie's investments
      if (age >= assumptions.jamieStartAge && age <= assumptions.jamieEndAge) {
        jamieInvestments = jamieInvestments * (1 + assumptions.jamieReturn / 100) + jamieContrib;
      } else if (age > assumptions.jamieEndAge) {
        jamieInvestments = jamieInvestments * (1 + assumptions.jamieReturn / 100);
      }

      // Entrepreneur fund
      if (age <= assumptions.jamieEndAge) {
        entrepreneur = entrepreneur * (1 + assumptions.entrepreneurReturn / 100) + entrepreneurContrib;
      } else {
        entrepreneur = entrepreneur * (1 + assumptions.entrepreneurReturn / 100);
      }

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

      const totalIn = ayoolaIncome + jamieIncome + Math.max(0, rentalNet) + marginNet + businessIncome;
      const totalOut = expenses + staffExpenses + entrepreneurContrib + cCorpContrib + jamieContrib + Math.abs(Math.min(0, rentalNet));
      const freeCash = totalIn - totalOut;

      const netWorth = cCorp + k401 + ira + seattleEquity + newHomeEquity + landEquity + jamieInvestments + entrepreneur + marginInvested - marginLoan;
      
      // Passive income breakdown
      const safeWithdrawal = netWorth * (assumptions.safeWithdrawalRate / 100);
      const passiveIncome = rentalNet + businessIncome + safeWithdrawal;

      years.push({
        age,
        year: 2026 + (age - assumptions.currentAge),
        cCorp: Math.round(cCorp),
        k401: Math.round(k401),
        ira: Math.round(ira),
        seattleEquity: Math.round(seattleEquity),
        newHomeEquity: Math.round(newHomeEquity),
        rentalNet: Math.round(rentalNet),
        acres,
        landEquity: Math.round(landEquity),
        jamieInvestments: Math.round(jamieInvestments),
        entrepreneur: Math.round(entrepreneur),
        marginLoan: Math.round(marginLoan),
        marginInvested: Math.round(marginInvested),
        marginNet: Math.round(marginNet),
        freeCash: Math.round(freeCash),
        netWorth: Math.round(netWorth),
        ayoolaIncome: Math.round(ayoolaIncome),
        jamieIncome: Math.round(jamieIncome),
        businessIncome: Math.round(businessIncome),
        passiveIncome: Math.round(passiveIncome),
        safeWithdrawal: Math.round(safeWithdrawal),
        freeCashSources: {
          ayoolaIncome,
          jamieIncome,
          rentalNet: Math.max(0, rentalNet),
          marginNet,
          businessIncome,
          expenses: -expenses,
          staffExpenses: -staffExpenses,
          contributions: -(cCorpContrib + jamieContrib + entrepreneurContrib),
        }
      });
    }
    return years;
  }, [assumptions]);

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
      { name: '401k/IRA', value: ageData.k401 + ageData.ira, desc: DESCRIPTIONS.k401 },
      { name: 'Seattle', value: ageData.seattleEquity, desc: DESCRIPTIONS.seattle },
      { name: 'New Home', value: ageData.newHomeEquity, desc: DESCRIPTIONS.newHome },
      { name: 'Land', value: ageData.landEquity, desc: DESCRIPTIONS.land },
      { name: "Jamie's", value: ageData.jamieInvestments, desc: DESCRIPTIONS.jamie },
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
            <div className="text-emerald-400">+ Ayoola's Income: {formatCurrency(src.ayoolaIncome)}</div>
            <div className="text-pink-400">+ Jamie's Income: {formatCurrency(src.jamieIncome)}</div>
            <div className="text-blue-400">+ Rental Net: {formatCurrency(src.rentalNet)}</div>
            <div className="text-cyan-400">+ Margin Arbitrage: {formatCurrency(src.marginNet)}</div>
            <div className="text-amber-400">+ Business Income: {formatCurrency(src.businessIncome)}</div>
            <div className="text-red-400">− Living Expenses: {formatCurrency(Math.abs(src.expenses))}</div>
            <div className="text-red-400">− Staff Expenses: {formatCurrency(Math.abs(src.staffExpenses))}</div>
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
    { age: 31, label: 'Start', icon: '🚀' },
    { age: 34, label: 'Move & Rent', icon: '🏠' },
    { age: 35, label: 'Gap Year', icon: '⏸️' },
    { age: 36, label: 'Jamie $300K', icon: '💰' },
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
              <Area type="monotone" dataKey="jamieInvestments" stackId="1" stroke="#EC4899" fill="#EC4899" name="Jamie's" />
              <Area type="monotone" dataKey="landEquity" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Land" />
              <Area type="monotone" dataKey="seattleEquity" stackId="1" stroke="#10B981" fill="#10B981" name="Seattle" />
              <Area type="monotone" dataKey="k401" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="401k" />
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
      { label: '401k/IRA', value: d.k401 + d.ira, color: 'text-purple-400' },
      { label: 'Seattle Equity', value: d.seattleEquity, color: 'text-emerald-400' },
      { label: 'New Home Equity', value: d.newHomeEquity, color: 'text-green-400' },
      { label: 'Land', value: d.landEquity, color: 'text-amber-400' },
      { label: "Jamie's Investments", value: d.jamieInvestments, color: 'text-pink-400' },
      { label: 'Ventures', value: d.entrepreneur, color: 'text-cyan-400' },
      { label: 'Margin (net)', value: d.marginInvested - d.marginLoan, color: 'text-gray-400' },
    ].filter(item => item.value !== 0);
  };

  const getPassiveIncomeBreakdown = (d) => {
    if (!d) return [];
    return [
      { label: '4% Safe Withdrawal', value: d.safeWithdrawal, color: 'text-emerald-400' },
      { label: 'Rental Net', value: d.rentalNet, color: 'text-blue-400' },
      { label: 'Business Income', value: d.businessIncome, color: 'text-amber-400' },
    ].filter(item => item.value !== 0);
  };

  const getFreeCashBreakdown = (d) => {
    if (!d) return [];
    const src = d.freeCashSources;
    return [
      { label: "Ayoola's Income", value: src.ayoolaIncome, color: 'text-emerald-400' },
      { label: "Jamie's Income", value: src.jamieIncome, color: 'text-pink-400' },
      { label: 'Rental Net', value: src.rentalNet, color: 'text-blue-400' },
      { label: 'Margin Arbitrage', value: src.marginNet, color: 'text-cyan-400' },
      { label: 'Business Income', value: src.businessIncome, color: 'text-amber-400' },
      { label: 'Living Expenses', value: src.expenses, color: 'text-red-400' },
      { label: 'Staff Expenses', value: src.staffExpenses, color: 'text-red-400' },
      { label: 'Contributions', value: src.contributions, color: 'text-red-400' },
    ].filter(item => item.value !== 0);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4" onClick={(e) => {
      if (e.target === e.currentTarget) {
        setActiveTooltip(null);
        setActiveCard(null);
      }
    }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Ayoola & Jamie's Wealth Map
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
            { label: 'Land Equity', value: targetData1?.landEquity || 0, color: 'text-amber-400' },
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
                <td className="p-2 text-right text-purple-400">{formatCurrency(row.k401)}</td>
                <td className="p-2 text-right text-emerald-400">{formatCurrency(row.seattleEquity)}</td>
                <td className="p-2 text-right text-amber-400">{formatCurrency(row.landEquity)}</td>
                <td className="p-2 text-right text-pink-400">{formatCurrency(row.jamieInvestments)}</td>
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

      {/* Settings Panel */}
      <button 
        onClick={() => setShowInputs(!showInputs)}
        className="w-full bg-gray-800 rounded-xl p-3 border border-gray-700 mb-4 text-sm text-gray-400 hover:bg-gray-700 transition"
      >
        {showInputs ? '▼ Hide' : '▶ Adjust'} Settings
      </button>

      {showInputs && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6 overflow-hidden">
          {/* Settings Tabs */}
          <div className="flex flex-wrap border-b border-gray-800">
            {[
              { id: 'balances', label: 'Starting Balances' },
              { id: 'returns', label: 'Returns' },
              { id: 'milestones', label: 'Milestones' },
              { id: 'income', label: 'Income Phases' },
              { id: 'rental', label: 'Rental' },
              { id: 'land', label: 'Land' },
              { id: 'expenses', label: 'Expenses' },
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
            {/* Starting Balances */}
            {settingsTab === 'balances' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'currentAge', label: 'Current Age', suffix: '' },
                  { key: 'cCorpStart', label: 'C-Corp', prefix: '$' },
                  { key: 'k401Start', label: '401k', prefix: '$' },
                  { key: 'iraStart', label: 'IRA', prefix: '$' },
                  { key: 'seattleEquityStart', label: 'Seattle Equity', prefix: '$' },
                  { key: 'initialAcres', label: 'Initial Acres', suffix: ' ac' },
                ].map(({ key, label, prefix, suffix }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{label}</label>
                    <div className="flex items-center bg-gray-800 rounded px-2">
                      {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                      <input
                        type="number"
                        value={assumptions[key]}
                        onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent w-full py-2 text-white text-sm outline-none"
                      />
                      {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Returns */}
            {settingsTab === 'returns' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'cCorpReturn', label: 'C-Corp Return' },
                  { key: 'k401Return', label: '401k Return' },
                  { key: 'jamieReturn', label: "Jamie's Return" },
                  { key: 'entrepreneurReturn', label: 'Ventures Return' },
                  { key: 'homeAppreciation', label: 'Seattle Apprec.' },
                  { key: 'newHomeAppreciation', label: 'New Home Apprec.' },
                  { key: 'landAppreciation', label: 'Land Apprec.' },
                  { key: 'safeWithdrawalRate', label: 'Withdrawal Rate' },
                  { key: 'marginRate', label: 'Margin Rate' },
                  { key: 'marginRatio', label: 'Margin Ratio' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{label}</label>
                    <div className="flex items-center bg-gray-800 rounded px-2">
                      <input
                        type="number"
                        step="0.5"
                        value={assumptions[key]}
                        onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent w-full py-2 text-white text-sm outline-none"
                      />
                      <span className="text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Milestones */}
            {settingsTab === 'milestones' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'moveOutAge', label: 'Move Out / Rent Start' },
                  { key: 'jamieStartAge', label: 'Jamie Income Starts' },
                  { key: 'jamieEndAge', label: 'Jamie Income Ends' },
                  { key: 'marginStartAge', label: 'Margin Trading Starts' },
                  { key: 'mortgagePaidAge', label: 'Mortgage Paid Off' },
                  { key: 'landPurchase1Age', label: 'Land Purchase #1' },
                  { key: 'landPurchase2Age', label: 'Land Purchase #2' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{label}</label>
                    <div className="flex items-center bg-gray-800 rounded px-2">
                      <span className="text-gray-500 text-sm">Age</span>
                      <input
                        type="number"
                        value={assumptions[key]}
                        onChange={(e) => setAssumptions({ ...assumptions, [key]: parseInt(e.target.value) || 0 })}
                        className="bg-transparent w-full py-2 text-white text-sm outline-none text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Income Phases */}
            {settingsTab === 'income' && (
              <div className="space-y-4">
                <div className="text-xs text-gray-400 mb-2">Phase 1: Ages 31-32 (Current)</div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'phase1AyoolaIncome', label: "Ayoola's Income" },
                    { key: 'phase1JamieIncome', label: "Jamie's Income" },
                    { key: 'phase1CCorpContrib', label: 'C-Corp Contrib' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{label}</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-gray-400 mb-2">Phase 2: Ages 33-34 (Transition)</div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'phase2AyoolaIncome', label: "Ayoola's Income" },
                    { key: 'phase2JamieIncome', label: "Jamie's Income" },
                    { key: 'phase2CCorpContrib', label: 'C-Corp Contrib' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{label}</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-400 mb-2">Phase 3: Gap Year (Age 35)</div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Ayoola's Income</label>
                    <div className="flex items-center bg-gray-800 rounded px-2">
                      <span className="text-gray-500 text-sm">$</span>
                      <input type="number" value={assumptions.phase3AyoolaIncome} onChange={(e) => setAssumptions({ ...assumptions, phase3AyoolaIncome: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-400 mb-2">Phase 4: Jamie Earning (Ages 36-45)</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'phase4AyoolaIncome', label: "Ayoola's Income" },
                    { key: 'phase4JamieIncome', label: "Jamie's Income" },
                    { key: 'phase4CCorpContrib', label: 'C-Corp Contrib' },
                    { key: 'jamieContrib', label: "Jamie's Invest Contrib" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{label}</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-400 mb-2">Phase 5: Coast Mode (Ages 46+)</div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'phase5AyoolaIncome', label: "Ayoola's Income" },
                    { key: 'phase5BusinessIncome', label: 'Business Income (Start)' },
                    { key: 'phase5BusinessGrowth', label: 'Business Growth/yr' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{label}</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">$</span>
                        <input type="number" value={assumptions[key]} onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rental */}
            {settingsTab === 'rental' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'grossRentYear1', label: 'Gross Rent (Year 1)', prefix: '$' },
                  { key: 'rentGrowth', label: 'Rent Growth', suffix: '%' },
                  { key: 'mortgagePayment', label: 'Mortgage Payment/yr', prefix: '$' },
                  { key: 'maintenanceRate', label: 'Maintenance', suffix: '%' },
                  { key: 'seattlePrincipal', label: 'Principal Paydown/yr', prefix: '$' },
                  { key: 'newHomePrincipal', label: 'New Home Principal/yr', prefix: '$' },
                ].map(({ key, label, prefix, suffix }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{label}</label>
                    <div className="flex items-center bg-gray-800 rounded px-2">
                      {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                      <input
                        type="number"
                        step={suffix === '%' ? '0.5' : '1000'}
                        value={assumptions[key]}
                        onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent w-full py-2 text-white text-sm outline-none"
                      />
                      {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Land */}
            {settingsTab === 'land' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'landPricePerAcre', label: 'Price per Acre', prefix: '$' },
                  { key: 'landPurchase1Acres', label: 'Purchase #1 Acres', suffix: ' ac' },
                  { key: 'landPurchase2Acres', label: 'Purchase #2 Acres', suffix: ' ac' },
                ].map(({ key, label, prefix, suffix }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{label}</label>
                    <div className="flex items-center bg-gray-800 rounded px-2">
                      {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                      <input
                        type="number"
                        value={assumptions[key]}
                        onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent w-full py-2 text-white text-sm outline-none"
                      />
                      {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Expenses */}
            {settingsTab === 'expenses' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'livingExpenses', label: 'Living Expenses/yr', prefix: '$' },
                  { key: 'staffExpensesBase', label: 'Staff (Base)/yr', prefix: '$' },
                  { key: 'staffExpensesMax', label: 'Staff (Max)/yr', prefix: '$' },
                  { key: 'k401Contrib', label: '401k Contrib/yr', prefix: '$' },
                  { key: 'entrepreneurContrib', label: 'Ventures Contrib/yr', prefix: '$' },
                ].map(({ key, label, prefix }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{label}</label>
                    <div className="flex items-center bg-gray-800 rounded px-2">
                      {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                      <input
                        type="number"
                        step="1000"
                        value={assumptions[key]}
                        onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent w-full py-2 text-white text-sm outline-none"
                      />
                    </div>
                  </div>
                ))}
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
