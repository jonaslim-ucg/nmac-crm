import { BarChart3, ChevronDown, Clock, Download, FileText, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useLazyGetExportDataQuery } from '../../../../redux/services/dashboard/settings';
import { useGetUserQuery } from '../../../../redux/services/dashboard/admin/adminUserApi';
import Swal from 'sweetalert2';

const GenerateReports: React.FC = () => {
  const [visitType, setVisitType] = useState('All Types');
  const [agentId, setAgentId] = useState('All Agents');
  const [period, setPeriod] = useState('Weekly');
  const [patientStatus, setPatientStatus] = useState('All Status');

  const { data: usersData } = useGetUserQuery();
  const [triggerExport, { isFetching: isExporting }] = useLazyGetExportDataQuery();

  const agents = usersData?.results?.filter((user: any) => user.role === 'AGENT') || [];

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item =>
      Object.values(item).map(val => `"${val}"`).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (format === 'pdf') {
      Swal.fire({
        title: 'Info',
        text: 'PDF export is coming soon. Please use Export to Excel for now.',
        icon: 'info',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-full px-8'
        }
      });
      return;
    }

    try {
      const type = 'agent_performance'; // Default to agent_performance for now as per original buttons
      const params: any = {
        export_type: type,
        period: period.toLowerCase() === 'this week' ? 'weekly' :
          period.toLowerCase() === 'this month' ? 'monthly' :
            period.toLowerCase() === 'this year' ? 'yearly' : 'daily',
      };

      if (agentId !== 'All Agents') {
        params.agent_id = agentId;
      }

      const response = await triggerExport(params).unwrap();

      if (response.results && response.results.length > 0) {
        const csvData = convertToCSV(response.results);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${type}_${params.period}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
          title: 'Success!',
          text: 'Report has been exported successfully.',
          icon: 'success',
          confirmButtonColor: '#000000',
          customClass: {
            popup: 'rounded-3xl',
            confirmButton: 'rounded-full px-8'
          }
        });
      } else {
        Swal.fire({
          title: 'No Data',
          text: 'No records found for the selected period.',
          icon: 'info',
          confirmButtonColor: '#000000',
          customClass: {
            popup: 'rounded-3xl',
            confirmButton: 'rounded-full px-8'
          }
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      Swal.fire({
        title: 'Export Failed',
        text: 'Failed to generate the report. Please try again.',
        icon: 'error',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-full px-8'
        }
      });
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <FileText className="w-5 h-5 text-gray-900" strokeWidth={2} />
            <h2 className="text-lg font-medium text-gray-900">Generate Custom Reports</h2>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Visit Type */}
            <div>
              <label className="block text-md text-[#364153] mb-2">Visit Type</label>
              <div className="relative">
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option>All Types</option>
                  <option>Annual Physicals</option>
                  <option>Colon Hydrotherapy</option>
                  <option>Spa Visits</option>
                  <option>Follow-up</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Agent */}
            <div>
              <label className="block text-md text-gray-700 mb-2">Agent</label>
              <div className="relative">
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="All Agents">All Agents</option>
                  {agents.map((agent: any) => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-md text-gray-700 mb-2">Time Period</label>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Patient Status */}
            <div>
              <label className="block text-md text-gray-700 mb-2">Patient Status</label>
              <div className="relative">
                <select
                  value={patientStatus}
                  onChange={(e) => setPatientStatus(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option>All Status</option>
                  <option>Contacted</option>
                  <option>Booked</option>
                  <option>Not Started</option>
                  <option>Declined</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2.5 flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm font-medium">{isExporting ? 'Exporting...' : 'Export to Excel'}</span>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-full py-2.5 px-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm font-medium">Export to PDF</span>
            </button>
          </div>

          {/* Quick Reports */}
          <div className="bg-[#F8F9FF] rounded-2xl p-5 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Reports</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Weekly Summary */}
              <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-3 flex items-center gap-3 transition-colors text-left">
                <Clock className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
                <span className="text-sm text-gray-900">Weekly Summary</span>
              </button>

              {/* Agent Performance */}
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full py-3 px-4 flex items-center gap-3 transition-colors text-left disabled:opacity-50"
              >
                <BarChart3 className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
                <span className="text-sm text-gray-900">Agent Performance</span>
              </button>

              {/* Conversion Analysis */}
              <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full py-3 px-4 flex items-center gap-3 transition-colors text-left">
                <TrendingUp className="w-5 h-5 text-gray-700 shrink-0" strokeWidth={2} />
                <span className="text-sm text-gray-900">Conversion Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReports;
