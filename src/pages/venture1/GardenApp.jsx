import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';
import AgeSlider from '../../components/AgeSlider';
import ContractorWidget from '../../components/ContractorWidget';
import { getContractorsForEntity, ENTITIES } from '../../lib/contractors';

export default function GardenApp() {
  const { data } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);
  const selectedYear = data?.years?.find(y => y.age === targetAge) || data?.years?.[0];
  const contractors = React.useMemo(() => getContractorsForEntity(ENTITIES.V2, 'garden-app'), []);
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
            <div className="text-5xl">🌱</div>
            <h1 className="text-4xl font-bold">Garden App</h1>
          </div>
          <p className="text-gray-400">Digital platform for garden planning, management, and plant care</p>
        </div>

        {/* Description Section */}
        <section className="mb-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Garden App is a mobile and web-based platform that helps users design, plan, and manage their gardens. The application provides tools for garden layout design, plant database, watering schedules, pest management, and community features to connect gardeners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-blue-400 mb-2">Key Features</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Digital garden planner</li>
                <li>• Plant database & care tips</li>
                <li>• Watering reminders</li>
                <li>• Community forum</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-blue-400 mb-2">Target Users</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Home gardeners</li>
                <li>• Urban farmers</li>
                <li>• Landscape enthusiasts</li>
                <li>• Sustainability-focused users</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Status Card */}
        <div className="mb-12 bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-xl font-semibold text-yellow-400">Planned</span>
          </div>
          <p className="text-gray-400 mt-2">MVP development in progress, beta launch scheduled for next quarter</p>
        </div>

        {/* Revenue Model */}
        <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Revenue Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-blue-400 font-semibold mb-2">Freemium Model</h3>
              <p className="text-sm text-gray-300">Free + Premium</p>
              <p className="text-xs text-gray-500 mt-2">Basic features free, advanced features paid</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-blue-400 font-semibold mb-2">Premium Subscription</h3>
              <p className="text-sm text-gray-300">$4.99-9.99/month</p>
              <p className="text-xs text-gray-500 mt-2">Advanced planning & community features</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-blue-400 font-semibold mb-2">Partner Revenue</h3>
              <p className="text-sm text-gray-300">Affiliate commissions</p>
              <p className="text-xs text-gray-500 mt-2">Gardening supplies & tools partnerships</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded text-gray-300">
            <p className="font-semibold mb-2">Key Metrics</p>
            <ul className="text-sm space-y-1">
              <li>Beta Users: [TBD]</li>
              <li>Target Launch Date: [TBD]</li>
              <li>Projected Free Users: [TBD]</li>
              <li>Projected Premium Conversion: [TBD]</li>
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

        <ContractorWidget contractors={contractors} title="Garden App Services" entityLabel="V2 AgTech" />
      </div>
    </div>
  );
}
