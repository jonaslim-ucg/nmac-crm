import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function AgentPerformanceChart({ agents = [] }: { agents?: any[] }) {
  const chartData = agents.map((agent: any) => ({
    name: agent.name,
    value1: agent.total_calls,
    value2: agent.total_booked,
  }));

  return (
    <div className="bg-gray-50 mt-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
        <h2 className="text-lg font-normal text-gray-900 mb-8">
          Agent Performance Comparison
        </h2>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              barGap={8}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
                horizontal={true}
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
                domain={[0, 160]}
              />
              <Bar
                dataKey="value1"
                fill="#dbeafe"
                radius={[6, 6, 0, 0]}
                maxBarSize={80}
              />
              <Bar
                dataKey="value2"
                fill="#ede9fe"
                radius={[6, 6, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}