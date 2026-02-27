import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const CallsAppointmentsChart: React.FC<{ agents: any[] }> = ({ agents }) => {
  const chartData = agents.map((agent: any) => ({
    name: agent.name,
    callsMade: agent.total_calls,
    appointmentsBooked: agent.total_booked,
  }));

  const CustomLegend = () => (
    <div className="flex items-center justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className='w-5 h-5 bg-[#d9f0dd]'></div>
        <span className="text-md text-gray-700">Appointments Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className='w-5 h-5 bg-[#bfdbfe]'></div>
        <span className="text-md text-gray-700">Calls Made</span>
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#364153] mb-8">
            Calls Made vs Appointments Booked
          </h2>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                barGap={8}
                barCategoryGap="25%"
              >
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#DBEAFE"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 13 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 13 }}
                  ticks={[0, 40, 80, 120, 160]}
                  dx={-10}
                />
                <Bar
                  dataKey="callsMade"
                  fill="#bfdbfe"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                />
                <Bar
                  dataKey="appointmentsBooked"
                  fill="#d9f0dd"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              No performance data to display.
            </div>
          )}

          <CustomLegend />
        </div>
      </div>
    </div>
  );
};

export default CallsAppointmentsChart;