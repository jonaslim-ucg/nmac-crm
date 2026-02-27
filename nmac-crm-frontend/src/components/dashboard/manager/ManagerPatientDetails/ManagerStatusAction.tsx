import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useUpdatePatientStatusMutation } from '../../../../redux/services/dashboard/manager/manager.api';
import Swal from 'sweetalert2';

interface StatusActionsProps {
  patientData?: any; // optional to avoid crash before data loads
}

const ManagerStatusActions: React.FC<StatusActionsProps> = ({ patientData }) => {
  const [status, setStatus] = useState(patientData?.status || 'NOT_STARTED');
  const [isOpen, setIsOpen] = useState(false);

  const [updateStatus, { isLoading }] = useUpdatePatientStatusMutation();

  const statusOptions = [
    'NOT_STARTED',
    'CONTACTED',
    'INTERESTED',
    'BOOKED',
    'DECLINED',
    'CALL_BACK_LATER',
  ];

  // Sync status if patientData changes (important for async fetch)
  useEffect(() => {
    if (patientData?.status) {
      setStatus(patientData.status);
    }
  }, [patientData?.status]);

  const handleStatusChange = async (newStatus: string) => {
    if (!patientData?.id) return; // safety check
    try {
      setStatus(newStatus);
      setIsOpen(false);

      await updateStatus({
        patient_id: patientData.id,
        status: newStatus,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Patient status has been updated to ${newStatus.replaceAll('_', ' ')}.`,
      });

    } catch (error) {
      console.error('Status update failed', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update patient status. Please try again.',
      });
    }
  };

  // If patientData hasn't loaded yet, show a placeholder
  if (!patientData) {
    return <div className="p-4 text-gray-500">Loading patient status...</div>;
  }

  return (
    <div className="w-full bg-[#F9FAFB] rounded-2xl border border-gray-200 p-4 lg:p-6">
      <h2 className="text-base text-gray-900 mb-6">Status & Actions</h2>

      <div className="space-y-6">
        {/* Current Status */}
        <div>
          <label className="block text-base text-gray-900 mb-3 font-semibold">
            Current Status
          </label>
          <div className="relative">
            <button
              disabled={isLoading}
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-full text-base text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <span>{status.replaceAll('_', ' ')}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    disabled={isLoading}
                    onClick={() => handleStatusChange(option)}
                    className={`w-full px-4 py-3 text-left text-base hover:bg-gray-50 transition-colors ${
                      option === status ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    {option.replaceAll('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Agent */}
        <div>
          <label className="block text-base text-gray-900 mb-3 font-semibold">
            Assigned Agent
          </label>
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-full text-base text-gray-900">
            {patientData?.agent?.name || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerStatusActions;
