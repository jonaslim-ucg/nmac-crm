import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useGetAllNotificationsAlertQuery, usePostNotificationAlertMutation } from '../../../../redux/services/dashboard/settings';
import Spinner from '../../../Spinner';
import Swal from 'sweetalert2';

const AdminNotifications: React.FC = () => {
    const { data: notificationsAlert, isLoading: notificationsLoading } = useGetAllNotificationsAlertQuery();
    const [updateSettings, { isLoading: isUpdating }] = usePostNotificationAlertMutation();

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [dailySummaryAlerts, setDailySummaryAlerts] = useState(true);
    const [performanceAlerts, setPerformanceAlerts] = useState(true);

    useEffect(() => {
        if (notificationsAlert) {
            setEmailNotifications(notificationsAlert.email_notifications);
            setDailySummaryAlerts(notificationsAlert.daily_summery_alert);
            setPerformanceAlerts(notificationsAlert.performance_alert);
        }
    }, [notificationsAlert]);

    const handleSave = async () => {
        try {
            await updateSettings({
                email_notifications: emailNotifications,
                daily_summery_alert: dailySummaryAlerts,
                performance_alert: performanceAlerts,
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

                {/* Daily Summary Alerts */}
                <div className="flex items-start justify-between gap-4 bg-white p-4 rounded-2xl">
                    <div className="flex-1">
                        <h2 className="mb-1 text-lg font-medium text-[#1E2939]">Daily Summary Alerts</h2>
                        <p className="text-md font-light text-[#6A7282]">
                            Daily reports for agent performance and outreach efforts
                        </p>
                    </div>
                    <Toggle
                        checked={dailySummaryAlerts}
                        onChange={() => setDailySummaryAlerts(!dailySummaryAlerts)}
                    />
                </div>

                {/* Performance Alerts */}
                <div className="flex items-start justify-between gap-4 bg-white p-3 rounded-2xl">
                    <div className="flex-1">
                        <h2 className="mb-1 text-lg font-medium text-[#1E2939]">Performance Alerts</h2>
                        <p className="text-md font-light text-[#6A7282]">
                            Notifications about underperforming agents or conversion issues
                        </p>
                    </div>
                    <Toggle
                        checked={performanceAlerts}
                        onChange={() => setPerformanceAlerts(!performanceAlerts)}
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-10">
                <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-md font-normal text-white transition-colors hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-400"
                >
                    <Save size={16} />
                    {isUpdating ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </div>
    );
};

export default AdminNotifications;
