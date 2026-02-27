// import React, { useState } from 'react';
// import loginImg from '../../../assets/login-image.png';
// import Footer from '../../../components/auth/Login/Footer';
// import { Link } from 'react-router-dom';
// const ForgotPassword: React.FC = () => {
//     const [email, setEmail] = useState('');

//     const handleLogin = () => {
//         console.log('Login submitted:', { email});
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
//             {/* 🔹 Background Image (Flipped) */}
//             <div
//                 className="absolute inset-0 bg-cover bg-center scale-x-[-1]"
//                 style={{
//                     backgroundImage: `url(${loginImg})`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                 }}
//             ></div>

//             {/* 🔹 Main Content */}
//             <div className=" flex items-center justify-end relative z-10 py-12 md:py-20">
//                 <div className="w-full md:w-[50%] flex justify-end items-center">
//                     <div className="w-full max-w-md">
//                         <div className="bg-white rounded-tl-[40px] rounded-bl-[10px] shadow-2xl p-6 sm:p-8">
//                             {/* Header */}
//                             <div className="text-center mb-6">
//                                 <h2 className="text-2xl font-semibold text-gray-900 mb-0.5">
//                                     Northshore Medical
//                                 </h2>
//                                 <p className="text-sm text-gray-500">Agent Real & Care Center</p>
//                             </div>

//                             {/* Title */}
//                             <div className="text-center mb-4">
//                                 <h1 className="text-3xl font-bold text-gray-900 mb-1">Forgot Your Password?</h1>
//                                 <p className="text-sm text-gray-500">
//                                     Enter your email address and we'll send you a
//                                     secure link to reset your password.
//                                 </p>
//                             </div>

//                             {/* Form */}
//                             <div className="mt-6 space-y-4">
//                                 <div>
//                                     <label
//                                         htmlFor="email"
//                                         className="block text-sm font-bold text-gray-700 mb-1.5"
//                                     >
//                                         Email
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         placeholder="agent@northshore.com"
//                                         className="w-full px-3 py-2 bg-[#F3F3F5] border-0 rounded-3xl text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                                     />
//                                 </div>

//                             <Link to='/reset-password'>
//                                 <button
//                                     onClick={handleLogin}
//                                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-1.5 rounded-3xl text-[14px] transition-all duration-200 shadow-lg shadow-blue-500/30 mt-5"
//                                 >
//                                    Send Email
//                                 </button>
//                             </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* 🔹 Footer */}
//             <Footer />
//         </div>
//     );
// };

// export default ForgotPassword;

import React, { useState } from 'react';
import loginImg from '../../../assets/login-image.png';
import Footer from '../../../components/auth/Login/Footer';
import {  useSendMailMutation, useVerifyOtpMutation } from '../../../redux/services/auth/auth.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import OTPModal from '../../../components/auth/OtpModal';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpData, setOtpData] = useState<{ otp: string; email: string } | null>(null);
    const [showOtpField, setShowOtpField] = useState(false);
    const navigate = useNavigate();


    const [sendMail, { isLoading: sendingMail }] = useSendMailMutation();
    const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
    // const [sessionKey, setSessionKey] = useState<string>('');



    // Step 1: send OTP to email
const handleSendMail = async () => {
    if (!email) {
        toast.error("Please enter your email");
        return;
    }

    try {
        const res = await sendMail({ email }).unwrap();
        console.log("Send Mail Response:", res);

        toast.success("OTP sent! Please check your email.");

        // Extract OTP from response if your backend sends it (for dev/testing)
        // Example: "OTP sent to admin@gmail.com. Expires in 1 minute. OTP: 123456"
        const otpCode = res.message?.split("OTP: ")[1] ?? ""; 

        // Save OTP in state so modal can use it
        setOtpData({ otp: otpCode, email });

        setShowOtpModal(true);
        setShowOtpField(true); 
    } catch (err: any) {
        toast.error(err?.data?.detail || "Failed to send OTP");
        console.error(err);
    }
};



    // Step 2: verify OTP
    const handleVerifyOtp = async () => {
  if (!otp) {
    toast.error("Please enter OTP");
    return;
  }

  try {
    const res = await verifyOtp({
      otp_value: otp,
      email,
    }).unwrap();

    console.log("Verify OTP Response:", res);

    // ✅ FIXED HERE
    const sessionKey = res.sessionKey;

    if (!sessionKey) {
      toast.error("Session key not received");
      return;
    }

    toast.success("OTP verified successfully!");

    navigate("/reset-password", {
      state: {
        email,
        session_key: sessionKey, // ✅ normalized name
      },
    });
  } catch (err: any) {
    toast.error(err?.data?.detail || "OTP verification failed");
    console.error(err);
  }
};

    
    const handleOtpModal = () => {
        setShowOtpModal(false);
    };



    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-x-[-1]"
                style={{ backgroundImage: `url(${loginImg})` }}
            />

            <div className="flex items-center justify-end relative z-10 py-12 md:py-20">
                <div className="w-full md:w-[50%] flex justify-end items-center">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-tl-[40px] rounded-bl-[10px] shadow-2xl p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-0.5">
                                    Northshore Medical
                                </h2>
                                <p className="text-sm text-gray-500">Agent Real & Care Center</p>
                            </div>

                            <div className="text-center mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Forgot Your Password?</h1>
                                <p className="text-sm text-gray-500">
                                    {showOtpField
                                        ? "Enter the OTP sent to your email."
                                        : "Enter your email address and we'll send you a secure link to reset your password."}
                                </p>
                            </div>

                            <div className="mt-6 space-y-4">
                                {!showOtpField ? (
                                    <>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="agent@northshore.com"
                                            className="w-full px-3 py-2 bg-[#F3F3F5] rounded-3xl text-[13px] focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleSendMail}
                                            disabled={sendingMail}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-3xl mt-5"
                                        >
                                            {sendingMail ? "Sending..." : "Send Email"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter OTP"
                                            className="w-full px-3 py-2 bg-[#F3F3F5] rounded-3xl text-[13px] focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleVerifyOtp}
                                            disabled={verifyingOtp}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-3xl mt-5"
                                        >
                                            {verifyingOtp ? "Verifying..." : "Verify OTP"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {showOtpModal && otpData && (
        <OTPModal
          otp={otpData.otp}
          email={otpData.email}
          onClose={handleOtpModal}
        />
      )}
            </div>

            <Footer />
        </div>
    );
};

export default ForgotPassword;
