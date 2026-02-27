import React from 'react';
import { Users, UserCheck, CheckCircle, TrendingUp } from 'lucide-react';
import SummaryCard from '../../../../components/dashboard/agent/Summary/SummaryCard';
import Charts from '../../../../components/dashboard/agent/Summary/Charts';
import CallBacks from '../../../../components/dashboard/agent/Summary/CallBacks';
import Spinner from '../../../../components/Spinner';
import { useGetNonBookingSummaryQuery, useGetPatientSummaryQuery } from '../../../../redux/services/dashboard/manager/manager.api';
import { useGetAllCallsQuery } from '../../../../redux/services/dashboard/manager/callLog.api';

const Summary: React.FC = () => {
  const { data: patientSummaryData, isLoading: isPatientSummaryLoading } = useGetPatientSummaryQuery();
     const { data: callLogsData, isLoading: isCallHistoryLoading } = useGetAllCallsQuery();
      console.log(callLogsData);
      

  console.log(patientSummaryData)
  // Fallbacks
  const contactedPatients = patientSummaryData?.contacted_patients ?? 0;
  const bookedAppointments = patientSummaryData?.booked_appointments ?? 0;
  const assignedPatients = patientSummaryData?.assigned_patients ?? 0;
  const {data:NonBookingReasons, isLoading: isNonBookingLoading} = useGetNonBookingSummaryQuery();
    console.log(NonBookingReasons);
    if ( isNonBookingLoading ) return <Spinner />;
  const cards = [
    {
      title: 'Patients Assigned',
      value: assignedPatients,
      subtitle: '',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-[#E4F4FF]',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Patients Contacted',
      value: contactedPatients,
      subtitle: 'Calls, WhatsApp, Emails',
      icon: <UserCheck className="w-6 h-6" />,
      bgColor: 'bg-[#FDE3D9]',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Appointments Booked',
      value: bookedAppointments,
      subtitle: '',
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-[#E8F5E9]',
      iconColor: 'text-green-500',
    },
    {
      title: 'Conversion Rate',
      value: bookedAppointments && contactedPatients
        ? `${((bookedAppointments / contactedPatients) * 100).toFixed(2)}%`
        : '0%',
      subtitle: `${bookedAppointments} booked ÷ ${contactedPatients} contacted`,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-[#F3E9FF]',
      iconColor: 'text-purple-500',
    },
  ];

  if(isPatientSummaryLoading || isCallHistoryLoading) return <Spinner />

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Agent Dashboard
        </h1>
        <p className="text-base text-[#6A7282] font-normal">
          Welcome back! Here's your personal performance overview.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            bgColor={card.bgColor}
            iconColor={card.iconColor}
          />
        ))}
      </div>
      {/* charts */}
      <Charts nonBookingReasons={NonBookingReasons}/>

      {/* call backs */}
      <CallBacks callHistory={callLogsData}/>
    </div>
  );
};

export default Summary;