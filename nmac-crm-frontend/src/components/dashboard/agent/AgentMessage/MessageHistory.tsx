/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import Tabs from './Tabs';
import TemplateCard from './TemplateCard';
import MessageCard from './MessageCard';
import WhatsappCard from './WhatsappCard';
import EmailCard from './EmailCard';
import SearchFilterBar from './SearchFilterBar';

type TabType = 'Message History' | 'WhatsApp' | 'Email' | 'Templates';

interface MessageHistoryProps {
  messages: any,
  filterType?: 'whatsapp' | 'email' | 'all'; // optional filter prop

}

const MessageHistory: React.FC<MessageHistoryProps> = ({ messages, filterType = 'all' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Message History');
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter messages based on search and filterType for general history
  const filteredMessages = useMemo(() => {
    return messages?.filter((msg: any) => {
      const matchesSearch =
        msg.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchValue.toLowerCase());

      const matchesType =
        filterType === 'all' ||
        msg.communication_type?.toLowerCase() === filterType;

      return matchesSearch && matchesType;
    });
  }, [messages, searchValue, filterType]);

  // Sort by created_at descending (newest first)
  const sortedMessages = useMemo(() => {
    if (!filteredMessages) return [];
    return [...filteredMessages].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime() || 0;
      const dateB = new Date(b.created_at).getTime() || 0;
      return dateB - dateA;
    });
  }, [filteredMessages]);

  const [page, setPage] = useState(1);
  const limit = 5;
  const totalMessages = sortedMessages?.length || 0;
  const paginatedMessages = sortedMessages?.slice(0, page * limit);

  // Separate messages by type for WhatsApp and Email tabs
  const whatsappMessages = useMemo(() =>
    messages?.filter((msg: any) => msg.communication_type?.toLowerCase() === 'whatsapp') || []
    , [messages]);

  const emailMessages = useMemo(() =>
    messages?.filter((msg: any) => msg.communication_type?.toLowerCase() === 'email') || []
    , [messages]);

  return (
    <div className="w-full min-h-screen">
      <div>
        <div className='p-2 mt-5'>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className='bg-white rounded-2xl border border-gray-200'>
          <div className="bg-white rounded-2xl overflow-hidden">
            {activeTab === 'Templates' && (
              <TemplateCard />
            )}
            {activeTab === 'Message History' && (
              <div className='p-4'>
                <SearchFilterBar
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                />

                {paginatedMessages?.length > 0 ? (
                  paginatedMessages.map((message: any) => (
                    <MessageCard key={message.id} message={message} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No messages found</p>
                )}

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
            )}

            {activeTab === 'WhatsApp' && (
              <WhatsappCard messages={whatsappMessages} />
            )}

            {activeTab === 'Email' && (
              <EmailCard messages={emailMessages} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageHistory;
