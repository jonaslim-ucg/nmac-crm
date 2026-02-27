import { Database, Users } from 'lucide-react';
import AdminSummaryCard from '../../../../components/dashboard/admin/AdminSummary/AdminSummaryCard';
import AdminFeatureCard from '../../../../components/dashboard/admin/AdminSummary/AdminFeatureCard';
import { useGetAdminSummaryQuery } from '../../../../redux/services/dashboard/admin/admin.patient';
// import { useGetAgentPerformanceQuery, useGetUserQuery } from '../../../../redux/services/dashboard/admin/adminUserApi';
// import type { ApiUser } from '../../../../redux/services/dashboard/admin/types/adminUser.type';

const AdminSummary: React.FC = () => {
const { data: cardData } = useGetAdminSummaryQuery();

console.log(cardData);


    const cards = [
        {
            title: 'Total Users',
            value: cardData?.total_user,
            subtitle: '12 Agents, 8 Managers, 4 Admins',
            icon: <Users className="w-6 h-6" />,
            bgColor: 'bg-[#E4F4FF]',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Active Agents',
            value: cardData?.total_active_agent,
            subtitle: 'Currently active in system',
            icon: <Users className="w-6 h-6" />,
            bgColor: 'bg-[#E8F5E9]',
            iconColor: 'text-[#00A63E]',
        },
        {
            title: 'Total Patients',
            value: cardData?.total_patients,
            subtitle: 'In ECW database',
            icon: <Database className="w-6 h-6" />,
            bgColor: 'bg-[#F3E9FF]',
            iconColor: 'text-[#9810FA]',
        },
        // {
        //     title: 'System Uptime',
        //     value: '99.8%',
        //     subtitle: 'Last 30 days',
        //     icon: <Activity className="w-6 h-6" />,
        //     bgColor: 'bg-[#FDE3D9]',
        //     iconColor: 'text-[#F54900]',
        // },
    ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-base text-[#6A7282] font-normal">
                    Complete platform management and system configuration
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <AdminSummaryCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        icon={card.icon}
                        bgColor={card.bgColor}
                        iconColor={card.iconColor}
                    />
                ))}
            </div>

            {/* feature card */}
            <AdminFeatureCard/>
        </div>
    );
};

export default AdminSummary;