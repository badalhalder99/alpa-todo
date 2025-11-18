"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { MdNotifications, MdCalendarToday, MdMenu } from "react-icons/md";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
   <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-[250px] w-full bg-[#EEF7FF]">
         {/* Top Header */}
         <header className="bg-white sticky top-0 z-30">
            <div className="flex items-center justify-between px-[10px] small:py-[28px] sm:px-6 lg:px-8 2xsmall:py-4">
            {/* Left Section - Menu & Logo */}
            <div className="flex items-center space-x-3">
               {/* Hamburger Menu (Mobile Only) */}
               <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
               >
                  <MdMenu className="w-6 h-6 text-gray-800" />
               </button>

               {/* Logo */}
                  <Image
                     src="/images/logo.png"
                     alt="LOGO"
                     width={105}
                     height={32}
                     className=""
                  />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-[24px] sm:space-x-4">
               <button className="p-2 w-[34px] h-[34px] hover:bg-[#5272FF] bg-[#5272FF] rounded-[8px] flex justify-center items-center">
                  <MdNotifications className="w-6 h-6 sm:w-6 sm:h-6 text-[#fff]" />
               </button>
               <button className="p-2 w-[34px] h-[34px] hover:bg-[#5272FF] bg-[#5272FF] rounded-[8px] flex justify-center items-center">
                  <MdCalendarToday className="w-5 h-5 sm:w-6 sm:h-6 text-[#fff]" />
               </button>

               <div className="text-right hidden md:block">
                  <div className="font-medium text-[15px] text-[#0D224A] mb-[2px]">
                  {currentDate.split(",")[0]}
                  </div>
                  <div className="font-medium text-[14px] text-[#0D224A] mb-[2px]">
                  {currentDate.split(",").slice(1).join(",")}
                  </div>
               </div>
            </div>
            </div>
         </header>

         {/* Page Content */}
         <main className="p-[21px]">{children}</main>
      </div>
      </div>
   </ProtectedRoute>
  );
}
