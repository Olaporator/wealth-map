import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import PlanDashboard from './pages/PlanDashboard';
import AccountsDashboard from './pages/AccountsDashboard';
import HomesteadDashboard from './pages/HomesteadDashboard';
import Venture1Dashboard from './pages/Venture1Dashboard';
import Venture2Dashboard from './pages/Venture2Dashboard';
import NonprofitDashboard from './pages/NonprofitDashboard';
import Venture3Dashboard from './pages/Venture3Dashboard';
import NigeriaDashboard from './pages/NigeriaDashboard';
import OffshoreDashboard from './pages/OffshoreDashboard';

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/accounts', label: 'Accounts & Budget', icon: '🏦', desc: 'Real-time balances, transactions, budgets' },
    { to: '/plan', label: 'Wealth Plan', icon: '🗺️', desc: 'Long-term projections & milestones' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Brand */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Wealth Map
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User/Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400">Demo Mode</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
              AO
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm transition ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/accounts" replace />} />
          <Route path="/accounts" element={<AccountsDashboard />} />
          <Route path="/plan" element={<PlanDashboard />} />
          <Route path="/homestead" element={<HomesteadDashboard />} />
          <Route path="/venture1" element={<Venture1Dashboard />} />
          <Route path="/venture2" element={<Venture2Dashboard />} />
          <Route path="/nonprofit" element={<NonprofitDashboard />} />
          <Route path="/venture3" element={<Venture3Dashboard />} />
          <Route path="/nigeria" element={<NigeriaDashboard />} />
          <Route path="/offshore" element={<OffshoreDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
