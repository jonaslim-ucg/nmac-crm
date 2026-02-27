import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";

interface Permission {
    name: string;
    granted: boolean;
}

const Permissions: React.FC = () => {
    const patientManagement: Permission[] = [
        { name: "View Patients", granted: true },
        { name: "Edit Patients", granted: false },
        { name: "Assign Patients", granted: false },
    ];

    const communication: Permission[] = [
        { name: "Send Messages", granted: true },
        { name: "Make Calls", granted: true },
        { name: "View Call Logs", granted: true },
    ];

    const systemAccess: Permission[] = [
        { name: "View Reports", granted: false },
        { name: "Export Data", granted: false },
        { name: "Access Audit Logs", granted: false },
        { name: "Manage Users", granted: false },
        { name: "Configure System", granted: false },
        { name: "Delete Records", granted: false },
    ];

    const PermissionRow = ({ permission }: { permission: Permission }) => (
        <div className="flex items-center justify-between bg-[#F9FAFB] py-3 px-4 rounded-full w-full">
            <span className="text-sm text-gray-900">{permission.name}</span>
            {permission.granted ? (
                <CheckCircle2 className="text-green-600 w-5 h-5" />
            ) : (
                <XCircle className="text-red-600 w-5 h-5" />
            )}
        </div>
    );

    const PermissionGrid = ({ list }: { list: Permission[] }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((item, idx) => (
                <PermissionRow key={idx} permission={item} />
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50">
            <div className="w-full">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Permissions</h1>
                        <p className="text-sm text-gray-500">
                            Permissions granted to this user based on their role
                        </p>
                    </div>

                    {/* Patient Management */}
                    <div className="mb-8">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Patient Management</h2>
                        <PermissionGrid list={patientManagement} />
                    </div>

                    <div className="border-t border-gray-200 mb-8" />

                    {/* Communication */}
                    <div className="mb-8">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Communication</h2>
                        <PermissionGrid list={communication} />
                    </div>

                    <div className="border-t border-gray-200 mb-8" />

                    {/* System Access */}
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 mb-4">System Access</h2>
                        <PermissionGrid list={systemAccess} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permissions;
