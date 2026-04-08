import { Link } from 'react-router-dom';

export default function EducationFellowships() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link to="/nonprofit" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
          ← Back to Nonprofit
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎓</span>
            <h1 className="text-4xl font-bold">Education & Fellowships</h1>
          </div>
          <p className="text-gray-400">Building skilled leadership in agriculture, business, and community development</p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-lg font-semibold text-purple-400">Active</span>
          </div>
          <p className="text-gray-300 mt-2">Supporting next-generation leaders through scholarships, training, and hands-on experience</p>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">Program Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            Education & Fellowships provides scholarships, vocational training, and apprenticeships for underrepresented communities
            interested in agriculture, business, and community development. Our programs combine classroom learning with real-world
            experience, preparing participants for careers in the regenerative economy.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎓</span>
              <h3 className="font-semibold text-purple-400">Scholarships Awarded</h3>
            </div>
            <p className="text-3xl font-bold mb-2">67</p>
            <p className="text-sm text-gray-400">Total students supported</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚡</span>
              <h3 className="font-semibold text-purple-400">Apprenticeships</h3>
            </div>
            <p className="text-3xl font-bold mb-2">34</p>
            <p className="text-sm text-gray-400">Active participants</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📚</span>
              <h3 className="font-semibold text-purple-400">Training Programs</h3>
            </div>
            <p className="text-3xl font-bold mb-2">12</p>
            <p className="text-sm text-gray-400">Offered annually</p>
          </div>
        </div>

        {/* Key Activities */}
        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">Key Activities</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              <span>Merit-based scholarship program with living stipends for students</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              <span>Apprenticeships in sustainable agriculture and regenerative farm management</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              <span>Business and cooperative development training for aspiring entrepreneurs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              <span>Mentorship matching with established professionals in the field</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
