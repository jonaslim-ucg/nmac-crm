import React from 'react';
import SummaryCard from './SummaryCard';
import { File, House, UserCheck, Users } from 'lucide-react';

const SummaryCards: React.FC = () => {

  const cards = [
    {
      icon: <House size={25} strokeWidth={2} />,
      title: 'Dashboard',
      subtitle: 'Overview',
      bgColor: 'bg-blue-100',
      iconColor: 'text-[#155DFC]'
    },
    {
      icon: <File size={25} strokeWidth={2} />,
      title: 'Reports',
      subtitle: 'Generate',
      bgColor: 'bg-purple-100',
      iconColor: 'text-[#9810FA]'
    },
    {
      icon: <UserCheck size={25} strokeWidth={2} />,
      title: 'Sales Agents',
      subtitle: 'Performance',
      bgColor: 'bg-green-100',
      iconColor: 'text-[#00A63E]'
    },
    {
      icon: <Users size={25} strokeWidth={2} />,
      title: 'Patients',
      subtitle: 'Statistics',
      bgColor: 'bg-orange-100',
      iconColor: 'text-[#F54900]'
    }
  ];

  return (
    <div className="w-full bg-gray-50 flex  justify-center">
      <div className="w-full">

            <h2 className="text-2xl font-semibold text-[#171C35] mb-2">
              Manager Dashboard
            </h2>
            <span className='text-[#6A7282]'>Overview of team performance, patient statistics, and data insights</span>
    

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
          {cards.map((card, index) => (
            <SummaryCard
              key={index}
              icon={card.icon}
              title={card.title}
              subtitle={card.subtitle}
              bgColor={card.bgColor}
              iconColor={card.iconColor}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SummaryCards;