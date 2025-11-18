"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI } from "@/lib/api";
import { ProfileUpdateRequest, ApiError } from "@/types";
import { MdCameraAlt } from "react-icons/md";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateRequest>({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      address: user?.address || "",
      contact_number: user?.contact_number || "",
      birthday: user?.birthday || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileUpdateRequest) => {
    setIsLoading(true);
    try {
      const updateData: ProfileUpdateRequest = {
        ...data,
        ...(selectedFile && { profile_image: selectedFile }),
      };

      await userAPI.updateProfile(updateData);
      await refreshUser();
      alert("Profile updated successfully!");
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.detail || "Failed to update profile. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      address: user?.address || "",
      contact_number: user?.contact_number || "",
      birthday: user?.birthday || "",
    });
    setPreviewImage(null);
    setSelectedFile(null);
  };

  return (
    <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white rounded-[16px] py-5 px-[28px]">
           <h1 className="font-semibold text-[24px] text-[#0D224A] mb-1">Account Information</h1>
           <hr className="w-[161px] h-[2px] bg-[#5272FF] mb-[24px]" />
         <form onSubmit={handleSubmit(onSubmit)}>
            {/* Profile Image Upload */}
            <div className="mb-6 p-4 sm:p-6 border border-[#A1A3ABA1] rounded-[16px]" style={{boxShadow:"0px 1px 2px 0px #0000000D"}}>
               <div className="flex flex-col sm:flex-row items-center sm:gap-[24px] 2xsmall:gap-[16px]">
               <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                     {previewImage || user?.profile_image ? (
                     <Image
                        src={previewImage || user?.profile_image || ""}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                     />
                     ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-300 text-3xl text-gray-600">
                        {user?.first_name?.[0]?.toUpperCase()}
                     </div>
                     )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-[#5272FF] rounded-full p-2 cursor-pointer w-8 h-8">
                     <MdCameraAlt className="w-4 h-4 text-white" />
                  </div>
               </div>

               <div className="text-center sm:text-left sm:mt-0 2xsmall:mt-2" style={{margin: "0px",}}>
                  <button
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     className="bg-[#5272FF] text-white px-4 sm:px-6 py-2 rounded-[8px] hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                  >
                     <MdCameraAlt className="w-5 h-5" />
                     <span className="font-normal text-[16px] text-[#fff]">Upload New Photo</span>
                  </button>
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="hidden"
                  />
               </div>
               </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 sm:space-y-6 border rounded-2xl border-[#A1A3ABA1] sm:py-5 2xsmall:py-4 2xsmall:px-6 sm:px-12">
               {/* First Name and Last Name */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
               <div>
                  <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                     First Name
                  </label>
                  <input
                     type="text"
                     {...register("first_name", { required: "First name is required" })}
                     className="w-full px-4 py-3 border border-[#D1D5DB] h-[42px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.first_name && (
                     <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                  )}
               </div>

               <div>
                  <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                     Last Name
                  </label>
                  <input
                     type="text"
                     {...register("last_name", { required: "Last name is required" })}
                     className="w-full px-4 py-3 border border-[#D1D5DB] h-[42px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.last_name && (
                     <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                  )}
               </div>
               </div>

               {/* Email (Read-only) */}
               <div>
               <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">Email</label>
               <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-[#D1D5DB] h-[42px] rounded-lg bg-gray-50 text-gray-500"
               />
               </div>

               {/* Address and Contact Number */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
               <div>
                  <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                     Address
                  </label>
                  <input
                     type="text"
                     {...register("address")}
                     className="w-full px-4 py-3 border border-[#D1D5DB] h-[42px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
               </div>

               <div>
                  <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                     Contact Number
                  </label>
                  <input
                     type="tel"
                     {...register("contact_number")}
                     className="w-full px-4 py-3 border border-[#D1D5DB] h-[42px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
               </div>
               </div>

               {/* Birthday */}
               <div>
               <label className="block font-medium text-[14px] text-[#0C0C0C] mb-[6px]">
                  Birthday
               </label>
               <div className="relative">
                  <input
                     type="date"
                     {...register("birthday")}
                     className="w-full px-4 py-3 border border-[#D1D5DB] h-[42px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* <MdCalendarToday className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
               </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
               <button
                  type="submit"
                  disabled={isLoading}
                  className="sm:w-[200px] w-auto bg-[#5272FF] font-medium text-[14px] text-[#fff] px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px] flex justify-center items-center"
               >
                  {isLoading ? "Saving..." : "Save Changes"}
               </button>
               <button
                  type="button"
                  onClick={handleCancel}
                  className="sm:w-[200px] w-auto bg-[#8CA3CD] font-medium text-[14px] text-[#fff] px-6 sm:px-8 py-3 rounded-lg hover:bg-gray-500 transition-colors flex justify-center items-center h-[40px]"
               >
                  Cancel
               </button>
               </div>
            </div>
         </form>
      </div>
    </div>
  );
}
