import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { DEFAULT_ASSUMPTIONS, runSimulation } from '../lib/simulation';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DESCRIPTIONS = {
  seattle: "10737 3rd Ave NW — sold at 31 (divorce settlement). 50% of net proceeds fund land down payment, remainder → Robinhood.",
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
  // NT additional work ($80K/yr) now permanent — no toggle needed
  const tableContainerRef = useRef(null);

  const [liveBalancesLoaded, setLiveBalancesLoaded] = useState(false);

  const [assumptions, setAssumptions] = useState(DEFAULT_ASSUMPTIONS);

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

  const data = useMemo(() => runSimulation(assumptions), [assumptions]);

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
      { name: 'Home Build', value: ageData.homeBuild, desc: 'Cumulative home development investment on land — $20K/yr from ventures fund' },
      { name: 'Land', value: ageData.totalLandEquity, desc: 'All property equity: US primary + offshore (Belize/CR) + Nigeria + city rentals' },
      { name: 'Venture 2', value: ageData.venture2, desc: 'RH-funded operating business — 10% of RH gains + matching self-income, revolving LOC' },
      { name: 'QOZ Fund', value: ageData.qozFund, desc: DESCRIPTIONS.qoz },
      { name: 'Ventures', value: ageData.ventures, desc: 'Venture fund — redirected 401k contributions ($1K/mo from age 32)' },
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
    { age: 32, label: '15+ Acres + Build', icon: '🌱', link: '/homestead' },
    { age: 33, label: 'Offshore Land', icon: '🌴', link: '/offshore' },
    { age: 35, label: 'Nigeria Land', icon: '🌍', link: '/nigeria' },
    { age: 40, label: 'City Rentals', icon: '🏘️', link: '/venture2' },
    { age: 45, label: 'Coast', icon: '⛵' },
    { age: 60, label: 'Retire + Legacy', icon: '👑', link: '/venture3' },
    { age: 60, label: 'V3 Generational', icon: '🏛️', link: '/venture3' },
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
              <Area type="monotone" dataKey="totalLandEquity" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Land" />
              <Area type="monotone" dataKey="homeBuild" stackId="1" stroke="#10B981" fill="#10B981" name="Home Build" />
              <Area type="monotone" dataKey="k401" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="401k/IRA" />
              <Area type="monotone" dataKey="qozFund" stackId="1" stroke="#06B6D4" fill="#06B6D4" name="QOZ Fund" />
              <Area type="monotone" dataKey="ventures" stackId="1" stroke="#84CC16" fill="#84CC16" name="Ventures" />
              <Area type="monotone" dataKey="venture2" stackId="1" stroke="#EC4899" fill="#EC4899" name="Venture 2" />
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

  // Table Header with tooltip + optional navigation link
  const TableHeader = ({ id, label, color = 'text-gray-400', align = 'right', link }) => {
    const isActive = activeTooltip === id;
    return (
      <th className={`p-2 text-${align} ${color} relative`}>
        <div className="flex items-center justify-end gap-1">
          {link ? (
            <Link
              to={link}
              className="hover:underline cursor-pointer transition-colors hover:brightness-125"
            >
              {label} →
            </Link>
          ) : (
            <button
              onClick={() => toggleTooltip(id)}
              className="hover:underline cursor-help"
            >
              {label}
            </button>
          )}
        </div>
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
      { label: 'Home Build', value: d.homeBuild, color: 'text-emerald-400' },
      { label: 'Land', value: d.landEquity, color: 'text-amber-400' },
      { label: 'QOZ Fund', value: d.qozFund, color: 'text-cyan-400' },
      { label: 'Ventures', value: d.ventures, color: 'text-lime-400' },
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
      { label: 'RH Pull (personal)', value: src.rhPullPersonal, color: 'text-orange-400' },
      { label: 'Rental (50%)', value: src.rentalShare, color: 'text-blue-400' },
      { label: 'Business Income', value: src.businessIncome, color: 'text-amber-400' },
      { label: 'Living Expenses', value: src.expenses, color: 'text-red-400' },
      { label: 'Staff Expenses', value: src.staffExpenses, color: 'text-red-400' },
      { label: 'Additional Taxes', value: src.additionalTaxes, color: 'text-orange-300' },
    ].filter(item => item.value !== undefined && item.value !== 0);

    if (src.netDistributions > 0) {
      items.push({ label: `S-Corp Distrib → Robinhood`, value: src.netDistributions, color: 'text-blue-400' });
    }
    if (src.rhPullQoz < 0) {
      items.push({ label: `RH Pull → QOZ`, value: src.rhPullQoz, color: 'text-cyan-400' });
    }
    if (src.rhPullNonprofit < 0) {
      items.push({ label: `RH Pull → Nonprofit`, value: src.rhPullNonprofit, color: 'text-green-400' });
    }
    if (src.freeCashToQoz < 0) {
      items.push({ label: `Free Cash → QOZ (66%)`, value: src.freeCashToQoz, color: 'text-cyan-400' });
    }
    if (src.freeCashToRH > 0) {
      items.push({ label: `Free Cash → Robinhood`, value: src.freeCashToRH, color: 'text-blue-400' });
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
          label={`Home Build @ ${targetAge1}`}
          value={formatCurrency(targetData1?.homeBuild || 0)}
          breakdown={[
            { label: 'Total Home Equity', value: targetData1?.seattleEquity || 0, color: 'text-gray-400' },
            { label: 'Cumulative Dev Spend', value: targetData1?.homeBuild || 0, color: 'text-emerald-400' },
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
              <TableHeader id="robinhood" label="Robinhood" color="text-orange-400" />
              <TableHeader id="k401" label="401k/IRA" color="text-purple-400" />
              <TableHeader id="land" label="Land" color="text-amber-400" link="/homestead" />
              <TableHeader id="ventures" label="Ventures" color="text-lime-400" link="/venture1" />
              <TableHeader id="venture2" label="Venture 2" color="text-pink-400" link="/venture2" />
              <TableHeader id="hardAssets" label="Hard Assets" color="text-yellow-400" link="/hard-assets" />
              <TableHeader id="qoz" label="QOZ Fund" color="text-cyan-400" />
              <th className="p-2 text-right text-red-400">Tax</th>
              <TableHeader id="netWorth" label="Net Worth" color="text-white font-bold" />
            </tr>
          </thead>
          <tbody>
            {data.filter(d => d.age <= 50 || d.age % 10 === 0).map((row) => (
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
                <td className="p-2 text-right text-orange-400">{formatCurrency(row.robinhood)}</td>
                <td className="p-2 text-right text-purple-400">{formatCurrency(row.k401 + row.ira)}</td>
                <td className="p-2 text-right text-amber-400">{formatCurrency(row.totalLandEquity)}</td>
                <td className="p-2 text-right text-lime-400">{formatCurrency(row.ventures)}</td>
                <td className="p-2 text-right text-pink-400">{formatCurrency(row.venture2)}</td>
                <td className="p-2 text-right text-yellow-400">{formatCurrency(row.hardAssets)}</td>
                <td className="p-2 text-right text-cyan-400">{formatCurrency(row.qozFund)}</td>
                <td className="p-2 text-right text-red-400 relative group/tax">
                  <span className="cursor-help">{formatCurrency(row.totalTax)}</span>
                  <span className="ml-1 text-red-500 text-[9px]">{row.effectiveTaxRate}%</span>
                  <div className="hidden group-hover/tax:block absolute right-0 bottom-full mb-1 bg-gray-950 border border-gray-700 rounded-lg p-3 text-xs w-56 z-20 shadow-xl">
                    <div className="font-bold text-white mb-2">Tax Breakdown @ {row.age}</div>
                    <div className="space-y-1">
                      {row.taxBreakdown.w2Tax > 0 && <div className="flex justify-between"><span className="text-gray-400">W2 ({assumptions.personalTaxRate}%)</span><span className="text-red-400">{formatCurrency(row.taxBreakdown.w2Tax)}</span></div>}
                      {row.taxBreakdown.distributionTax > 0 && <div className="flex justify-between"><span className="text-gray-400">Distrib ({assumptions.distributionTaxRate}%)</span><span className="text-red-400">{formatCurrency(row.taxBreakdown.distributionTax)}</span></div>}
                      {row.taxBreakdown.additionalTax > 0 && <div className="flex justify-between"><span className="text-gray-400">Add'l Income (15%)</span><span className="text-red-400">{formatCurrency(row.taxBreakdown.additionalTax)}</span></div>}
                      {row.taxBreakdown.rhPullTax > 0 && <div className="flex justify-between"><span className="text-gray-400">RH LTCG (15%)</span><span className="text-red-400">{formatCurrency(row.taxBreakdown.rhPullTax)}</span></div>}
                      {row.taxBreakdown.employerPayroll > 0 && <div className="flex justify-between"><span className="text-gray-400">Employer Payroll</span><span className="text-red-400">{formatCurrency(row.taxBreakdown.employerPayroll)}</span></div>}
                      <div className="border-t border-gray-700 pt-1 mt-1 flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-red-400">{formatCurrency(row.totalTax)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Gross Income</span>
                        <span>{formatCurrency(row.taxBreakdown.totalGrossIncome)}</span>
                      </div>
                      <div className="flex justify-between text-orange-400 font-semibold">
                        <span>Effective Rate</span>
                        <span>{row.effectiveTaxRate}%</span>
                      </div>
                    </div>
                  </div>
                </td>
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
                  <div className="text-xs text-yellow-400 mt-2">W2 maintained — NT covers salary, no distributions</div>
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
                {/* Seattle Home — SOLD */}
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2 font-semibold">🏠 Seattle Home — 10737 3rd Ave NW (SOLD at {assumptions.seattleSaleAge})</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Sale Value</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-gray-400 font-medium">
                        {formatCurrency(assumptions.seattleCurrentValue)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Equity at Sale</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-gray-400 font-medium">
                        {formatCurrency(assumptions.seattleCurrentValue - assumptions.seattleMortgageBalance)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Proceeds (50%)</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-emerald-400 font-medium">
                        {formatCurrency((assumptions.seattleCurrentValue - assumptions.seattleMortgageBalance - assumptions.seattleCurrentValue * assumptions.seattleSellerFeePct / 100) / 2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Divorce settlement — 50% of net proceeds funded land down payment, remainder → Robinhood</div>
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
                        $12K living expenses
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">💡 No mortgage — housing cost included in $12K/yr ($1K/mo) living expenses</div>
                </div>
              </div>
            )}

            {/* City Rental Properties (V2-owned) */}
            {settingsTab === 'rental' && (
              <div className="space-y-4">
                <div className="text-xs text-blue-400 font-semibold mb-2">City Rental Properties — V2-owned (Age {assumptions.rentalPurchaseAge}+)</div>

                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Acquisition</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Total Purchase Price</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-white font-medium text-sm">
                        {formatCurrency(assumptions.rentalPurchasePrice)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Down Payment (25%)</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-yellow-400 font-medium text-sm">
                        {formatCurrency(assumptions.rentalDownPayment)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Mortgage Rate</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-white font-medium text-sm">
                        {assumptions.rentalMortgageRate}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-800">
                  <div className="text-xs text-emerald-400 mb-2 font-semibold">Income</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Gross Rent Year 1</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-emerald-400 font-medium text-sm">
                        {formatCurrency(assumptions.rentalGrossRentYear1)}/yr
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Occupancy</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-white font-medium text-sm">
                        {assumptions.rentalOccupancy}%
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Rent Growth</label>
                      <div className="bg-gray-800 rounded px-2 py-2 text-white font-medium text-sm">
                        {assumptions.rentalRentGrowth}%/yr
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">2-3 city units (Airbnb + long-term mix). Income flows to V2 balance, not personal.</div>
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
                      <label className="text-xs text-gray-400 block mb-1">401k (age 31: {assumptions.k401Rate}%)</label>
                      <div className="bg-blue-900/30 rounded px-2 py-2 text-blue-400 font-medium">
                        {formatCurrency(assumptions.w2Gross * assumptions.k401Rate / 100)}/yr
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">401k ({assumptions.k401Rate}% of W2)</label>
                      <div className="bg-blue-900/30 rounded px-2 py-2 text-blue-400 font-medium">
                        {formatCurrency(assumptions.w2Gross * assumptions.k401Rate / 100 - assumptions.k401ReductionAmount)}/yr
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Free Cash → Ventures</label>
                      <div className="bg-lime-900/30 rounded px-2 py-2 text-lime-400 font-medium">
                        $1K/mo from age {assumptions.k401ReductionAge}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">At age {assumptions.k401ReductionAge}, $1K/mo pulled from Robinhood into ventures fund.</div>
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
                      { key: 'venturesReturn', label: 'Ventures Return' },
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
                
                {/* Robinhood Growth Pulls */}
                <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-800">
                  <div className="text-xs text-orange-400 mb-2 font-semibold">Robinhood Growth Pulls (Tax-Strategic LTCG from Age {assumptions.rhPullStartAge})</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Start Age</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <span className="text-gray-500 text-sm">Age</span>
                        <input type="number" step="1" value={assumptions.rhPullStartAge} onChange={(e) => setAssumptions({ ...assumptions, rhPullStartAge: parseInt(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none text-right" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ Personal (% of growth)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="0.5" value={assumptions.rhPullPersonalPct} onChange={(e) => setAssumptions({ ...assumptions, rhPullPersonalPct: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">→ QOZ Fund (% of growth)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="0.5" value={assumptions.rhPullQozPct} onChange={(e) => setAssumptions({ ...assumptions, rhPullQozPct: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="col-span-3">
                      <label className="text-xs text-gray-400 block mb-1">Free Cash → QOZ (%)</label>
                      <div className="flex items-center bg-gray-800 rounded px-2">
                        <input type="number" step="5" value={assumptions.freeCashToQozPct} onChange={(e) => setAssumptions({ ...assumptions, freeCashToQozPct: parseFloat(e.target.value) || 0 })} className="bg-transparent w-full py-2 text-white text-sm outline-none" />
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">RH pulls: {assumptions.rhPullPersonalPct}% personal + {assumptions.rhPullQozPct}% QOZ. Plus {assumptions.freeCashToQozPct}% of positive free cash → QOZ. LTCG at 15%.</div>
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
                        $1K/mo — bills, utilities, food, travel (Seattle sold at 31)
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
                      { key: 'seattleSaleAge', label: 'Seattle Sale Age' },
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
                      { key: 'qozInvestAge', label: 'QOZ Fund Investment' },
                      { key: 'debtPayoffAge', label: 'Debt Payoff Target' },
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
              icon: '🏠',
              title: 'Sell Seattle Home',
              desc: 'Divorce settlement sale — 50% of net proceeds fund land down payment, rest → Robinhood.',
              cost: 0,
              status: targetAge1 >= 31 ? 'complete' : 'upcoming',
              category: 'home'
            },
            {
              age: 31,
              year: 2026,
              icon: '🌾',
              title: 'Land Purchase (15+ acres)',
              desc: `${formatCurrency(assumptions.landPurchasePrice)} rural homestead — financed with Seattle proceeds + mortgage.`,
              cost: assumptions.landPurchasePrice,
              status: targetAge1 >= 31 ? 'complete' : 'upcoming',
              category: 'land'
            },
            {
              age: 32,
              year: 2027,
              icon: '🏗️',
              title: 'Construction Loan + V1 LOC',
              desc: `${formatCurrency(assumptions.constructionLoanAmount)} home build + ${formatCurrency(assumptions.venturesLocAmount)} business LOC. V2 launches.`,
              cost: assumptions.constructionLoanAmount + assumptions.venturesLocAmount,
              status: targetAge1 >= 32 ? 'complete' : 'upcoming',
              category: 'milestone'
            },
            {
              age: 33,
              year: 2028,
              icon: '🇳🇬',
              title: 'Nigeria Ops Hub + Hard Assets',
              desc: 'Ops hub launches (2 staff). Hard assets purchasing begins. Offshore land acquired.',
              cost: assumptions.offshorePurchasePrice,
              status: targetAge1 >= 33 ? 'complete' : 'upcoming',
              category: 'milestone'
            },
            {
              age: 36,
              year: 2031,
              icon: '🌍',
              title: 'Nigeria Land Purchase',
              desc: `${formatCurrency(assumptions.nigeriaPurchasePrice)} cash from Robinhood.`,
              cost: assumptions.nigeriaPurchasePrice,
              status: targetAge1 >= 36 ? 'complete' : 'upcoming',
              category: 'land'
            },
            {
              age: 40,
              year: 2035,
              icon: '🏙️',
              title: 'City Rental Properties',
              desc: `${formatCurrency(assumptions.rentalPurchasePrice)} in 2-3 units (V2-owned, Airbnb/rental @ 90% occupancy).`,
              cost: assumptions.rentalPurchasePrice,
              status: targetAge1 >= 40 ? 'complete' : 'upcoming',
              category: 'rental'
            },
            {
              age: 42,
              year: 2037,
              icon: '🎯',
              title: 'QOZ Fund Investment',
              desc: `${formatCurrency(assumptions.qozInvestAmount)} rolled from RH gains — tax-free appreciation after 10yr hold.`,
              cost: assumptions.qozInvestAmount,
              status: targetAge1 >= 42 ? 'complete' : 'upcoming',
              category: 'milestone'
            },
            {
              age: 60,
              year: 2055,
              icon: '👑',
              title: 'Retirement Target',
              desc: 'Coast on investments + passive income. Family fund deploys from 401k.',
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
