import ManagerPatientCard from "./ManagerPatientCard";
// import { useGetPatientSummaryQuery } from "../../../../redux/services/dashboard/manager/manager.api";
// import { useGetAllPatientQuery } from "../../../../redux/services/dashboard/admin/admin.patient";
import { useMemo } from "react";
// import ExcelUploadModal from "./ExcelUploadModal";
interface ManagerAssignedPatientsProps {
    patientSummaryData?: any;
    patientsData?: any;
}
const ManagerAssignedPatients: React.FC<ManagerAssignedPatientsProps> = ({ patientSummaryData, patientsData }) => {
    const highPriorityCount = useMemo(() => {
        if (!patientsData?.results) return 0;

        return patientsData.results.filter(
            (patient: any) => patient?.priority?.toLowerCase() === "high"
        ).length;
    }, [patientsData]);
    // const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // const handleUpload = (data: any[]) => {
    //     console.log("Uploaded data:", data);
    //     // TODO: Implement upload logic here
    // };

    const cards = [
        {
            title: 'My Patients',
            count: patientSummaryData?.total_patients,
            bgColor: 'bg-[#E4F4FF]',
            iconColor: 'text-blue-600',
        },
        {
            title: 'High Priority',
            count: highPriorityCount,
            bgColor: 'bg-[#F3E9FF]',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Unassigned',
            count: patientSummaryData?.unassigned_patients,
            bgColor: 'bg-[#FDE3D9]',
            iconColor: 'text-orange-600',
        },
    ];


    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        All Patients
                    </h1>
                    <p className="text-base text-gray-500">
                        Manage and assign patients to agents
                    </p>
                </div>

                {/* <div className="flex justify-end mt-6 px-4">
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        Upload Client Data
                    </button>
                </div> */}
            </div>


            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <ManagerPatientCard
                        key={index}
                        title={card.title}
                        count={card.count}
                        bgColor={card.bgColor}
                        iconColor={card.iconColor}
                    />
                ))}
            </div>

            {/* <ExcelUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUpload}
            /> */}
        </div >
    );
};

export default ManagerAssignedPatients;