"use client";

import React from "react";
import { Filter, MoreVertical, Mail, FileText, CheckCircle2, Clock } from "lucide-react";
import StudioButton from "@/components/studio/atoms/StudioButton";
import StudioBadge from "@/components/studio/atoms/StudioBadge";
import StudioSearchInput from "@/components/studio/molecules/StudioSearchInput";

export default function CandidatesPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">候補者管理</h1>
          <p className="text-gray-500 font-medium">エントリーがあった候補者の確認と選考管理を行えます。</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <StudioSearchInput placeholder="名前や職種で検索..." containerClassName="flex-1" />
        <div className="flex gap-2">
          <StudioButton variant="outline" icon={<Filter className="w-4 h-4" />}>
            フィルター
          </StudioButton>
          <StudioButton>CSVエクスポート</StudioButton>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                <th className="px-6 py-4">氏名</th>
                <th className="px-6 py-4">希望職種</th>
                <th className="px-6 py-4">ステータス</th>
                <th className="px-6 py-4">応募日</th>
                <th className="px-6 py-4 text-center">書類</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                        {["佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺"][i - 1].charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {["佐藤 健太", "鈴木 一郎", "高橋 花子", "田中 太一", "伊藤 美咲", "渡辺 裕二"][i - 1]}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">kenta.sato@example.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {["エンジニア", "デザイナー", "PM", "マーケター", "エンジニア", "人事"][i - 1]}
                  </td>
                  <td className="px-6 py-4">
                    <StudioBadge
                      variant={i % 3 === 0 ? "info" : i % 3 === 1 ? "warning" : "neutral"}
                      icon={i % 3 === 0 ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    >
                      {i % 3 === 0 ? "面接中" : i % 3 === 1 ? "書類選考中" : "未着手"}
                    </StudioBadge>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">2026/01/2{i}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-black transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-black transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
