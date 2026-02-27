import { useState } from 'react';
import GenerateReports from '../../../../components/dashboard/manager/GenerateReports/GenerateReports';
import ManagerDashboardOverview from '../../../../components/dashboard/manager/ManagerDashboardOverview/ManagerDashboardOverview';
import PatientStatistics from '../../../../components/dashboard/manager/PatientStatistics/PatientStatistics';
import SalesAgent from '../../../../components/dashboard/manager/SalesAgent/SalesAgent';
import SummaryCards from '../../../../components/dashboard/manager/Summary/SummaryCards';

const ManagerSummary = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof tabsData>('Dashboard Overview');

  const tabsData = {
    'Dashboard Overview': {
      title: 'Dashboard Overview',
      content: (
        <ManagerDashboardOverview />
      )
    },
    'Sales Agents': {
      title: 'Sales Agents',
      content: (
        <SalesAgent />
      )
    },
    'Patient Statistics': {
      title: 'Patient Statistics',
      content: (
        <PatientStatistics />
      )
    },
    'Reports': {
      title: 'Reports',
      content: (
        <GenerateReports />
      )
    }
  };

  const navItems = Object.keys(tabsData);

  return (
    <div>
      <SummaryCards />
      <div className="w-full overflow-x-auto no-scrollbar mt-8">
        <div className="flex justify-between mb-3 bg-gray-200 px-0.5 py-0.5 rounded-3xl w-full">
          {navItems.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as keyof typeof tabsData)}
              className={`px-6 py-2.5 rounded-full text-md font-medium whitespace-nowrap transition-colors ${activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-600 hover:bg-white/50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>


      {/* Display Tab Content */}
      <div className="mt-4">
        {tabsData[activeTab].content}
      </div>
    </div>
  )
}

export default ManagerSummary

