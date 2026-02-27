import React from 'react';
import { BarChart3 } from 'lucide-react';

interface MetricCard {
  label: string;
  value: string;
  subtitle: string;
}

interface WeeklyActivityDay {
  day: string;
  calls: number;
  appointments: number;
  maxCalls: number;
  maxAppointments: number;
}

const Performance: React.FC = () => {
  const metricsRow1: MetricCard[] = [
    {
      label: 'Calls Made',
      value: '145',
      subtitle: '+12% from last week'
    },
    {
      label: 'Appointments',
      value: '78',
      subtitle: '+8% from last week'
    },
    {
      label: 'Conversion Rate',
      value: '53.8%',
      subtitle: 'Above target (50%)'
    },
    {
      label: 'Avg Call Time',
      value: '4m 23s',
      subtitle: 'Within target range'
    }
  ];

  const metricsRow2: MetricCard[] = [
    {
      label: 'Messages Sent',
      value: '89',
      subtitle: 'WhatsApp + Email'
    },
    {
      label: 'Response Rate',
      value: '76%',
      subtitle: 'Good engagement'
    },
    {
      label: 'Missed Calls',
      value: '12',
      subtitle: 'Requires follow-up'
    },
    {
      label: 'Follow-ups',
      value: '67',
      subtitle: 'Completed this week'
    }
  ];

  const weeklyActivity: WeeklyActivityDay[] = [
    { day: 'Mon', calls: 25, appointments: 12, maxCalls: 35, maxAppointments: 20 },
    { day: 'Tue', calls: 32, appointments: 15, maxCalls: 35, maxAppointments: 20 },
    { day: 'Wed', calls: 28, appointments: 14, maxCalls: 35, maxAppointments: 20 },
    { day: 'Thu', calls: 30, appointments: 18, maxCalls: 35, maxAppointments: 20 },
    { day: 'Fri', calls: 30, appointments: 19, maxCalls: 35, maxAppointments: 20 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full space-y-6">
        {/* Performance Metrics Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-gray-900" />
            <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
          </div>

          {/* First Row of Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {metricsRow1.map((metric, idx) => (
              <div key={idx} className="bg-white border border-[#1447E64D] rounded-2xl p-5">
                <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-xs text-gray-500">{metric.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Second Row of Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsRow2.map((metric, idx) => (
              <div key={idx} className="bg-white border border-[#1447E64D] rounded-2xl p-5">
                <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-xs text-gray-500">{metric.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h2>

          <div className="space-y-6">
            {weeklyActivity.map((day, idx) => (
              <div key={idx}>
                {/* Day Label and Numbers */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600 w-12">{day.day}</div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-blue-600 font-medium">{day.calls} calls</div>
                    <div className="text-sm text-green-600 font-medium">{day.appointments} appointments</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="flex items-center gap-3">
                  {/* Calls Progress Bar */}
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.calls / day.maxCalls) * 100}%` }}
                      />
                    </div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  </div>

                  {/* Appointments Progress Bar */}
                  <div className="flex-1 flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.appointments / day.maxAppointments) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;