import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useGetAllNotificationsAlertQuery, usePostNotificationAlertMutation } from '../../../../redux/services/dashboard/settings';
import Spinner from '../../../Spinner';
import Swal from 'sweetalert2';

const AgentNotifications: React.FC = () => {
    const { data: notificationsAlert, isLoading: notificationsLoading } = useGetAllNotificationsAlertQuery();
    const [updateSettings, { isLoading: isUpdating }] = usePostNotificationAlertMutation();

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [whatsappNotifications, setWhatsappNotifications] = useState(true);
    const [callReminders, setCallReminders] = useState(true);
    const [reminderFrequency, setReminderFrequency] = useState('Daily');

    useEffect(() => {
        if (notificationsAlert) {
            setEmailNotifications(notificationsAlert.email_notifications);
            setWhatsappNotifications(notificationsAlert.whatsapp_notifications);
            setCallReminders(notificationsAlert.call_reminder_notifications);
            setReminderFrequency(notificationsAlert.reminder_frequency || 'Daily');
        }
    }, [notificationsAlert]);

    const handleSave = async () => {
        try {
            await updateSettings({
                email_notifications: emailNotifications,
                whatsapp_notifications: whatsappNotifications,
                call_reminder_notifications: callReminders,
                reminder_frequency: reminderFrequency,
            }).unwrap();

            Swal.fire({
                title: 'Success!',
                text: 'Your notification preferences have been saved.',
                icon: 'success',
                confirmButtonColor: '#000000',
                customClass: {
                    popup: 'rounded-3xl',
                    confirmButton: 'rounded-full px-8'
                }
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save settings. Please try again.',
                icon: 'error',
                confirmButtonColor: '#000000',
                customClass: {
                    popup: 'rounded-3xl',
                    confirmButton: 'rounded-full px-8'
                }
            });
        }
    };

    const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-black' : 'bg-gray-300'
                }`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
            />
        </button>
    );

    if (notificationsLoading) return <Spinner />;

    return (
        <div className="">
            <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-start justify-between gap-4 bg-white p-4 rounded-2xl">
                    <div className="flex-1">
                        <h2 className="mb-1 text-lg font-medium text-[#1E2939]">Email Notifications</h2>
                        <p className="text-md font-light text-[#6A7282]">
                            Receive email updates about patient activity
                        </p>
                    </div>
                    <Toggle
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                    />
                </div>

                {/* WhatsApp Notifications */}
                <div className="flex items-start justify-between gap-4 bg-white p-4 rounded-2xl">
                    <div className="flex-1">
                        <h2 className="mb-1 text-lg font-medium text-[#1E2939]">WhatsApp Notifications</h2>
                        <p className="text-md font-light text-[#6A7282]">
                            Receive WhatsApp alerts for urgent tasks
                        </p>
                    </div>
                    <Toggle
                        checked={whatsappNotifications}
                        onChange={() => setWhatsappNotifications(!whatsappNotifications)}
                    />
                </div>

                {/* Call Reminder Alerts */}
                <div className="flex items-start justify-between gap-4 bg-white p-3 rounded-2xl">
                    <div className="flex-1">
                        <h2 className="mb-1 text-lg font-medium text-[#1E2939]">Call Reminder Alerts</h2>
                        <p className="text-md font-light text-[#6A7282]">
                            Get reminders for scheduled patient calls
                        </p>
                    </div>
                    <Toggle
                        checked={callReminders}
                        onChange={() => setCallReminders(!callReminders)}
                    />
                </div>

                {/* Reminder Frequency */}
                <div className='bg-white p-4 rounded-2xl'>
                    <div className="space-y-3">
                        <h2 className="text-lg font-medium text-[#1E2939]">Reminder Frequency</h2>
                        <div className="relative">
                            <select
                                value={reminderFrequency}
                                onChange={(e) => setReminderFrequency(e.target.value)}
                                className="w-full appearance-none rounded-full bg-[#F3F3F5] px-4 py-2.5 text-base font-light text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-0"
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                <svg
                                    width="12"
                                    height="8"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 1.5L6 6.5L11 1.5"
                                        stroke="#666666"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-6">
                <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2 text-md font-normal text-white transition-colors hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-400"
                >
                    <Save size={16} />
                    {isUpdating ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </div>
    );
};

export default AgentNotifications;
