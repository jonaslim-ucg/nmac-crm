import React, { useState, useMemo } from 'react';
import { Mail } from 'lucide-react';

interface EmailCardProps {
  messages: any[];
}

const EmailCard: React.FC<EmailCardProps> = ({ messages }) => {
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
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-xl font-normal text-gray-900">Email Conversations</h1>
            <span className="text-md text-gray-600 border rounded-full border-gray-200 px-3 py-1">
              {totalMessages} Emails
            </span>
          </div>
          <p className="text-md text-[#717182] mt-2">View and manage email communications</p>
        </div>

        {/* Categories / Conversations List */}
        <div className="space-y-4">
          {paginatedMessages?.length > 0 ? (
            paginatedMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 p-3 bg-blue-50 rounded-full">
                    <Mail className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-medium text-gray-900">{message.name}</h3>
                      <span className="text-sm text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-blue-600 mb-2 font-medium">{message.subject || 'No Subject'}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="min-h-[500px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Mail className="w-12 h-12 mb-4 opacity-20" />
              <p>No email conversations found</p>
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

export default EmailCard;