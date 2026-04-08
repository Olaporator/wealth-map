import React from 'react';
import { Link } from 'react-router-dom';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';

export default function WebullPortfolio() {
  const { data } = useWealthData();
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/venture1" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <span>←</span>
          Back to Venture 1
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-900 rounded-lg">
            <span className="text-3xl">📈</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Webull Portfolio</h1>
            <p className="text-gray-400 mt-1">S-Corp Investment Account</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            A $100K Webull investment entity account managed by NimbusTech S-Corp.
            Seeded at age 32 with $30K diverted + $10K family gift + $10K family loan + $50K from V1 LOC (repaid in 6 months).
            Actively invested with 12% annual returns target.
          </p>
        </div>

        {/* Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Status</p>
                <p className="text-2xl font-bold mt-1">Active</p>
              </div>
              <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Founding Age</p>
                <p className="text-2xl font-bold mt-1">Age 32</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        {/* Capital Structure */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Capital Structure</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Internal Diversion</span>
              <span className="font-semibold">$30,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Family Gift</span>
              <span className="font-semibold">$10,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Family Loan</span>
              <span className="font-semibold">$10,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">V1 LOC (6mo repay)</span>
              <span className="font-semibold">$50,000</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-gray-200 font-semibold">Total Portfolio Value</span>
              <span className="text-2xl font-bold text-blue-400">$100,000</span>
            </div>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Investment Returns
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Annual Return Target</span>
                <span className="text-green-400 font-bold text-lg">12%</span>
              </div>
              <p className="text-gray-400 text-sm">Expected annual portfolio growth through equity investments</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Expected Annual Gain</span>
                <span className="text-green-400 font-bold text-lg">$12,000</span>
              </div>
              <p className="text-gray-400 text-sm">Projected yearly returns at 12% growth rate</p>
            </div>
          </div>
        </div>

        {/* Year-by-Year (Parent Entity: V1 NimbusTech) */}
        {data?.years && (
          <CollapsibleYearByYear title="Year-by-Year Projection (V1 NimbusTech Entity)">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left px-4 py-3 text-gray-300">Age</th>
                  <th className="text-right px-4 py-3 text-gray-300">V1 Balance</th>
                  <th className="text-right px-4 py-3 text-gray-300">Net Worth</th>
                </tr>
              </thead>
              <tbody>
                {data.years.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 font-semibold">{row.age}</td>
                    <td className="text-right px-4 py-3 text-pink-400">{row.venture2 >= 1000000 ? '$' + (row.venture2 / 1000000).toFixed(1) + 'M' : row.venture2 >= 1000 ? '$' + (row.venture2 / 1000).toFixed(0) + 'K' : '$' + (row.venture2 || 0)}</td>
                    <td className="text-right px-4 py-3 text-white font-semibold">{row.netWorth >= 1000000 ? '$' + (row.netWorth / 1000000).toFixed(1) + 'M' : row.netWorth >= 1000 ? '$' + (row.netWorth / 1000).toFixed(0) + 'K' : '$' + (row.netWorth || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CollapsibleYearByYear>
        )}
      </div>
    </div>
  );
}
