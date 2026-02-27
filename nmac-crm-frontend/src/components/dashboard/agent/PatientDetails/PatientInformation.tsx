import { Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';

interface ManagerPatientInformationProps {
    patientData: any;
}

const PatientInformation: React.FC<ManagerPatientInformationProps> = ({
    patientData,
}) => {
        const age = Date.now() - new Date(patientData?.dob || '').getTime();
    const ageDate = new Date(age);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);  
    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Patient Information
            </h2>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Patient ID */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Patient ID</label>
                    <p className="text-base text-gray-900">{patientData?.id}</p>
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                    <p className="text-base text-gray-900">{patientData?.name}</p>
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-base text-gray-900">
                        {patientData?.dob} ({calculatedAge} years)
                    </p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone</label>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-900" strokeWidth={2} />
                        <p className="text-base text-gray-900">{patientData?.phone}</p>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-900" strokeWidth={2} />
                        <p className="text-base text-gray-900">{patientData?.email}</p>
                    </div>
                </div>

                {/* Insurance */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Insurance</label>
                    <p className="text-base text-gray-900">{patientData?.insurance_payer}</p>
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Address</label>
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-900 mt-0.5 shrink-0" strokeWidth={2} />
                        <p className="text-base text-gray-900">{patientData?.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientInformation;