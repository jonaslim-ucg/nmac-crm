import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
interface ManagerAnalyticsProps {
    outCome?: {
        already_scheduled: number;
        call_back_later: number;
        no_answer: number;
        declined: number;
    };
}

const lineData = [
    { week: 'Week 1', value1: 210, value2: 120, value3: 65 },
    { week: 'Week 2', value1: 230, value2: 150, value3: 85 },
    { week: 'Week 3', value1: 220, value2: 140, value3: 75 },
    { week: 'Week 4', value1: 250, value2: 160, value3: 95 },
];


export default function ManagerAnalytics({outCome}: ManagerAnalyticsProps) {
    const pieData = [
  { name: 'Booked', value: outCome?.already_scheduled ?? 0, color: '#10b981' },
  { name: 'Callback', value: outCome?.call_back_later ?? 0, color: '#3b82f6' },
  { name: 'No Answer', value: outCome?.no_answer ?? 0, color: '#f59e0b' },
  { name: 'Declined', value: outCome?.declined ?? 0, color: '#ef4444' },
];

const total =
  (outCome?.already_scheduled ?? 0) +
  (outCome?.call_back_later ?? 0) +
  (outCome?.no_answer ?? 0) +
  (outCome?.declined ?? 0);

const getPercent = (value: number) =>
  total ? ((value / total) * 100).toFixed(1) : 0;

console.log('Outcome data:', outCome);
    return (
        <div className="bg-gray-50 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Monthly Trends Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <h2 className="text-lg font-normal text-gray-900 mb-6">
                        Monthly Trends
                    </h2>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={lineData}
                                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                    vertical={true}
                                    horizontal={true}
                                />
                                <XAxis
                                    dataKey="week"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 13 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 13 }}
                                    ticks={[0, 60, 120, 180, 240]}
                                    domain={[0, 240]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value1"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value2"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value3"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    dot={{ fill: '#a855f7', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Call Outcomes Distribution Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <h2 className="text-lg font-normal text-gray-900 mb-6">
                        Call Outcomes Distribution
                    </h2>
                    <div className="w-full h-[300px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={110}
                                    paddingAngle={0}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={450}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Labels */}
                        <div className="absolute top-2 right-32 text-sm font-normal text-emerald-500">
                            Booked: {getPercent(outCome?.already_scheduled ?? 0)}%
                        </div>
                        <div className="absolute left-4 top-[60%] -translate-y-2 text-sm font-normal text-blue-500">
                            Callback: {getPercent(outCome?.call_back_later ?? 0)}%
                        </div>
                        <div className="absolute bottom-3 right-[20%] translate-x-8 text-sm font-normal text-amber-500">
                            No Answer: {getPercent(outCome?.no_answer ?? 0)}%
                        </div>
                        <div className="absolute top-1/3 right-4 text-sm font-normal text-red-500">
                            Declined: {getPercent(outCome?.declined ?? 0)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}