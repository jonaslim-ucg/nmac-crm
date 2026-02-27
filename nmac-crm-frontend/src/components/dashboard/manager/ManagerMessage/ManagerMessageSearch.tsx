import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
}

const ManagerMessageSearch: React.FC<Props> = ({
  searchValue,
  setSearchValue,
  // isDropdownOpen,
  // setIsDropdownOpen,
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" strokeWidth={2} />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[#F3F3F5] border-0 rounded-full text-gray-900 placeholder-gray-400 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        {/* <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="
      flex items-center justify-between gap-3
      h-10 px-3 
      w-full sm:w-auto
      bg-[#F3F3F5] border border-gray-200
      rounded-full hover:bg-gray-50 transition-colors
    "
          >
               <span>
                                    <Filter
                                      className="w-4 h-4 mr-3 text-gray-600"
                                      strokeWidth={2}
                                    />
                                  </span>
            <span className="text-sm font-medium text-gray-700">All Platforms</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="
        absolute right-0 mt-2
        w-full sm:w-48
        bg-white border border-gray-200 
        rounded-xl shadow-lg z-10
      "
            >
              <div className="py-2">
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">
                  All Platforms
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">
                  WhatsApp
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">
                  Email
                </button>
              </div>
            </div>
          )}
        </div> */}

      </div>
    </div>
  );
};

export default ManagerMessageSearch;
