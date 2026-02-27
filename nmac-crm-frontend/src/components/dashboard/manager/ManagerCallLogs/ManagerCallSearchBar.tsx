import React, { useState } from 'react';
import { ChevronDown, Filter, Search } from 'lucide-react';

interface Props {
  searchValue: string;
  setSearchValue: (value: string) => void;
  // taskStatus: string;
  // setTaskStatus: (v: string) => void;
  outcomeStatus: string;
  setOutcomeStatus: (v: string) => void;
}

const ManagerCallSearchBar: React.FC<Props> = ({
  searchValue,
  setSearchValue,
  // taskStatus,
  // setTaskStatus,
  outcomeStatus,
  setOutcomeStatus
}) => {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);

  // const taskStatuses = [
  //   "All Tasks",
  //   "Active Tasks",
  //   "Completed Tasks",
  //   "Pending Tasks"
  // ];

  const outcomes = [
    "All Outcomes",
    "BOOKED",
    "NO_ANSWER",
    "CALL_BACK_LATER",
    "DECLINED",
    "CONTACTED",
    "NOT_STARTED",
    "INTERESTED",
    "NOT_INTERESTED"
  ];

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


            {/* Task Filter Dropdown */}
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
                <span className="text-sm font-medium text-gray-700">
                  {taskStatus || "All Tasks"}
                </span>
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
                    {taskStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setTaskStatus(status === "All Tasks" ? "" : status);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${(taskStatus === status || (!taskStatus && status === "All Tasks"))
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div> */}


            {/* Outcome Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
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
                <span className="text-sm font-medium text-gray-700">
                  {outcomeStatus || "All Outcomes"}
                </span>
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
                    {outcomes.map((outcome) => (
                      <button
                        key={outcome}
                        onClick={() => {
                          setOutcomeStatus(outcome === "All Outcomes" ? "" : outcome);
                          setIsAgentDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${(outcomeStatus === outcome || (!outcomeStatus && outcome === "All Outcomes"))
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {outcome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerCallSearchBar;