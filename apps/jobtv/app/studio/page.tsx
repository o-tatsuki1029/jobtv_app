"use client";

import React from "react";
import { Users, Video, Eye, TrendingUp, Plus } from "lucide-react";
import StudioButton from "@/components/studio/atoms/StudioButton";
import StudioStatCard from "@/components/studio/molecules/StudioStatCard";

export default function StudioDashboard() {
  return (
    <div className="space-y-10">
      {/* ヘッダーエリア */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">ダッシュボード</h1>
          <p className="text-gray-500 font-medium">こんにちは、サンプル株式会社 Studioへようこそ。</p>
        </div>
        <StudioButton icon={<Plus className="w-4 h-4" />}>新規動画をアップロード</StudioButton>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "総視聴回数", value: "45,231", icon: Eye, change: "+12.5%", changeType: "increase" as const },
          { label: "総エントリー数", value: "1,284", icon: Users, change: "+5.2%", changeType: "increase" as const },
          { label: "公開動画数", value: "12", icon: Video, change: "0%", changeType: "neutral" as const },
          { label: "平均視聴維持率", value: "68%", icon: TrendingUp, change: "+2.4%", changeType: "increase" as const }
        ].map((stat, i) => (
          <StudioStatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 最近の動画リスト */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-lg">最近のアップロード動画</h2>
            <button className="text-sm font-bold text-gray-500 hover:text-black transition-colors">すべて見る</button>
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3].map((v) => (
              <div
                key={v}
                className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="w-24 aspect-video bg-gray-200 rounded-md flex-shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">【新卒採用】エンジニア社員インタビュー 2026</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">2026/01/25 アップロード</span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">公開中</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">1,245</p>
                  <p className="text-[10px] text-gray-400 font-medium">視聴回数</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg">最近のエントリー</h2>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3, 4].map((a) => (
              <div key={a} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">佐藤 健太 さん</p>
                  <p className="text-xs text-gray-500 mt-0.5">機械学習エンジニア職にエントリーしました</p>
                  <p className="text-[10px] text-gray-400 mt-1">2時間前</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button className="w-full text-sm font-bold text-gray-500 py-2 hover:text-black transition-colors">
              すべてのエントリーを確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
