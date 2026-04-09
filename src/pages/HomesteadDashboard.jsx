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

export default function HomesteadDashboard() {
  const { data, assumptions } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);

  // Filter and compute homestead data from years
  const yearsData = useMemo(() => {
    if (!data || !data.years) return [];

    return data.years.map((year) => {
      const age = year.age;
      const landValue = year.landValue || 0;
      const landEquity = year.landEquity || 0;
      const landMortgage = year.landMortgage || 0;

      // Farm income: $50K/yr starting at 35, growing 3%/yr
      let farmIncome = 0;
      if (age >= assumptions.farmIncomeStartAge) {
        const yearsOfFarming = age - assumptions.farmIncomeStartAge;
        farmIncome = assumptions.farmIncomeAnnual * Math.pow(1 + assumptions.farmIncomeGrowth / 100, yearsOfFarming);
      }

      // Construction interest: $400K × 8.5% from age 32 to 52
      let constructionInterest = year.constructionInterest || 0;

      // Mortgage P&I: amortized on original $400K at 7.5%/30yr
      let mortgagePI = 0;
      if (landMortgage > 0) {
        const rate = assumptions.landMortgageRate / 100 / 12;
        const nMonths = assumptions.landMortgageTerm * 12;
        const principal = assumptions.constructionLoanAmount;
        const monthlyPayment = principal * (rate * Math.pow(1 + rate, nMonths)) / (Math.pow(1 + rate, nMonths) - 1);
        const interestPortion = landMortgage * (assumptions.landMortgageRate / 100);
        mortgagePI = Math.min(monthlyPayment * 12, interestPortion + Math.min(landMortgage, monthlyPayment * 12 - interestPortion));
      }

      const netAnnualCost = constructionInterest + mortgagePI - farmIncome;

      return {
        age,
        year: year.year,
        landValue,
        landEquity,
        landMortgage,
        acres: year.acres || 0,
        farmIncome: Math.round(farmIncome),
        constructionInterest: Math.round(constructionInterest),
        mortgagePI: Math.round(mortgagePI),
        netAnnualCost: Math.round(netAnnualCost),
      };
    });
  }, [data, assumptions]);

  // Summary cards
  const latestYear = yearsData[yearsData.length - 1] || yearsData[0];
  const currentYear = yearsData.find(y => y.age === assumptions.currentAge) || yearsData[0];
  const selectedYear = yearsData.find(y => y.age === targetAge) || yearsData[0];

  const summaryCards = [
    {
      label: 'Total Land Value',
      value: formatCurrency(selectedYear?.landValue || 0),
      icon: '🏞️',
    },
    {
      label: 'Land Equity',
      value: formatCurrency(selectedYear?.landEquity || 0),
      icon: '🔑',
    },
    {
      label: 'Mortgage Balance',
      value: formatCurrency(selectedYear?.landMortgage || 0),
      icon: '🏦',
    },
    {
      label: 'Farm Income (Current)',
      value: formatCurrency(selectedYear?.farmIncome || 0),
      icon: '🌾',
    },
    {
      label: 'Construction Loan Status',
      value: selectedYear?.age >= 52 ? 'Paid Off ✓' : 'Active',
      icon: '🏗️',
    },
    {
      label: 'Acres',
      value: (selectedYear?.acres || 0).toFixed(0),
      icon: '📍',
    },
  ];

  // Chart data
  const chartData = yearsData.filter(y => y.age >= assumptions.landPurchase1Age && y.age <= 50);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/plan" className="text-blue-400 hover:text-blue-300">
          ← Back to Plan
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-5xl">🌱</span>
        <h1 className="text-4xl font-bold">US Homestead</h1>
      </div>

      <AgeSlider age={targetAge} onChange={setTargetAge} />

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
      <CollapsibleYearByYear title="Year-by-Year Projection">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-gray-300">Age</th>
              <th className="text-right px-4 py-3 text-gray-300">Land Value</th>
              <th className="text-right px-4 py-3 text-gray-300">Land Equity</th>
              <th className="text-right px-4 py-3 text-gray-300">Mortgage</th>
              <th className="text-right px-4 py-3 text-gray-300">Farm Income</th>
              <th className="text-right px-4 py-3 text-gray-300">Construction Int</th>
              <th className="text-right px-4 py-3 text-gray-300">Mortgage P&I</th>
              <th className="text-right px-4 py-3 text-gray-300">Net Cost</th>
            </tr>
          </thead>
          <tbody>
            {yearsData.filter(y => y.age >= assumptions.landPurchase1Age).map((row, idx) => (
              <tr key={idx} onClick={() => setTargetAge(row.age)} className={`border-b border-gray-800 cursor-pointer transition-colors ${row.age === targetAge ? 'bg-emerald-900/30 ring-1 ring-emerald-600/50' : 'hover:bg-gray-800'}`}>
                <td className={`px-4 py-3 font-semibold ${row.age === targetAge ? 'text-emerald-400' : ''}`}>{row.age}</td>
                <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.landValue)}</td>
                <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.landEquity)}</td>
                <td className="text-right px-4 py-3 text-red-400">{formatCurrency(row.landMortgage)}</td>
                <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.farmIncome)}</td>
                <td className="text-right px-4 py-3 text-orange-400">{formatCurrency(row.constructionInterest)}</td>
                <td className="text-right px-4 py-3 text-orange-400">{formatCurrency(row.mortgagePI)}</td>
                <td className="text-right px-4 py-3 text-gray-300">{formatCurrency(row.netAnnualCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleYearByYear>

      {/* Chart: Land Equity vs Mortgage Balance */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Land Equity vs Mortgage Balance</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="age" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Age ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="landEquity"
              stroke="#10B981"
              name="Land Equity"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="landMortgage"
              stroke="#EF4444"
              name="Mortgage Balance"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">🤝 Staffing Model</h2>
        <p className="text-gray-300 leading-relaxed">
          Ventures staff support homestead farming — no separate payroll. Self/family/volunteer labor keeps
          operational costs near zero while building infrastructure. Farm income grows at 3%/yr starting at age 35.
        </p>
      </div>

      {/* Key Events Timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">📅 Key Events Timeline</h2>
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="text-2xl">🏡</div>
            <div>
              <p className="font-semibold">Land Purchase at Age {assumptions.landPurchase1Age}</p>
              <p className="text-gray-400">15+ acre property; $500K financed 80/20</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">🏗️</div>
            <div>
              <p className="font-semibold">Construction Loan at Age {assumptions.constructionLoanAge}</p>
              <p className="text-gray-400">$400K construction loan at 8.5% for home/infrastructure</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">🌾</div>
            <div>
              <p className="font-semibold">Farm Income Starts at Age {assumptions.farmIncomeStartAge}</p>
              <p className="text-gray-400">$50K/yr from produce/livestock sales, growing 3%/yr</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">✓</div>
            <div>
              <p className="font-semibold">Construction Loan Paid Off at Age 52</p>
              <p className="text-gray-400">30-year mortgage amortization complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
