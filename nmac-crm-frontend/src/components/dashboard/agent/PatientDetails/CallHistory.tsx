import React, { useState } from 'react';
import { Clock } from 'lucide-react';
// import { useGetAllCallsQuery } from '../../../../redux/services/dashboard/manager/callLog.api';
import { Link, useLocation } from 'react-router-dom';
// import Spinner from '../../../Spinner';

interface Call {
  id: number;
  patient_name: string;
  patient_status: 'BOOKED' |'INTERESTED' |
 'NOT_INTERESTED' | 'CALL_BACK_LATER'| 'CONTACTED' |'NOT_STARTED' | 'DECLINED';
  phone: string;
  created_at: string;
  time: string;
  call_duration: string;
  agent:{
    id: number;
    name: string;
  }
  note: string;
  patient_id:string;
}
interface CallHistoryProps {
  patientData?: any;
  
  callLogsData?: any
  // call:Call[];
}

const CallHistory: React.FC<CallHistoryProps> = ({ patientData, callLogsData }) => {
  const [page,setPage] = useState(1);
  const [limit] = useState(5);
  const location = useLocation();
  console.log(callLogsData)

   const isPatientDetailsPage =
    location.pathname.startsWith('/dashboard/agent/patients/');
  // const { data: callLogsData, isLoading: loading } = useGetAllCallsQuery(undefined, {
  //   skip: isPatientDetailsPage,
  // });
  let callHistory: Call[] = [];
  console.log(patientData)

if (isPatientDetailsPage) {
  callHistory =
    patientData?.contacts?.map((contact: any) => ({
      id: contact.id,
      patient_name: patientData?.name,
      patient_status: patientData?.status,
      phone: contact.phone,
      created_at: contact.created_at,
      time: '',
      call_duration: '',
      agent: patientData?.agent === null ? { id: 0, name: 'N/A' } : { id: patientData.agent.id, name: patientData.agent.name },
      note: '',
    })) || [];
  } else {
  callHistory = callLogsData?.data || [];
}


  const totalCalls = callHistory?.length || 0;

const paginatedCalls = callHistory?.slice(0, page * limit);


  const formatTime = (isoString: string) => {
      // Get the time part from ISO string
      const timePart = isoString.split('T')[1].split('.')[0]; // "11:15:30"
      
      // Create a Date object for easier formatting
      const [hoursStr, minutesStr] = timePart.split(':');
      let hours = parseInt(hoursStr);
      const minutes = minutesStr;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // convert 0 => 12
      return `${hours}:${minutes} ${ampm}`;
    };

  //     const getStatusStyles = (status: Call['patient_status']) => {
  //   switch (status) {
  //     case 'BOOKED':
  //       return 'bg-green-100 text-green-700';
  //     case 'INTERESTED':
  //       return 'bg-pink-100 text-pink-700';
  //     case 'NOT_INTERESTED':
  //       return 'bg-yellow-100 text-yellow-700';
  //     case 'CALL_BACK_LATER':
  //       return 'bg-blue-100 text-blue-700';
  //     case 'CONTACTED':
  //       return 'bg-orange-100 text-orange-700';
  //     case 'NOT_STARTED':
  //       return 'bg-purple-100 text-purple-700';
  //     case 'DECLINED':
  //       return 'bg-red-100 text-red-700';
  //     default:
  //       return '';
  //   }
  // };


  // const defaultCalls: CallRecord[] = [
  //   {
  //     id: '1',
  //     dateTime: '10/20/2024 at 2:30 PM',
  //     outcome: 'No Answer',
  //     notes: 'Left voicemail',
  //     agent: 'John Agent',
  //   },
  //   {
  //     id: '2',
  //     dateTime: '10/15/2024 at 10:15 AM',
  //     outcome: 'Spoke with patient',
  //     notes: 'Interested in booking',
  //     agent: 'John Agent',
  //   },
  //   {
  //     id: '3',
  //     dateTime: '10/10/2024 at 3:45 PM',
  //     outcome: 'No Answer',
  //     notes: 'Will try again',
  //     agent: 'Maria Garcia',
  //   },
  // ];

  // const callList = calls || defaultCalls;
  // if(loading) return <Spinner />

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 mt-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Call History
      </h2>
      <p className='text-[#6A7282] mb-3'>Showing {paginatedCalls.length} calls</p>

      {/* Call Records */}
      <div className="space-y-6">
        {paginatedCalls.map((call: Call) => (
          <div
            key={call.id}
            className="bg-[#F9FAFB] rounded-xl p-5 space-y-2"
          >
          <div className="flex items-center justify-between flex-wrap"> {/* changed from items-start to items-center */}
            {/* Date/Time */}
            <div className='space-y-2'>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" strokeWidth={2} /> ·
              <span>{call.created_at.split('T')[0]}</span>
                            <span className='text-gray-900 '>{formatTime(call.created_at)} · {call.call_duration ? call.call_duration : '00:00'}</span>

            </div>

            {/* Outcome */}
            <div className="text-sm">
              <span className="font-semibold text-gray-900">Outcome: </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium `}>
                        {call.patient_status.replaceAll('_', ' ')}

                      </span>
            </div>

            {/* Notes */}
            <p className="text-sm text-gray-600">{call.note}</p>

            {/* Agent */}
            <p className="text-sm text-gray-500">
              Agent: <span className="text-gray-900">{call.agent?.name}</span>
            </p>
            </div>
           {/* Right section */}
                            <div className="flex flex-col items-start gap-3 mt-4 md:mt-0 md:ml-6">
                              <Link to={`/dashboard/agent/patients/${call.patient_id}`}>
                              <button className="px-4 py-1.5 text-sm font-normal bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                                View Patient
                              </button>
                              </Link>
                            </div>
                            </div>
          </div>
        ))}
         {paginatedCalls && paginatedCalls.length < totalCalls && (
                <div className="flex justify-center py-6">
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-6 py-2 rounded-full text-sm font-medium 
                              bg-gray-900 text-white 
                              hover:bg-gray-800 
                              transition-all duration-200
                              flex items-center gap-2"
                  >
                    Load More
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
      </div>
    </div>
  );
};

export default CallHistory;