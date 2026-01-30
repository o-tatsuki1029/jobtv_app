"use client";

import React, { useState } from "react";
import { Settings, User, Building, Shield, Bell, HelpCircle, Save } from "lucide-react";
import StudioButton from "@/components/studio/atoms/StudioButton";
import StudioFormField from "@/components/studio/molecules/StudioFormField";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("一般設定");

  const tabs = [
    { name: "一般設定", icon: Settings },
    { name: "企業プロフィール", icon: Building },
    { name: "チームメンバー", icon: User },
    { name: "通知", icon: Bell },
    { name: "セキュリティ", icon: Shield },
    { name: "ヘルプ・サポート", icon: HelpCircle }
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">設定</h1>
        <p className="text-gray-500 font-medium">企業プロフィールやアカウントの設定を管理します。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* サイドナビ */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === item.name
                  ? "bg-black text-white shadow-lg shadow-black/5"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </div>

        {/* フォーム */}
        <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">{activeTab}</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StudioFormField label="企業名" name="companyName" value="サンプル株式会社" />
                <StudioFormField label="代表電話番号" name="phone" value="03-1234-5678" />
                <div className="md:col-span-2">
                  <StudioFormField label="管理用メールアドレス" name="email" type="email" value="admin@example.com" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <StudioButton icon={<Save className="w-4 h-4" />}>設定を保存</StudioButton>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-100 p-8 space-y-4">
            <h3 className="text-red-800 font-bold">危険なアクション</h3>
            <p className="text-red-600 text-sm font-medium">
              アカウントを削除すると、すべての動画、求人、候補者データが完全に消去されます。この操作は取り消せません。
            </p>
            <StudioButton variant="danger">アカウントを完全に削除</StudioButton>
          </div>
        </div>
      </div>
    </div>
  );
}
