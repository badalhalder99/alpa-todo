"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authAPI } from "@/lib/api";
import { SignupRequest, ApiError } from "@/types";
import { VscEyeClosed, VscEye  } from "react-icons/vsc";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupRequest & { confirmPassword: string }>();

  const password = watch("password");

  const onSubmit = async (data: SignupRequest & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });
      alert("Account created successfully! Please login.");
      router.push("/login");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.detail || "Signup failed. Please try again.";
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
               src="/images/signup_poster.png"
               alt="Signup illustration"
               width={400}
               height={400}
               className="w-full h-auto"
            />
         </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-auto my-0 mx-auto bg-[#fff] flex items-center justify-center p-8">
        <div className="w-full xsmall:max-w-[448px]">
          <div className="text-center mb-[36px]">
            <h1 className="xsmall:text-[30px] 2xsmall:text-[26px] font-bold text-[#0D224A] mb-[8px]">Create your account</h1>
            <p className="font-normal text-[16px] text-[#4B5563]">Start managing your tasks efficiently</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[16px]">
            {/* First Name and Last Name */}
            <div className="grid xsmall:grid-cols-2 2xsmall:grid-cols-1 xsmall:gap-[16px] 2xsmall:gap-[0px]">
              <div>
                <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("first_name", {
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: "Please enter a valid name format.",
                    },
                  })}
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[8px] h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-[14px] text-[#0C0C0C]"
                  placeholder=""
                />
                {errors.first_name && (
                  <p className="font-normal text-[12px] text-[#EE0039] mb-[6px] mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("last_name", {
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: "Please enter a valid name format.",
                    },
                  })}
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[8px] h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-[14px] text-[#0C0C0C]"
                  placeholder=""
                />
                {errors.last_name && (
                  <p className="font-normal text-[12px] text-[#EE0039] mb-[6px] mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

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
                placeholder=""
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
                    minLength: {
                      value: 6,
                      message: "4 characters minimum.",
                    },
                  })}
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[8px] h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-[14px] text-[#0C0C0C]"
                  placeholder=""
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

            {/* Confirm Password */}
            <div>
              <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[8px] h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-[14px] text-[#0C0C0C]"
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <VscEye size={18} />
                  ) : (
                    <VscEyeClosed size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="font-normal text-[12px] text-[#EE0039] mb-[6px] mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[40px] bg-[#5272FF] text-white py-3 rounded-[8px] border border-[#fff] text-[16px] font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <p className="text-center font-normal text-[16px] text-[#4B5563]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#5272FF] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
