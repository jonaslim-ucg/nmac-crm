import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Users, Calendar } from 'lucide-react';
import Performance from './Performance';
import Permissions from './Permissions';
import ActivityLog from './ActivityLog';

import { useLocation, useNavigate } from 'react-router-dom';

type TabType = 'Overview' | 'Performance' | 'Permissions' | 'Activity Log';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

interface EmploymentDetails {
  employeeId: string;
  department: string;
  reportsTo: string;
  dateJoined: string;
}

const UserTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
 const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user; // 👈 get user from state

  useEffect(() => {
    if (!user) {
      // redirect back if no user data
      navigate('/dashboard/admin/user-management');
    }
  }, [user, navigate]);
    console.log(user);
  
  const tabs: TabType[] = ['Overview', 'Performance', 'Permissions', 'Activity Log'];

  const personalInfo: PersonalInfo = {
    fullName: user?.name || "-",
    email: user?.email,
    phone: user?.phone,
    location: user?.address || "-"
  };

  const employmentDetails: EmploymentDetails = {
    employeeId: user?.id,
    department:user?.department || "-",
    reportsTo: user?.report_to_name || "-",
    dateJoined: user?.created_at
      ? new Date(user?.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '-'
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6 ">
          <User size={20} className="text-gray-900" />
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        </div>

        <div className="space-y-5">
          {/* Full Name */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5 ">
              <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                <User size={18} className="text-gray-400 " />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Full Name</div>
              <div className="text-base text-gray-900">{personalInfo.fullName}</div>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
             <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                 <Mail size={18} className="text-gray-400" />
             </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Email Address</div>
              <div className="text-base text-gray-900">{personalInfo.email}</div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                <Phone size={18} className="text-gray-400" />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Phone Number</div>
              <div className="text-base text-gray-900">{personalInfo.phone}</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                <MapPin size={18} className="text-gray-400" />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Location</div>
              <div className="text-base text-gray-900">{personalInfo.location}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Employment Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={20} className="text-gray-900" />
          <h2 className="text-lg font-semibold text-gray-900">Employment Details</h2>
        </div>

        <div className="space-y-5">
          {/* Employee ID */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                <Shield size={18} className="text-gray-400" />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Employee ID</div>
              <div className="text-base text-gray-900">{employmentDetails.employeeId}</div>
            </div>
          </div>

          {/* Department */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                <Users size={18} className="text-gray-400" />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Department</div>
              <div className="text-base text-gray-900">{employmentDetails.department}</div>
            </div>
          </div>

          {/* Reports To */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                <Users size={18} className="text-gray-400" />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Reports To</div>
              <div className="text-base text-gray-900">{employmentDetails.reportsTo}</div>
            </div>
          </div>

          {/* Date Joined */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
             <div className='bg-[#F3F4F6] p-2.5 rounded-xl'>
                 <Calendar size={18} className="text-gray-400" />
             </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Date Joined</div>
              <div className="text-base text-gray-900">{employmentDetails.dateJoined}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <Performance/>
  );

  const renderPermissions = () => (
   <Permissions/>
  );

  const renderActivityLog = () => (
   <ActivityLog/>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverview();
      case 'Performance':
        return renderPerformance();
      case 'Permissions':
        return renderPermissions();
      case 'Activity Log':
        return renderActivityLog();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-gray-50 mt-6">
      <div className="w-full">
        {/* Tabs */}
        <div className="w-full overflow-x-auto no-scrollbar mb-6">
          <div className="inline-flex gap-2 bg-gray-200 px-0.5 py-0.5 rounded-3xl flex-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-md font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'bg-transparent text-gray-600 hover:bg-white/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserTab;