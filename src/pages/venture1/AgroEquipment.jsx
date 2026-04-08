import React from 'react';
import { Link } from 'react-router-dom';

export default function AgroEquipment() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/venture1"
          className="text-blue-400 hover:text-blue-300 mb-8 inline-flex items-center gap-2 text-lg"
        >
          ← Back to Venture 1
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
      </div>
    </div>
  );
}
