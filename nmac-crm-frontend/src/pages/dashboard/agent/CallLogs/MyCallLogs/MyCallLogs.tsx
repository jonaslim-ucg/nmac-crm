import React, { useMemo, useState } from 'react';
import TaskCard from '../../../../../components/dashboard/agent/Tasks/MyTasks/TaskCard';
import callIcon from '../../../../../assets/call.png'
import waveIcon from '../../../../../assets/wave.png'
import waveIcon2 from '../../../../../assets/wave2.png'
import CallSearchBar from '../../../../../components/dashboard/agent/CallLogs/MyCallLogs/CallSearchBar';
// import MyCallHistory from '../../../../../components/dashboard/agent/CallLogs/MyCallLogs/MyCallHistory';
import { useGetAllCallsQuery } from '../../../../../redux/services/dashboard/manager/callLog.api';
import Spinner from '../../../../../components/Spinner';
import CallHistory from '../../../../../components/dashboard/agent/PatientDetails/CallHistory';
import { useGetCallsOutreachSummaryQuery } from '../../../../../redux/services/dashboard/manager/manager.api';


const MyCallLogs: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [outcome, setOutcome] = useState('');
  const { data: callLogsData, isLoading: loading } = useGetAllCallsQuery();
  const { data: callStats, isLoading: isCardLoading } = useGetCallsOutreachSummaryQuery();
  console.log(callLogsData)

  const cards = [
    {
      title: 'Total Calls',
      value: callStats?.total_calls ?? 0,
      icon: <img src={callIcon} className="w-6 h-6" />,
      bgColor: 'bg-[#E4F4FF]',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Phone Calls',
      value: callStats?.PHONE ?? 0,
      icon: <img src={waveIcon2} className="w-6 h-6" />,
      bgColor: 'bg-[#FDE3D9]',
      iconColor: 'text-green-600',
    },
    {
      title: 'WhatsApp Calls',
      value: callStats?.WHATSAPP ?? 0,
      icon: <img src={waveIcon} className="w-6 h-6" />,
      bgColor: 'bg-[#E8F5E9]',
      iconColor: 'text-green-700',
    },
  ];

  const filteredCallLogs = useMemo(() => {
    if (!callLogsData?.data) return [];

    return callLogsData.data.filter((item: any) => {
      const searchValueLower = searchValue.toLowerCase().trim();
      const nameMatch = !searchValueLower ||
        (item?.patient_name || '').toLowerCase().includes(searchValueLower) ||
        (item?.agent?.name || '').toLowerCase().includes(searchValueLower);

      // Filter by outcome (status) using multiple possible property names
      const itemOutcome = item?.patient_status || item?.outcome || item?.status || '';
      const outcomeMatch = !outcome || itemOutcome.toUpperCase() === outcome.toUpperCase();

      return nameMatch && outcomeMatch;
    });
  }, [callLogsData, searchValue, outcome]);




  if (loading || isCardLoading) return <Spinner />

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          My Call Log
        </h1>
        <p className="text-base text-[#6A7282] font-normal">
          Track your patient calls and outcomes
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <TaskCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle=""
            icon={card.icon}
            bgColor={card.bgColor}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      {/* patient search bar  */}
      {/* <CallSearchBar/> */}
      <CallSearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        outcome={outcome}
        setOutcome={setOutcome}
      />


      {/* call history */}

      {/* <CallHistory callLogsData={callLogsData} /> */}
      <CallHistory
        callLogsData={{ ...callLogsData, data: filteredCallLogs }}
      />


    </div>
  );
};

export default MyCallLogs;