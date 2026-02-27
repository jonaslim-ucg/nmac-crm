import { ChevronDown, Filter, Search } from "lucide-react";
import React, { useState } from "react";

interface Props {
  searchValue: string;
  setSearchValue: (value: string) => void;
  outcome: string;
  setOutcome: (value: string) => void;
}

const CallSearchBar: React.FC<Props> = ({ searchValue, setSearchValue, outcome, setOutcome }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

            {/* Filter Button */}

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                    w-full sm:w-auto
                    flex items-center justify-between 
                    gap-3 h-10 px-5 
                    bg-[#F3F3F5] border border-gray-200 
                    rounded-full hover:bg-gray-50 
                    transition-colors
                "
              >
                <span>
                  <Filter
                    className="w-4 h-4 text-gray-600 mr-3"
                    strokeWidth={2}
                  />
                </span>

                <span className="text-sm font-medium text-gray-700">
                
                  {/* {outcome || "All Outcomes"} */}
                    {outcome ? outcome.replace(/_/g, " ") : "All Outcomes"}

                </span>

                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                  strokeWidth={2}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  <div className="py-2">

                    {outcomes.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setOutcome(item === "All Outcomes" ? "" : item);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          (outcome === item || (!outcome && item === "All Outcomes"))
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item === "All Outcomes" ? item : item.replace(/_/g, " ")}
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

export default CallSearchBar;
