// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from 'react';
// import CallHistoryCard from './CallHistoryCard';
// import { useGetAllCallsQuery } from '../../../../../redux/services/dashboard/manager/callLog.api';
// import { replace } from 'react-router-dom';
// import CallHistory from '../../PatientDetails/CallHistory';


// interface Call {
//   id: number;
//   patient_name: string;
//   patient_status: 'BOOKED' |'INTERESTED' |
//  'NOT_INTERESTED' | 'CALL_BACK_LATER'| 'CONTACTED' |'NOT_STARTED' | 'DECLINED';
//   phone: string;
//   created_at: string;
//   time: string;
//   call_duration: string;
//   agent:{
//     id: number;
//     name: string;
//   }
//   note: string;
// }
// interface CallHistoryProps {
//   callLogsData?: any;
// }

// // const callHistory = [
// //   {
// //     id: '1',
// //     name: 'Sarah Johnson',
// //     status: 'Booked',
// //     phone: '(555) 123-4567',
// //     time: '10:30 AM',
// //     duration: '5m 23s',
// //     date: '10/23/2024',
// //     note: 'Patient scheduled for next week'
// //   },
// //   {
// //     id: '2',
// //     name: 'Michael Chen',
// //     status: 'No Answer',
// //     phone: '(555) 234-5678',
// //     time: '11:15 AM',
// //     duration: '3m 45s',
// //     date: '10/23/2024',
// //     note: 'Left voicemail'
// //   },
// //   {
// //     id: '3',
// //     name: 'Robert Wilson',
// //     status: 'Booked',
// //     phone: '(555) 456-7890',
// //     time: '3:30 PM',
// //     duration: '4m 50s',
// //     date: '10/23/2024',
// //     note: 'Appointment confirmed'
// //   },
// //   {
// //     id: '4',
// //     name: 'Jennifer Martinez',
// //     status: 'Booked',
// //     phone: '(555) 678-9012',
// //     time: '9:45 AM',
// //     duration: '6m 10s',
// //     date: '10/22/2024',
// //     note: 'Patient excited for appointment'
// //   },
// //   {
// //     id: '5',
// //     name: 'Patricia Taylor',
// //     status: 'Callback',
// //     phone: '(555) 890-1234',
// //     time: '11:30 AM',
// //     duration: '4m 15s',
// //     date: '10/22/2024',
// //     note: 'Requested call back after 3 PM'
// //   }
// // ];
// const MyCallHistory: React.FC<CallHistoryProps> = ({ callLogsData }) => {
//   const [page,setPage] = useState(1);
//   const [limit] = useState(5);
//     const callHistory =
//     callLogsData?.data?.map((call: Call) => {
//       const dateObj = new Date(call.created_at);

//       return {
//         id: call.id,
//         name: call.patient_name,
//         status: call.patient_status,
//         phone: call.phone ?? 'N/A',
//         time: dateObj.toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         }),
//         date: dateObj.toLocaleDateString(),
//         duration: call.call_duration ?? '0s',
//         note: call.note ?? '',
//       };
//     }) || [];
//   const totalCalls = callHistory?.length || 0;

// const paginatedCalls = callHistory?.slice(0, page * limit);

//   return (
//     <div className="w-full  bg-white p-1 sm:p-3 lg:p-5 mt-5 rounded-2xl border border-gray-200">
//       <div className="">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-1">Call History</h1>
//           <p className="text-sm text-gray-500">Showing {callHistory.length} calls</p>
//         </div>

//         {/* Call List */}
//         <div className="space-y-4">
//           {paginatedCalls.map((call:any) => (
//             <CallHistory key={call.id} call={call} />
//           ))}
//         {paginatedCalls && paginatedCalls.length < totalCalls && (
//                 <div className="flex justify-center py-6">
//                   <button
//                     onClick={() => setPage((prev) => prev + 1)}
//                     className="px-6 py-2 rounded-full text-sm font-medium 
//                               bg-gray-900 text-white 
//                               hover:bg-gray-800 
//                               transition-all duration-200
//                               flex items-center gap-2"
//                   >
//                     Load More
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default MyCallHistory;