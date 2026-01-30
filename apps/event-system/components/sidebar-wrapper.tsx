"use client";

import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";

type SidebarWrapperProps = {
  userRole?: "admin" | "recruiter" | "candidate" | null;
  isRoleLoading?: boolean;
};

export default function SidebarWrapper({ userRole, isRoleLoading }: SidebarWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        userRole={userRole}
        isRoleLoading={isRoleLoading}
      />
      {/* ハンバーガーメニューボタン/閉じるボタン（左下） */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="lg:hidden fixed bottom-4 left-4 z-[70] bg-gray-900 text-white p-3 hover:bg-gray-700 rounded-lg shadow-lg"
        aria-label={isSidebarOpen ? "メニューを閉じる" : "メニューを開く"}
      >
        {isSidebarOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
    </>
  );
}

