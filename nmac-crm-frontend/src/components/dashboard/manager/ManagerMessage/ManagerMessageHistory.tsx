/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import ManagerMessageTemplate from './ManagerMessageTemplate';
import ManagerMessageSignleCard from './ManagerMessageSingleCard';
import ManagerMessageTabs from './ManagerMessageTabs';
import ComposeMessage from './ComposeMessage';
import ManagerMessageSearch from './ManagerMessageSearch';

type TabType = 'Message History' | 'Compose Message' | 'Templates';


// const messageHistoryData = [
//   {
//     id: '1',
//     name: 'Sarah Johnson',
//     phone: '(555) 123-4567',
//     message: 'Hi Sarah! Time for your annual checkup. We would love to see you soon!',
//     timestamp: '10/23/2024 at 10:30 AM',
//     status: 'Delivered',
//     platform: 'WhatsApp'
//   },
//   {
//     id: '2',
//     name: 'Michael Chen',
//     phone: '(555) 234-5678',
//     message: 'Hello Michael, its been 6 months since your last visit. Schedule now!',
//     timestamp: '10/23/2024 at 11:15 AM',
//     status: 'Read',
//     platform: 'WhatsApp'
//   },
//   {
//     id: '3',
//     name: 'Robert Wilson',
//     phone: '(555) 456-7890',
//     message: 'Hi Robert! Ready for your wellness checkup? Call us to book!',
//     timestamp: '10/23/2024 at 3:30 PM',
//     status: 'Delivered',
//     platform: 'Email'
//   }
// ];
interface MessageHistoryProps {
  messages: any,
  filterType?: 'whatsapp' | 'email' | 'all'; // optional filter prop

}

const ManagerMessageHistory: React.FC<MessageHistoryProps> = ({ messages, filterType = 'all' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Message History');
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter messages based on search and filterType
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

  return (
    <div className="w-full min-h-screen">
      <div>

        <div className='p-2 mt-5'>
          <ManagerMessageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className='bg-white rounded-2xl'>

          <div className="bg-white rounded-2xl overflow-hidden">
            {activeTab === 'Templates' && (

              <ManagerMessageTemplate />
            )}
            {activeTab === 'Message History' && (
              <div className='p-6'>
                <ManagerMessageSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                />
                {/* {
                  messageHistoryData.map((message: any) => (
                    <ManagerMessageSignleCard key={message.id} message={message} />
                  ))
                } */}
                {paginatedMessages?.length > 0 ? (
                  paginatedMessages.map((message: any) => (
                    <ManagerMessageSignleCard key={message.id} message={message} />
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

            {
              activeTab === 'Compose Message' && (
                <ComposeMessage />
              )
            }


          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerMessageHistory;
