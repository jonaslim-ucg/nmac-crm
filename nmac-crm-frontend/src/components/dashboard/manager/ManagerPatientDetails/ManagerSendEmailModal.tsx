import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSendEmailMutation } from '../../../../redux/services/communications/communications.api';
import { useGetUserProfileQuery } from '../../../../redux/services/auth/auth.api';
import { toast } from 'react-toastify';

interface ManagerSendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientEmail: string;
}

const ManagerSendEmailModal: React.FC<ManagerSendEmailModalProps> = ({ isOpen, onClose, patientEmail }) => {
    const { data: userData } = useGetUserProfileQuery();
    const [sendEmail, { isLoading }] = useSendEmailMutation();

    const [formData, setFormData] = useState({
        subject: '',
        to: patientEmail,
        message: '',
        cc: '',
        bcc: '',
        reply_to: '',
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, to: patientEmail }));
    }, [patientEmail]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendEmail({
                subject: formData.subject,
                to: formData.to,
                message: formData.message,
                from_email: userData?.email,
                from_name: userData?.name || userData?.email,
                cc: formData.cc ? formData.cc.split(',').map(s => s.trim()) : [],
                bcc: formData.bcc ? formData.bcc.split(',').map(s => s.trim()) : [],
                reply_to: formData.reply_to ? formData.reply_to.split(',').map(s => s.trim()) : [],
            }).unwrap();
            toast.success('Email sent successfully');
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to send email');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl text-left">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">Send Email</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">To</label>
                        <input
                            type="email"
                            value={formData.to}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Subject</label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                            placeholder="Email subject"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Message</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all resize-none"
                            placeholder="Type your message here..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left text-xs">CC (comma separated)</label>
                            <input
                                type="text"
                                value={formData.cc}
                                onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all text-sm"
                                placeholder="cc@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left text-xs">BCC (comma separated)</label>
                            <input
                                type="text"
                                value={formData.bcc}
                                onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all text-sm"
                                placeholder="bcc@example.com"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-full border border-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManagerSendEmailModal;
