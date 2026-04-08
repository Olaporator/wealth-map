import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';
import AgeSlider from '../../components/AgeSlider';

export default function CityRentals() {
  const { data } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);
  const selectedYear = data?.years?.find(y => y.age === targetAge) || data?.years?.[0];
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
          <div className="p-3 bg-amber-900 rounded-lg">
            <span className="text-3xl">🏠</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">City Rentals</h1>
            <p className="text-gray-400 mt-1">Residential & Airbnb Properties</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            A portfolio of 2-3 premium rental and Airbnb properties in major cities.
            Purchased at age 40 using 25% down payment from V2 balance.
            Total portfolio value of $2.5M with strong occupancy and stable cash flow.
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

          <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200 text-sm font-medium">Founding Age</p>
                <p className="text-2xl font-bold mt-1">Age 40</p>
              </div>
              <span className="text-3xl">📍</span>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Number of Properties</span>
              <span className="font-semibold">2-3 units</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Total Portfolio Value</span>
              <span className="font-semibold text-amber-400 text-lg">$2,500,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Down Payment (25%)</span>
              <span className="font-semibold">$625,000</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-gray-200 font-semibold">Financing (75%)</span>
              <span className="font-semibold text-amber-300">$1,875,000</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">📈</span>
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-300">Occupancy Rate</span>
                <span className="text-2xl font-bold text-amber-400">90%</span>
              </div>
              <p className="text-xs text-gray-400">High demand in urban locations</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-300">Expense Ratio</span>
                <span className="text-2xl font-bold text-amber-400">30%</span>
              </div>
              <p className="text-xs text-gray-400">Maintenance, property tax, utilities</p>
            </div>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">💰</span>
            Revenue Model
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-amber-300 mb-3">Dual Income Streams</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  Traditional Long-term Rentals
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  Premium Airbnb Short-term Stays
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-amber-300 mb-2">Cash Flow Profile</h3>
              <p className="text-sm text-gray-300">
                90% occupancy with 30% operating expenses provides strong net cash flow.
                Appreciation potential in established urban markets.
              </p>
            </div>
          </div>
        </div>

        {/* Age Slider */}
        <AgeSlider age={targetAge} onChange={setTargetAge} />

        {/* Summary Stats */}
        {selectedYear && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">V1 NimbusTech Balance @ {targetAge}</p>
              <p className="text-2xl font-bold text-pink-400">{selectedYear.venture2 >= 1000000 ? '$' + (selectedYear.venture2 / 1000000).toFixed(1) + 'M' : selectedYear.venture2 >= 1000 ? '$' + (selectedYear.venture2 / 1000).toFixed(0) + 'K' : '$' + (selectedYear.venture2 || 0)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Net Worth @ {targetAge}</p>
              <p className="text-2xl font-bold text-white">{selectedYear.netWorth >= 1000000 ? '$' + (selectedYear.netWorth / 1000000).toFixed(1) + 'M' : selectedYear.netWorth >= 1000 ? '$' + (selectedYear.netWorth / 1000).toFixed(0) + 'K' : '$' + (selectedYear.netWorth || 0)}</p>
            </div>
          </div>
        )}

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
                  <tr key={idx} onClick={() => setTargetAge(row.age)} className={`border-b border-gray-800 cursor-pointer transition-colors ${row.age === targetAge ? 'bg-emerald-900/30 ring-1 ring-emerald-600/50' : 'hover:bg-gray-800'}`}>
                    <td className={`px-4 py-3 font-semibold ${row.age === targetAge ? 'text-emerald-400' : ''}`}>{row.age}</td>
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
