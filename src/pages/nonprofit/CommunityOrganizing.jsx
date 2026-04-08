import { Link } from 'react-router-dom';

export default function CommunityOrganizing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link to="/nonprofit" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
          ← Back to Nonprofit
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👥</span>
            <h1 className="text-4xl font-bold">Community Organizing</h1>
          </div>
          <p className="text-gray-400">Strengthening local capacity for climate resilience and economic justice</p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 border border-blue-500 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-lg font-semibold text-blue-400">Active</span>
          </div>
          <p className="text-gray-300 mt-2">Building community leadership and collective action for climate adaptation and food sovereignty</p>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Program Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            Community Organizing empowers local residents to lead climate adaptation and food sovereignty initiatives. We facilitate
            grassroots leadership development, build networks for collective action, and support wealth-building through cooperative
            models and asset development strategies tailored to community needs.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👥</span>
              <h3 className="font-semibold text-blue-400">Community Members Engaged</h3>
            </div>
            <p className="text-3xl font-bold mb-2">342</p>
            <p className="text-sm text-gray-400">In organizing initiatives</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎯</span>
              <h3 className="font-semibold text-blue-400">Community Groups</h3>
            </div>
            <p className="text-3xl font-bold mb-2">18</p>
            <p className="text-sm text-gray-400">Active neighborhood associations</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="font-semibold text-blue-400">Community Campaigns</h3>
            </div>
            <p className="text-3xl font-bold mb-2">6</p>
            <p className="text-sm text-gray-400">Led by community leaders</p>
          </div>
        </div>

        {/* Key Activities */}
        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Key Activities</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>Leadership development workshops and training for community organizers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>Grassroots campaigns for local food systems and climate justice</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>Cooperative model development for community wealth-building</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>Asset mapping and community resource development strategies</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
