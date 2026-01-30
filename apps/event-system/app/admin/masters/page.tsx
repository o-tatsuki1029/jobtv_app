"use client";

import { useState } from "react";
import { useMasterData } from "@/hooks/useMasterData";
import MasterAreasTab from "@/components/admin/masters/MasterAreasTab";
import MasterGraduationYearsTab from "@/components/admin/masters/MasterGraduationYearsTab";
import MasterEventTypesTab from "@/components/admin/masters/MasterEventTypesTab";

export default function MastersPage() {
  const [activeTab, setActiveTab] = useState<"areas" | "years" | "eventTypes">("areas");
  const { areas, graduationYears, eventTypes, isLoading, error, refetch } = useMasterData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">マスタ管理</h1>
        <p className="text-muted-foreground mt-2">
          エリア、卒年度、イベントタイプのマスタデータを管理します
        </p>
      </div>

      {/* タブ */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("areas")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "areas"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            エリアマスタ
          </button>
          <button
            onClick={() => setActiveTab("years")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "years"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            卒年度マスタ
          </button>
          <button
            onClick={() => setActiveTab("eventTypes")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "eventTypes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            イベントタイプマスタ
          </button>
        </nav>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* タブコンテンツ */}
      {activeTab === "areas" ? (
        <MasterAreasTab
          areas={areas}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      ) : activeTab === "years" ? (
        <MasterGraduationYearsTab
          graduationYears={graduationYears}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      ) : (
        <MasterEventTypesTab
          eventTypes={eventTypes}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      )}
    </div>
  );
}

