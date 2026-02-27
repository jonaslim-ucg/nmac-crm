import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import {  useResetPasswordMutation } from '../../../../redux/services/auth/auth.api';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { setUser } from '../../../../redux/services/auth/auth.slice';

const AdminPasswordSecurity: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const refreshToken = useAppSelector((state) => state.auth.refresh_token); // get refresh token from Redux

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
const role = useAppSelector(state => state.auth.role); // get role once

const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  try {
    const response = await resetPassword({
      old_password: currentPassword,
      password: newPassword,
      // access_token: accessToken!,   // current token
      refresh_token: refreshToken!, // ensures backend can refresh
    }).unwrap();

    // update Redux store with new tokens
    dispatch(setUser({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      role: role!, // use role from selector
    }));

    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err: any) {
    toast.error(err?.data?.detail || "Failed to change password");
    console.error(err);
  }
};



  return (
    <div className="bg-gray-50 flex items-start justify-center">
      <div className="w-full rounded-2xl">

        {/* Current Password */}
        <div className="mb-4">
          <label 
            htmlFor="current-password" 
            className="block text-sm font-medium text-[#364153] mb-3"
          >
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-11 pr-4 py-2 bg-[#F3F3F5] border-0 rounded-full text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="mb-3">
          <label 
            htmlFor="new-password" 
            className="block text-sm font-medium text-[#364153] mb-3"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-11 pr-4 py-2 bg-[#F3F3F5]  border-0 rounded-full text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password Requirements */}
        <p className="text-sm text-gray-500 mb-6">
          Must be at least 8 characters with uppercase, lowercase, and numbers
        </p>

        {/* Confirm New Password */}
        <div className="mb-4">
          <label 
            htmlFor="confirm-password" 
            className="block text-sm font-medium text-[#364153] mb-3"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full pl-11 pr-4 py-2 bg-[#F3F3F5]  border-0 rounded-full text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Change Password Button */}
        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-md font-medium rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
        >
          <Lock className="w-4 h-4" />
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
};

export default AdminPasswordSecurity;