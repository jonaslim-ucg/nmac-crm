import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useGetAllCallsQuery } from '../../../../redux/services/dashboard/manager/callLog.api';
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
interface ManagerCallHistoryProps {
  patientData?: any;
    callLogsData?: any

}


const ManagerCallHistory: React.FC<ManagerCallHistoryProps> = ({ patientData,callLogsData }) => {
  const [page,setPage] = useState(1);
  const [limit] = useState(5);
  const location = useLocation();

  const isPatientDetailsPage =
    location.pathname.startsWith('/dashboard/manager/patients/');

  // const { data: callLogsData, isLoading: loading } = useGetAllCallsQuery(undefined, {
  //   skip: isPatientDetailsPage,
  // });
  console.log(callLogsData)
  let callHistory: Call[] = [];

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


  // const {data:callLogsData,isLoading:loading} = useGetAllCallsQuery();
  // const callHistory = callLogsData?.data;
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
  const getStatusStyles = (status: Call['patient_status']) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-green-100 text-green-700';
      case 'INTERESTED':
        return 'bg-pink-100 text-pink-700';
      case 'NOT_INTERESTED':
        return 'bg-yellow-100 text-yellow-700';
      case 'CALL_BACK_LATER':
        return 'bg-blue-100 text-blue-700';
      case 'CONTACTED':
        return 'bg-orange-100 text-orange-700';
      case 'NOT_STARTED':
        return 'bg-purple-100 text-purple-700';
      case 'DECLINED':
        return 'bg-red-100 text-red-700';
      default:
        return '';
    }
  };

  return (
    <div className=" bg-gray-50 mt-6">
      <div className="w-full bg-white rounded-2xl shadow-sm">
        <div className="px-6 py-5">
          <h1 className="text-xl font-normal text-gray-900">Call History</h1>
          <p className="text-sm text-gray-500 mt-1">  Showing {paginatedCalls?.length} of {totalCalls} calls</p>
        </div>
          <div className="px-6 pb-3">
            {paginatedCalls?.map((call:Call) => (
              <div key={call.id} className="px-6 py-4 hover:bg-gray-50 transition-colors bg-[#F9FAFB] mb-6 rounded-2xl">
                <div className="flex items-center justify-between flex-wrap"> {/* changed from items-start to items-center */}

                  {/* Left section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-base font-normal text-gray-900">{call.patient_name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(call.patient_status
  )}`}>
                        {call.patient_status.replaceAll('_', ' ')}

                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-gray-600">{call.phone || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">{call.created_at.split('T')[0]}</span>
                    </div>

                    <p className="text-sm text-gray-500 italic mt-3">{call.note}</p>
                  </div>

                  {/* Middle section - vertically centered */}
                  <div className="flex flex-col justify-center mx-6 min-w-[150px]">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatTime(call.created_at)} · {call.call_duration ? call.call_duration : '00:00'}</span>
                    </div>
                    <p className="text-sm text-gray-600">Agent: {call.agent === null ? 'N/A' : call.agent.name}</p>
                  </div>

                  {/* Right section */}
                  <div className="flex flex-col items-start gap-3 mt-4 md:mt-0 md:ml-6">
                    <Link to={`/dashboard/manager/patients/${call.patient_id}`}>
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
    </div>
  );
};

export default ManagerCallHistory;