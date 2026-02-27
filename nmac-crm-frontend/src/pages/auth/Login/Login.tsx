import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginImg from "../../../assets/login-image.png";
import Footer from "../../../components/auth/Login/Footer";
import { Link, useNavigate,  } from "react-router-dom";
import { z } from "zod";
import { useLoginMutation } from "../../../redux/services/auth/auth.api";
import OTPModal from "../../../components/auth/OtpModal";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/services/auth/auth.slice";
import { FaSpinner } from "react-icons/fa6";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
    // .min(6, "Password must be at least 6 characters"),
  otp_value: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOtp, setShowOtp] = useState(false);
const [otpData, setOtpData] = useState<{ otp: string; email: string } | null>(null);
const [showOtpModal, setShowOtpModal] = useState(false);
const [isLoading,setIsLoading] = useState(false);
  const [createLogin] = useLoginMutation();
  // const  [verifyToken ] = useVerifyTokenMutation();

  const {
  register,
  handleSubmit,
  setValue, // ✅ Add this
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
const onSubmit = async (data: LoginFormData) => {
  try {
    setIsLoading(true);

    const payload: { email: string; password: string; otp_value?: string } = {
      email: data.email,
      password: data.password,
    };

    // Include OTP only if entered
    if (data.otp_value) payload.otp_value = data.otp_value;

    const res = await createLogin(payload).unwrap();
    console.log("Login Response:", res);

    // CASE 1 → OTP required and no OTP entered yet
    if (res.details === "OTP required." && !data.otp_value) {
      const otpCode = res.message.split("OTP: ")[1];
      setOtpData({ otp: otpCode, email: data.email });
      setShowOtp(true);
      setShowOtpModal(true);
      setValue("otp_value", ""); // reset OTP input
      toast.info("OTP sent! Please check and enter.");
      return;
    }

    // CASE 2 → Successful login (with OTP)
    // if (res.access_token) {
    //   dispatch(
    //     setUser({
    //       access_token: res.access_token,
    //       refresh_token: res.refresh_token,
    //       role: res.role,
    //     })
    //   );


    //   toast.success("Login successful!");
    //   if (res.role === "AGENT") navigate("/dashboard/agent");
    //   else if (res.role === "MANAGER") navigate("/dashboard/manager");
    //   else navigate("/dashboard/admin");
    if (res.access_token) {
        dispatch(
          setUser({
            access_token: res.access_token,
          refresh_token: res.refresh_token,
          role: res.role,
          })
        );

        toast.success("Login successful!");

        if (res.role === "AGENT") navigate("/dashboard/agent");
        else if (res.role === "MANAGER") navigate("/dashboard/manager");
        else navigate("/dashboard/admin");
    }
      
     else {
      toast.error("Login failed. Please check your OTP or credentials.");
    }
  } catch (err: any) {
    toast.error(err?.data?.detail || err?.detail || "Login failed");
    console.error("Login error:", err);
  } finally {
    setIsLoading(false);
  }
};

// Close OTP modal
const handleOtpModal = () => {
  setShowOtpModal(false);
  // ✅ Keep showOtp true so field remains visible
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

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Northshore Medical
                </h2>
                <p className="text-sm text-gray-500">
                  Agent Real & Care Center
                </p>
              </div>

              {/* Title */}
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Agent Login
                </h1>
                <p className="text-sm text-gray-500">
                  Sign in to access your patient dashboard
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                {showOtp ?
                (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      OTP
                    </label>
                    <input
                      {...register("otp_value")}
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full px-3 py-2 bg-[#F3F3F5] rounded-3xl text-[13px] focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ):
                (<div className="mt-6 space-y-4">
                    {/* Email */}
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Email
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="agent@northshore.com"
                        className="w-full px-3 py-2 bg-[#F3F3F5] rounded-3xl text-[13px] focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                        </p>
                    )}
                    </div>

                    {/* Password */}
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Password
                    </label>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 bg-[#F3F3F5] rounded-3xl text-[13px] focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">
                        {errors.password.message}
                        </p>
                    )}
                    </div>
                </div>)
                }

                {/* Forgot */}
                <div className="text-left">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-3xl shadow-lg mt-5"
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <FaSpinner className="animate-spin " />
                        </div>
                        ) : (
                            showOtp ? "Verify OTP" : "Sign In"
                        )}
                </button>
              </form>
              
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

export default Login;
