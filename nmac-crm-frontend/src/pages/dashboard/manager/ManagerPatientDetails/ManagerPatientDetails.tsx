import { useParams } from "react-router-dom";
import ManagerCallHistory from "../../../../components/dashboard/manager/ManagerPatientDetails/ManagerCallHistory";
// import ManagerLogNewCall from "../../../../components/dashboard/manager/ManagerPatientDetails/ManagerLogNewCall";
import ManagerPatientInformation from "../../../../components/dashboard/manager/ManagerPatientDetails/ManagerPatientInformaton";
import ManagerQuickActions from "../../../../components/dashboard/manager/ManagerPatientDetails/ManagerQuickActions";
import ManagerSendWhatsApp from "../../../../components/dashboard/manager/ManagerPatientDetails/ManagerSendWhatsApp";
import ManagerStatusActions from "../../../../components/dashboard/manager/ManagerPatientDetails/ManagerStatusAction";
import ManagerVisitInformation from "../../../../components/dashboard/manager/ManagerPatientDetails/ManagerVisitInformation";
import { useGetPatientQuery } from "../../../../redux/services/dashboard/manager/manager.api";
import Spinner from "../../../../components/Spinner";
const ManagerPatientDetails = () => {
  const id = useParams();
  console.log('Patient ID from URL params:', id);
  const { data: patientData, isLoading } = useGetPatientQuery({ patientId: id.patientId || '' });
  console.log('Fetched patient data:', patientData);
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left side: takes 2/3 on large screens, full width on mobile */}
      <div className="w-full lg:w-2/3 space-y-6">
        <ManagerPatientInformation patientData={patientData} />
        <ManagerVisitInformation patientData={patientData} />
        <ManagerCallHistory patientData={patientData} />
      </div>

      {/* Right side: takes 1/3 on large screens, full width on mobile */}
      <div className="w-full lg:w-1/3 space-y-6">
        <ManagerStatusActions patientData={patientData} />
        <ManagerQuickActions patientData={patientData} />
        {/* <ManagerLogNewCall/> */}
        <ManagerSendWhatsApp patientData={patientData} />
      </div>
    </div>
  );
};

export default ManagerPatientDetails;
