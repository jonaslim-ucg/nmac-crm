import React, { useState } from 'react';
import { CheckCircle, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';


interface PendingFollowUpsProps {
  callHistory?: any;
}

const CallBacks: React.FC<PendingFollowUpsProps> = ({ callHistory }) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  console.log(callHistory)

  // Format relative time
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 1) return `${diffDays} days ago`;
    if (diffDays === 1) return `1 day ago`;
    if (diffHours > 1) return `${diffHours} hours ago`;
    if (diffHours === 1) return `1 hour ago`;
    if (diffMinutes > 1) return `${diffMinutes} minutes ago`;
    return 'Just now';
  };

  // Map patient status to readable status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Call Back Later':
        return 'bg-blue-50 text-blue-700';
      case 'No Answer':
        return 'bg-yellow-50 text-yellow-700';
      case 'Declined':
        return 'bg-red-50 text-red-700';
      case 'Interested':
        return 'bg-green-50 text-green-700';
      case 'Not Interested':
        return 'bg-gray-50 text-gray-700';
      case 'Booked':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Map API call history to internal structure
  const mapCalls = (apiCalls: any[] = []) => {
    return apiCalls.map((item) => ({
      id: item.id,
      name: item.patient_name,
      phone: item.contact_method || "N/A",
      appointmentType: item.appointment?.type || "Unknown",
      status: (() => {
        switch(item.patient_status) {
          case 'CALL_BACK_LATER': return 'Call Back Later';
          case 'NOT_STARTED':
          case 'CONTACTED': return 'No Answer';
          case 'DECLINED': return 'Declined';
          case 'INTERESTED': return 'Interested';
          case 'NOT_INTERESTED': return 'Not Interested';
          default: return 'No Answer';
        }
      })(),
      lastContact: formatRelativeDate(item.created_at),
      is_appointed: item.is_appointed
    }));
  };

  const callList = mapCalls(callHistory?.data || []);
  const totalCalls = callList.length;
  const paginatedCalls = callList.slice(0, page * limit);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 mt-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Pending Follow-ups or Call Backs
        </h2>
        <p className="text-sm text-gray-600">
          {totalCalls ? totalCalls : "No"} calls requiring follow-up action
        </p>
      </div>

      {/* Call List */}
      <div className="space-y-6">
        {paginatedCalls.map((call: any) => (
          <div
            key={call.id}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 bg-[#F9FAFB] p-3 rounded-2xl"
          >
            {/* Call Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold text-gray-900">{call.name}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(call.status)}`}
                >
                  {call.status}
                </span>
              </div>
              <p className="text-sm text-gray-900 mb-1">{call.phone}</p>
              <p className="text-sm text-gray-500">
                {call.is_appointed && `${call.appointmentType} · `}Last contact: {call.lastContact}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
              {call.is_appointed && (
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-2xl text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap bg-white">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Booked
                </button>
              )}
              <Link to={`/dashboard/agent/patients/${call.patient_id}/call-log`}>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-2xl text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap bg-white">
                  <Phone className="w-4 h-4" />
                  Log Call
                </button>
              </Link>
              <Link to="/dashboard/agent/messages">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-2xl text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap bg-white">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
              </Link>
            </div>
          </div>
        ))}

        {/* Load More Button */}
        {paginatedCalls.length < totalCalls && (
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

export default CallBacks;
