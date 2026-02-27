import { TriangleAlert } from 'lucide-react';
import React from 'react';
import { useGetNonBookingSummaryQuery } from '../../../../redux/services/dashboard/manager/manager.api';
// import Spinner from '../../../Spinner';

const BookingAnalyticsDashboard: React.FC = () => {
  const {data:NonBookingReasons} = useGetNonBookingSummaryQuery();
  // console.log(NonBookingReasons);
  const nonBookingReasons = [
    { label: 'No Answer', value: NonBookingReasons?.no_answer, color: '#ff7b7b' },
    { label: 'Declined', value: NonBookingReasons?.declined, color: '#ffd4d4' },
    { label: 'Wrong Number', value: NonBookingReasons?.wrong_number, color: '#ffd166' },
    { label: 'Call Back Later', value: NonBookingReasons?.call_back_later, color: '#e8f4f8' },
    { label: 'Already Scheduled', value: NonBookingReasons?.already_scheduled, color: '#d4e4f7' },
    { label: 'Not Interested', value: NonBookingReasons?.not_interested, color: '#e8d4f7' },
  ];

  const dataQualityIssues = [
    { label: 'Incorrect Phone', severity: 'high', value: 89, max: 145 },
    { label: 'Missing Email', severity: 'medium', value: 145, max: 145 },
    { label: 'Invalid Address', severity: 'low', value: 34, max: 145 },
    { label: 'Duplicate Records', severity: 'high', value: 23, max: 145 },
    { label: 'Missing Last Visit', severity: 'medium', value: 67, max: 145 },
  ];

  const total = nonBookingReasons.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const createPieSlice = (percentage: number, color: string, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const largeArcFlag = angle > 180 ? 1 : 0;

    const startX = 50 + 45 * Math.cos((Math.PI * startAngle) / 180);
    const startY = 50 + 45 * Math.sin((Math.PI * startAngle) / 180);
    const endX = 50 + 45 * Math.cos((Math.PI * endAngle) / 180);
    const endY = 50 + 45 * Math.sin((Math.PI * endAngle) / 180);

    return {
      path: `M 50 50 L ${startX} ${startY} A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
      color,
      nextAngle: endAngle,
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-600';
      case 'medium':
        return 'bg-orange-50 text-orange-600';
      case 'low':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };
  // if (isLoading) return <Spinner />;


  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 mt-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Reasons for Non-Booking */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-2">
            <span><TriangleAlert className='w-5 h-5' /></span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Reasons for Non-Booking</h2>
              {total ? <p className="text-sm text-[#6A7282] mt-1">Total: {total.toFixed()} unsuccessful attempts</p> : <p className="text-sm text-[#6A7282] mt-1">No unsuccessful booking attempts recorded.</p>}
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center gap-8">
            {/* Pie Chart */}
            <div className="w-56 h-56 shrink-0">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {nonBookingReasons.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const slice = createPieSlice(percentage, item.color, currentAngle);
                  currentAngle = slice.nextAngle;
                  return (
                    <path
                      key={index}
                      d={slice.path}
                      fill={slice.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3 w-full">
              {nonBookingReasons.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded-full">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 ml-4">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card - Data Quality Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-gray-900 text-sm font-bold">i</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Data Quality Insights</h2>
              <p className="text-sm text-[#6A7282] mt-1">Total: 358 data issues found</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {dataQualityIssues.map((issue, index) => (
              <div key={index} className='bg-[#F9FAFB] p-6 rounded-2xl'>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{issue.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{issue.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(issue.value / issue.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            View Detailed Issues
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingAnalyticsDashboard;