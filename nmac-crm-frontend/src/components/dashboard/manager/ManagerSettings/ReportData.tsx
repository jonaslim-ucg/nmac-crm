import { useState } from 'react';
import { ChevronDown, Download, Save } from 'lucide-react';
import { useLazyGetExportDataQuery } from '../../../../redux/services/dashboard/settings';
import { useGetUserQuery } from '../../../../redux/services/dashboard/admin/adminUserApi';
import Swal from 'sweetalert2';

export default function ReportData() {
  const [reportTemplate, setReportTemplate] = useState('Agent Performance');
  const [timePeriod, setTimePeriod] = useState('Weekly');
  const [agentFilter, setAgentFilter] = useState('All Agents');

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
      let type = 'agent_performance';
      if (reportTemplate === 'Call Analytics') type = 'call_analytics';

      const params: any = {
        export_type: type,
        period: timePeriod.toLowerCase(),
      };

      if (agentFilter !== 'All Agents') {
        params.agent_id = agentFilter;
      }

      const response = await triggerExport(params).unwrap();

      if (response.results && response.results.length > 0) {
        const csvData = convertToCSV(response.results);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.body.appendChild(document.createElement('a'));
        link.href = url;
        link.download = `${type}_${params.period}_${new Date().toISOString().split('T')[0]}.csv`;
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
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-full ">
        {/* First Row - Report Template and Time Period */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Default Report Template */}
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2.5">
              Default Report Template
            </label>
            <div className="relative">
              <select
                value={reportTemplate}
                onChange={(e) => setReportTemplate(e.target.value)}
                className="w-full appearance-none bg-[#F3F3F5]  rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Agent Performance">Agent Performance</option>
                <option value="Call Analytics">Call Analytics</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Default Time Period */}
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2.5">
              Default Time Period
            </label>
            <div className="relative">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full appearance-none bg-[#F3F3F5] rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Default Agent Filter */}
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2.5">
              Default Agent Filter
            </label>
            <div className="relative">
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="w-full appearance-none bg-[#F3F3F5] rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="All Agents">All Agents</option>
                {agents.map((agent: any) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>


        {/* Divider */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Export Options */}
        <div className="mb-8">
          <h2 className="text-sm font-normal text-gray-900 mb-4">
            Export Options
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              type="button"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 rounded-full px-5 py-1.5 text-sm font-normal transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export to Excel'}</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              type="button"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 rounded-full px-5 py-1.5 text-sm font-normal transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <Download className="w-4 h-4" />
              <span>Export to PDF</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          className="inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          <Save className="w-4 h-4" />
          <span>Save Reporting Settings</span>
        </button>
      </div>
    </div>
  );
}
