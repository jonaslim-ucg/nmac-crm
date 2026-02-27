import React, { useState } from 'react';
import { RefreshCw, Info } from 'lucide-react';

const SystemConfiguration: React.FC = () => {
  const [ecwSync, setEcwSync] = useState('Daily at 8:00 AM');
  const [dataRetention, setDataRetention] = useState('2 Years');
  // const [backupFreq, setBackupFreq] = useState('Every 2 Hours');
  // const [timeZone, setTimeZone] = useState('Central (CST)');
  // const [maintenanceMode, setMaintenanceMode] = useState(false);
  // const [debugLogging, setDebugLogging] = useState(false);

  return (
    <div className="">
      <div className="w-full">
        <div className="">
          {/* Configuration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            {/* ECW Sync Frequency */}
            <div className="rounded-3xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-md font-medium text-gray-700">ECW Sync Frequency</label>
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={ecwSync}
                  onChange={(e) => setEcwSync(e.target.value)}
                  className="w-full bg-[#F3F3F5] border border-gray-300 rounded-full px-4 py-2 text-gray-700 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Daily at 8:00 AM</option>
                  <option>Every 6 Hours</option>
                  <option>Every 12 Hours</option>
                  <option>Weekly</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Data Retention Period */}
            <div className="rounded-3xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-md font-medium text-gray-700">Data Retention Period</label>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="w-full bg-[#F3F3F5] border border-gray-300 rounded-full px-4 py-2 text-gray-700 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>2 Years</option>
                  <option>1 Year</option>
                  <option>3 Years</option>
                  <option>5 Years</option>
                  <option>7 Years</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Backup Frequency */}
            {/* <div className=" rounded-3xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-md font-medium text-gray-700">Backup Frequency</label>
                <Database className="w-4 h-4 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={backupFreq}
                  onChange={(e) => setBackupFreq(e.target.value)}
                  className="w-full bg-[#F3F3F5] border border-gray-300 rounded-full px-4 py-2 text-gray-700 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Every 2 Hours</option>
                  <option>Hourly</option>
                  <option>Every 4 Hours</option>
                  <option>Every 6 Hours</option>
                  <option>Daily</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div> */}

            {/* Time Zone */}
            {/* <div className="rounded-3xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-md font-medium text-gray-700">Time Zone</label>
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full bg-[#F3F3F5] border border-gray-300 rounded-full px-4 py-2 text-gray-700 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Central (CST)</option>
                  <option>Eastern (EST)</option>
                  <option>Pacific (PST)</option>
                  <option>Mountain (MST)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div> */}
          </div>

          {/* Toggle Settings */}
          <div className="space-y-4">
            {/* Maintenance Mode */}
            {/* <div className="flex items-start justify-between  border-t border-gray-200 bg-[#F3F3F5] px-3 py-2 rounded-2xl">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Disable user access for maintenance</p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  maintenanceMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div> */}

            {/* Debug Logging */}
            {/* <div className="flex items-start justify-between bg-[#F3F3F5] px-3 py-2 rounded-2xl">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Debug Logging</h3>
                <p className="text-sm text-gray-500">Enable detailed system logs</p>
              </div>
              <button
                onClick={() => setDebugLogging(!debugLogging)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  debugLogging ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    debugLogging ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;