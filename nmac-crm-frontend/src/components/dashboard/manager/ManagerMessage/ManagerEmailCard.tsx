import React from 'react';

const EmailCard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-xl font-normal text-gray-900">Email Conversations</h1>
            <span className="text-md text-gray-600 border rounded-full border-gray-200 px-1">0 Emails</span>
          </div>
          <p className="text-md text-[#717182]">View and manage email communications</p>
        </div>

        {/* Empty State - Large white space as shown in image */}
        <div className="min-h-[500px]">
          {/* Intentionally empty to match the design */}
        </div>
      </div>
    </div>
  );
};

export default EmailCard;