/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';


interface ChartsProps {
    nonBookingReasons: any;
}

const Charts: React.FC<ChartsProps> = ({nonBookingReasons}) => {
const data = [
  { name: 'No Answer', value: nonBookingReasons?.no_answer ?? 0, color: '#3B82F6' },
  { name: 'Declined', value: nonBookingReasons?.declined ?? 0, color: '#EF4444' },
  { name: 'Wrong Number', value: nonBookingReasons?.wrong_number ?? 0, color: '#6B7280' },
  { name: 'Call Back Later', value: nonBookingReasons?.call_back_later ?? 0, color: '#F59E0B' },
  { name: 'Already Scheduled', value: nonBookingReasons?.already_scheduled ?? 0, color: '#10B981' },
  { name: 'Not Interested', value: nonBookingReasons?.not_interested ?? 0, color: '#8B5CF6' },
].filter(item => item.value > 0);

if (!data.length) {
  return (
    <div className="bg-white rounded-2xl  p-6 mt-8 text-center text-gray-500">
      No non-booking data available
    </div>
  );
}



    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 mt-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Common Reasons for Non-Booking
                </h2>
                <p className="text-sm text-gray-600">
                    Understanding why patients don't book helps improve conversion rates
                </p>
            </div>

            {/* Chart and Legend Container */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                {/* Pie Chart */}
                <div className="w-full lg:w-auto flex-2 justify-center lg:justify-start">
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 mx-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    dataKey="value"
                                    nameKey="name"
                                    >
                                    {data.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Labels on chart - Hidden on mobile, visible on large screens */}

                        <div className="hidden lg:block absolute top-20 -right-36  -translate-x-1/2 text-sm text-blue-600 font-normal">
                            No Answer: {nonBookingReasons?.no_answer || 0}%
                        </div>
                        <div className="hidden lg:block absolute top-0 left-0  text-sm text-red-600 font-normal">
                            Declined: {nonBookingReasons?.declined || 0}%
                        </div>                            
                        <div className="hidden lg:block absolute bottom-30 -left-30 text-sm text-amber-600 font-normal">
                            Call Back Later: {nonBookingReasons?.call_back_later || 0}%
                        </div>
                        <div className="hidden lg:block absolute bottom-4 -right-16 text-sm text-green-600 font-normal">
                            Already Scheduled: {nonBookingReasons?.already_scheduled || 0}%
                        </div>
                        <div className="hidden lg:block absolute bottom-30 -right-30 text-sm text-purple-600 font-normal">
                            Not Interested: {nonBookingReasons?.not_interested || 0}%
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4 w-full lg:w-auto">
                    {data.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-[#F9FAFB] rounded-full px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-base text-gray-900">{item.name}</span>
                            </div>
                            <span className="text-base text-gray-900 font-normal">
                                {item.value}%

                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Charts;