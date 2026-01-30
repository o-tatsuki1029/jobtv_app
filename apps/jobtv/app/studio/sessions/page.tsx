"use client";

import React from "react";
import { Plus, MapPin, Users, Clock, MoreVertical, ExternalLink } from "lucide-react";
import StudioButton from "@/components/studio/atoms/StudioButton";
import StudioBadge from "@/components/studio/atoms/StudioBadge";

export default function BriefingsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">説明会管理</h1>
          <p className="text-gray-500 font-medium">説明会やイベントの情報を管理します。</p>
        </div>
        <StudioButton icon={<Plus className="w-4 h-4" />}>新規説明会を作成</StudioButton>
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:border-black/10"
          >
            <div className="md:w-64 bg-gray-50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100">
              <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                {i === 1 ? "FEB" : "MAR"}
              </div>
              <div className="text-5xl font-black mb-1 text-gray-900">{i === 1 ? "20" : "05"}</div>
              <div className="text-xs font-bold text-gray-500">{i === 1 ? "金曜日 19:30〜" : "木曜日 18:00〜"}</div>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                      {i === 1 ? "勉強会" : "説明会"}
                    </span>
                    <StudioBadge variant="success">受付中</StudioBadge>
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    {i === 1
                      ? "AIスタートアップの技術スタック公開勉強会"
                      : "2026年新卒・中途採用向けオンライン会社説明会"}
                  </h3>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <MapPin className="w-4 h-4" />
                  {i === 1 ? "オンライン / 六本木オフィス" : "オンライン (Zoom)"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Users className="w-4 h-4" />
                  参加予約: <span className="text-black font-black">42</span> / 100名
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Clock className="w-4 h-4" />
                  残り15日
                </div>
              </div>
            </div>

            <div className="md:w-48 p-6 flex flex-col items-center justify-center gap-3 bg-gray-50/50 border-t md:border-t-0 md:border-l border-gray-100">
              <StudioButton size="sm" fullWidth>
                予約リストを確認
              </StudioButton>
              <StudioButton variant="outline" size="sm" fullWidth icon={<ExternalLink className="w-3 h-3" />}>
                詳細編集
              </StudioButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
