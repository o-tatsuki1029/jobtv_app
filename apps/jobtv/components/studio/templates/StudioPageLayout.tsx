"use client";

import React from "react";
import StudioSidebar from "../organisms/StudioSidebar";
import StudioHeader from "../organisms/StudioHeader";

interface StudioPageLayoutProps {
  children: React.ReactNode;
}

export default function StudioPageLayout({ children }: StudioPageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* サイドバー（デスクトップ） */}
      <StudioSidebar />

      {/* ヘッダー（モバイル） */}
      <StudioHeader />

      {/* メインコンテンツ */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
