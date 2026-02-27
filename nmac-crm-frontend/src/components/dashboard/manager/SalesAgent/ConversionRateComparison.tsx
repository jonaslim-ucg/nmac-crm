/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ConversionRateComparison: React.FC<{ agents: any[] }> = ({ agents }) => {
  const chartData = agents.map((agent: any) => ({
    name: agent.name,
    rate: agent.conversion_rate_percent,
  }));

  const getBarColor = (rate: number) => {
    if (rate >= 58) return '#d1f4dd';
    if (rate >= 55) return '#ddf4e8';
    return '#e5e7eb';
  };

  return (
    <div className="mt-6 w-full">
      <div className="bg-white border border-gray-200 rounded-2xl w-full overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-6 sm:mb-8 pl-6 sm:pl-12 pt-6">
          Conversion Rate Comparison
        </h2>

        <div className="w-full h-80 sm:h-[400px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: window.innerWidth < 640 ? 70 : 100,
                  bottom: 10,
                }}
                barSize={32}
                barGap={16}
              >
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#f0f0f0"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  domain={[0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={window.innerWidth < 640 ? 80 : 90}
                />
                <Bar
                  dataKey="rate"
                  radius={[0, 4, 4, 0]}
                  fill="#e5e7eb"
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    const color = getBarColor(payload.rate);
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={color}
                        rx={4}
                        ry={4}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No conversion data to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversionRateComparison;
