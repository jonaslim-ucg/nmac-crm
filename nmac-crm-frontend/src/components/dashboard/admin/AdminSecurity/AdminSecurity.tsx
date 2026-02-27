import React, { useEffect, useState } from 'react';
import { ShieldCheck, CircleCheckBig, Settings } from 'lucide-react';
import SystemConfiguration from './SystemConfiguration';
import {
  useGetPrivacyDataQuery,
  useGetTermsDataQuery,
  usePostPrivacyDataMutation,
  usePostTermsDataMutation
} from '../../../../redux/services/dashboard/settings';
import Spinner from '../../../Spinner';
import Swal from 'sweetalert2';

type TabType = 'Privacy' | 'Terms and Conditions' | 'System Configuration';

const AdminSecurity: React.FC = () => {
  const { data: privacyData, isLoading: isPrivacyLoading } = useGetPrivacyDataQuery();
  const { data: termsData, isLoading: isTermsLoading } = useGetTermsDataQuery();

  const [updatePrivacy, { isLoading: isUpdatingPrivacy }] = usePostPrivacyDataMutation();
  const [updateTerms, { isLoading: isUpdatingTerms }] = usePostTermsDataMutation();

  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  const [savedPrivacy, setSavedPrivacy] = useState("");
  const [savedTerms, setSavedTerms] = useState("");

  const [activeTab, setActiveTab] = useState<TabType>('Privacy');

  useEffect(() => {
    if (privacyData) {
      setPrivacyPolicy(privacyData.details || "");
      setSavedPrivacy(privacyData.details || "");
    }
  }, [privacyData]);

  useEffect(() => {
    if (termsData) {
      setTermsAndConditions(termsData.details || "");
      setSavedTerms(termsData.details || "");
    }
  }, [termsData]);

  const tabs: TabType[] = [
    'Privacy',
    'Terms and Conditions',
    'System Configuration'
  ];

  const getTabDescription = (): string => {
    switch (activeTab) {
      case 'Privacy':
        return 'Manage user privacy policy and data protection settings';
      case 'Terms and Conditions':
        return 'Manage platform terms of service and usage conditions';
      case 'System Configuration':
        return 'Configure system-wide operational settings';
      default:
        return '';
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'Privacy':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Terms and Conditions':
        return <CircleCheckBig className="w-6 h-6" />;
      case 'System Configuration':
        return <Settings className="w-6 h-6" />;
      default:
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  const handleSavePrivacy = async () => {
    try {
      await updatePrivacy({ details: privacyPolicy }).unwrap();
      setSavedPrivacy(privacyPolicy);
      Swal.fire({
        title: 'Success!',
        text: 'Privacy policy has been updated.',
        icon: 'success',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-full px-8'
        }
      });
    } catch (error) {
      console.error('Failed to save privacy policy:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update privacy policy. Please try again.',
        icon: 'error',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-full px-8'
        }
      });
    }
  };

  const handleSaveTerms = async () => {
    try {
      await updateTerms({ details: termsAndConditions }).unwrap();
      setSavedTerms(termsAndConditions);
      Swal.fire({
        title: 'Success!',
        text: 'Terms and conditions have been updated.',
        icon: 'success',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-full px-8'
        }
      });
    } catch (error) {
      console.error('Failed to save terms and conditions:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update terms and conditions. Please try again.',
        icon: 'error',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-full px-8'
        }
      });
    }
  };

  if (isPrivacyLoading || isTermsLoading) return <Spinner />;

  const renderPrivacyContent = () => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Privacy Policy Content
          </label>
          <textarea
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            rows={20}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none bg-[#F9FAFB]"
            placeholder="Enter privacy policy text here..."
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setPrivacyPolicy(savedPrivacy)}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePrivacy}
            disabled={isUpdatingPrivacy}
            className="px-8 py-2.5 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300"
          >
            {isUpdatingPrivacy ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  };

  const renderTermsContent = () => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms and Conditions Content
          </label>
          <textarea
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            rows={20}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none bg-[#F9FAFB]"
            placeholder="Enter terms and conditions text here..."
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setTermsAndConditions(savedTerms)}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTerms}
            disabled={isUpdatingTerms}
            className="px-8 py-2.5 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300"
          >
            {isUpdatingTerms ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  };

  const renderSystemConfiguration = () => {
    return (
      <SystemConfiguration />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Security & Compliance
          </h1>
          <p className="text-base text-gray-500">
            HIPAA compliance and security settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="w-full overflow-x-auto no-scrollbar mb-8">
          <div className="inline-flex gap-2 bg-gray-200 p-1 rounded-3xl flex-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Section Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-8 h-8 flex items-center justify-center text-gray-700">
              {getTabIcon()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab}
              </h2>
              <p className="text-base text-gray-500">
                {getTabDescription()}
              </p>
            </div>
          </div>

          {/* Privacy content info banner */}
          {activeTab === 'Privacy' && (
            <div className="bg-[#e8f0ff] rounded-2xl p-4 mb-6 border border-[#c5d9f7]">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5">
                  <ShieldCheck className='text-[#155DFC]' />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#1e40af] mb-1">
                    Privacy Policy Status: Active
                  </div>
                  <div className="text-sm text-[#2563eb]">
                    Your privacy policy and data protection settings are currently active and visible to users.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'Privacy' ? (
            renderPrivacyContent()
          ) : activeTab === 'Terms and Conditions' ? (
            renderTermsContent()
          ) : (
            renderSystemConfiguration()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
