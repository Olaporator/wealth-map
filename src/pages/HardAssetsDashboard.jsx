import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { useWealthData } from '../hooks/useWealthData';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0';
  const absValue = Math.abs(value);
  if (absValue >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
  if (absValue >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
  return '$' + Math.round(value);
};

export default function HardAssetsDashboard() {
  const { data, assumptions } = useWealthData();

  const yearsData = useMemo(() => {
    if (!data || !data.years) return [];

    let cumulativePurchases = 0;
    let cumulativeCosts = 0;

    return data.years.map((year) => {
      const age = year.age;
      const totalValue = year.hardAssets || 0;
      const purchase = year.hardAssetsPurchase || 0;
      const appreciation = year.hardAssetsAppreciation || 0;
      const costs = year.hardAssetsCosts || 0;

      if (age >= assumptions.hardAssetsStartAge) {
        cumulativePurchases += purchase;
        cumulativeCosts += costs;
      }

      const netValue = totalValue - cumulativeCosts;

      return {
        age,
        year: year.year,
        totalValue,
        purchase,
        appreciation,
        annualCosts: costs,
        cumulativePurchases,
        cumulativeCosts,
        netValue: Math.round(netValue),
        rhPull: year.rhPullHardAssets || 0,
      };
    });
  }, [data, assumptions]);

  const currentYear = yearsData.find(y => y.age === assumptions.currentAge) || yearsData[0];
  const startYear = yearsData.find(y => y.age === assumptions.hardAssetsStartAge);
  const age50 = yearsData.find(y => y.age === 50);
  const latestYear = yearsData[yearsData.length - 1];

  const summaryCards = [
    { label: 'Start Age', value: assumptions.hardAssetsStartAge, icon: '📅' },
    { label: 'Distro Allocation', value: assumptions.hardAssetsRhPullPct + '%', icon: '💸' },
    { label: 'Avg Appreciation', value: assumptions.hardAssetsAppreciation + '%', icon: '📈' },
    { label: 'Storage + Insurance', value: formatCurrency(assumptions.hardAssetsStorageCost) + '/yr + ' + assumptions.hardAssetsInsurancePct + '%', icon: '🔒' },
    { label: 'Value at 50', value: formatCurrency(age50?.totalValue || 0), icon: '🪙' },
    { label: 'Value at 85', value: formatCurrency(latestYear?.totalValue || 0), icon: '💎' },
    { label: 'Total Purchased (85)', value: formatCurrency(latestYear?.cumulativePurchases || 0), icon: '🛒' },
    { label: 'Net Value at 85', value: formatCurrency(latestYear?.netValue || 0), icon: '✨' },
  ];

  const chartData = yearsData.filter(y => y.age >= assumptions.hardAssetsStartAge);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/plan" className="text-blue-400 hover:text-blue-300">
          ← Back to Plan
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-5xl">🏦</span>
        <div>
          <h1 className="text-4xl font-bold">Hard Assets — Locked Storage</h1>
          <p className="text-gray-400 mt-1">Gold, Silver, Metals, Antiques, Premium Building Materials</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
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

      {/* Value Growth Chart */}
      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Portfolio Value Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={v => formatCurrency(v)} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
              />
              <Legend />
              <Area type="monotone" dataKey="cumulativePurchases" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={1} name="Cost Basis" />
              <Area type="monotone" dataKey="totalValue" stroke="#eab308" fill="#eab308" fillOpacity={0.25} strokeWidth={2} name="Total Value" />
              <Area type="monotone" dataKey="netValue" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} name="Net Value (after costs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Annual Purchases & Appreciation Chart */}
      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Annual Purchases & Appreciation</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={v => formatCurrency(v)} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
              />
              <Legend />
              <Line type="monotone" dataKey="purchase" stroke="#f59e0b" strokeWidth={2} dot={false} name="New Purchases" />
              <Line type="monotone" dataKey="appreciation" stroke="#10b981" strokeWidth={2} dot={false} name="Appreciation" />
              <Line type="monotone" dataKey="annualCosts" stroke="#ef4444" strokeWidth={1} dot={false} name="Storage + Insurance" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Year-by-Year Table */}
      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Year-by-Year Projection</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-300">Age</th>
                <th className="text-right px-4 py-3 text-gray-300">Distro Alloc</th>
                <th className="text-right px-4 py-3 text-gray-300">Purchased</th>
                <th className="text-right px-4 py-3 text-gray-300">Appreciation</th>
                <th className="text-right px-4 py-3 text-gray-300">Costs</th>
                <th className="text-right px-4 py-3 text-gray-300">Total Value</th>
                <th className="text-right px-4 py-3 text-gray-300">Cost Basis</th>
                <th className="text-right px-4 py-3 text-gray-300">Net Value</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="text-left px-4 py-3 font-semibold">{row.age}</td>
                  <td className="text-right px-4 py-3 text-orange-400">{formatCurrency(row.rhPull)}</td>
                  <td className="text-right px-4 py-3 text-yellow-400">{formatCurrency(row.purchase)}</td>
                  <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.appreciation)}</td>
                  <td className="text-right px-4 py-3 text-red-400">({formatCurrency(row.annualCosts)})</td>
                  <td className="text-right px-4 py-3 text-yellow-300 font-semibold">{formatCurrency(row.totalValue)}</td>
                  <td className="text-right px-4 py-3 text-gray-400">{formatCurrency(row.cumulativePurchases)}</td>
                  <td className="text-right px-4 py-3 text-emerald-400 font-semibold">{formatCurrency(row.netValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Categories */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Asset Categories</h2>
        <p className="text-gray-400 text-sm mb-4">Portfolio mix of tangible assets held in secure storage for long-term appreciation. Items may occasionally be personally utilized or informally made available.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-900/30">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">Gold & Bullion</h3>
            <p className="text-gray-400 text-sm">Bars, coins, and certified ingots. Primary inflation hedge — historically 7-8% annual appreciation. Highly liquid when needed.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600/30">
            <h3 className="text-lg font-bold text-gray-300 mb-2">Silver & Precious Metals</h3>
            <p className="text-gray-400 text-sm">Silver bars, platinum, palladium. Industrial demand creates floor value. More volatile but higher upside than gold in bull cycles.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-amber-900/30">
            <h3 className="text-lg font-bold text-amber-400 mb-2">Antiques & Collectibles</h3>
            <p className="text-gray-400 text-sm">Curated pieces with provenance — furniture, art, rare tools. 5-10% appreciation. Value increases as items age and become scarcer.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-emerald-900/30">
            <h3 className="text-lg font-bold text-emerald-400 mb-2">Premium Building Materials</h3>
            <p className="text-gray-400 text-sm">Reclaimed timber, copper, architectural stone, specialty hardware. Scarcity-driven appreciation — excellent for personal builds or resale to luxury contractors.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-blue-900/30">
            <h3 className="text-lg font-bold text-blue-400 mb-2">Industrial Metals</h3>
            <p className="text-gray-400 text-sm">Copper, aluminum, steel in bulk. Essential infrastructure materials with steady demand. Can be deployed for homestead/venture builds at cost.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-purple-900/30">
            <h3 className="text-lg font-bold text-purple-400 mb-2">Specialty Items</h3>
            <p className="text-gray-400 text-sm">Rare earth elements, gemstones, high-value tools and equipment. Niche appreciation assets with both functional and investment value.</p>
          </div>
        </div>
      </div>

      {/* Strategy Notes */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Strategy</h2>
        <p className="text-gray-200 leading-relaxed mb-3">
          Starting at age {assumptions.hardAssetsStartAge}, {assumptions.hardAssetsRhPullPct}% of after-tax distributions are allocated to hard asset acquisitions. Items are placed in insured, climate-controlled storage and held for long-term appreciation averaging {assumptions.hardAssetsAppreciation}% annually across the portfolio mix.
        </p>
        <p className="text-gray-200 leading-relaxed mb-3">
          Annual carrying costs are {formatCurrency(assumptions.hardAssetsStorageCost)} base storage plus {assumptions.hardAssetsInsurancePct}% of portfolio value for insurance — covered by personal cash flow via the credit card strategy. These tangible assets provide portfolio diversification away from paper/digital assets and serve as an inflation-resistant store of value.
        </p>
        <p className="text-gray-400 leading-relaxed text-sm italic">
          Some items may from time to time be personally utilized for homestead projects, loaned to ventures for operational use, or made informally available to trusted parties — entirely at the owner's discretion and outside the scope of this financial model.
        </p>
      </div>
    </div>
  );
}
