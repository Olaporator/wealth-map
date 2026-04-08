import { Link } from 'react-router-dom';

export default function PolicyAdvocacy() {
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
      </div>
    </div>
  );
}
