// import React from 'react';
// import { Users } from 'lucide-react';
// import { useGetPatientSummaryQuery } from '../../../../redux/services/dashboard/manager/manager.api';

// const PatientStatistics: React.FC = () => {
//   const { data:patientSummaryData, isLoading: isPatientSummaryLoading } = useGetPatientSummaryQuery();
//   return (
//     <div>
//       <div className="w-full">
//         <div className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6">
//           {/* Header */}
//           <div className="flex items-center gap-2 mb-8">
//             <Users className="w-5 h-5 text-gray-900" strokeWidth={2} />
//             <h2 className="text-lg font-medium text-[#0A0A0A]">Patient Statistics Overview</h2>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             {/* Total Patients */}
//             <div className="rounded-xl p-6 border border-[#E4F4FF]">
//               <div className="text-md text-gray-600 mb-2">Total Patients</div>
//               <div className="text-4xl font-normal text-gray-900 mb-2">1,247</div>
//               <div className="text-md text-gray-600">+12% from last month</div>
//             </div>

//             {/* Active Patients */}
//             <div className="rounded-xl p-6 border border-[#E8F5E9]">
//               <div className="text-md text-gray-600 mb-2">Active Patients</div>
//               <div className="text-4xl font-normal text-gray-900 mb-2">908</div>
//               <div className="text-md text-gray-600">72.8% of total</div>
//             </div>

//             {/* Due for Recall */}
//             <div className="rounded-xl p-6 border border-[#FDE3D9]">
//               <div className="text-md text-gray-600 mb-2">Due for Recall</div>
//               <div className="text-4xl font-normal text-gray-900 mb-2">908</div>
//               <div className="text-md text-gray-600">Across all visit types</div>
//             </div>
//           </div>

//           {/* View All Patients Button */}
//           <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-2 px-6 flex items-center justify-center gap-2 transition-colors">
//             <Users className="w-4 h-4" strokeWidth={2} />
//             <span className="text-sm font-medium">View All Patients</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientStatistics;

import React from 'react';
import { Users } from 'lucide-react';
import { useGetPatientSummaryQuery } from '../../../../redux/services/dashboard/manager/manager.api';
import Spinner from '../../../Spinner';

const PatientStatistics: React.FC = () => {
  const { data: patientSummaryData, isLoading: isPatientSummaryLoading } = useGetPatientSummaryQuery();

  if (isPatientSummaryLoading) {
    return (
      <div className="w-full text-center py-10">
        <Spinner />
      </div>
    );
  }

  // Fallbacks
  const totalPatients = patientSummaryData?.total_patients ?? 0;
  const activePatients = patientSummaryData?.active_patients ?? 0;
  const dueForRecall = patientSummaryData?.due_for_recall ?? 0;
  const contactedPatients = patientSummaryData?.contacted_patients ?? 0;
  const bookedAppointments = patientSummaryData?.booked_appointments ?? 0;
  const assignedPatients = patientSummaryData?.assigned_patients ?? 0;
  const unassignedPatients = patientSummaryData?.unassigned_patients ?? 0;

  // Calculate percentages

  const activePercentage = totalPatients ? ((activePatients / totalPatients) * 100).toFixed(1) : '0';
  const contactedPercentage = totalPatients ? ((contactedPatients / totalPatients) * 100).toFixed(1) : '0';
  const bookedPercentage = totalPatients ? ((bookedAppointments / totalPatients) * 100).toFixed(1) : '0';
  const assignedPercentage = totalPatients ? ((assignedPatients / totalPatients) * 100).toFixed(1) : '0';
  const unassignedPercentage = totalPatients ? ((unassignedPatients / totalPatients) * 100).toFixed(1) : '0';

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Users className="w-5 h-5 text-gray-900" strokeWidth={2} />
          <h2 className="text-lg font-medium text-[#0A0A0A]">Patient Statistics Overview</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          {/* Total Patients */}
          <div className="rounded-xl p-6 border border-[#E4F4FF]">
            <div className="text-md text-gray-600 mb-2">Total Patients</div>
            <div className="text-4xl font-normal text-gray-900 mb-2">{totalPatients}</div>
            <div className="text-md text-gray-600">Across all patients</div>
          </div>

          {/* Active Patients */}
          <div className="rounded-xl p-6 border border-[#E8F5E9]">
            <div className="text-md text-gray-600 mb-2">Active Patients</div>
            <div className="text-4xl font-normal text-gray-900 mb-2">{activePatients}</div>
            <div className="text-md text-gray-600">{activePercentage}% of total</div>
          </div>

          {/* Due for Recall */}
          <div className="rounded-xl p-6 border border-[#FDE3D9]">
            <div className="text-md text-gray-600 mb-2">Due for Recall</div>
            <div className="text-4xl font-normal text-gray-900 mb-2">{dueForRecall}</div>
            <div className="text-md text-gray-600">Across all visit types</div>
          </div>

          {/* Contacted Patients */}
          <div className="rounded-xl p-6 border border-[#D9F0FE]">
            <div className="text-md text-gray-600 mb-2">Contacted Patients</div>
            <div className="text-4xl font-normal text-gray-900 mb-2">{contactedPatients}</div>
            <div className="text-md text-gray-600">{contactedPercentage}% of total</div>
          </div>

          {/* Booked Appointments */}
          <div className="rounded-xl p-6 border border-[#EAD9FE]">
            <div className="text-md text-gray-600 mb-2">Booked Appointments</div>
            <div className="text-4xl font-normal text-gray-900 mb-2">{bookedAppointments}</div>
            <div className="text-md text-gray-600">{bookedPercentage}% of total</div>
          </div>

          {/* Assigned Patients */}
          <div className="rounded-xl p-6 border border-[#D9FEE4]">
            <div className="text-md text-gray-600 mb-2">Assigned Patients</div>
            <div className="text-4xl font-normal text-gray-900 mb-2">{assignedPatients}</div>
            <div className="text-md text-gray-600">{assignedPercentage}% of total</div>
          </div>

          {/* Unassigned Patients */}
          <div className="rounded-xl p-6 border border-[#FFE5D9]">
            <div className="text-md text-gray-600 mb-2">Unassigned Patients</div>
            <div className="text-4xl font-normal text-gray-900 mb-2">{unassignedPatients}</div>
            <div className="text-md text-gray-600">{unassignedPercentage}% of total</div>
          </div>
        </div>

        {/* View All Patients Button */}
        <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-2 px-6 flex items-center justify-center gap-2 transition-colors">
          <Users className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm font-medium">View All Patients</span>
        </button>
      </div>
    </div>
  );
};

export default PatientStatistics;
