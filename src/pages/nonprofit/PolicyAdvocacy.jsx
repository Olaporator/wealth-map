import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';
import AgeSlider from '../../components/AgeSlider';
import ContractorWidget from '../../components/ContractorWidget';
import { getContractorsForEntity, ENTITIES } from '../../lib/contractors';

export default function PolicyAdvocacy() {
  const { data } = useWealthData();
  const [targetAge, setTargetAge] = useState(31);
  const selectedYear = data?.years?.find(y => y.age === targetAge) || data?.years?.[0];
  const contractors = useMemo(() => getContractorsForEntity(ENTITIES.NP, 'policy'), []);
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link to="/nonprofit" className="text-rose-400 hover:text-rose-300 mb-8 inline-block">
          ← Back to Nonprofit
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📢</span>
            <h1 className="text-4xl font-bold">Policy & Advocacy</h1>
          </div>
          <p className="text-gray-400">Advancing systemic change for land rights and equitable development</p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 border border-rose-500 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
            <span className="text-lg font-semibold text-rose-400">Active</span>
          </div>
          <p className="text-gray-300 mt-2">Researching and advocating for policies that support land rights, conservation, and equitable development</p>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-rose-400">Program Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            Policy & Advocacy conducts rigorous research on land rights, conservation incentives, and equitable development models.
            We translate evidence into advocacy campaigns, policy recommendations, and community legal support to advance systemic change
            that benefits low-income communities and protects natural resources.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📄</span>
              <h3 className="font-semibold text-rose-400">Research Reports</h3>
            </div>
            <p className="text-3xl font-bold mb-2">14</p>
            <p className="text-sm text-gray-400">Published studies and briefs</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚖️</span>
              <h3 className="font-semibold text-rose-400">Policies Influenced</h3>
            </div>
            <p className="text-3xl font-bold mb-2">8</p>
            <p className="text-sm text-gray-400">Local and state initiatives</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📢</span>
              <h3 className="font-semibold text-rose-400">Community Legal Cases</h3>
            </div>
            <p className="text-3xl font-bold mb-2">6</p>
            <p className="text-sm text-gray-400">Active advocacy support</p>
          </div>
        </div>

        {/* Key Activities */}
        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-rose-400">Key Activities</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-rose-400">•</span>
              <span>Research on land tenure, conservation incentives, and equitable development outcomes</span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400">•</span>
              <span>Policy briefs and evidence-based recommendations for decision-makers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400">•</span>
              <span>Advocacy campaigns for community land rights and environmental justice</span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400">•</span>
              <span>Legal support and community education on land rights and conservation programs</span>
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

        <ContractorWidget contractors={contractors} title="Policy & Advocacy Services" entityLabel="NP Policy" />
      </div>
    </div>
  );
}
