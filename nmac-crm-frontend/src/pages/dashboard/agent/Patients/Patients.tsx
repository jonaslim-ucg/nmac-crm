
import { useState } from 'react';
import AssignedPatients from '../../../../components/dashboard/agent/Patients/AssignedPatients'
import PatientsTable from '../../../../components/dashboard/agent/Patients/PatientsTable'
import Spinner from '../../../../components/Spinner';
import { useGetPatientSummaryQuery } from '../../../../redux/services/dashboard/manager/manager.api';
import { useGetAllPatientQuery } from '../../../../redux/services/dashboard/admin/admin.patient';

const Patients = () => {
    const [limit] = useState(5);
    const [page] = useState(1);
  
    const offset = (page - 1) * limit;
        const { data: patientSummaryData , isLoading: isPatientSummaryLoading } = useGetPatientSummaryQuery();
        const { data: patientsData, isLoading: isPatientsLoading } = useGetAllPatientQuery({ limit, offset });
            if (isPatientSummaryLoading || isPatientsLoading) {
          return <Spinner />;
            }
  return (
    <>
    <AssignedPatients patientSummaryData={patientSummaryData} patientsData={patientsData}/>
    <PatientsTable/>
    </>
  )
}

export default Patients