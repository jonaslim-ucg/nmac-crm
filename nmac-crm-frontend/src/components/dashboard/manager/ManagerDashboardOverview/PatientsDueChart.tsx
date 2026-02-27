import React from 'react';


interface ChartData {
  category: string;
  threeMonths: number;
  sixMonths: number;
  twelveMonths: number;
}

interface PatientsDueChartProps {
  visitTypeData: any;
}

const PatientsDueChart: React.FC<PatientsDueChartProps> = ({visitTypeData}) => {


  const data: ChartData[] = visitTypeData?.map((item: any) => ({
    category: item.visit_type,
    threeMonths: item.patients_3m,
    sixMonths: item.patients_6m,
    twelveMonths: item.patients_12m,
  })) || [];

  const chartMax = 360;
  const yAxisLabels = [360, 270, 180, 90, 0];

  return (
    <div className="w-full bg-gray-50 p-6 sm:p-8 border border-gray-200 rounded-3xl">
      <h2 className="text-base font-medium text-gray-900 mb-8">
        Patients Due by Time Period
      </h2>

      <div className="relative">
        <div className="flex items-end gap-0 relative">
          {/* Y-Axis */}
          <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-500 pr-3">
            {yAxisLabels.map((label, idx) => (
              <div key={idx} className="text-right" style={{ lineHeight: '1' }}>
                {label}
              </div>
            ))}
          </div>

          {/* Grid Lines */}
          <div className="absolute left-12 right-0 top-0 bottom-12 flex flex-col justify-between pointer-events-none">
            {yAxisLabels.slice(0, -1).map((_, idx) => (
              <div key={idx} className="w-full border-t border-gray-200" />
            ))}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-around w-full pl-12 gap-4 sm:gap-8 md:gap-12 lg:gap-16">
            {data.map((item, index) => {
              const total = item.threeMonths + item.sixMonths + item.twelveMonths;
              const heightPercentage = (total / chartMax) * 100;

              const threeMonthsHeight = (item.threeMonths / total) * 100;
              const sixMonthsHeight = (item.sixMonths / total) * 100;
              const twelveMonthsHeight = (item.twelveMonths / total) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center max-w-50">
                  <div
                    className="w-full rounded-t-lg overflow-hidden relative"
                    style={{ height: '300px' }}
                  >
                    <div
                      className="w-full absolute bottom-0 left-0 right-0 flex flex-col"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      <div className="w-full bg-[#FDE3D9]" style={{ height: `${twelveMonthsHeight}%` }} />
                      <div className="w-full bg-[#F3E9FF]" style={{ height: `${sixMonthsHeight}%` }} />
                      <div className="w-full bg-[#E4F4FF]" style={{ height: `${threeMonthsHeight}%` }} />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600 text-center leading-tight">
                    {item.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#FDE3D9]" />
          <span className="text-sm text-gray-900">12 Months</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#F3E9FF]" />
          <span className="text-sm text-gray-900">6 Months</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#E4F4FF]" />
          <span className="text-sm text-gray-900">3 Months</span>
        </div>
      </div>
    </div>
  );
};

export default PatientsDueChart;
