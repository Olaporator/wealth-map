import React, { useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
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

export default function Venture2Dashboard() {
  const { data, assumptions } = useWealthData();

  // Filter and compute venture 2 data from years
  const yearsData = useMemo(() => {
    if (!data || !data.years) return [];

    return data.years.map((year) => {
      const age = year.age;
      const v2Balance = year.venture2 || 0;
      const v2LocDebt = year.venture2Loc || 0;
      const v2SelfIncome = year.venture2SelfIncome || 0;
      const rhPullV2 = year.rhPullVenture2 || 0;
      const rentalNetIncome = year.rentalNetIncome || 0;
      const investGain = v2Balance > 0 ? v2Balance * (assumptions.venture2InvestReturn / 100) : 0;
      const netEquity = v2Balance - v2LocDebt;

      // LOC Paydown: 50% of (investment gains + self income)
      const locPaydown = ((investGain + v2SelfIncome) * 0.5);

      // Affordable headcount: floor(v2 balance * 0.15 / $50K)
      const affordableHeadcount = Math.floor(v2Balance * 0.15 / 50000);

      return {
        age,
        year: year.year,
        v2Balance,
        v2LocDebt,
        netEquity,
        rhPullV2: Math.round(rhPullV2),
        v2SelfIncome: Math.round(v2SelfIncome),
        investGain: Math.round(investGain),
        locPaydown: Math.round(locPaydown),
        rentalNetIncome: Math.round(rentalNetIncome),
        affordableHeadcount,
      };
    });
  }, [data, assumptions]);

  // Summary cards — current age
  const currentYear = yearsData.find(y => y.age === assumptions.currentAge) || yearsData[0];

  // Rental property details
  const rentalPurchaseAge = assumptions.rentalPurchaseAge;
  const rentalPurchasePrice = assumptions.rentalPurchasePrice;
  const rentalDownPayment = assumptions.rentalDownPayment;
  const rentalMortgagePrincipal = rentalPurchasePrice - rentalDownPayment;
  const rentalGrossRent = assumptions.rentalGrossRentYear1;
  const occupancyRate = assumptions.rentalOccupancy / 100;
  const rentalExpenseRate = assumptions.rentalExpenseRate / 100;
  const rentalMortgageRate = assumptions.rentalMortgageRate / 100;
  const rentalMortgageTerm = assumptions.rentalMortgageTerm;

  const monthlyRate = rentalMortgageRate / 12;
  const nMonths = rentalMortgageTerm * 12;
  const monthlyPayment = rentalMortgagePrincipal * (monthlyRate * Math.pow(1 + monthlyRate, nMonths)) / (Math.pow(1 + monthlyRate, nMonths) - 1);
  const rentalMortgagePayment = monthlyPayment * 12;

  const effectiveRent = rentalGrossRent * occupancyRate;
  const operatingExpenses = rentalGrossRent * rentalExpenseRate;
  const rentalNetIncomeCalc = effectiveRent - operatingExpenses - rentalMortgagePayment;

  const summaryCards = [
    {
      label: 'V2 Balance',
      value: formatCurrency(currentYear?.v2Balance || 0),
      icon: '🚀',
    },
    {
      label: 'V2 LOC Debt',
      value: formatCurrency(currentYear?.v2LocDebt || 0),
      icon: '💳',
    },
    {
      label: 'Net Equity',
      value: formatCurrency(currentYear?.netEquity || 0),
      icon: '💎',
    },
    {
      label: 'Rental Properties',
      value: '2x $1M',
      icon: '🏢',
    },
    {
      label: 'Rental Net Income (Annual)',
      value: formatCurrency(rentalNetIncomeCalc),
      icon: '💰',
    },
    {
      label: 'Self-Generated Income',
      value: formatCurrency(currentYear?.v2SelfIncome || 0),
      icon: '📈',
    },
    {
      label: 'Employees Affordable',
      value: currentYear?.affordableHeadcount || 0,
      icon: '👥',
    },
  ];

  // Chart data
  const chartData = yearsData.filter(y => y.age >= assumptions.venture2StartAge);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/plan" className="text-blue-400 hover:text-blue-300">
          ← Back to Plan
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-5xl">🚀</span>
        <h1 className="text-4xl font-bold">Venture 2</h1>
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

      {/* Rental/Airbnb Detail Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">🏠 Rental/Airbnb Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">Property Overview</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-300">Total Value:</span> <span className="text-emerald-400 font-semibold">{formatCurrency(rentalPurchasePrice)}</span></p>
              <p><span className="text-gray-300">Down Payment (25%):</span> <span className="text-emerald-400 font-semibold">{formatCurrency(rentalDownPayment)}</span></p>
              <p><span className="text-gray-300">Mortgage Principal:</span> <span className="text-red-400 font-semibold">{formatCurrency(rentalMortgagePrincipal)}</span></p>
              <p><span className="text-gray-300">Mortgage Rate:</span> <span className="font-semibold">{rentalMortgageRate * 100}% / {rentalMortgageTerm} yrs</span></p>
              <p><span className="text-gray-300">Occupancy Rate:</span> <span className="text-blue-400 font-semibold">{(occupancyRate * 100).toFixed(0)}%</span></p>
            </div>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">Annual Economics</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-300">Gross Rent:</span> <span className="text-emerald-400 font-semibold">{formatCurrency(rentalGrossRent)}</span></p>
              <p><span className="text-gray-300">Effective Rent (90%):</span> <span className="text-emerald-400 font-semibold">{formatCurrency(effectiveRent)}</span></p>
              <p><span className="text-gray-300">Operating Expenses (30%):</span> <span className="text-orange-400 font-semibold">({formatCurrency(operatingExpenses)})</span></p>
              <p><span className="text-gray-300">Mortgage P&I:</span> <span className="text-red-400 font-semibold">({formatCurrency(rentalMortgagePayment)})</span></p>
              <p className="pt-2 border-t border-gray-700"><span className="text-gray-300">Net Rental Income:</span> <span className="text-lime-400 font-semibold">{formatCurrency(rentalNetIncomeCalc)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Year-by-Year Projection</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-gray-300">Age</th>
              <th className="text-right px-4 py-3 text-gray-300">V2 Balance</th>
              <th className="text-right px-4 py-3 text-gray-300">V2 LOC</th>
              <th className="text-right px-4 py-3 text-gray-300">Net Equity</th>
              <th className="text-right px-4 py-3 text-gray-300">RH Pull In</th>
              <th className="text-right px-4 py-3 text-gray-300">Self Income</th>
              <th className="text-right px-4 py-3 text-gray-300">Invest Gains (12%)</th>
              <th className="text-right px-4 py-3 text-gray-300">Rental Net Income</th>
              <th className="text-right px-4 py-3 text-gray-300">LOC Paydown</th>
              <th className="text-right px-4 py-3 text-gray-300">Staff</th>
            </tr>
          </thead>
          <tbody>
            {yearsData.filter(y => y.age >= assumptions.venture2StartAge).map((row, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-semibold">{row.age}</td>
                <td className="text-right px-4 py-3 text-blue-400">{formatCurrency(row.v2Balance)}</td>
                <td className="text-right px-4 py-3 text-red-400">{formatCurrency(row.v2LocDebt)}</td>
                <td className="text-right px-4 py-3 text-green-400">{formatCurrency(row.netEquity)}</td>
                <td className="text-right px-4 py-3 text-purple-400">{formatCurrency(row.rhPullV2)}</td>
                <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.v2SelfIncome)}</td>
                <td className="text-right px-4 py-3 text-emerald-400">{formatCurrency(row.investGain)}</td>
                <td className="text-right px-4 py-3 text-cyan-400">{formatCurrency(row.rentalNetIncome)}</td>
                <td className="text-right px-4 py-3 text-yellow-400">{formatCurrency(row.locPaydown)}</td>
                <td className="text-right px-4 py-3 text-gray-300">{row.affordableHeadcount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart: V2 Balance + Rental Net Income */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">V2 Balance & Rental Income Growth</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
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
              dataKey="v2Balance"
              fill="#3B82F6"
              stroke="#3B82F6"
              fillOpacity={0.3}
              name="V2 Balance"
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="rentalNetIncome"
              stroke="#06B6D4"
              strokeWidth={2}
              name="Rental Net Income"
              yAxisId="right"
              dot={false}
            />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Affordable Headcount Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">👥 Affordable Headcount</h2>
        <p className="text-gray-300 mb-4">
          Affordable headcount = floor(V2 balance × 0.15 / $50K). Scales with business growth and available equity for payroll.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">Current Headcount</p>
            <p className="text-3xl font-bold text-blue-400">{currentYear?.affordableHeadcount || 0}</p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">Annual Cost per Employee</p>
            <p className="text-3xl font-bold text-green-400">$50K</p>
          </div>
        </div>
      </div>

      {/* Business Model Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">📋 Business Model & Funding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-emerald-400 mb-3">Funding Mechanism</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>✓ <span className="text-gray-400">10% of Robinhood leveraged gains → V2 seed</span></li>
              <li>✓ <span className="text-gray-400">Matching self-generated income (1:1 ratio)</span></li>
              <li>✓ <span className="text-gray-400">Revolving LOC at 9%, 7-year term</span></li>
              <li>✓ <span className="text-gray-400">RH pull covers all debt service (P&I)</span></li>
              <li>✓ <span className="text-gray-400">50% of net gains → LOC paydown</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-400 mb-3">Rental Strategy</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>✓ <span className="text-gray-400">Purchase 2x $1M properties at age 40</span></li>
              <li>✓ <span className="text-gray-400">25% down payment ($500K) from V2 balance</span></li>
              <li>✓ <span className="text-gray-400">90% occupancy (Airbnb + long-term mix)</span></li>
              <li>✓ <span className="text-gray-400">30% operating expense ratio</span></li>
              <li>✓ <span className="text-gray-400">7% mortgage rate, 30-year amortization</span></li>
            </ul>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4 italic">
          Shared staff with Venture 1 and Homestead — leverages economies of scale. Goal: build operating business with rental real estate as collateral and cash flow stabilizer.
        </p>
      </div>
    </div>
  );
}
