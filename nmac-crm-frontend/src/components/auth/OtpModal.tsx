import React, { useState } from "react";

interface OTPModalProps {
  otp: string;
  email: string;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ otp, email, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);

      // Optional: reset back to "Copy" after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy OTP:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">OTP Sent</h2>
        <p className="text-sm mb-4">
          An OTP has been sent to <strong>{email}</strong>. Expires in 1 minute.
        </p>
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-4">
          <span className="text-lg font-mono">{otp}</span>
          <button
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            onClick={copyToClipboard}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-sm text-gray-500">Use this OTP to complete login.</p>
      </div>
    </div>
  );
};

export default OTPModal;
