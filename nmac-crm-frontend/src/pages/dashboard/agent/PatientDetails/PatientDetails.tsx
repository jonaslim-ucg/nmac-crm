import { Link, useParams } from 'react-router-dom';
import AppointmentHistory from '../../../../components/dashboard/agent/PatientDetails/AppointmentHistory';
import CallHistory from '../../../../components/dashboard/agent/PatientDetails/CallHistory';
// import LogNewCall from '../../../../components/dashboard/agent/PatientDetails/LogNewCall';
import PatientInformation from '../../../../components/dashboard/agent/PatientDetails/PatientInformation';
import QuickActions from '../../../../components/dashboard/agent/PatientDetails/QuickActions';
import SendWhatsApp from '../../../../components/dashboard/agent/PatientDetails/SendWhatsApp';
import StatusActions from '../../../../components/dashboard/agent/PatientDetails/StatusActions';
import VisitInformation from '../../../../components/dashboard/agent/PatientDetails/VisitInformation';
import { useGetPatientQuery } from '../../../../redux/services/dashboard/manager/manager.api';
import Spinner from '../../../../components/Spinner';

const PatientDetails = () => {
  const id = useParams();
  console.log('Patient ID from URL params:', id);
  const { data: patientData, isLoading } = useGetPatientQuery({ patientId: id.patientId || '' });
  console.log('Fetched patient data:', patientData);
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">
            Patient Details
          </h1>
          <p className="text-sm sm:text-base text-[#6A7282] font-normal">
            Complete patient information and interaction history
          </p>
        </div>

        <div className="sm:text-right">
          <Link to="/dashboard/agent/patients">
            <button className="px-4 py-1.5 border border-gray-200 rounded-full bg-white w-full sm:w-auto">
              Back to Patient List
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side: takes 2/3 on large screens, full width on mobile */}
        <div className="w-full lg:w-2/3 space-y-6">
          <PatientInformation patientData={patientData} />
          <VisitInformation patientData={patientData} />
          <AppointmentHistory patientData={patientData} />
          <CallHistory patientData={patientData} />
        </div>

        {/* Right side: takes 1/3 on large screens, full width on mobile */}
        <div className="w-full lg:w-1/3 space-y-6">
          <StatusActions patientData={patientData} />
          <QuickActions patientData={patientData} />
          {/* <LogNewCall /> */}
          <SendWhatsApp patientData={patientData} />
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
