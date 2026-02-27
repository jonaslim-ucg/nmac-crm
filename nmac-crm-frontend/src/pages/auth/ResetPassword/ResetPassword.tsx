import React, { useState } from 'react';
import loginImg from '../../../assets/login-image.png';
import Footer from '../../../components/auth/Login/Footer';
import { useLocation, useNavigate} from 'react-router-dom';
import { useForgotPasswordMutation } from '../../../redux/services/auth/auth.api';
import { toast } from 'react-toastify';
const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const navigate = useNavigate();
    const location = useLocation();

    const { email, session_key } = location.state as {
    email: string;
    session_key: string;
    };
    console.log(email, session_key)
    // Step 2: PASSWORD SETUP

    const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
        console.log(email, password, session_key);
      await forgotPassword({
        email,
        password,
        session_key,
      }).unwrap();

      toast.success('Password reset successfully!');
      navigate('/password-changed');
    } catch (err: any) {
      toast.error(err?.data?.detail || 'Password reset failed');
      console.error(err);
    }
  };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
            {/* 🔹 Background Image (Flipped) */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-x-[-1]"
                style={{
                    backgroundImage: `url(${loginImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>

            {/* 🔹 Main Content */}
            <div className=" flex items-center justify-end relative z-10 py-12 md:py-20">
                <div className="w-full md:w-[50%] flex justify-end items-center">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-tl-[40px] rounded-bl-[10px] shadow-2xl p-6 sm:p-8">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-0.5">
                                    Northshore Medical
                                </h2>
                                <p className="text-sm text-gray-500">Agent Real & Care Center</p>
                            </div>

                            {/* Title */}
                            <div className="text-center mb-4">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset password</h1>
                            </div>

                            {/* Form */}
                            <div className="mt-6 space-y-4">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-bold text-gray-700 mb-1.5"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Type password"
                                        className="w-full px-3 py-2 border-0 rounded-3xl text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-[#F3F3F5]"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-bold text-gray-700 mb-1.5"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat password"
                                        className="w-full px-3 py-2 border-0 rounded-3xl text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-[#F3F3F5]"
                                    />
                                </div>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-1.5 rounded-3xl text-[14px] transition-all duration-200 shadow-lg shadow-blue-500/30 mt-5"
                                >
                                    Reset Password
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Footer */}
            <Footer />
        </div>
    );
};

export default ResetPassword;

