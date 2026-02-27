import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Upload, X, FileSpreadsheet, CheckCircle } from 'lucide-react';

interface ExcelUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
        if (fileType !== 'xlsx' && fileType !== 'xls') {
            Swal.fire({
                icon: "error",
                title: "Invalid File Type",
                text: "Please upload a valid Excel file (.xlsx or .xls)",
                timer: 1500
            });
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = () => {
        if (!file) {
            Swal.fire({
                icon: "warning",
                title: "No File",
                text: "Please select a file to upload.",
            });
            return;
        }
        onUpload(file);
        // Reset state after upload
        setFile(null);
        onClose();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Upload Client Data</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Import bulk client information via Excel
                    </p>
                </div>

                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        className="hidden"
                    />

                    {file ? (
                        <div className="flex flex-col items-center">
                            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                            <p className="font-medium text-gray-700">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-green-500 mb-2 transition-colors" />
                            <p className="text-sm text-gray-600 font-medium">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                XLSX or XLS files only
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-colors
              ${!file
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-black hover:bg-gray-800'
                            }`}
                    >
                        Import Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploadModal;
