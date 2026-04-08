import React from 'react';
import { Link } from 'react-router-dom';

export default function PropertyManagement() {
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
            <div className="text-5xl">🏠</div>
            <h1 className="text-4xl font-bold">Property Management</h1>
          </div>
          <p className="text-gray-400">Full-service property management for rental and vacation properties</p>
        </div>

        {/* Description Section */}
        <section className="mb-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Property Management provides comprehensive services for residential rental properties and vacation rentals. Our team handles tenant relations, maintenance coordination, rent collection, compliance, and marketing to maximize property returns for owners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-purple-400 mb-2">Services Offered</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Tenant screening & management</li>
                <li>• Rent collection & accounting</li>
                <li>• Maintenance coordination</li>
                <li>• Property marketing</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-purple-400 mb-2">Property Types</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Long-term rentals</li>
                <li>• Short-term/Airbnb</li>
                <li>• Multi-unit buildings</li>
                <li>• Commercial properties</li>
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
          <p className="text-gray-400 mt-2">Managing diverse portfolio of residential and vacation rental properties</p>
        </div>

        {/* Revenue Model */}
        <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Revenue Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-purple-400 font-semibold mb-2">Management Fees</h3>
              <p className="text-sm text-gray-300">8-12% of rent</p>
              <p className="text-xs text-gray-500 mt-2">Monthly management fee</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-purple-400 font-semibold mb-2">Leasing Fees</h3>
              <p className="text-sm text-gray-300">One month rent</p>
              <p className="text-xs text-gray-500 mt-2">Per tenant placement</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-purple-400 font-semibold mb-2">Additional Services</h3>
              <p className="text-sm text-gray-300">À la carte</p>
              <p className="text-xs text-gray-500 mt-2">Repairs, upgrades, renovations</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded text-gray-300">
            <p className="font-semibold mb-2">Key Metrics</p>
            <ul className="text-sm space-y-1">
              <li>Properties Under Management: [TBD]</li>
              <li>Average Property Value: [TBD]</li>
              <li>Total Monthly Managed Rent: [TBD]</li>
              <li>Occupancy Rate: [TBD]%</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
