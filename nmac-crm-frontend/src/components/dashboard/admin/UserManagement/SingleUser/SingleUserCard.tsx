import React from 'react';
import { ShieldCheck, CircleCheckBig, Clock } from 'lucide-react';

interface AgentInfoCardsProps {
  role?: string;
  status?: 'active' | 'inactive';
  patientsAssigned?: number;
  totalPatients?: number;
  lastActiveTime?: string;
  lastActiveDate?: string;
}

const AgentInfoCards: React.FC<AgentInfoCardsProps> = ({
  role = 'agent',
  status = 'active',
  patientsAssigned = 45,
  totalPatients = 60,
  lastActiveTime = '2 min ago',
  lastActiveDate = 'October 1, 2024'
}) => {
  const progressPercentage = (patientsAssigned / totalPatients) * 100;

  return (
    <div className="w-full bg-gray-50 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Role Card */}
        <div className="bg-[#E3F2FD] rounded-2xl p-6 flex flex-col border border-gray-200  min-h-[120px]">
          <div className="text-md font-bold text-gray-900 mb-3">Role</div>
          <div className="flex items-center gap-2 pl-3">
            <ShieldCheck size={16} className="text-blue-600" strokeWidth={2} />
            <span className="text-base font-normal text-gray-900">{role}</span>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-[#E8F5E9] rounded-2xl p-6 flex flex-col min-h-[120px] border border-gray-300">
          <div className="text-md  text-gray-900 mb-3 font-bold">Status</div>
          <div className="flex items-center gap-2">
            <CircleCheckBig size={16} className="text-green-600" strokeWidth={2} />
            <span className="text-base font-normal text-gray-900">{status}</span>
          </div>
        </div>

        {/* Patients Assigned Card */}
        <div className="bg-[#F3E5F5] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] border border-gray-300">
          <div className="text-md font-bold text-gray-900 mb-3">Patients Assigned</div>
          <div className="space-y-2">
            <div className="text-3xl font-semibold text-gray-900">{patientsAssigned}</div>
            <div className="relative">
              <div className="w-full bg-purple-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1 text-right">/ {totalPatients}</div>
            </div>
          </div>
        </div>

        {/* Last Active Card */}
        <div className="bg-[#FFE0B2] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] border border-gray-300">
          <div className="text-md font-bold text-gray-900 mb-3">Last Active</div>
          <div className="space-y-1">
            <div className="text-xl font-semibold text-gray-900">{lastActiveTime}</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock size={12} strokeWidth={2} />
              <span>Joined {lastActiveDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const SingleUserCard: React.FC = () => {
  return (
    <div className=" bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
        <p className='text-[#6A7282]'>Agent • Patient Outreach</p>
        
        {/* Default Example */}
        <AgentInfoCards />
      </div>
    </div>
  );
};

export default SingleUserCard;