"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { MdDashboard, MdCheckBox, MdPerson, MdLogout, MdClose } from "react-icons/md";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "Todos",
      href: "/dashboard/todos",
      icon: MdCheckBox,
    },
    {
      name: "Account Information",
      href: "/dashboard/profile",
      icon: MdPerson,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-[250px] bg-[#0D224A] text-white flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-white hover:bg-blue-800 p-2 rounded-lg"
        >
          <MdClose className="w-6 h-6" />
        </button>

        {/* User Profile Section */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-[86px] h-[86px] rounded-full overflow-hidden mb-[13px] bg-gray-300 border border-[#fff]">
            {user?.profile_image ? (
              <Image
                src={user.profile_image}
                alt={user.first_name}
                width={86}
                height={86}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-400 text-2xl font-semibold text-[16px] text-[#fff]">
                {user?.first_name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-[16px] text-[#fff] mb-[2px] text-center">
            {user?.first_name || "User"}
          </h3>
          <p className="font-normal text-[12px] text-[#fff] text-center truncate w-full px-2">
            {user?.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 hover:bg-blue-800 hover:text-[#fff] transition-colors ${
                  isActive ? "bg-blue-800" : ""
                }`}
              >
               <Icon className={`w-6 h-6 mr-[18px] ${isActive ? "bg-blue-800 text-white" : "text-[#8CA3CD]"} `} />
                <span className={`font-medium text-[16px] ${isActive ? "text-white" : "text-[#8CA3CD]"} `}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mb-[30px] px-0 hover:text-white">
          <button
            onClick={logout}
            className="flex items-center w-full block px-4 py-3 hover:bg-blue-800 hover:text-white transition-colors"
          >
            <MdLogout className="w-[22px] h-[24px] mr-1 text-[#8CA3CD] hover:text-white" />
            <span className="font-medium text-[16px] text-[#8CA3CD] hover:text-white">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
