import React from 'react';
import { X } from 'lucide-react';

interface DeleteTemplateModalProps {
    isOpen: boolean;
    templateName?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({ isOpen, templateName, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Delete Template</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{templateName}</span>? This action cannot be undone.
                </p>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTemplateModal;
