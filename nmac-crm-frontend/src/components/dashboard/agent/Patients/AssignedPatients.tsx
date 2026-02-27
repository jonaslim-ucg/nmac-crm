import React, { useMemo } from "react";
import PatientCard from "./PatientCard";


interface MyAssignedPatientsProps {

    patientSummaryData?: any;
    patientsData?: any;
}

const AssignedPatients: React.FC<MyAssignedPatientsProps> = ({
    patientSummaryData, patientsData
}) => {
    

    console.log(patientsData);

    // Count calculations
    const highPriorityCount = useMemo(() => {
        if (!patientsData?.results) return 0;

        return patientsData.results.filter(
            (patient: any) => patient?.priority?.toLowerCase() === "high"
        ).length;
    }, [patientsData]);

    console.log(highPriorityCount);
    console.log(patientSummaryData);
    const cards = [
        {
            title: 'My Patients',
            count: patientSummaryData?.total_patients || 0,
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
            count: patientSummaryData?.unassigned_patients || 0,
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
                        My Assigned Patients
                    </h1>
                    <p className="text-base text-gray-500">
                        Manage your assigned patient list
                    </p>
                </div>

                
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <PatientCard
                        key={index}
                        title={card.title}
                        count={card.count}
                        bgColor={card.bgColor}
                        iconColor={card.iconColor}
                    />
                ))}
            </div>
            
        </div>
    );
};

export default AssignedPatients;