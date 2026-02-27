import React from 'react';
import { Activity, Phone, MessageSquare } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: 'login' | 'call' | 'message';
  title: string;
  subtitle: string;
  time: string;
  tag: string;
}

const ActivityLog: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      icon: 'login',
      title: 'Logged in to system',
      subtitle: 'IP 192.168.1.100',
      time: '2 min ago',
      tag: 'login'
    },
    {
      id: '2',
      icon: 'call',
      title: 'Called patient Sarah Johnson',
      subtitle: 'Duration: 5m 12s - Appointment booked',
      time: '15 min ago',
      tag: 'call'
    },
    {
      id: '3',
      icon: 'message',
      title: 'Sent WhatsApp message to Michael Chen',
      subtitle: '3-month recall reminder',
      time: '32 min ago',
      tag: 'message'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Activity className="w-5 h-5" />;
      case 'call':
        return <Phone className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 pb-5">
          {/* Header */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity Log</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Last 8 actions performed by this user</p>
          </div>

          {/* Activity List */}
          <div className=" px-6">
            {activities.map((activity) => (
              <div key={activity.id} className=" py-5 hover:bg-gray-50 rounded-2xl transition-colors bg-gray-50 mb-3 p-4 mt-3">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    <div className="text-gray-600 bg-white p-2 rounded-2xl">
                      {getIcon(activity.icon)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-medium text-gray-900 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 mb-2.5">
                      {activity.subtitle}
                    </p>
                    <span className="inline-block px-2.5 py-0.5  text-gray-700 text-xs font-medium border border-gray-200 rounded-full">
                      {activity.tag}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="shrink-0 text-right">
                    <span className="text-[13px] text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
         <div className='px-6'>
           <div className="px-6 border-gray-200 border rounded-full">
            <button className="w-full py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              Load More Activity
            </button>
          </div>
         </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;