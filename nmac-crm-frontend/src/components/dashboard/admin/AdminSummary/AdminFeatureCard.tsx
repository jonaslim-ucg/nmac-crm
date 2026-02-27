import { MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminFeatureCard() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 flex items-center justify-center mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
        {/* Template Management Card */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col">
          <div className="mb-5">
            <MessageSquare className="w-11 h-11 text-blue-600 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-normal text-[#1E2939] mb-3">
            Template Management
          </h3>
          <p className="text-sm font-normal text-[#4A5565] leading-relaxed mb-8 grow">
            Create and manage communication templates for WhatsApp and Email
          </p>
          <Link to="/dashboard/admin/manage-template">
            <button
              type="button"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Manage Templates
            </button>
          </Link>
        </div>

        {/* Platform Reports Card */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col">
          <div className="mb-5">
            <BarChart3 className="w-11 h-11 text-purple-600 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-normal text-[#1E2939] mb-3">
            Platform Reports
          </h3>
          <p className="text-sm font-normal text-[#4A5565] leading-relaxed mb-8 grow">
            Comprehensive analytics and insights across the entire platform
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/settings", { state: { activeTab: 'report' } })}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            View Reports
          </button>
        </div>

        {/* Platform Settings Card */}
        <div className="bg-gray-50 rounded-2xl  border border-gray-200 p-4 flex flex-col">
          <div className="mb-5">
            <Settings className="w-11 h-11 text-orange-600 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-normal text-[#1E2939] mb-3">
            Platform Settings
          </h3>
          <p className="text-sm font-normal text-[#4A5565] leading-relaxed mb-8 grow">
            Complete system configuration, ECW integration, and security settings
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/security")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Configure Platform
          </button>
        </div>
      </div>
    </div>
  );
}