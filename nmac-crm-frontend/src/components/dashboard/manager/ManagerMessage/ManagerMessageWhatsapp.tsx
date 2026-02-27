import React, { useState, useMemo } from 'react';
import { CheckCheck } from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  message: string;
  timestamp: string;
  status: 'read' | 'delivered';
  avatar: string;
  created_at?: string;
}

const ManagerMessageWhatsapp: React.FC = () => {
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      idNumber: 'ID: P12345',
      message: 'Thank you! I\'ll call to schedule.',
      timestamp: '10/27/2024 · 2:45 PM',
      status: 'read',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      created_at: '2024-10-27T14:45:00Z'
    },
    {
      id: '2',
      name: 'Michael Chen',
      phone: '(555) 234-5678',
      idNumber: 'ID: P12346',
      message: 'Hello Michael, its been 6 months since your last visit...',
      timestamp: '10/27/2024 · 11:15 AM',
      status: 'delivered',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      created_at: '2024-10-27T11:15:00Z'
    }
  ];

  const [page, setPage] = useState(1);
  const limit = 5;

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.created_at || a.timestamp).getTime() || 0;
      const dateB = new Date(b.created_at || b.timestamp).getTime() || 0;
      return dateB - dateA;
    });
  }, [conversations]);

  const totalConversations = sortedConversations.length;
  const paginatedConversations = sortedConversations.slice(0, page * limit);

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
              {totalConversations} Conversations
            </span>

          </div>
          <p className="text-md text-[#717182] mt-2">View and manage WhatsApp communications</p>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {paginatedConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-white rounded-2xl border border-[#B9F8CF] p-3 sm:p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center text-2xl">
                    <img src={conversation.avatar} alt="profile-img" className='w-full rounded-full' />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-normal text-gray-900">{conversation.name}</h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {conversation.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    {conversation.phone} · {conversation.idNumber}
                  </p>

                  <p className="text-sm text-gray-700 mb-3">
                    {conversation.message}
                  </p>

                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    {conversation.status === 'read' ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5" />
                        Read
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-3.5 h-3.5" />
                        Delivered
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paginatedConversations.length < totalConversations && (
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

export default ManagerMessageWhatsapp;