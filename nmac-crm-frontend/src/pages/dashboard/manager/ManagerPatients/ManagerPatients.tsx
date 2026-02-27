import ManagerPatientsTable from '../../../../components/dashboard/manager/MangerPatients/ManagerPatientsTable'
import ManagerAssignedPatients from '../../../../components/dashboard/manager/MangerPatients/ManagerAssignedPatients'
import ExcelUploadModal from '../../../../components/dashboard/manager/MangerPatients/ExcelUploadModal';
import Spinner from '../../../../components/Spinner';
import { useGetAllPatientQuery, useUploadPatientFileMutation } from '../../../../redux/services/dashboard/admin/admin.patient';
import { useGetPatientSummaryQuery } from '../../../../redux/services/dashboard/manager/manager.api';
import { useState } from 'react';

const ManagerPatients = () => {

  const [limit] = useState(5);
  const [page] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const offset = (page - 1) * limit;
  const { data: patientSummaryData, isLoading: isPatientSummaryLoading } = useGetPatientSummaryQuery();
  const { data: patientsData, isLoading: isPatientsLoading } = useGetAllPatientQuery({ limit, offset });
  const [uploadPatientFile] = useUploadPatientFileMutation();
  if (isPatientSummaryLoading || isPatientsLoading) {
    return <Spinner />;
  }

const handleUploadData = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    await uploadPatientFile(formData); // your RTK mutation
  } catch (error) {
    console.error(error);
  }
};


  return (
    <>
      <ManagerAssignedPatients patientSummaryData={patientSummaryData} patientsData={patientsData} />
      <ManagerPatientsTable/>
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadData}
      />
    </>
  )
}

export default ManagerPatients