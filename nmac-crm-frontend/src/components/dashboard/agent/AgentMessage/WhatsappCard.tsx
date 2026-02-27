import React, { useState, useMemo } from 'react';
import { CheckCheck } from 'lucide-react';

interface WhatsappCardProps {
  messages: any[];
}

const WhatsappCard: React.FC<WhatsappCardProps> = ({ messages }) => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const sortedMessages = useMemo(() => {
    if (!messages) return [];
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime() || 0;
      const dateB = new Date(b.created_at).getTime() || 0;
      return dateB - dateA;
    });
  }, [messages]);

  const totalMessages = sortedMessages.length;
  const paginatedMessages = sortedMessages.slice(0, page * limit);
  return (
    <div className="min-h-screen p-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-xl font-bold text-gray-900">WhatsApp Conversations</h1>
            <span
              className="text-xs sm:text-sm text-gray-600 font-medium border border-gray-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap"
            >
              {totalMessages} Conversations
            </span>
          </div>
          <p className="text-md text-[#717182] mt-2">View and manage WhatsApp communications</p>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {paginatedMessages?.length > 0 ? (
            paginatedMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-2xl border border-[#B9F8CF] p-3 sm:p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 rounded-full overflow-hidden">
                      <img
                        src={message.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D'}
                        alt="profile-img"
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-normal text-gray-900">{message.name}</h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {message.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      {message.phone} · ID: {message.patient_id}
                    </p>

                    <p className="text-sm text-gray-700 mb-3">
                      {message.message}
                    </p>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      <CheckCheck className="w-3.5 h-3.5" />
                      {message.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
              No WhatsApp conversations found
            </div>
          )}
        </div>

        {paginatedMessages && paginatedMessages.length < totalMessages && (
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

export default WhatsappCard;