import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useWealthData } from '../hooks/useWealthData';
import CollapsibleYearByYear from '../components/CollapsibleYearByYear';
import AgeSlider from '../components/AgeSlider';

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

export default function OffshoreDashboard() {
  const { data, assumptions } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);

  // Filter and compute offshore data from years
  const yearsData = useMemo(() => {
    if (!data || !data.years) return [];

    return data.years.map((year) => {
      const age = year.age;
      const propertyValue = year.offshoreEquity || 0;
      const previousValue = age > assumptions.offshorePurchaseAge
        ? (data.years[data.years.indexOf(year) - 1]?.offshoreEquity || 0)
        : assumptions.offshorePurchasePrice;

      const appreciationGain = age >= assumptions.offshorePurchaseAge
        ? propertyValue - previousValue
        : 0;

      const yearsOwned = age >= assumptions.offshorePurchaseAge ? age - assumptions.offshorePurchaseAge : 0;

      // Maintenance varies: $20K until age 40, then $10K
      let annualMaintenance = 0;
      if (age >= assumptions.offshorePurchaseAge) {
        annualMaintenance = age < assumptions.offshoreMaintenanceDropAge
          ? assumptions.offshoreMaintenance
          : assumptions.offshoreMaintenanceReduced;
      }

      // Cumulative maintenance: calculate year by year
      let cumulativeMaintenance = 0;
      if (age >= assumptions.offshorePurchaseAge) {
        const yearsAt20K = Math.min(yearsOwned, assumptions.offshoreMaintenanceDropAge - assumptions.offshorePurchaseAge);
        const yearsAt10K = yearsOwned - yearsAt20K;
        cumulativeMaintenance = (yearsAt20K * assumptions.offshoreMaintenance) + (yearsAt10K * assumptions.offshoreMaintenanceReduced);
      }

      const netEquity = propertyValue - cumulativeMaintenance;

      return {
        age,
        year: year.year,
        propertyValue,
        appreciationGain: Math.round(appreciationGain),
        annualMaintenance,
        cumulativeMaintenance,
        netEquity: Math.max(0, netEquity),
      };
    });
  }, [data, assumptions]);

  // Summary cards
  const purchaseYear = yearsData.find(y => y.age === assumptions.offshorePurchaseAge);
  const currentYear = yearsData.find(y => y.age === assumptions.currentAge) || yearsData[0];
  const latestYear = yearsData[yearsData.length - 1];
  const selectedYear = yearsData.find(y => y.age === targetAge) || yearsData[0];

  const summaryCards = [
    {
      label: 'Property Value (Current)',
      value: formatCurrency(selectedYear?.propertyValue || 0),
      icon: '🌴',
    },
    {
      label: 'Property Value at 60',
      value: formatCurrency(latestYear?.propertyValue || 0),
      icon: '🌴',
    },
    {
      label: 'Purchase Price',
      value: formatCurrency(assumptions.offshorePurchasePrice),
      icon: '💰',
    },
    {
      label: 'Annual Maintenance (Current)',
      value: formatCurrency(selectedYear?.annualMaintenance || 0),
      icon: '🔧',
    },
    {
      label: 'Appreciation Rate',
      value: assumptions.offshoreAppreciation + '%',
      icon: '📈',
    },
    {
      label: 'Purchase Age',
      value: assumptions.offshorePurchaseAge,
      icon: '🎂',
    },
    {
      label: 'Net Equity (Current)',
      value: formatCurrency(selectedYear?.netEquity || 0),
      icon: '💎',
    },
    {
      label: 'Cumulative Maintenance',
      value: formatCurrency(selectedYear?.cumulativeMaintenance || 0),
      icon: '📊',
    },
  ];

  // Chart data — only from purchase age onward
  const chartData = yearsData.filter(y => y.age >= assumptions.offshorePurchaseAge);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/plan" className="text-blue-400 hover:text-blue-300">
          ← Back to Plan
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-5xl">🌴</span>
        <h1 className="text-4xl font-bold">Offshore — Belize / Costa Rica</h1>
      </div>

      <AgeSlider age={targetAge} onChange={setTargetAge} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
      {chartData.length > 0 && (
        <CollapsibleYearByYear title="Year-by-Year Projection (Age 33+)">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-300">Age</th>
                <th className="text-right px-4 py-3 text-gray-300">Property Value</th>
                <th className="text-right px-4 py-3 text-gray-300">Appreciation Gain</th>
                <th className="text-right px-4 py-3 text-gray-300">Annual Maintenance</th>
                <th className="text-right px-4 py-3 text-gray-300">Cumulative Maintenance</th>
                <th className="text-right px-4 py-3 text-gray-300">Net Equity</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, idx) => (
                <tr key={idx} onClick={() => setTargetAge(row.age)} className={`border-b border-gray-800 cursor-pointer transition-colors ${row.age === targetAge ? 'bg-emerald-900/30 ring-1 ring-emerald-600/50' : 'hover:bg-gray-800'}`}>
                  <td className={`text-left px-4 py-3 font-semibold ${row.age === targetAge ? 'text-emerald-400' : ''}`}>{row.age}</td>
                  <td className="text-right px-4 py-3 text-emerald-400 font-semibold">{formatCurrency(row.propertyValue)}</td>
                  <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.appreciationGain)}</td>
                  <td className="text-right px-4 py-3">{formatCurrency(row.annualMaintenance)}</td>
                  <td className="text-right px-4 py-3 text-orange-400">({formatCurrency(row.cumulativeMaintenance)})</td>
                  <td className="text-right px-4 py-3 text-lime-400 font-semibold">{formatCurrency(row.netEquity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleYearByYear>
      )}

      {/* Property Value and Net Equity Chart */}
      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Property Value & Net Equity Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={v => '$' + (v / 1000000).toFixed(1) + 'M'} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="propertyValue"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Property Value"
              />
              <Line
                type="monotone"
                dataKey="netEquity"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Net Equity"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Operations Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">📋 Operations</h2>
        <p className="text-gray-200 leading-relaxed mb-4">
          Cash purchase from Robinhood at age {assumptions.offshorePurchaseAge}. Initial investment: {formatCurrency(assumptions.offshorePurchasePrice)}.
        </p>
        <p className="text-gray-200 leading-relaxed mb-4">
          Maintenance costs drop from {formatCurrency(assumptions.offshoreMaintenance)} annually to {formatCurrency(assumptions.offshoreMaintenanceReduced)} at age{' '}
          {assumptions.offshoreMaintenanceDropAge} as major improvements and infrastructure development reach completion.
        </p>
        <p className="text-gray-200 leading-relaxed">
          Property appreciates at {assumptions.offshoreAppreciation}% per year—modest but steady growth reflecting tropical real estate stability. Net equity accounts for the full
          maintenance and improvement costs required to maintain and develop the property into its intended use.
        </p>
      </div>

      {/* Potential Uses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">🏝️ Personal Retreat</h3>
          <p className="text-gray-400 text-sm">
            Private sanctuary for family vacations, reflection, and disconnection from North American winters.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">🏨 Eco-Tourism Rental</h3>
          <p className="text-gray-400 text-sm">
            Premium short-term rental platform attracting conscious travelers seeking authentic tropical experiences.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">🌱 Agricultural</h3>
          <p className="text-gray-400 text-sm">
            Sustainable farming—cacao, tropical fruits, or agroforestry generating supplemental income and food security.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">🌅 Retirement Base</h3>
          <p className="text-gray-400 text-sm">
            Phase 2 domicile post-60 leveraging lower cost of living and favorable tax treatment for retirees.
          </p>
        </div>
      </div>
    </div>
  );
}
