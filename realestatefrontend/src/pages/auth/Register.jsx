import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Building2, Eye, EyeOff, Mail } from "lucide-react";
import toast from "react-hot-toast";
import AuthFooter from "../../components/layout/AuthFooter";

export default function Register() {
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
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
      role: "buyer",
    },
  });

  useEffect(() => {
    let timer;

    if (showOTP && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [countdown, showOTP]);

  // ======================
  // SEND OTP
  // ======================
  const sendOTP = async () => {
    const data = getValues();

    if (!data.email) {
      toast.error("Enter your email first");
      return;
    }

    try {
      setOtpLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: data.email,
        }
      );

      toast.success(res.data.message);

      setShowOTP(true);
      setCountdown(30);
      setCanResend(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to send OTP"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // ======================
  // VERIFY OTP & REGISTER
  // ======================
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Registration Successful");

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-guest min-h-screen bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            PropEstate
          </h1>

          <p className="text-primary-200">
            Create Your Account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            {/* Name */}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Full Name
              </label>

              <input
                className="input-field"
                placeholder="John Doe"
                {...register("name", {
                  required: "Name is required",
                })}
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Email
              </label>

              <div className="flex gap-2">

                <input
                  type="email"
                  className="input-field flex-1"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={otpLoading}
                  className="px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  {otpLoading ? "..." : <Mail size={18} />}
                </button>

              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Phone
              </label>

              <input
                className="input-field"
                placeholder="9876543210"
                {...register("phone")}
              />
            </div>

            {/* Role */}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Register As
              </label>

              <select
                className="input-field"
                {...register("role")}
              >
                <option value="buyer">
                  Buyer
                </option>

                <option value="agent">
                  Agent
                </option>
              </select>
            </div>

            {/* Password */}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPw ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="Minimum 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPw ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
                        {/* OTP Section */}

            {showOTP && (
              <>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Email OTP
                  </label>

                  <input
                    type="text"
                    maxLength={6}
                    className="input-field text-center tracking-[8px] text-lg font-semibold"
                    placeholder="000000"
                    {...register("otp", {
                      required: "OTP is required",
                      minLength: {
                        value: 6,
                        message: "OTP must be 6 digits",
                      },
                    })}
                  />

                  {errors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">

                  {!canResend ? (
                    <p className="text-gray-500">
                      Resend OTP in {countdown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOTP}
                      className="text-blue-600 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}

                  <span className="text-green-600">
                    OTP sent to your email
                  </span>

                </div>

              </>
            )}

            {/* Register Button */}

            <button
              type="submit"
              disabled={!showOTP || loading}
              className="btn-primary w-full py-2.5 text-sm"
            >
              {loading
                ? "Creating Account..."
                : "Verify OTP & Create Account"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>

        <AuthFooter dark />
      </div>
      
    </div>
  );
}