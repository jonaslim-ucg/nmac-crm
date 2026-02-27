import { Camera, Loader2, Mail, Phone, Save } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import AgentNotifications from '../../../../components/dashboard/agent/Settings/AgentNotifications';
import PasswordSecurity from '../../../../components/dashboard/agent/Settings/PasswordSecurity';
import WorkHours from '../../../../components/dashboard/agent/Settings/WorkHours';
import { useGetUserProfileQuery, useUpdateProfileMutation } from '../../../../redux/services/auth/auth.api';
import Swal from 'sweetalert2';
import Spinner from '../../../../components/Spinner';

type TabType = 'profile' | 'notifications' | 'workHours' | 'security';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
 const [preview, setPreview] = useState<string | null>(null);
    const { data: userInfo, isLoading } = useGetUserProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] =
      useUpdateProfileMutation();
  const [formData, setFormData] = useState<{
      fullName: string;
      email: string;
      phone: string;
      photo: File | string | null;
    }>({
      fullName: '',
      email: '',
      phone: '',
      photo: null,
    });
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

          useEffect(() => {
        // Case 1: new uploaded file
        if (formData.photo instanceof File) {
          const url = URL.createObjectURL(formData.photo);
          setPreview(url);
      
          return () => URL.revokeObjectURL(url);
        }
      
        // Case 2: backend image URL
        if (typeof formData.photo === 'string' && formData.photo) {
          setPreview(formData.photo);
          return;
        }
      
        // Case 3: fallback from userInfo
        if (userInfo?.photo) {
          setPreview(userInfo.photo);
          return;
        }
      
        // Case 4: no image
        setPreview(null);
      }, [formData.photo, userInfo?.photo]);
  
        useEffect(() => {
          if (userInfo) {
            setFormData({
              fullName: userInfo.name ?? '',
              email: userInfo.email ?? '',
              phone: userInfo.phone ?? 'N/A',
              photo: userInfo.photo ?? '',
            });
          }
        }, [userInfo]);

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile Settings' },
    { id: 'notifications' as TabType, label: 'Notification Preferences' },
    { id: 'workHours' as TabType, label: 'Work Hours & Time Zone' },
    { id: 'security' as TabType, label: 'Password & Security' }
  ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
    
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Type validation
        if (!file.type.startsWith('image/')) {
          Swal.fire('Invalid file', 'Please upload an image file', 'error');
          return;
        }

        // Size validation (2MB)
        if (file.size > 2 * 1024 * 1024) {
          Swal.fire('File too large', 'Max size is 2MB', 'error');
          return;
        }

        setFormData((prev) => ({
          ...prev,
          photo: file,
        }));
      };

      const handleSaveProfile = async () => {
      try {
        const fd = new FormData();
    
        fd.append('name', formData.fullName);
        fd.append('phone', formData.phone);
    
        if (formData.photo) {
          fd.append('photo', formData.photo);
        }
    
        await updateProfile(fd).unwrap();
    
        Swal.fire({
          icon: 'success',
          title: 'Profile updated successfully',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: error?.data?.detail || 'Something went wrong',
        });
      }
    };
    
    
      if (isLoading) return <Spinner />
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <button
                 onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                />

              </div>
              <div>
                <h3 className="text-sm font-normal text-[#364153] mb-1">Profile Picture</h3>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-md font-normal text-[#364153] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#F3F3F5] border-0 rounded-full text-sm text-[#717182] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-md font-normal text-[#364153] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F3F3F5] border-0 rounded-full text-sm text-[#717182] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 lg:pr-3">
              <label className="block text-md font-normal text-[#364153] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F3F3F5] border-0 rounded-full text-sm text-[#717182] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Save Button */}
            <div>
              <button onClick={handleSaveProfile} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm font-normal rounded-full hover:bg-gray-800 transition-colors">
                <Save className="w-4 h-4" />
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <AgentNotifications />
        );

      case 'workHours':
        return (
          <WorkHours />
        );

      case 'security':
        return (
          <PasswordSecurity />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Main Content */}
      <div className="w-full p-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-500">Manage your profile, preferences, and account settings</p>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar mb-2">
          <div className="inline-flex gap-2 mb-6 bg-gray-200 px-0.5 py-0.5 rounded-3xl w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-md font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl border-3 border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;