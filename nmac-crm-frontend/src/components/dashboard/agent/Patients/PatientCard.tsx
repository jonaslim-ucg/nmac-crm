import React from 'react';
import { Users } from 'lucide-react';

interface PatientCardProps {
  title: string;
  count: number;
  bgColor: string;
  iconColor: string;
}

const PatientCard: React.FC<PatientCardProps> = ({ title, count, bgColor, iconColor }) => {
  return (
    <div className={`${bgColor} rounded-3xl p-6 flex flex-col h-full  border-gray-200 border`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <Users className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
      </div>

      {/* Count */}
      <div>
        <p className="text-4xl font-semibold text-gray-900">{count}</p>
      </div>
    </div>
  );
};

export default PatientCard;

