import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  Building2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import AuthFooter from "../../components/layout/AuthFooter";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  // ======================
  // LOGIN
  // ======================

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      await login(formData);

      toast.success("Welcome Back 👋");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // FORGOT PASSWORD
  // ======================

  const forgotPassword = async () => {
    const email = getValues("email");

    if (!email) {
      toast.error(
        "Please enter your registered email first."
      );
      return;
    }

    try {
      const { data } = await axios.post(
        `${API}/forgot-password`,
        {
          email,
        }
      );

      toast.success(data.message);

      navigate("/forgot-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP"
      );
    }
  };

  return (
    <div className="theme-guest min-h-screen flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">

          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-2xl mb-8">

            <Building2 className="w-14 h-14" />

          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Find Your
            <br />
            Dream Home
          </h1>

          <p className="mt-6 text-lg text-blue-100 leading-8 max-w-lg">
            Buy, Sell and Rent properties with confidence.
            Discover thousands of verified listings from
            trusted agents across the country.
          </p>

          <div className="mt-12 flex gap-10">

            <div>
              <h2 className="text-3xl font-bold">
                10K+
              </h2>
              <p className="text-blue-200">
                Properties
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                500+
              </h2>
              <p className="text-blue-200">
                Agents
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                20K+
              </h2>
              <p className="text-blue-200">
                Customers
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex-1 bg-gradient-to-br from-slate-100 via-blue-50 to-white flex items-center justify-center p-8">

        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-10">

          <div className="text-center">

            <div className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-xl hover:scale-110 transition duration-300">

              <Building2 className="w-10 h-10 text-white" />

            </div>

            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome Back 👋
            </h2>

            <p className="mt-2 text-gray-500">
              Sign in to continue managing your properties.
            </p>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            {/* Email */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  {showPw ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* Remember Me + Forgot Password */}

            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">

                <input
                  type="checkbox"
                  {...register("remember")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                Remember Me

              </label>

              <button
                type="button"
                onClick={forgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                </>
              )}

            </button>
                        {/* Divider */}

            <div className="flex items-center gap-4">

              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="text-sm text-gray-400 font-medium">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>

            </div>

            {/* Register */}

            <Link
              to="/register"
              className="block w-full"
            >

              <button
                type="button"
                className="w-full h-12 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Create New Account
              </button>

            </Link>

          </form>

          
          {/* Help Card */}

          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">

            <h4 className="font-semibold text-gray-800 mb-2">
              Need Help?
            </h4>

            <p className="text-sm text-gray-600">
              Contact our support team if you're having trouble accessing your account.
            </p>

            <div className="mt-3 space-y-1 text-sm">

              <p>
                📧 support@propestate.com
              </p>

              <p>
                📞 +91 98765 43210
              </p>

            </div>

          </div>

          {/* Footer */}

          <AuthFooter />

        </div>

      </div>

    </div>

  );

}