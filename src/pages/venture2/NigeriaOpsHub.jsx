import React from 'react';
import { Link } from 'react-router-dom';

export default function NigeriaOpsHub() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/venture2" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <span>←</span>
          Back to Venture 2
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-900 rounded-lg">
            <span className="text-3xl">🌍</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Nigeria Ops Hub</h1>
            <p className="text-gray-400 mt-1">V2 Subsidiary via EOR</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            A V2 subsidiary providing centralized back-office operations for all ventures.
            Handles HR, Accounting, Taxes, Logistics, and DevOps across the portfolio.
            Connected to NimbusTech S-Corp via Employer of Record (EOR) arrangement in Nigeria.
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

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Location</p>
                <p className="text-2xl font-bold mt-1">Nigeria</p>
              </div>
              <span className="text-3xl">🌍</span>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">💼</span>
            Core Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-purple-300 mb-2">Human Resources</h3>
              <p className="text-sm text-gray-400">Recruitment, payroll, benefits, compliance</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-purple-300 mb-2">Accounting</h3>
              <p className="text-sm text-gray-400">Financial statements, bookkeeping, reconciliation</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-purple-300 mb-2">Taxes</h3>
              <p className="text-sm text-gray-400">Tax planning, filings, compliance</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-purple-300 mb-2">Logistics</h3>
              <p className="text-sm text-gray-400">Supply chain, inventory, distribution</p>
            </div>
            <div className="bg-gray-800 rounded p-4 md:col-span-2">
              <h3 className="font-semibold text-purple-300 mb-2">DevOps & Infrastructure</h3>
              <p className="text-sm text-gray-400">IT infrastructure, systems, security, support</p>
            </div>
          </div>
        </div>

        {/* Employee Structure */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">👥</span>
            Compensation Model
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Starting Salary</span>
                <span className="text-purple-400 font-bold">$5,000/yr</span>
              </div>
              <p className="text-gray-400 text-sm">Entry-level employee compensation</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Annual Raise Structure</span>
                <span className="text-purple-400 font-bold">10%/yr</span>
              </div>
              <p className="text-gray-400 text-sm">Consistent merit-based annual increases</p>
            </div>
          </div>
        </div>

        {/* Billing Model */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">💰</span>
            Service Billing
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">V1 (Venture 1)</span>
              <span className="font-semibold text-purple-400">30%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">V2 (Venture 2)</span>
              <span className="font-semibold text-purple-400">40%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-300">Nonprofit</span>
              <span className="font-semibold text-purple-400">30%</span>
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">Cost allocation based on operational usage across ventures</p>
          </div>
        </div>
      </div>
    </div>
  );
}
