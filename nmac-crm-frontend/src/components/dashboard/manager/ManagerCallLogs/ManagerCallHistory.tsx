/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ManagerCallHistoryCard from './ManagerCallHistoryCard';

const callHistory = [
  {
    id: '1',
    name: 'Sarah Johnson',
    status: 'Booked',
    phone: '(555) 123-4567',
    time: '10:30 AM',
    duration: '5m 23s',
    date: '10/23/2024',
    note: 'Patient scheduled for next week'
  },
  {
    id: '2',
    name: 'Michael Chen',
    status: 'No Answer',
    phone: '(555) 234-5678',
    time: '11:15 AM',
    duration: '3m 45s',
    date: '10/23/2024',
    note: 'Left voicemail'
  },
  {
    id: '3',
    name: 'Robert Wilson',
    status: 'Booked',
    phone: '(555) 456-7890',
    time: '3:30 PM',
    duration: '4m 50s',
    date: '10/23/2024',
    note: 'Appointment confirmed'
  },
  {
    id: '4',
    name: 'Jennifer Martinez',
    status: 'Booked',
    phone: '(555) 678-9012',
    time: '9:45 AM',
    duration: '6m 10s',
    date: '10/22/2024',
    note: 'Patient excited for appointment'
  },
  {
    id: '5',
    name: 'Patricia Taylor',
    status: 'Callback',
    phone: '(555) 890-1234',
    time: '11:30 AM',
    duration: '4m 15s',
    date: '10/22/2024',
    note: 'Requested call back after 3 PM'
  }
];
const ManagerCallHistory: React.FC = () => {
  
  return (
    <div className="w-full  bg-white p-1 sm:p-3 lg:p-5 mt-5 rounded-2xl border border-gray-200">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Call History</h1>
          <p className="text-sm text-gray-500">Showing {callHistory.length} calls</p>
        </div>

        {/* Call List */}
        <div className="space-y-4">
          {callHistory.map((call:any) => (
            <ManagerCallHistoryCard key={call.id} call={call} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerCallHistory;