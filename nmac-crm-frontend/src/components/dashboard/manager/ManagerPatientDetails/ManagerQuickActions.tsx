import { Phone, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ManagerSendEmailModal from './ManagerSendEmailModal';

interface ManagerQuickActionsProps {
    patientData: any;
}

const ManagerQuickActions: React.FC<ManagerQuickActionsProps> = ({ patientData }) => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const handleCall = () => {
        if (patientData?.phone) {
            window.location.href = `tel:${patientData.phone}`;
        } else {
            toast.error('Patient phone number not found');
        }
    };

    const handleSendEmail = () => {
        if (patientData?.email) {
            setIsEmailModalOpen(true);
        } else {
            toast.error('Patient email address not found');
        }
    };

    return (
        <div className="w-full bg-[#F9FAFB] rounded-2xl border border-gray-200 p-4 lg:p-6">
            <h2 className="text-gray-900 text-base font-normal mb-4">Quick Actions</h2>

            <div className="space-y-3">
                {/* Call Patient Button */}
                <button
                    onClick={handleCall}
                    className="w-full bg-gray-900 text-white rounded-full py-2.5 px-6 flex items-center justify-center gap-2 transition-colors cursor-pointer hover:bg-gray-800 active:bg-gray-950"
                >
                    <Phone className="w-5 h-5" />
                    <span className="text-base font-normal">Call Patient</span>
                </button>

                {/* Send Email Button */}
                <button
                    onClick={handleSendEmail}
                    className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 rounded-full py-2.5 px-6 flex items-center justify-center gap-2 border border-gray-200 transition-colors cursor-pointer"
                >
                    <Mail className="w-5 h-5" />
                    <span className="text-base font-normal">Send Email</span>
                </button>
            </div>

            <ManagerSendEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                patientEmail={patientData?.email || ''}
            />
        </div>
    );
};

export default ManagerQuickActions;