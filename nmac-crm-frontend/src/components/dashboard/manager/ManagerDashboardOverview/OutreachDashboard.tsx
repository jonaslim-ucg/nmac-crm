import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';


interface OutreachDay {
  day_name: string;
  PHONE: number;
  WHATSAPP: number;
  EMAIL: number;
}

interface OutreachDashboardProps {
  callsOutreachData: any;
  bookingData: any;
}


const OutreachDashboard: React.FC<OutreachDashboardProps> = ({callsOutreachData, bookingData}) => {



const dailyData = callsOutreachData?.last_7_days
  ?.slice() 
  .reverse()
  .map((day: OutreachDay) => ({
    day: day.day_name,
    calls: day.PHONE,
    whatsapp: day.WHATSAPP,
    emails: day.EMAIL,
  })) || [];

  const weeklyData = bookingData?.last_7_days?.map(
  (week: {
    date: string;
    day_name: string;
    total_contacts: number;
    CONTACTED: number;
    BOOKED: number;
  }, index: number) => ({
    week: `Week ${index + 1}`,
    contacted: week.CONTACTED,
    booked: week.BOOKED,
    rate: week.CONTACTED === 0 ? 0 : Math.round((week.BOOKED / week.CONTACTED) * 100),
  })
) || [];


  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 mt-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Outreach Efforts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Outreach Efforts (This Week)</h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="text-center border rounded-2xl border-[#E4F4FF] py-3 px-12">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full  flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{callsOutreachData?.total_calls}</div>
              <div className="text-sm text-gray-500">Total Calls</div>
            </div>

            <div className="text-center border rounded-2xl border-[#E4F4FF] py-3 px-12">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{callsOutreachData?.WHATSAPP}</div>
              <div className="text-sm text-gray-500">WhatsApp</div>
            </div>

            <div className="text-center border rounded-2xl border-[#E4F4FF] py-3 px-12">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full  flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{callsOutreachData?.EMAIL}</div>
              <div className="text-sm text-gray-500">Emails</div>
            </div>
          </div>

          {/* Daily Breakdown Chart */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Daily Breakdown</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9C6FFF99" stopOpacity={1} />
                    <stop offset="95%" stopColor="#9C6FFF99" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E99" stopOpacity={1} />
                    <stop offset="95%" stopColor="#22C55E99" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#526FFF" stopOpacity={1} />
                    <stop offset="95%" stopColor="#526FFF" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  ticks={[0, 40, 80, 120, 160]}
                />
                <Area
                  type="monotone"
                  dataKey="emails"
                  stackId="1"
                  stroke="#a78bfa"
                  fill="url(#colorEmails)"
                  strokeWidth={0}
                />
                <Area
                  type="monotone"
                  dataKey="whatsapp"
                  stackId="1"
                  stroke="#4ade80"
                  fill="url(#colorWhatsapp)"
                  strokeWidth={0}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stackId="1"
                  stroke="#60a5fa"
                  fill="url(#colorCalls)"
                  strokeWidth={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card - Bookings & Conversion Rates */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Bookings & Conversion Rates</h2>
          </div>
          {
            !bookingData ? (
              <p>No booking data available.</p>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="text-center border rounded-2xl border-[#E4F4FF] py-3 px-12">
                    <div className="text-sm text-gray-500 mb-2">Contacted</div>
                    <div className="text-3xl font-bold text-gray-900">{bookingData?.CONTACTED}</div>
                  </div>

                  <div className="text-center border rounded-2xl border-[#E4F4FF] py-3 px-12">
                    <div className="text-sm text-gray-500 mb-2">Booked</div>
                    <div className="text-3xl font-bold text-gray-900">{bookingData?.BOOKED}</div>
                  </div>

                  <div className="text-center border rounded-2xl border-[#FDE3D9] py-3 px-6 sm:px-8 lg:px-12">
                    <div className="text-sm text-gray-500 mb-2">Conversion</div>
                    <div className="text-3xl font-bold text-gray-900">{bookingData?.CONTACTED === 0 ? 0 : Math.round((bookingData?.BOOKED / bookingData?.CONTACTED) * 100)}%</div>
                  </div>

                </div>

                {/* Weekly Conversion Trend */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Weekly Conversion Trend</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                      <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        ticks={[0, 40, 80, 120, 160]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        ticks={[0, 15, 30, 45, 60]}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="booked"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="contacted"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="rate"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        dot={{ fill: '#ef4444', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-lg text-[#22C55E]">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-lg text-[#526FFF]">Contacted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-lg text-[#FF6B6B]">Rate %</span>
                    </div>
                  </div>
                </div>
              </>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default OutreachDashboard;