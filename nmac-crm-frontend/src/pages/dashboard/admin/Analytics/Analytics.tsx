import React from 'react';
import { useGetUserQuery } from '../../../../redux/services/dashboard/admin/adminUserApi';
import Spinner from '../../../../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

interface Agent {
    name: string;
    patientsAssigned: number;
    isActive: boolean;
}

interface Manager {
    name: string;
    lastActive: string;
    isActive: boolean;
}

const Analytics: React.FC = () => {
    const navigate = useNavigate();
    const { data: allUserdata, isLoading: isUserLoading } = useGetUserQuery();
    console.log(allUserdata);

    const agents: Agent[] = allUserdata?.results?.filter((user: any) => user.role === 'AGENT').map((user: any) => ({
        name: user.name,
        patientsAssigned: user.patient_assigned || 0,
        isActive: user.is_active
    })) || [];

    const managers: Manager[] = allUserdata?.results?.filter((user: any) => user.role === 'MANAGER').map((user: any) => ({
        name: user.name,
        lastActive: 'Active recently',
        isActive: user.is_active
    })) || [];

    if (isUserLoading) return <Spinner />

    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
                            Platform Analytics
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500">
                            Monitor overall system performance and user activity
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/admin/settings', { state: { activeTab: 'report' } })}
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2.5 text-sm font-medium transition-all shadow-sm"
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>View Reports</span>
                    </button>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Agent Performance Section */}
                    <div className="bg-[#f0f4ff] rounded-2xl p-4 sm:p-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Agent Performance
                        </h2>
                        <div className="space-y-4">
                            {agents.map((agent, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-3xl p-3 sm:p-3 flex items-center justify-between shadow-sm"
                                >
                                    <div>
                                        <div className="text-base font-medium text-gray-900 mb-1">
                                            {agent.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {agent.patientsAssigned} patients assigned
                                        </div>
                                    </div>
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-xs font-medium ${agent.isActive
                                            ? 'bg-[#d4f4dd] text-[#0d7d2d]'
                                            : 'bg-[#ffd4d4] text-[#d32f2f]'
                                            }`}
                                    >
                                        {agent.isActive ? 'active' : 'inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Manager Oversight Section */}
                    <div className="bg-[#FAF5FF] rounded-2xl p-4 sm:p-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Manager Oversight
                        </h2>
                        <div className="space-y-4">
                            {managers.map((manager, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-3xl p-3 sm:p-3 flex items-center justify-between shadow-sm"
                                >
                                    <div>
                                        <div className="text-base font-medium text-gray-900 mb-1">
                                            {manager.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Last active: {manager.lastActive}
                                        </div>
                                    </div>
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-xs font-medium ${manager.isActive
                                            ? 'bg-[#d4f4dd] text-[#0d7d2d]'
                                            : 'bg-[#ffd4d4] text-[#d32f2f]'
                                            }`}
                                    >
                                        {manager.isActive ? 'active' : 'inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;