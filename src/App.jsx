import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DESCRIPTIONS = {
  cCorp: "Olaporations C-Corp holding company that takes management fee from NT at 21% C-Corp tax rate to invest in diversified securities",
  seattle: "10737 3rd Ave NW, Seattle WA 98177 — appreciating ~6%/year with 2-3% rent increases annually once rented (starting age 34)",
  land: "Rural land acquisitions to grow, build community infrastructure, and commune sovereignly — appreciating ~4%/year",
  jamie: "Jamie's surgical income invested in diversified portfolio at ~10% returns — contributions start when she begins attending role",
  ventures: "Entrepreneurship fund for side projects and community businesses — conservative 1% annual return assumption",
  k401: "Tax-advantaged retirement account with $12k annual contributions at 8% average returns",
  ira: "Individual Retirement Account coasting at market returns — no additional contributions",
  newHome: "Downsized primary residence purchased at age 34 — lower cost, appreciating ~5%/year",
  margin: "Margin loan against C-Corp investments at 4.5% interest rate, using 30-35% of portfolio value. Spread between investment returns and interest creates additional income.",
  freeCash: "Annual surplus after all expenses, contributions, and debt service. Sources: Ayoola's income + Jamie's income + Rental net + Margin arbitrage − Living expenses − Homestead staff − Investment contributions"
};

export default function FinancialDashboard() {
  const [targetAge1, setTargetAge1] = useState(40);
  const [activeChart, setActiveChart] = useState('netWorth');
  const [showInputs, setShowInputs] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const [assumptions, setAssumptions] = useState({
    cCorpStart: 100000,
    cCorpReturn: 10,
    k401Return: 8,
    jamieReturn: 10,
    homeAppreciation: 6,
    newHomeAppreciation: 5,
    landAppreciation: 4,
    rentGrowth: 2.5,
    landPricePerAcre: 6000,
    initialAcres: 20,
    marginRate: 4.5,
    marginRatio: 32.5,
  });

  const toggleTooltip = (id) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const data = useMemo(() => {
    const years = [];
    let cCorp = assumptions.cCorpStart;
    let k401 = 15000;
    let ira = 5000;
    let seattleEquity = 30000;
    let newHomeEquity = 0;
    let acres = assumptions.initialAcres;
    let landEquity = acres * assumptions.landPricePerAcre;
    let jamieInvestments = 0;
    let entrepreneur = 0;
    let marginLoan = 0;
    let marginInvested = 0;

    for (let age = 31; age <= 85; age++) {
      let cCorpContrib = 0;
      let k401Contrib = 12000;
      let jamieContrib = 0;
      let entrepreneurContrib = 0;
      let ayoolaIncome = 0;
      let jamieIncome = 0;
      let rentalNet = 0;
      let expenses = 60000;
      let homesteadHelp = 0;
      let homesteadIncome = 0;

      if (age <= 32) {
        cCorpContrib = 180000;
        ayoolaIncome = 200000;
        jamieIncome = 100000;
      } else if (age <= 34) {
        cCorpContrib = 90000;
        ayoolaIncome = 150000;
        jamieIncome = 100000;
        entrepreneurContrib = 50000;
        homesteadHelp = 50000;
      } else if (age === 35) {
        cCorpContrib = 0;
        ayoolaIncome = 50000;
        jamieIncome = 0;
        homesteadHelp = 50000;
        entrepreneurContrib = 50000;
      } else if (age <= 45) {
        cCorpContrib = 100000;
        ayoolaIncome = 50000;
        jamieIncome = 300000;
        jamieContrib = 70000;
        homesteadHelp = 50000 + Math.min((age - 36) * 10000, 50000);
        entrepreneurContrib = 50000;
        homesteadIncome = Math.max(0, (age - 36) * 15000);
      } else {
        cCorpContrib = 0;
        ayoolaIncome = 50000;
        jamieIncome = 0;
        jamieContrib = 0;
        homesteadHelp = 100000;
        entrepreneurContrib = 0;
        homesteadIncome = 150000 + (age - 45) * 5000;
        k401Contrib = 0;
      }

      if (age >= 34) {
        const rentYears = age - 34;
        const grossRent = 72000 * Math.pow(1 + assumptions.rentGrowth / 100, rentYears);
        const mortgage = age < 64 ? 67200 : 0;
        const maintenance = grossRent * 0.1;
        rentalNet = grossRent - mortgage - maintenance;
      }

      cCorp = cCorp * (1 + assumptions.cCorpReturn / 100) + cCorpContrib;
      k401 = k401 * (1 + assumptions.k401Return / 100) + k401Contrib;
      ira = ira * (1 + assumptions.cCorpReturn / 100);
      
      if (age >= 34) {
        seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100) + 18000;
      } else {
        seattleEquity = seattleEquity * (1 + assumptions.homeAppreciation / 100);
      }

      if (age >= 34) {
        newHomeEquity = (newHomeEquity + 15000) * (1 + assumptions.newHomeAppreciation / 100);
      }

      if (age === 34) acres = 35;
      if (age === 40) acres = 135;
      landEquity = landEquity * (1 + assumptions.landAppreciation / 100);
      if (age === 34) landEquity += 15 * assumptions.landPricePerAcre * Math.pow(1 + assumptions.landAppreciation / 100, 3);
      if (age === 40) landEquity += 100 * assumptions.landPricePerAcre * Math.pow(1 + assumptions.landAppreciation / 100, 9);

      if (age >= 36 && age <= 45) {
        jamieInvestments = jamieInvestments * (1 + assumptions.jamieReturn / 100) + jamieContrib;
      } else if (age > 45) {
        jamieInvestments = jamieInvestments * (1 + assumptions.jamieReturn / 100);
      }

      if (age <= 45) {
        entrepreneur = entrepreneur * 1.01 + entrepreneurContrib;
      } else {
        entrepreneur = entrepreneur * 1.01;
      }

      if (age >= 36) {
        const maxMargin = cCorp * (assumptions.marginRatio / 100);
        marginLoan = maxMargin;
        marginInvested = marginInvested * (1 + assumptions.cCorpReturn / 100);
        const newBorrowing = Math.max(0, maxMargin - (marginInvested / (1 + assumptions.cCorpReturn / 100)));
        marginInvested += newBorrowing;
      }

      const marginInterest = marginLoan * (assumptions.marginRate / 100);
      const marginGain = marginInvested * (assumptions.cCorpReturn / 100);
      const marginNet = marginGain - marginInterest;

      const totalIn = ayoolaIncome + jamieIncome + Math.max(0, rentalNet) + marginNet + homesteadIncome;
      const totalOut = expenses + homesteadHelp + entrepreneurContrib + cCorpContrib + jamieContrib + Math.abs(Math.min(0, rentalNet));
      const freeCash = totalIn - totalOut;

      const netWorth = cCorp + k401 + ira + seattleEquity + newHomeEquity + landEquity + jamieInvestments + entrepreneur + marginInvested - marginLoan;
      
      // Passive income breakdown
      const safeWithdrawal = netWorth * 0.04;
      const passiveIncome = rentalNet + homesteadIncome + safeWithdrawal;

      years.push({
        age,
        year: 2026 + (age - 31),
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
        homesteadIncome: Math.round(homesteadIncome),
        passiveIncome: Math.round(passiveIncome),
        safeWithdrawal: Math.round(safeWithdrawal),
        freeCashSources: {
          ayoolaIncome,
          jamieIncome,
          rentalNet: Math.max(0, rentalNet),
          marginNet,
          homesteadIncome,
          expenses: -expenses,
          homesteadHelp: -homesteadHelp,
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
            <div className="text-amber-400">+ Homestead Income: {formatCurrency(src.homesteadIncome)}</div>
            <div className="text-red-400">− Living Expenses: {formatCurrency(Math.abs(src.expenses))}</div>
            <div className="text-red-400">− Homestead Staff: {formatCurrency(Math.abs(src.homesteadHelp))}</div>
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
    { age: 60, label: 'Legacy', icon: '👑' },
  ];

  const chartButtons = [
    { id: 'netWorth', label: 'Net Worth' },
    { id: 'assets', label: 'Assets' },
    { id: 'freeCash', label: 'Free Cash' },
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
      { label: 'Homestead Income', value: d.homesteadIncome, color: 'text-amber-400' },
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
      { label: 'Homestead Income', value: src.homesteadIncome, color: 'text-amber-400' },
      { label: 'Living Expenses', value: src.expenses, color: 'text-red-400' },
      { label: 'Homestead Staff', value: src.homesteadHelp, color: 'text-red-400' },
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
        <p className="text-gray-400 text-sm mt-1">Ages 31 → 85 • Homestead • Legacy</p>
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
            { label: 'Per Acre Value', value: Math.round((targetData1?.landEquity || 0) / (targetData1?.acres || 1)), color: 'text-gray-400' },
          ]}
          borderColor="amber-800"
        />
      </div>

      {/* Legacy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <StatCard 
          id="legacy"
          label={`Legacy Split (÷5) @ ${targetAge1}`}
          value={formatCurrency((targetData1?.netWorth || 0) / 5)}
          breakdown={getNetWorthBreakdown(targetData1).map(item => ({ ...item, value: Math.round(item.value / 5) }))}
          monthly={formatMonthly((targetData1?.netWorth || 0) / 5 * 0.04)}
          borderColor="purple-800"
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

      {/* Timeline */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6 overflow-x-auto">
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

      {/* Pie Chart */}
      <div className="bg-gray-900 rounded-xl p-4 border border-emerald-800 mb-6">
        <h2 className="text-sm text-emerald-400 mb-2 text-center font-semibold">Age {targetAge1} Allocation</h2>
        <ResponsiveContainer width="100%" height={250}>
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

      {/* Assumptions Panel */}
      <button 
        onClick={() => setShowInputs(!showInputs)}
        className="w-full bg-gray-800 rounded-xl p-3 border border-gray-700 mb-4 text-sm text-gray-400 hover:bg-gray-700 transition"
      >
        {showInputs ? '▼ Hide' : '▶ Adjust'} Assumptions
      </button>

      {showInputs && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'cCorpStart', label: 'C-Corp Start', prefix: '$' },
              { key: 'cCorpReturn', label: 'C-Corp Return', suffix: '%' },
              { key: 'jamieReturn', label: "Jamie's Return", suffix: '%' },
              { key: 'homeAppreciation', label: 'Seattle Apprec.', suffix: '%' },
              { key: 'landAppreciation', label: 'Land Apprec.', suffix: '%' },
              { key: 'marginRate', label: 'Margin Rate', suffix: '%' },
              { key: 'marginRatio', label: 'Margin Used', suffix: '%' },
              { key: 'landPricePerAcre', label: '$/Acre', prefix: '$' },
            ].map(({ key, label, prefix, suffix }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <div className="flex items-center bg-gray-800 rounded px-2">
                  {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                  <input
                    type="number"
                    step={key.includes('Ratio') || key.includes('Rate') ? '0.5' : '1'}
                    value={assumptions[key]}
                    onChange={(e) => setAssumptions({ ...assumptions, [key]: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent w-full py-2 text-white text-sm outline-none"
                  />
                  {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend with clickable info badges */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4">
        <div className="text-xs text-gray-500 mb-2">Tap any item for details:</div>
        <div className="flex flex-wrap gap-2">
          <InfoBadge id="cCorp" label="C-Corp" color="blue" />
          <InfoBadge id="k401" label="401k/IRA" color="purple" />
          <InfoBadge id="seattle" label="Seattle" color="emerald" />
          <InfoBadge id="land" label="Land" color="amber" />
          <InfoBadge id="jamie" label="Jamie's" color="pink" />
          <InfoBadge id="ventures" label="Ventures" color="cyan" />
          <InfoBadge id="margin" label="Margin" color="gray" />
          <InfoBadge id="freeCash" label="Free Cash" color="gray" />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="p-2 text-left">Age</th>
              <th className="p-2 text-right text-blue-400">C-Corp</th>
              <th className="p-2 text-right text-purple-400">401k</th>
              <th className="p-2 text-right text-emerald-400">Seattle</th>
              <th className="p-2 text-right text-amber-400">Land</th>
              <th className="p-2 text-right text-pink-400">Jamie's</th>
              <th className="p-2 text-right">Free $</th>
              <th className="p-2 text-right font-bold">Net Worth</th>
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
                <td className={`p-2 text-right ${row.freeCash < 0 ? 'text-red-400' : 'text-gray-400'}`}>{formatCurrency(row.freeCash)}</td>
                <td className="p-2 text-right font-bold text-white">{formatCurrency(row.netWorth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-gray-600 text-xs">
        Built for generational wealth • Homestead Hub • Community Impact
      </div>
    </div>
  );
}
