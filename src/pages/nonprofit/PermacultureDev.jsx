import { Link } from 'react-router-dom';

export default function PermacultureDev() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link to="/nonprofit" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">
          ← Back to Nonprofit
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌱</span>
            <h1 className="text-4xl font-bold">Permaculture Development</h1>
          </div>
          <p className="text-gray-400">Building regenerative food systems on Opportunity Zone land</p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 border border-emerald-500 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-lg font-semibold text-emerald-400">Active</span>
          </div>
          <p className="text-gray-300 mt-2">Currently establishing food forests and training farmers in regenerative practices</p>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Program Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            Permaculture Development focuses on creating sustainable food production systems on QOZ land. We establish food forests,
            implement regenerative agriculture practices, and train local farmers to steward the land while building food sovereignty.
            We also distribute high-quality seeds adapted to our local climate and soil conditions.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌱</span>
              <h3 className="font-semibold text-emerald-400">Food Forests Established</h3>
            </div>
            <p className="text-3xl font-bold mb-2">12</p>
            <p className="text-sm text-gray-400">Across 45 acres of QOZ land</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👥</span>
              <h3 className="font-semibold text-emerald-400">Farmers Trained</h3>
            </div>
            <p className="text-3xl font-bold mb-2">89</p>
            <p className="text-sm text-gray-400">In regenerative agriculture</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📈</span>
              <h3 className="font-semibold text-emerald-400">Seeds Distributed</h3>
            </div>
            <p className="text-3xl font-bold mb-2">15K+</p>
            <p className="text-sm text-gray-400">Varieties adapted to region</p>
          </div>
        </div>

        {/* Key Activities */}
        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Key Activities</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Food forest design and establishment on available QOZ parcels</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Hands-on training workshops in permaculture principles and practices</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Seed library and distribution network for regional varieties</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">•</span>
              <span>Soil health and regenerative agriculture certification support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
