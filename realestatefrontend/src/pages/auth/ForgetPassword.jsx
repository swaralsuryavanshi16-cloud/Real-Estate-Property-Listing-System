import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Building2,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import AuthFooter from "../../components/layout/AuthFooter";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [showOTP, setShowOTP] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: location.state?.email || "",
    },
  });

  // =============================
  // OTP Countdown Timer
  // =============================
  useEffect(() => {
    if (!showOTP || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, showOTP]);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown]);

  // =============================
  // Send OTP
  // =============================
  const sendOTP = async () => {
    const email = getValues("email");

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setOtpLoading(true);

      const { data } = await axios.post(`${API}/forgot-password`, {
        email,
      });

      toast.success(data.message || "OTP sent successfully.");

      setShowOTP(true);
      setCountdown(30);
      setCanResend(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // =============================
  // Reset Password
  // =============================
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API}/reset-password`,
        {
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        }
      );

      toast.success(data.message || "Password updated.");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-guest min-h-screen bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-4">

            <Building2 className="w-9 h-9 text-white" />

          </div>

          <h1 className="text-3xl font-bold text-white">
            PropEstate
          </h1>

          <p className="text-primary-200 mt-2">
            Forgot your password?
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
                        {/* Email */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="input-field flex-1"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={otpLoading}
                  className="px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-60"
                >
                  {otpLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <Mail size={18} />
                  )}
                </button>
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* OTP Section */}

            {showOTP && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification OTP
                  </label>

                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className="input-field text-center tracking-[8px] text-lg font-bold"
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "OTP must be exactly 6 digits",
                      },
                    })}
                  />

                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  {!canResend ? (
                    <span className="text-gray-500">
                      Resend OTP in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOTP}
                      className="text-primary-600 hover:underline font-medium"
                    >
                      Resend OTP
                    </button>
                  )}

                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <ShieldCheck size={16} />
                    OTP Sent
                  </span>
                </div>

                {/* New Password */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="input-field pr-12"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message:
                            "Password must be at least 8 characters",
                        },
                      })}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="input-field pr-12"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === getValues("password") ||
                          "Passwords do not match",
                      })}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Reset Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base"
                >
                  {loading
                    ? "Resetting Password..."
                    : "Reset Password"}
                </button>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Back to Login
            </Link>
          </p>
        </div>
        <AuthFooter dark />
      </div>
    </div>
  );
}