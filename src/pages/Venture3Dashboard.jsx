import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

export default function Venture3Dashboard() {
  const { data, assumptions } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);

  // Filter and compute venture 3 data from years
  const yearsData = useMemo(() => {
    if (!data || !data.years) return [];

    return data.years.map((year) => {
      const age = year.age;
      const v3Balance = year.venture3 || 0;
      const v3Employees = year.venture3Employees || 0;
      const v3Seed = year.v3Seed || 0;
      const v3V2Contrib = year.v3V2Contrib || 0;
      const v3NpContrib = year.v3NpContrib || 0;
      const investGain = v3Balance > 0 ? v3Balance * (assumptions.venture3InvestReturn / 100) : 0;
      const opsCost = v3Balance > 0 ? v3Balance * (assumptions.venture3OpsLossPct / 100) : 0;
      const netGrowth = investGain - opsCost;

      return {
        age,
        year: year.year,
        v3Balance,
        v3Employees,
        v3Seed: Math.round(v3Seed),
        v3V2Contrib: Math.round(v3V2Contrib),
        v3NpContrib: Math.round(v3NpContrib),
        investGain: Math.round(investGain),
        opsCost: Math.round(opsCost),
        netGrowth: Math.round(netGrowth),
      };
    });
  }, [data, assumptions]);

  const selectedYear = yearsData.find(y => y.age === targetAge) || yearsData[0];

  // Summary cards — current age
  const currentYear = yearsData.find(y => y.age === assumptions.currentAge) || yearsData[0];

  // Get a year at age 60 for comparison (if available)
  const age60Year = yearsData.find(y => y.age === 60);

  const summaryCards = [
    {
      label: 'V3 Balance (Current)',
      value: formatCurrency(currentYear?.v3Balance || 0),
      icon: '🏛️',
    },
    {
      label: 'V3 Balance at 60',
      value: formatCurrency(age60Year?.v3Balance || 0),
      icon: '🏛️',
    },
    {
      label: 'Employees Affordable',
      value: age60Year?.v3Employees || 0,
      icon: '👥',
    },
    {
      label: '401k Seed (30%)',
      value: formatCurrency(age60Year?.v3Seed || 0),
      icon: '💼',
    },
    {
      label: 'V2 Contribution (10%)',
      value: formatCurrency(age60Year?.v3V2Contrib || 0),
      icon: '🚀',
    },
    {
      label: 'Nonprofit Contribution (10%)',
      value: formatCurrency(age60Year?.v3NpContrib || 0),
      icon: '❤️',
    },
    {
      label: 'Investment Return Rate',
      value: assumptions.venture3InvestReturn + '%',
      icon: '📈',
    },
    {
      label: 'Annual Ops Cost Rate',
      value: assumptions.venture3OpsLossPct + '%',
      icon: '⚙️',
    },
  ];

  // Chart data — only from age 60 onward
  const chartData = yearsData.filter(y => y.age >= assumptions.venture3StartAge);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/plan" className="text-blue-400 hover:text-blue-300">
          ← Back to Plan
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-5xl">🏛️</span>
        <h1 className="text-4xl font-bold">Venture 3 — Generational</h1>
      </div>

      {/* Activation Notice */}
      <div className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg p-4 mb-8">
        <p className="text-blue-200">
          <span className="font-semibold">Note:</span> V3 activates at age {assumptions.venture3StartAge}. Before that, all values are $0.
        </p>
      </div>

      {/* Age Slider */}
      <div className="mb-8">
        <AgeSlider age={targetAge} onChange={setTargetAge} />
      </div>

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
        <CollapsibleYearByYear title="Year-by-Year Projection (Age 60+)">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-300">Age</th>
                <th className="text-right px-4 py-3 text-gray-300">V3 Balance</th>
                <th className="text-right px-4 py-3 text-gray-300">401k Seed</th>
                <th className="text-right px-4 py-3 text-gray-300">V2 Contrib</th>
                <th className="text-right px-4 py-3 text-gray-300">NP Contrib</th>
                <th className="text-right px-4 py-3 text-gray-300">Invest Gains (12%)</th>
                <th className="text-right px-4 py-3 text-gray-300">Ops Cost (5%)</th>
                <th className="text-right px-4 py-3 text-gray-300">Net Growth</th>
                <th className="text-right px-4 py-3 text-gray-300">Employees</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, idx) => (
                <tr key={idx} onClick={() => setTargetAge(row.age)} className={`border-b border-gray-800 cursor-pointer transition-colors ${row.age === targetAge ? 'bg-emerald-900/30 ring-1 ring-emerald-600/50' : 'hover:bg-gray-800'}`}>
                  <td className={`text-left px-4 py-3 font-semibold ${row.age === targetAge ? 'text-emerald-400' : ''}`}>{row.age}</td>
                  <td className="text-right px-4 py-3">{formatCurrency(row.v3Balance)}</td>
                  <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.v3Seed)}</td>
                  <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.v3V2Contrib)}</td>
                  <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.v3NpContrib)}</td>
                  <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.investGain)}</td>
                  <td className="text-right px-4 py-3 text-orange-400">({formatCurrency(row.opsCost)})</td>
                  <td className="text-right px-4 py-3 text-lime-400">{formatCurrency(row.netGrowth)}</td>
                  <td className="text-right px-4 py-3">{row.v3Employees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleYearByYear>
      )}

      {/* V3 Balance Chart */}
      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">V3 Balance Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={v => '$' + (v / 1000000).toFixed(0) + 'M'} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
              />
              <Legend />
              <Bar dataKey="v3Balance" fill="#8b5cf6" name="V3 Balance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mission Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">🎯 Mission</h2>
        <p className="text-gray-200 leading-relaxed">
          Seasons and tightens the entire generational operation. Consolidates learning from V1, V2, and nonprofit into a permanent family wealth vehicle.
          Employs family members, funds education, manages generational assets. V3 is the legacy vessel—designed to compound across decades while
          supporting family priorities, staying lean through shared infrastructure.
        </p>
      </div>

      {/* Funding Streams */}
      {age60Year && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">💼 401k Seed Draws</h3>
            <p className="text-gray-400 text-sm mb-2">30% of annual family legacy withdrawals</p>
            <p className="text-3xl font-bold text-emerald-400">{formatCurrency(age60Year.v3Seed)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">🚀 V2 Contributions</h3>
            <p className="text-gray-400 text-sm mb-2">10% of V2 balance contributed annually</p>
            <p className="text-3xl font-bold text-cyan-400">{formatCurrency(age60Year.v3V2Contrib)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">❤️ Nonprofit Contributions</h3>
            <p className="text-gray-400 text-sm mb-2">10% of nonprofit balance contributed annually</p>
            <p className="text-3xl font-bold text-pink-400">{formatCurrency(age60Year.v3NpContrib)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
