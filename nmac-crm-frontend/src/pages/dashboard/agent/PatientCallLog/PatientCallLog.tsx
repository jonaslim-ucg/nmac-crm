import { useParams } from "react-router-dom"
import Header from "../../../../components/dashboard/agent/PatientCallLog/Header"
import Tabs from "../../../../components/dashboard/agent/PatientCallLog/Tabs"
import { useGetPatientQuery } from "../../../../redux/services/dashboard/manager/manager.api";
import Spinner from "../../../../components/Spinner";

const PatientCallLog = () => {
     const patient = useParams();
     console.log(patient.patientId);
     const { data: patientData, isLoading } = useGetPatientQuery({ patientId: patient.patientId || '' });
    console.log('Fetched patient data:', patientData);

    if (isLoading) {
        return <Spinner />;
    }
    return (
        <>
        <Header patientData={patientData}/>
        <Tabs />
        </>
    )
}

export default PatientCallLog