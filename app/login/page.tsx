"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authAPI, userAPI } from "@/lib/api";
import { LoginRequest, ApiError } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { VscEyeClosed, VscEye  } from "react-icons/vsc";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const authResponse = await authAPI.login(data);
      localStorage.setItem("access_token", authResponse.access);
      localStorage.setItem("refresh_token", authResponse.refresh);

      // Fetch user profile
      const userProfile = await userAPI.getProfile();
      setUser(userProfile);

      router.push("/dashboard");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.detail || "Login failed. Please check your credentials.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-[606px] bg-[#E2ECF8] items-center justify-center p-0">
         <div className="w-full">
            <Image
               src="/images/login_poster.png"
               alt="login illustration"
               width={400}
               height={400}
               className="w-full h-auto"
            />
         </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-auto my-0 mx-auto bg-[#fff] flex items-center justify-center p-8">
        <div className="xsmall:w-[448px] 2xsmall:w-full">
          <div className="text-center mb-[36px]">
            <h1 className="xsmall:text-[30px] 2xsmall:text-[26px] font-bold text-[#0D224A] mb-[8px]">Log in to your account</h1>
            <p className="font-normal text-[16px] text-[#4B5563]">Start managing your tasks efficiently</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[16px]">
            {/* Email */}
            <div>
              <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[8px] h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-[14px] text-[#0C0C0C]"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="font-normal text-[12px] text-[#EE0039] mb-[6px] mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[8px] h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-[14px] text-[#0C0C0C]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <VscEye size={18} /> : <VscEyeClosed size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="font-normal text-[12px] text-[#EE0039] mb-[6px] mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 font-normal text-[14px] text-[#374151]">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-[14px] text-[#5272FF] hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[40px] bg-[#5272FF] text-white py-3 rounded-[8px] border border-[#fff] text-[16px] font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            {/* Signup Link */}
            <p className="text-center font-normal text-[16px] text-[#4B5563]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-[#5272FF] hover:underline">
                Register now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
