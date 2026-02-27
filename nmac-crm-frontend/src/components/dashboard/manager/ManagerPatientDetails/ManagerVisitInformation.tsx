
interface VisitInformationProps {
  patientData: any;
}

// const ManagerVisitInformation: React.FC<VisitInformationProps> = ({
//   primaryProvider = 'Dr. Kyjuan Brown',
//   lastVisitDate = '04/15/2024',
//   lastVisitType = 'Annual Physical',
//   dueFor = 'Annual Physical - 6 months overdue',
//   dueForColor = 'orange',
// }) => {
const ManagerVisitInformation= ({patientData}: VisitInformationProps) => {
  console.log(patientData)
  const patient = patientData|| {};
  // const patientVisitInfo = patientData?.visits || {};
  const primaryProvider = patient?.primary_provider_name || 'N/A';
  const lastVisitDate = patient?.last_visit_date || 'N/A';
  const lastVisitType = patient?.last_visit_type || 'N/A';
  const dueFor = patient?.due_for || 'N/A';
  const dueForColor =  'orange';
  const getDueForColor = () => {
    switch (dueForColor) {
      // case 'red':
      //   return 'text-red-600';
      // case 'green':
      //   return 'text-green-600';
      case 'orange':
      default:
        return 'text-orange-600';
    }
  };

  return (
    <div className="w-full bg-[#FDE3D9] rounded-2xl border border-gray-200 p-4 lg:p-6 mt-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Visit Information
      </h2>

      {/* Information Rows */}
      <div className="space-y-4">
        {/* Primary Provider */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-base text-[#4A5565]">Primary Provider:</span>
          <span className="text-base text-gray-900 sm:text-right">
            {primaryProvider}
          </span>
        </div>

        {/* Last Visit Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-base text-[#4A5565]">Last Visit Date:</span>
          <span className="text-base text-gray-900 sm:text-right">
            {lastVisitDate}
          </span>
        </div>

        {/* Last Visit Type */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-base text-[#4A5565]">Last Visit Type:</span>
          <span className="text-base text-gray-900 sm:text-right">
            {lastVisitType}
          </span>
        </div>

        {/* Due For */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-base text-[#4A5565]">Due For:</span>
          <span className={`text-base font-sm sm:text-right bg-[#FFEDD4] py-1 px-3 rounded-2xl ${getDueForColor()}`}>
            {lastVisitType} - {dueFor}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManagerVisitInformation;