import React from 'react';
import { Link } from 'react-router-dom';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';

export default function InternalTools() {
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
          <div className="p-3 bg-indigo-900 rounded-lg">
            <span className="text-3xl">🔧</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Internal Tools</h1>
            <p className="text-gray-400 mt-1">Business Management & Analytics</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            A suite of internal-only tools designed for portfolio management and decision-making.
            Includes investment tracking, portfolio analytics, business performance dashboards, and management utilities.
            Built exclusively for internal use and not customer-facing.
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

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Access</p>
                <p className="text-2xl font-bold mt-1">Internal Only</p>
              </div>
              <span className="text-3xl">🔒</span>
            </div>
          </div>
        </div>

        {/* Tool Categories */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">💾</span>
            Tool Suite
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded p-4 border-l-4 border-indigo-500">
              <h3 className="font-semibold text-indigo-300 mb-2">Investment Tracking App</h3>
              <p className="text-sm text-gray-400">
                Real-time portfolio monitoring, asset allocation, performance analytics,
                and investment decision support across all ventures.
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4 border-l-4 border-indigo-500">
              <h3 className="font-semibold text-indigo-300 mb-2">Business Analytics Dashboard</h3>
              <p className="text-sm text-gray-400">
                Key metrics, KPIs, performance trends, variance analysis, and executive summaries
                for all operating entities.
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4 border-l-4 border-indigo-500">
              <h3 className="font-semibold text-indigo-300 mb-2">Portfolio Management System</h3>
              <p className="text-sm text-gray-400">
                Asset management, allocation tracking, rebalancing tools, and strategic planning utilities.
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4 border-l-4 border-indigo-500">
              <h3 className="font-semibold text-indigo-300 mb-2">Financial Reporting Tools</h3>
              <p className="text-sm text-gray-400">
                Consolidated financial statements, cash flow analysis, and performance reporting across entities.
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4 border-l-4 border-indigo-500">
              <h3 className="font-semibold text-indigo-300 mb-2">Business Management Suite</h3>
              <p className="text-sm text-gray-400">
                Project management, task tracking, resource allocation, and operational coordination tools.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Real-time data synchronization</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Advanced analytics & reporting</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Secure authentication & authorization</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Customizable dashboards</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Historical data & audit trails</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">API integrations with external systems</span>
            </div>
          </div>
        </div>

        {/* Usage & Access */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">🔒</span>
            Access & Security
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-indigo-300 mb-2">Internal Access Only</h3>
              <p className="text-sm text-gray-300">
                Tools are restricted to internal team members and leadership.
                Not exposed to customers, vendors, or public-facing systems.
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-indigo-300 mb-2">Security & Compliance</h3>
              <p className="text-sm text-gray-300">
                Enterprise-grade security, role-based access controls, encrypted data transmission,
                and comprehensive audit logging for compliance requirements.
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-indigo-300 mb-2">Data Privacy</h3>
              <p className="text-sm text-gray-300">
                Sensitive financial and operational data is protected with advanced encryption,
                access restrictions, and secure backup procedures.
              </p>
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
