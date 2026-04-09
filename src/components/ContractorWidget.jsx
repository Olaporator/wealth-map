import React, { useState, useMemo } from 'react';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0';
  const absValue = Math.abs(value);
  if (absValue >= 1000000) return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`;
  if (absValue >= 1000) return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`;
  return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`;
};

const statusColor = {
  Active: 'bg-emerald-900/50 text-emerald-400 border-emerald-700',
  Planned: 'bg-blue-900/50 text-blue-400 border-blue-700',
  Future: 'bg-gray-800/50 text-gray-400 border-gray-600',
};

const statusDot = {
  Active: 'bg-emerald-400',
  Planned: 'bg-blue-400',
  Future: 'bg-gray-500',
};

const typeColor = {
  'Part-time': 'text-yellow-400',
  'Part-time → scaling': 'text-yellow-400',
  'Full-time': 'text-emerald-400',
  'Contract': 'text-blue-400',
  'Retainer': 'text-purple-400',
  'Seasonal': 'text-orange-400',
  'Seasonal Contract': 'text-orange-400',
  'Fellowship': 'text-pink-400',
  'On-call': 'text-gray-400',
  'As-needed': 'text-gray-400',
  'Volunteer + Stipend': 'text-green-400',
};

export default function ContractorWidget({ contractors, title = 'Contractors & Service Providers', entityLabel = '' }) {
  const [filter, setFilter] = useState('all'); // all, active, planned, future
  const [expanded, setExpanded] = useState(true);

  const filtered = useMemo(() => {
    if (filter === 'all') return contractors;
    return contractors.filter(c => c.status.toLowerCase() === filter);
  }, [contractors, filter]);

  const stats = useMemo(() => {
    const active = contractors.filter(c => c.status === 'Active').length;
    const planned = contractors.filter(c => c.status === 'Planned').length;
    const future = contractors.filter(c => c.status === 'Future').length;
    const totalMin = contractors.reduce((s, c) => s + c.rateMin, 0);
    const totalMax = contractors.reduce((s, c) => s + c.rateMax, 0);
    const crossBiz = contractors.filter(c => c.crossBiz && c.crossBiz.length > 0).length;
    return { active, planned, future, totalMin, totalMax, crossBiz, total: contractors.length };
  }, [contractors]);

  if (contractors.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-left"
        >
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h2 className="text-xl font-bold">🤝 {title}</h2>
          <span className="text-sm text-gray-500 ml-2">({stats.total} roles)</span>
        </button>
        {entityLabel && (
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{entityLabel}</span>
        )}
      </div>

      {!expanded ? null : (
        <>
          {/* Summary Cards — horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto pb-3 mb-5 scrollbar-thin">
            <div className="flex-shrink-0 bg-gray-800 rounded-lg p-4 min-w-[160px] border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Est. Annual Cost</p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(stats.totalMin)} – {formatCurrency(stats.totalMax)}
              </p>
              <p className="text-gray-500 text-xs mt-1">All {stats.total} roles combined</p>
            </div>
            <div className="flex-shrink-0 bg-gray-800 rounded-lg p-4 min-w-[120px] border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Active</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
              <p className="text-gray-500 text-xs mt-1">Currently engaged</p>
            </div>
            <div className="flex-shrink-0 bg-gray-800 rounded-lg p-4 min-w-[120px] border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Planned</p>
              <p className="text-2xl font-bold text-blue-400">{stats.planned}</p>
              <p className="text-gray-500 text-xs mt-1">Near-term hires</p>
            </div>
            <div className="flex-shrink-0 bg-gray-800 rounded-lg p-4 min-w-[120px] border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Future</p>
              <p className="text-2xl font-bold text-gray-400">{stats.future}</p>
              <p className="text-gray-500 text-xs mt-1">When funded</p>
            </div>
            <div className="flex-shrink-0 bg-gray-800 rounded-lg p-4 min-w-[120px] border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Cross-Biz</p>
              <p className="text-2xl font-bold text-purple-400">{stats.crossBiz}</p>
              <p className="text-gray-500 text-xs mt-1">Shared roles</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {['all', 'active', 'planned', 'future'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && ` (${stats[f]})`}
              </button>
            ))}
          </div>

          {/* Contractor Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="text-left px-3 py-2">Role</th>
                  <th className="text-left px-3 py-2">Location</th>
                  <th className="text-left px-3 py-2">Type</th>
                  <th className="text-right px-3 py-2">Rate</th>
                  <th className="text-center px-3 py-2">Status</th>
                  <th className="text-center px-3 py-2">Start</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="px-3 py-3">
                      <div>
                        <p className="text-white font-medium">{c.role}</p>
                        <p className="text-gray-500 text-xs mt-0.5 max-w-xs group-hover:text-gray-400 transition-colors">
                          {c.description}
                        </p>
                        {c.crossBiz && c.crossBiz.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {c.crossBiz.map(e => (
                              <span key={e} className="text-[10px] bg-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded">
                                {e === 'v1' ? 'V1' : e === 'v2' ? 'V2' : e === 'nonprofit' ? 'NP' : e === 'v3' ? 'V3' : e === 'ops-hub' ? 'Hub' : e}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-300 whitespace-nowrap">{c.location}</td>
                    <td className={`px-3 py-3 whitespace-nowrap ${typeColor[c.type] || 'text-gray-400'}`}>
                      {c.type}
                    </td>
                    <td className="px-3 py-3 text-right text-white whitespace-nowrap font-mono text-xs">
                      {c.rateRange}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${statusColor[c.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[c.status]}`}></span>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-400 text-xs">
                      Age {c.startAge}
                      {c.endAge ? `–${c.endAge}` : '+'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <p className="text-gray-500 text-center py-4 text-sm">No contractors match this filter.</p>
          )}
        </>
      )}
    </div>
  );
}
