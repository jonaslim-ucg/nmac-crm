import React, { useState } from 'react';
import { Save } from 'lucide-react';

const WorkHours: React.FC = () => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [timeZone, setTimeZone] = useState('Eastern (EST)');

  const handleSave = () => {
    console.log('Saving work hours:', { startTime, endTime, timeZone });
  };

  return (
    <div className="bg-gray-50 flex items-start justify-center">
      <div className="w-full">
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Work Hours Start */}
          <div className="flex flex-col">
            <label 
              htmlFor="work-hours-start" 
              className="text-sm font-medium text-[#364153] mb-3"
            >
              Work Hours Start
            </label>
            <input
              id="work-hours-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-full text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Work Hours End */}
          <div className="flex flex-col">
            <label 
              htmlFor="work-hours-end" 
              className="text-sm font-medium text-[#364153] mb-3"
            >
              Work Hours End
            </label>
            <input
              id="work-hours-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-full text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Time Zone */}
          <div className="flex flex-col">
            <label 
              htmlFor="time-zone" 
              className="text-sm font-medium text-[#364153] mb-3"
            >
              Time Zone
            </label>
            <select
              id="time-zone"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full px-4 py-2 bg-[#F3F3F5] border-0 rounded-full text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                paddingRight: '3rem'
              }}
            >
              <option value="Eastern (EST)">Eastern (EST)</option>
              <option value="Central (CST)">Central (CST)</option>
              <option value="Mountain (MST)">Mountain (MST)</option>
              <option value="Pacific (PST)">Pacific (PST)</option>
              <option value="Alaska (AKST)">Alaska (AKST)</option>
              <option value="Hawaii (HST)">Hawaii (HST)</option>
            </select>
          </div>
        </div>

        {/* Current Schedule Display */}
        <div className="mb-6">
          <p className="text-md text-gray-600 bg-white p-3 rounded-2xl">
            Current Schedule: {startTime} - {endTime} EST
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
        >
          <Save className="w-4 h-4" />
          Save Work Hours
        </button>
      </div>
    </div>
  );
};

export default WorkHours;