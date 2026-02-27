import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface TimeframeData {
  label: string;
  value: number;
}

interface PatientCard {
  title: string;
  total: number;
  timeframes: TimeframeData[];
  borderColor: string;
  bgColor?: string; // <-- optional now
}

interface PatientFollowUpDashboardProps {
  visitTypeData: any;
}

const borderColors = ['border-blue-400', 'border-[#9C6FFF]', 'border-pink-300', 'border-orange-300'];

const PatientFollowUpDashboard: React.FC<PatientFollowUpDashboardProps> = ({visitTypeData}) => {


   // Transform API data into card format
  const cards: PatientCard[] = visitTypeData?.map((item: any, index: number) => ({
    title: item.visit_type,
    total: item.total_patients,
    timeframes: [
      { label: '3 months', value: item.patients_3m },
      { label: '6 months', value: item.patients_6m },
      { label: '12 months', value: item.patients_12m },
    ],
    borderColor: borderColors[index % borderColors.length],
    bgColor: 'bg-white',
  })) || [];

    const totalPatients = cards.reduce((acc, card) => acc + card.total, 0);

    // if (isVisitTypeLoading) {
    //   return <Spinner />;
    // }
  return (
    <div className="mb-6">
      <div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-700" />
            <h1 className="text-base font-medium text-gray-900">
              Total Patients Due for Follow-Up
            </h1>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            Total: {totalPatients}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor || "bg-white"} border rounded-2xl p-5 transition-all hover:shadow-md border-l-4 ${card.borderColor}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-sm font-medium text-[#4A5565]">
                  {card.title}
                </h2>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>

              {/* Total Count */}
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {card.total}
              </div>

              {/* Timeframes */}
              <div className="space-y-2 mb-5">
                {card.timeframes.map((timeframe, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-md"
                  >
                    <span className="text-gray-600">{timeframe.label}</span>
                    <span className="font-semibold text-[#6A7282]">
                      {timeframe.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* View Patients Button */}
              <button className="w-full text-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border rounded-full border-gray-200 py-2">
                View Patients
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PatientFollowUpDashboard;
