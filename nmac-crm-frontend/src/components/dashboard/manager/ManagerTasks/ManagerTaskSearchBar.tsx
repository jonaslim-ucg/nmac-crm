import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ManagerTaskSearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false)

  return (
    <div className="w-full bg-gray-50 mt-6">
      <div className="">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Search patient name..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-10 pl-12 pr-4 bg-[#F3F3F5] border-0 rounded-full text-gray-900 placeholder-gray-400 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>


            {/* Dropdown */}
            {/* <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
    flex items-center justify-between gap-3
    h-10 px-3
    w-full sm:w-auto
    min-w-[140px]
    bg-[#F3F3F5] border border-gray-200
    rounded-full hover:bg-gray-50 transition-colors
  "
              >
                <span>
                  <Filter
                    className="w-4 h-4 mr-3 stroke-black"
                    strokeWidth={2}
                  />
                </span>

                <span className="text-sm font-medium text-gray-600">All Tasks</span>

                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                  strokeWidth={2}
                />
              </button>


              {isDropdownOpen && (
                <div
                  className="
        absolute left-0 top-full mt-2
        w-full sm:w-48
        bg-white border border-gray-200 rounded-xl
        shadow-lg z-20
      "
                >
                  <div className="py-2">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      All Tasks
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Active Tasks
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Completed Tasks
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Pending Tasks
                    </button>
                  </div>
                </div>
              )}
            </div> */}


            {/* all agents */}
            {/* <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
                className="
                  flex items-center justify-between gap-3 
                  h-10 px-3
                  w-full sm:w-auto
                  min-w-[140px]
                  bg-[#F3F3F5] border border-gray-200 
                  rounded-full hover:bg-gray-50 transition-colors
                "
              >
                <span>
                  <Filter
                    className="w-4 h-4 mr-3 stroke-black"
                    strokeWidth={2}
                  />
                </span>

                <span className="text-sm font-medium text-gray-700">All Agents</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${isAgentDropdownOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>

              {isAgentDropdownOpen && (
                <div
                  className="
                      absolute left-0 
                      mt-2 
                      w-full sm:w-48
                      bg-white border border-gray-200 
                      rounded-xl shadow-lg z-10
                    "
                >
                  <div className="py-2">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      All Agent
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Active Agent
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Inactive Agent
                    </button>
                  </div>
                </div>
              )}
            </div> */}


          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerTaskSearchBar;