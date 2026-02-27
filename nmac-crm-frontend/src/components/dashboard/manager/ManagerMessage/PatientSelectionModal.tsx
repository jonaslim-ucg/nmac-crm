import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useGetAllPatientQuery } from '../../../../redux/services/dashboard/admin/admin.patient';
import Spinner from '../../../Spinner';

interface PatientSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (patientId: string) => void;
}

const PatientSelectionModal: React.FC<PatientSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: patientsData, isLoading } = useGetAllPatientQuery({ limit: 100, offset: 0 }); // Fetch more to allow better filtering

    const patients = patientsData?.results || [];

    const filteredPatients = patients.filter((patient: any) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Select Patient</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {isLoading ? (
                            <div className="flex justify-center p-4">
                                <Spinner />
                            </div>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((patient: any) => (
                                <button
                                    key={patient.id}
                                    onClick={() => onSelect(patient.id)}
                                    className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mr-3">
                                        {patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {patient.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {patient.email || 'No email'}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500 py-4">
                                No patients found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSelectionModal;
