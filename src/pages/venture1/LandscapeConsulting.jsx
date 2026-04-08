import React from 'react';
import { Link } from 'react-router-dom';

export default function LandscapeConsulting() {
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
            <div className="text-5xl">🌿</div>
            <h1 className="text-4xl font-bold">Landscape Consulting</h1>
          </div>
          <p className="text-gray-400">Premium consulting services for residential and commercial landscaping projects</p>
        </div>

        {/* Description Section */}
        <section className="mb-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Landscape Consulting provides expert design and planning services for outdoor spaces. Our team offers consultation on landscape design, plant selection, hardscaping, irrigation systems, and project management for both residential and commercial clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-green-400 mb-2">Services</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Design consultation</li>
                <li>• Site assessment</li>
                <li>• Plant recommendations</li>
                <li>• Project management</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-green-400 mb-2">Target Markets</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Residential homeowners</li>
                <li>• Commercial properties</li>
                <li>• Developers</li>
                <li>• Property managers</li>
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
          <p className="text-gray-400 mt-2">Currently operating with established client base and revenue stream</p>
        </div>

        {/* Revenue Model */}
        <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Revenue Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-green-400 font-semibold mb-2">Consultation Fees</h3>
              <p className="text-sm text-gray-300">$150-300/hour</p>
              <p className="text-xs text-gray-500 mt-2">Design consultation and site visits</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-green-400 font-semibold mb-2">Project Management</h3>
              <p className="text-sm text-gray-300">10-15% margin</p>
              <p className="text-xs text-gray-500 mt-2">End-to-end project oversight</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-green-400 font-semibold mb-2">Retainer Clients</h3>
              <p className="text-sm text-gray-300">$2,000-5,000/month</p>
              <p className="text-xs text-gray-500 mt-2">Ongoing maintenance consultation</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded text-gray-300">
            <p className="font-semibold mb-2">Key Metrics</p>
            <ul className="text-sm space-y-1">
              <li>Active Projects: [TBD]</li>
              <li>Average Project Value: [TBD]</li>
              <li>Monthly Recurring Revenue: [TBD]</li>
              <li>YTD Revenue: [TBD]</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
