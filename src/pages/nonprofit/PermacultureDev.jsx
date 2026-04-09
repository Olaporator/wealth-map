import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';
import AgeSlider from '../../components/AgeSlider';
import ContractorWidget from '../../components/ContractorWidget';
import { getContractorsForEntity, ENTITIES } from '../../lib/contractors';

export default function PermacultureDev() {
  const { data } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);
  const selectedYear = data?.years?.find(y => y.age === targetAge) || data?.years?.[0];
  const contractors = useMemo(() => getContractorsForEntity(ENTITIES.NP, 'permaculture'), []);
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link to="/nonprofit" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">
          ← Back to Nonprofit
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌱</span>
            <h1 className="text-4xl font-bold">Permaculture Development</h1>
          </div>
          <p className="text-gray-400">Building regenerative food systems on Opportunity Zone land</p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 border border-emerald-500 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-lg font-semibold text-emerald-400">Active</span>
          </div>
          <p className="text-gray-300 mt-2">Currently establishing food forests and training farmers in regenerative practices</p>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Program Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            Permaculture Development focuses on creating sustainable food production systems on QOZ land. We establish food forests,
            implement regenerative agriculture practices, and train local farmers to steward the land while building food sovereignty.
            We also distribute high-quality seeds adapted to our local climate and soil conditions.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌱</span>
              <h3 className="font-semibold text-emerald-400">Food Forests Established</h3>
            </div>
            <p className="text-3xl font-bold mb-2">12</p>
            <p className="text-sm text-gray-400">Across 45 acres of QOZ land</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👥</span>
              <h3 className="font-semibold text-emerald-400">Farmers Trained</h3>
            </div>
            <p className="text-3xl font-bold mb-2">89</p>
            <p className="text-sm text-gray-400">In regenerative agriculture</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📈</span>
              <h3 className="font-semibold text-emerald-400">Seeds Distributed</h3>
            </div>
            <p className="text-3xl font-bold mb-2">15K+</p>
            <p className="text-sm text-gray-400">Varieties adapted to region</p>
          </div>
        </div>

        {/* Key Activities */}
        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Key Activities</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Food forest design and establishment on available QOZ parcels</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Hands-on training workshops in permaculture principles and practices</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Seed library and distribution network for regional varieties</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Soil health and regenerative agriculture certification support</span>
            </li>
          </ul>
        </div>

        <AgeSlider age={targetAge} onChange={setTargetAge} />

        {selectedYear && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">NP Reserves @ {targetAge}</p>
              <p className="text-2xl font-bold text-emerald-400">{selectedYear.nonprofit >= 1000000 ? '$' + (selectedYear.nonprofit / 1000000).toFixed(1) + 'M' : selectedYear.nonprofit >= 1000 ? '$' + (selectedYear.nonprofit / 1000).toFixed(0) + 'K' : '$' + (selectedYear.nonprofit || 0)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Net Worth @ {targetAge}</p>
              <p className="text-2xl font-bold text-white">{selectedYear.netWorth >= 1000000 ? '$' + (selectedYear.netWorth / 1000000).toFixed(1) + 'M' : selectedYear.netWorth >= 1000 ? '$' + (selectedYear.netWorth / 1000).toFixed(0) + 'K' : '$' + (selectedYear.netWorth || 0)}</p>
            </div>
          </div>
        )}

        {/* Year-by-Year (Parent Entity: Nonprofit) */}
        {data?.years && (
          <CollapsibleYearByYear title="Year-by-Year Projection (Nonprofit Entity)">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left px-4 py-3 text-gray-300">Age</th>
                  <th className="text-right px-4 py-3 text-gray-300">NP Reserves</th>
                  <th className="text-right px-4 py-3 text-gray-300">Net Worth</th>
                </tr>
              </thead>
              <tbody>
                {data.years.map((row, idx) => (
                  <tr key={idx} onClick={() => setTargetAge(row.age)} className={`border-b border-gray-800 cursor-pointer transition-colors ${row.age === targetAge ? 'bg-emerald-900/30 ring-1 ring-emerald-600/50' : 'hover:bg-gray-800'}`}>
                    <td className={`px-4 py-3 font-semibold ${row.age === targetAge ? 'text-emerald-400' : ''}`}>{row.age}</td>
                    <td className="text-right px-4 py-3 text-emerald-400">{row.nonprofit >= 1000000 ? '$' + (row.nonprofit / 1000000).toFixed(1) + 'M' : row.nonprofit >= 1000 ? '$' + (row.nonprofit / 1000).toFixed(0) + 'K' : '$' + (row.nonprofit || 0)}</td>
                    <td className="text-right px-4 py-3 text-white font-semibold">{row.netWorth >= 1000000 ? '$' + (row.netWorth / 1000000).toFixed(1) + 'M' : row.netWorth >= 1000 ? '$' + (row.netWorth / 1000).toFixed(0) + 'K' : '$' + (row.netWorth || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CollapsibleYearByYear>
        )}

        <ContractorWidget contractors={contractors} title="Permaculture Program Services" entityLabel="NP Programs" />
      </div>
    </div>
  );
}
