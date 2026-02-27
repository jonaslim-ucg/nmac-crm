import { CheckCircle, Info, Mail, MapPin, Phone, Save, Shield, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUserQuery, useUpdateUserProfileMutation } from '../../../../redux/services/dashboard/admin/adminUserApi';
import Swal from 'sweetalert2';
import type { ApiUser } from '../../../../redux/services/dashboard/admin/types/adminUser.type';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    employeeId: string;
    department: string;
    role: string;
    status: string;
    // report_to_id: string;
    // report_to_name: string;
    reportsTo: string;
}



const EditUser: React.FC = () => {
      const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user; // 👈 get user from state

  useEffect(() => {
    if (!user) {
      // redirect back if no user data
      navigate('/dashboard/admin/user-management');
    }
  }, [user, navigate]);
    console.log(user);
    const [updateUser, { isLoading }] = useUpdateUserProfileMutation();
    const { data: usersData = [] } = useGetUserQuery();
    
     const reportsTo: ApiUser[] =
                 usersData?.results?.filter((user: ApiUser) => user ) ?? [];
    
    
            console.log(reportsTo);
    const [formData, setFormData] = useState<FormData>({
            fullName: user?.name,
            email: user?.email,
            phone: user?.phone || '',
            location: user?.location || '',
            employeeId: user?.id,
            department: user?.department || '',
            role: user?.role || '',
            status: user?.is_active ? 'Active' : 'Inactive',
            reportsTo: user?.report_to_id || '', // store manager ID here
        });


    const [hasChanges, setHasChanges] = useState(false);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleCancel = () => {
        setHasChanges(false);
    };

    const handleSave = async () => {
        const payload = new FormData();
        payload.append('name', formData.fullName || '');
        payload.append('department', formData.department || '');
        payload.append('report_to_id', formData.reportsTo || '');
        payload.append('phone', formData.phone || '');
        console.log(payload)
        try {
            await updateUser({ user_id: user.id, body: payload }).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'User updated successfully!',
                timer: 2000,
                showConfirmButton: false,
            });
            setHasChanges(false);
            navigate('/dashboard/admin/user-management');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: error?.data?.detail || error.message,
            });
        }
    };





    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="">
                <div className="w-full">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Edit User: John Agent</h1>
                    <p className="text-sm text-gray-500">Update user information, role, and permissions</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Personal Details Card */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="w-5 h-5 text-gray-700" />
                            <h2 className="text-base font-semibold text-gray-900">Personal Details</h2>
                        </div>

                        <div className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                    <User className="w-4 h-4" />
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5] border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5]  border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5] border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5]  border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employment Details Card */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-5 h-5 text-gray-700" />
                            <h2 className="text-base font-semibold text-gray-900">Employment Details</h2>
                        </div>

                        <div className="space-y-5">
                            {/* Employee ID */}
                            <div>
                                <label className="text-sm font-bold text-gray-900 mb-2 block">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    value={formData.employeeId}
                                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5] border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Department */}
                            <div>
                                <label className="text-sm font-bold text-gray-900 mb-2 block">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5]  border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                    <Shield className="w-4 h-4" />
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5] border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="AGENT">Agent</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5]  border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Reports To */}
                            <div>
                                <label className="text-sm font-bold text-gray-900 mb-2 block">
                                    Reports To
                                </label>
                                <select
                                        value={formData.reportsTo} // this is manager ID now
                                        onChange={(e) => handleInputChange('reportsTo', e.target.value)}
                                                                            className="w-full px-4 py-2 bg-[#F3F3F5]  border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                        >
                                        {reportsTo.map((manager) => (
                                            <option key={manager.id} value={manager.id}>
                                            {manager.name}
                                            </option>
                                        ))}
                                </select>

                                {/* <select
                                    value={formData.report_to_name}
                                    onChange={(e) => handleInputChange('report_to_name', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F3F3F5]  border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                     <option value="Sarah Manager">Sarah Manager</option>
                                    <option value="John Supervisor">John Supervisor</option>
                                    <option value="Mary Director">Mary Director</option>
                                </select> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Role-Based Defaults</h3>
                            <p className="text-sm text-blue-700">
                                Changing the role will automatically update permissions to match the new role's default access level. You can customize these in the Permissions tab.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-white border border-gray-200 rounded-3xl p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            {hasChanges ? 'Unsaved changes' : 'No changes made'}
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 text-sm font-medium text-white bg-[#030213] rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isLoading? "Saving Changes...":"Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;