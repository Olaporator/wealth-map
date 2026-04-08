import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';
import AgeSlider from '../../components/AgeSlider';

export default function AgroEquipment() {
  const { data } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);
  const selectedYear = data?.years?.find(y => y.age === targetAge) || data?.years?.[0];
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/venture2"
          className="text-blue-400 hover:text-blue-300 mb-8 inline-flex items-center gap-2 text-lg"
        >
          ← Back to Venture 2
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🚜</div>
            <h1 className="text-4xl font-bold">Agro Equipment Leasing</h1>
          </div>
          <p className="text-gray-400">Equipment rental and leasing services for agricultural and landscaping operations</p>
        </div>

        {/* Description Section */}
        <section className="mb-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Agro Equipment Leasing provides flexible rental and leasing options for agricultural, farming, and landscaping equipment. Our fleet includes tractors, tillers, irrigation systems, and specialized tools, offering businesses a cost-effective alternative to equipment ownership.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-orange-400 mb-2">Equipment Types</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Tractors & loaders</li>
                <li>• Tillers & cultivators</li>
                <li>• Irrigation systems</li>
                <li>• Specialized tools</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-orange-400 mb-2">Target Customers</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Small farms</li>
                <li>• Landscaping companies</li>
                <li>• Property managers</li>
                <li>• Commercial growers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Status Card */}
        <div className="mb-12 bg-green-900 bg-opacity-20 border border-green-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xl font-semibold text-green-400">Active</span>
          </div>
          <p className="text-gray-400 mt-2">Operating with initial equipment fleet and growing customer base</p>
        </div>

        {/* Revenue Model */}
        <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Revenue Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-orange-400 font-semibold mb-2">Daily Rentals</h3>
              <p className="text-sm text-gray-300">$150-500/day</p>
              <p className="text-xs text-gray-500 mt-2">Short-term equipment rental</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-orange-400 font-semibold mb-2">Monthly Leases</h3>
              <p className="text-sm text-gray-300">$2,000-8,000/month</p>
              <p className="text-xs text-gray-500 mt-2">Seasonal and extended leases</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-orange-400 font-semibold mb-2">Maintenance & Support</h3>
              <p className="text-sm text-gray-300">Included/Additional fees</p>
              <p className="text-xs text-gray-500 mt-2">Equipment maintenance & repair</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded text-gray-300">
            <p className="font-semibold mb-2">Key Metrics</p>
            <ul className="text-sm space-y-1">
              <li>Fleet Size: [TBD] units</li>
              <li>Average Equipment Utilization: [TBD]%</li>
              <li>Active Contracts: [TBD]</li>
              <li>Monthly Recurring Revenue: [TBD]</li>
            </ul>
          </div>
        </section>

        {/* Year-by-Year (Parent Entity: V2 Agro) */}
        <AgeSlider age={targetAge} onChange={setTargetAge} />

        {selectedYear && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">V2 Agro Balance @ {targetAge}</p>
              <p className="text-2xl font-bold text-lime-400">{selectedYear.ventures >= 1000000 ? '$' + (selectedYear.ventures / 1000000).toFixed(1) + 'M' : selectedYear.ventures >= 1000 ? '$' + (selectedYear.ventures / 1000).toFixed(0) + 'K' : '$' + (selectedYear.ventures || 0)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Net Worth @ {targetAge}</p>
              <p className="text-2xl font-bold text-white">{selectedYear.netWorth >= 1000000 ? '$' + (selectedYear.netWorth / 1000000).toFixed(1) + 'M' : selectedYear.netWorth >= 1000 ? '$' + (selectedYear.netWorth / 1000).toFixed(0) + 'K' : '$' + (selectedYear.netWorth || 0)}</p>
            </div>
          </div>
        )}

        {data?.years && (
          <CollapsibleYearByYear title="Year-by-Year Projection (V2 Agro Entity)">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left px-4 py-3 text-gray-300">Age</th>
                  <th className="text-right px-4 py-3 text-gray-300">V2 Balance</th>
                  <th className="text-right px-4 py-3 text-gray-300">Net Worth</th>
                </tr>
              </thead>
              <tbody>
                {data.years.map((row, idx) => (
                  <tr key={idx} onClick={() => setTargetAge(row.age)} className={`border-b border-gray-800 cursor-pointer transition-colors ${row.age === targetAge ? 'bg-emerald-900/30 ring-1 ring-emerald-600/50' : 'hover:bg-gray-800'}`}>
                    <td className={`px-4 py-3 font-semibold ${row.age === targetAge ? 'text-emerald-400' : ''}`}>{row.age}</td>
                    <td className="text-right px-4 py-3 text-lime-400">{row.ventures >= 1000000 ? '$' + (row.ventures / 1000000).toFixed(1) + 'M' : row.ventures >= 1000 ? '$' + (row.ventures / 1000).toFixed(0) + 'K' : '$' + (row.ventures || 0)}</td>
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
