import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PatientSearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-gray-50 mt-6">
      <div>
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
            {/* <div className="relative">
              
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                    flex items-center justify-between gap-3 h-10 px-5 
                    min-w-[140px] bg-[#F3F3F5] border border-gray-200 
                    rounded-full hover:bg-gray-50 transition-colors

                    w-full sm:w-auto 
                  "
                              >
               
                <span className="text-sm font-medium text-gray-700">All Tasks</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>


              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSearchBar;