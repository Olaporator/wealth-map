import React from 'react';
import { Link } from 'react-router-dom';
import { useWealthData } from '../../hooks/useWealthData';
import CollapsibleYearByYear from '../../components/CollapsibleYearByYear';

export default function ContentMedia() {
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
          <div className="p-3 bg-pink-900 rounded-lg">
            <span className="text-3xl">📢</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Content & Media</h1>
            <p className="text-gray-400 mt-1">Centralized Creative Operations</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            A centralized content creation and media management hub serving all ventures.
            Handles social media strategy, marketing campaigns, brand management, and content production
            across the entire portfolio. Ensures consistent brand voice and maximizes marketing efficiency.
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

          <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-medium">Type</p>
                <p className="text-2xl font-bold mt-1">Shared Service</p>
              </div>
              <span className="text-3xl">📤</span>
            </div>
          </div>
        </div>

        {/* Core Functions */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">📷</span>
            Core Functions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Social Media Strategy</h3>
              <p className="text-sm text-gray-400">Content calendars, platform management, community engagement</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Content Creation</h3>
              <p className="text-sm text-gray-400">Video, photography, copywriting, graphic design</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Marketing Campaigns</h3>
              <p className="text-sm text-gray-400">Campaign planning, execution, performance tracking</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Brand Management</h3>
              <p className="text-sm text-gray-400">Brand guidelines, voice consistency, visual identity</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Media Production</h3>
              <p className="text-sm text-gray-400">Video editing, podcast production, multimedia assets</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Analytics & Insights</h3>
              <p className="text-sm text-gray-400">Performance metrics, audience insights, optimization</p>
            </div>
          </div>
        </div>

        {/* Venture Coverage */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            Serves All Ventures
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <span className="text-gray-300">Venture 1 - Primary Business</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <span className="text-gray-300">Venture 2 - NimbusTech</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <span className="text-gray-300">Nonprofit - Mission-Driven Content</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <span className="text-gray-300">Webull Portfolio - Investment Updates</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <span className="text-gray-300">City Rentals - Property Marketing</span>
            </div>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">📤</span>
            Operating Model
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Shared Cost Structure</h3>
              <p className="text-sm text-gray-300">
                Costs allocated across all served ventures based on usage and campaign volume.
                Eliminates duplicate creative efforts and maximizes ROI on content investments.
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-pink-300 mb-2">Efficiency Gains</h3>
              <p className="text-sm text-gray-300">
                Centralized approach reduces overhead, improves brand consistency,
                and enables cross-venture collaboration and promotional opportunities.
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
