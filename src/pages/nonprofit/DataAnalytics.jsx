import { Link } from 'react-router-dom';

export default function DataAnalytics() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link to="/nonprofit" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
          ← Back to Nonprofit
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💾</span>
            <h1 className="text-4xl font-bold">Data Analytics (R&D)</h1>
          </div>
          <p className="text-gray-400">Research and data infrastructure supporting all nonprofit initiatives</p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-lg font-semibold text-cyan-400">Active</span>
          </div>
          <p className="text-gray-300 mt-2">Internal research and analytics infrastructure. Not customer-facing.</p>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Program Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            Data Analytics is the internal research and evaluation backbone of the nonprofit. We collect, manage, and analyze data
            across all programs to measure outcomes, inform decision-making, identify best practices, and improve program delivery.
            This is foundational infrastructure supporting all customer-facing programs.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📊</span>
              <h3 className="font-semibold text-cyan-400">Programs Tracked</h3>
            </div>
            <p className="text-3xl font-bold mb-2">6</p>
            <p className="text-sm text-gray-400">Real-time monitoring systems</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💾</span>
              <h3 className="font-semibold text-cyan-400">Data Records</h3>
            </div>
            <p className="text-3xl font-bold mb-2">89K+</p>
            <p className="text-sm text-gray-400">Outcomes and impact data</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔬</span>
              <h3 className="font-semibold text-cyan-400">Research Projects</h3>
            </div>
            <p className="text-3xl font-bold mb-2">4</p>
            <p className="text-sm text-gray-400">Active evaluations</p>
          </div>
        </div>

        {/* Key Activities */}
        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Key Activities</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Data systems design and management for all programs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Outcome measurement and impact evaluation frameworks</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Research studies on program effectiveness and best practices</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Data visualization and reporting for internal and external stakeholders</span>
            </li>
          </ul>
        </div>

        {/* Note */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mt-8">
          <p className="text-sm text-gray-400">
            <span className="text-cyan-400 font-semibold">Internal-facing:</span> This program provides data infrastructure and research support to all other programs. It is not a direct service to beneficiaries or customers.
          </p>
        </div>
      </div>
    </div>
  );
}
