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

export default function NonprofitDashboard() {
  const { data, assumptions } = useWealthData();

  // Filter and compute nonprofit data from years
  const yearsData = useMemo(() => {
    if (!data || !data.years) return [];

    return data.years.map((year) => {
      const age = year.age;
      const reserves = year.nonprofit || 0;
      const locDebt = year.nonprofitLoc || 0;
      const netEquity = reserves - locDebt;
      const rhPullIn = year.rhPullNonprofit || 0;

      // External donations: $5K year 1, grow 10%/yr
      let donations = 0;
      if (age >= assumptions.nonprofitStartAge) {
        const yearsActive = age - assumptions.nonprofitStartAge;
        donations = assumptions.nonprofitInitialDonations * Math.pow(1 + assumptions.nonprofitDonationGrowth / 100, yearsActive);
      }

      // Investment gains: 12% tax-free on reserves
      const investGain = reserves > 0 ? reserves * (assumptions.nonprofitInvestReturn / 100) : 0;

      // Ops cost: 8% on reserves (funded via LOC)
      const opsCost = reserves > 0 ? reserves * (assumptions.nonprofitOpsLossPct / 100) : 0;

      // LOC interest: 7% on LOC balance
      const locInterest = locDebt > 0 ? locDebt * (assumptions.nonprofitLocRate / 100) : 0;

      // LOC Paydown: 50% of investment gains
      const locPaydown = Math.min(locDebt, investGain * 0.5);

      // Employees from simulation data
      const employees = year.npEmployees || 0;
      const opsHubEmployees = year.opsHubEmployees || 0;
      const opsHubBillNp = year.opsHubBillNp || 0;

      return {
        age,
        year: year.year,
        reserves,
        locDebt,
        netEquity,
        rhPullIn: Math.round(rhPullIn),
        donations: Math.round(donations),
        investGain: Math.round(investGain),
        opsCost: Math.round(opsCost),
        locInterest: Math.round(locInterest),
        locPaydown: Math.round(locPaydown),
        employees,
        opsHubEmployees,
        opsHubBillNp,
      };
    });
  }, [data, assumptions]);

  // Summary cards — current age
  const currentYear = yearsData.find(y => y.age === assumptions.currentAge) || yearsData[0];

  const summaryCards = [
    {
      label: 'Reserves',
      value: formatCurrency(currentYear?.reserves || 0),
      icon: '💚',
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
      label: 'Investment Return (12% Tax-Free)',
      value: formatCurrency(currentYear?.investGain || 0),
      icon: '📈',
    },
    {
      label: 'Annual Donations',
      value: formatCurrency(currentYear?.donations || 0),
      icon: '🎁',
    },
    {
      label: 'Employees',
      value: currentYear?.employees || 0,
      icon: '👥',
    },
  ];

  // Chart data
  const chartData = yearsData.filter(y => y.age >= assumptions.nonprofitStartAge);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/plan" className="text-blue-400 hover:text-blue-300">
          ← Back to Plan
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">💚</span>
          <div>
            <h1 className="text-4xl font-bold">501(c)(3) Nonprofit</h1>
            <p className="text-lg text-emerald-400 font-semibold">Entity Name TBD</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl">
          Tax-exempt entity for land stewardship, community development, and education. Investment gains are 100% tax-free. Partners with QOZ fund for on-the-ground work. Nigeria Ops Hub handles admin at 30% of hub costs.
        </p>
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

      {/* Tax Advantage Callout */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-emerald-400 mb-2">✓ Tax Advantage</h3>
        <p className="text-gray-300 leading-relaxed">
          Investment gains are 100% tax-free under 501(c)(3) status. LTCG donations from Robinhood are tax-deductible,
          allowing strategic deployment of equity gains for charitable impact without immediate capital gains taxation.
        </p>
      </div>

      {/* Year-by-Year Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Year-by-Year Projection</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-gray-300">Age</th>
              <th className="text-right px-4 py-3 text-gray-300">Reserves</th>
              <th className="text-right px-4 py-3 text-gray-300">LOC Debt</th>
              <th className="text-right px-4 py-3 text-gray-300">Net Equity</th>
              <th className="text-right px-4 py-3 text-gray-300">RH Donation In</th>
              <th className="text-right px-4 py-3 text-gray-300">External Donations</th>
              <th className="text-right px-4 py-3 text-gray-300">Invest Gains (12%)</th>
              <th className="text-right px-4 py-3 text-gray-300">Ops Cost (8%)</th>
              <th className="text-right px-4 py-3 text-gray-300">LOC Interest (7%)</th>
              <th className="text-right px-4 py-3 text-gray-300">LOC Paydown</th>
              <th className="text-right px-4 py-3 text-gray-300">Employees</th>
            </tr>
          </thead>
          <tbody>
            {yearsData.filter(y => y.age >= assumptions.nonprofitStartAge).map((row, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-semibold">{row.age}</td>
                <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.reserves)}</td>
                <td className="text-right px-4 py-3 text-red-400">{formatCurrency(row.locDebt)}</td>
                <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.netEquity)}</td>
                <td className="text-right px-4 py-3 text-purple-400">{formatCurrency(row.rhPullIn)}</td>
                <td className="text-right px-4 py-3 text-pink-400">{formatCurrency(row.donations)}</td>
                <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.investGain)}</td>
                <td className="text-right px-4 py-3 text-orange-400">({formatCurrency(row.opsCost)})</td>
                <td className="text-right px-4 py-3 text-orange-400">({formatCurrency(row.locInterest)})</td>
                <td className="text-right px-4 py-3 text-yellow-400">{formatCurrency(row.locPaydown)}</td>
                <td className="text-right px-4 py-3 text-gray-300">{row.employees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart: Reserves vs LOC Debt */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Reserves vs LOC Debt</h2>
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
              dataKey="reserves"
              fill="#10B981"
              stroke="#10B981"
              fillOpacity={0.3}
              name="Reserves"
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
          All admin, accounting, HR, and tax handled by the Nigeria Ops Hub at $5K/yr starting + 10% annual raises per employee. Nonprofit pays 30% of hub costs via inter-company billing (tax-free). US program director only at $5M+ reserves.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">🇳🇬 Ops Hub Staff</p>
            <p className="text-3xl font-bold text-green-400">{currentYear?.opsHubEmployees || 0}</p>
            <p className="text-gray-500 text-xs mt-1">Shared across all entities</p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">NP Hub Bill</p>
            <p className="text-3xl font-bold text-purple-400">{formatCurrency(currentYear?.opsHubBillNp || 0)}<span className="text-sm text-gray-500">/yr</span></p>
            <p className="text-gray-500 text-xs mt-1">30% of hub cost (tax-free)</p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">US Staff</p>
            <p className="text-3xl font-bold text-emerald-400">{currentYear?.employees || 0}</p>
            <p className="text-gray-500 text-xs mt-1">Only at $5M+ reserves</p>
          </div>
        </div>
      </div>

      {/* Program Funding Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">🌱 Potential Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded p-4 border border-gray-700">
            <h3 className="font-semibold text-emerald-400 mb-2">Permaculture Development</h3>
            <p className="text-gray-400 text-sm">
              Establish food forests and regenerative agriculture on QOZ land. Train farmers, distribute seeds.
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4 border border-gray-700">
            <h3 className="font-semibold text-emerald-400 mb-2">Community Organizing</h3>
            <p className="text-gray-400 text-sm">
              Build local capacity for climate adaptation, food sovereignty, and wealth-building initiatives.
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4 border border-gray-700">
            <h3 className="font-semibold text-emerald-400 mb-2">Education & Fellowships</h3>
            <p className="text-gray-400 text-sm">
              Fund scholarships, training programs, and apprenticeships in agriculture and business.
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4 border border-gray-700">
            <h3 className="font-semibold text-emerald-400 mb-2">Homestead Support</h3>
            <p className="text-gray-400 text-sm">
              Provide grants and loans to families establishing regenerative homes and food systems.
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4 border border-gray-700">
            <h3 className="font-semibold text-emerald-400 mb-2">Policy & Advocacy</h3>
            <p className="text-gray-400 text-sm">
              Research and advocate for land rights, conservation incentives, and equitable development.
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4 border border-gray-700">
            <h3 className="font-semibold text-emerald-400 mb-2">Asset Building</h3>
            <p className="text-gray-400 text-sm">
              Co-invest with communities in land trusts, cooperative enterprises, and wealth vehicles.
            </p>
          </div>
        </div>
      </div>

      {/* Funding Model Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">📊 Funding Model & Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-emerald-400 mb-3">Revenue Streams</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>✓ <span className="text-gray-400">5% of Robinhood gains as tax-deductible donations (from LTCG harvesting)</span></li>
              <li>✓ <span className="text-gray-400">External donations: $5K year 1, grow 10%/yr</span></li>
              <li>✓ <span className="text-gray-400">12% tax-free investment return on reserves (permaculture/land assets)</span></li>
              <li>✓ <span className="text-gray-400">Program partnerships with QOZ fund for on-the-ground work</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-400 mb-3">Operations</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>✓ <span className="text-gray-400">4% ops overhead (halved from 8% with ops hub) + 30% hub bill</span></li>
              <li>✓ <span className="text-gray-400">Funded via CDFI LOC at 7% rate</span></li>
              <li>✓ <span className="text-gray-400">50% of investment gains → LOC paydown</span></li>
              <li>✓ <span className="text-gray-400">Build endowment for long-term sustainability</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sub-Programs */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">📂 Programs</h2>
        <p className="text-gray-400 text-sm mb-4">Manage individual programs within the 501(c)(3).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/nonprofit/permaculture" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">🌱</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Permaculture Development</h3>
            <p className="text-gray-500 text-xs mt-1">Food forests & regenerative agriculture</p>
          </Link>
          <Link to="/nonprofit/community" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">🤝</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Community Organizing</h3>
            <p className="text-gray-500 text-xs mt-1">Climate adaptation & food sovereignty</p>
          </Link>
          <Link to="/nonprofit/education" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">🎓</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Education & Fellowships</h3>
            <p className="text-gray-500 text-xs mt-1">Scholarships, training & apprenticeships</p>
          </Link>
          <Link to="/nonprofit/homestead-support" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">🏡</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Homestead Support</h3>
            <p className="text-gray-500 text-xs mt-1">Grants & loans for regenerative homes</p>
          </Link>
          <Link to="/nonprofit/policy" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">📜</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Policy & Advocacy</h3>
            <p className="text-gray-500 text-xs mt-1">Land rights & conservation research</p>
          </Link>
          <Link to="/nonprofit/data-analytics" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-600 transition-colors group">
            <span className="text-2xl block mb-2">📊</span>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Data Analytics (R&D)</h3>
            <p className="text-gray-500 text-xs mt-1">Internal research & data infrastructure</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
