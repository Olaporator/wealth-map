import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useWealthData } from '../hooks/useWealthData';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0';
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return '$' + (value / 1000000).toFixed(1) + 'M';
  }
  if (absValue >= 1000) {
    return '$' + (value / 1000).toFixed(0) + 'K';
  }
  return '$' + value.toFixed(0);
};

export default function Venture1Dashboard() {
  const { data, assumptions } = useWealthData();

  // Filter and compute venture 1 data from years
  const yearsData = useMemo(() => {
    if (!data || !data.years) return [];

    return data.years.map((year) => {
      const age = year.age;
      const ventureBalance = year.ventures || 0;

      // LOC Debt: $200K at age 32, minus paydowns
      // 50% of net gain pays down LOC
      let locDebt = 0;
      if (age >= assumptions.venturesLocAge) {
        locDebt = assumptions.venturesLocAmount;

        // Calculate paydowns from net gains (12% return - 10% loss = 2% net)
        for (let a = assumptions.venturesLocAge; a < age; a++) {
          const prevYear = data.years.find(y => y.age === a);
          if (prevYear) {
            const balance = prevYear.ventures || 0;
            const investmentGain = balance * (12 / 100); // 12% investment return
            const opsLoss = balance * (10 / 100); // 10% ops loss
            const netGain = investmentGain - opsLoss; // 2% net
            const paydown = netGain * 0.5; // 50% of net gain pays down LOC
            locDebt = Math.max(0, locDebt - paydown);
          }
        }
      }

      const netEquity = ventureBalance - locDebt;

      // Annual gains and losses for this year
      let investmentGain = 0;
      let opsLoss = 0;
      let netGain = 0;
      let locPaydown = 0;

      if (age >= assumptions.venturesLocAge && ventureBalance > 0) {
        investmentGain = ventureBalance * (12 / 100); // 12% investment return
        opsLoss = ventureBalance * (10 / 100); // 10% ops loss
        netGain = investmentGain - opsLoss; // 2% net spread
        locPaydown = netGain * 0.5; // 50% of net gain pays down LOC
      }

      // Employees from simulation data
      const employees = year.v1Employees || 0;
      const opsHubEmployees = year.opsHubEmployees || 0;
      const opsHubBillV1 = year.opsHubBillV1 || 0;

      return {
        age,
        year: year.year,
        ventureBalance,
        locDebt,
        netEquity,
        investmentGain: Math.round(investmentGain),
        opsLoss: Math.round(opsLoss),
        netGain: Math.round(netGain),
        locPaydown: Math.round(locPaydown),
        employees,
        opsHubEmployees,
        opsHubBillV1,
      };
    });
  }, [data, assumptions]);

  // Summary cards
  const currentYear = yearsData.find(y => y.age === assumptions.currentAge) || yearsData[0];

  const summaryCards = [
    {
      label: 'Venture Balance',
      value: formatCurrency(currentYear?.ventureBalance || 0),
      icon: '⚡',
    },
    {
      label: 'LOC Debt',
      value: formatCurrency(currentYear?.locDebt || 0),
      icon: '💳',
    },
    {
      label: 'Net Equity',
      value: formatCurrency(currentYear?.netEquity || 0),
      icon: '💎',
    },
    {
      label: 'Investment Return (12%)',
      value: formatCurrency(currentYear?.investmentGain || 0),
      icon: '📈',
    },
    {
      label: 'Ops Loss (10%)',
      value: formatCurrency(currentYear?.opsLoss || 0),
      icon: '📉',
    },
    {
      label: 'Net Annual Gain (2%)',
      value: formatCurrency(currentYear?.netGain || 0),
      icon: '✓',
    },
  ];

  // Chart data
  const chartData = yearsData.filter(y => y.age >= assumptions.venturesLocAge);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/plan" className="text-blue-400 hover:text-blue-300">
          ← Back to Plan
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-5xl">⚡</span>
        <h1 className="text-4xl font-bold">Venture 1</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Year-by-Year Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Year-by-Year Projection</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-gray-300">Age</th>
              <th className="text-right px-4 py-3 text-gray-300">Venture Balance</th>
              <th className="text-right px-4 py-3 text-gray-300">LOC Debt</th>
              <th className="text-right px-4 py-3 text-gray-300">Net Equity</th>
              <th className="text-right px-4 py-3 text-gray-300">Invest Gains (12%)</th>
              <th className="text-right px-4 py-3 text-gray-300">Ops Loss (10%)</th>
              <th className="text-right px-4 py-3 text-gray-300">Net Gain</th>
              <th className="text-right px-4 py-3 text-gray-300">LOC Paydown (50%)</th>
              <th className="text-right px-4 py-3 text-gray-300">Staff</th>
            </tr>
          </thead>
          <tbody>
            {yearsData.filter(y => y.age >= assumptions.venturesLocAge).map((row, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-semibold">{row.age}</td>
                <td className="text-right px-4 py-3 text-blue-400">{formatCurrency(row.ventureBalance)}</td>
                <td className="text-right px-4 py-3 text-red-400">{formatCurrency(row.locDebt)}</td>
                <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.netEquity)}</td>
                <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.investmentGain)}</td>
                <td className="text-right px-4 py-3 text-orange-400">({formatCurrency(row.opsLoss)})</td>
                <td className="text-right px-4 py-3 text-lime-400">{formatCurrency(row.netGain)}</td>
                <td className="text-right px-4 py-3 text-yellow-400">{formatCurrency(row.locPaydown)}</td>
                <td className="text-right px-4 py-3 text-gray-300">{row.employees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart: Venture Balance vs LOC Debt */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Venture Balance vs LOC Debt</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="age" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Age ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="ventureBalance"
              fill="#3B82F6"
              stroke="#3B82F6"
              fillOpacity={0.3}
              name="Venture Balance"
            />
            <Area
              type="monotone"
              dataKey="locDebt"
              fill="#EF4444"
              stroke="#EF4444"
              fillOpacity={0.3}
              name="LOC Debt"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Staffing Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">👥 Staffing</h2>
        <p className="text-gray-300 mb-4">
          Day-to-day operations handled by the Nigeria Ops Hub (V2 subsidiary) at $5K/yr starting + 10% annual raises per employee. US hires only at $1M+ balance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">🇳🇬 Ops Hub Staff</p>
            <p className="text-3xl font-bold text-green-400">{currentYear?.opsHubEmployees || 0}</p>
            <p className="text-gray-500 text-xs mt-1">Shared across all entities</p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">V1 Hub Bill</p>
            <p className="text-3xl font-bold text-orange-400">{formatCurrency(currentYear?.opsHubBillV1 || 0)}<span className="text-sm text-gray-500">/yr</span></p>
            <p className="text-gray-500 text-xs mt-1">30% of hub cost (tax-free)</p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">US Staff</p>
            <p className="text-3xl font-bold text-blue-400">{currentYear?.employees || 0}</p>
            <p className="text-gray-500 text-xs mt-1">Only at $1M+ balance</p>
          </div>
        </div>
      </div>

      {/* Business Model Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">🏢 Business Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded p-4">
            <p className="text-lg font-semibold mb-2">Equipment Leasing</p>
            <p className="text-gray-400 text-sm">Rental & maintenance of tools and equipment</p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-lg font-semibold mb-2">Rental Services</p>
            <p className="text-gray-400 text-sm">Property management and short-term rentals</p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-lg font-semibold mb-2">Airbnb Management</p>
            <p className="text-gray-400 text-sm">Co-management of vacation rental properties</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4 italic">
          Nigeria Ops Hub handles HR, accounting, taxes, logistics, and DevOps — V1 pays 30% of hub costs via inter-company billing (tax-free).
        </p>
      </div>

      {/* Sub-Ventures */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">📂 Sub-Ventures</h2>
        <p className="text-gray-400 text-sm mb-4">Manage individual business lines within Venture 1.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/venture1/landscape-consulting" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">🌿</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Landscape Consulting</h3>
            <p className="text-gray-500 text-xs mt-1">Consulting services for landscaping projects</p>
          </Link>
          <Link to="/venture1/garden-app" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">📱</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Garden App</h3>
            <p className="text-gray-500 text-xs mt-1">Digital platform for garden planning & management</p>
          </Link>
          <Link to="/venture1/agro-equipment" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">🚜</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Agro Equipment</h3>
            <p className="text-gray-500 text-xs mt-1">Equipment rental & leasing for agriculture</p>
          </Link>
          <Link to="/venture1/property-management" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">🏘️</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Property Management</h3>
            <p className="text-gray-500 text-xs mt-1">Full-service property & vacation rental mgmt</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
