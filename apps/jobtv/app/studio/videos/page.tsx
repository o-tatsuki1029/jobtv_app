"use client";

import React from "react";
import { Plus, Filter, Play, Eye, MessageSquare, MoreVertical } from "lucide-react";
import StudioButton from "@/components/studio/atoms/StudioButton";
import StudioBadge from "@/components/studio/atoms/StudioBadge";
import StudioSearchInput from "@/components/studio/molecules/StudioSearchInput";

export default function VideosPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">動画管理</h1>
          <p className="text-gray-500 font-medium">公開中の動画の編集や分析、新規アップロードが行えます。</p>
        </div>
        <StudioButton icon={<Plus className="w-4 h-4" />}>新規動画をアップロード</StudioButton>
      </div>

      {/* フィルター・検索 */}
      <div className="flex flex-col md:flex-row gap-4">
        <StudioSearchInput placeholder="動画タイトルで検索..." containerClassName="flex-1" />
        <StudioButton variant="outline" icon={<Filter className="w-4 h-4" />}>
          フィルター
        </StudioButton>
      </div>

      {/* 動画テーブル */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                <th className="px-6 py-4">動画</th>
                <th className="px-6 py-4">ステータス</th>
                <th className="px-6 py-4">日付</th>
                <th className="px-6 py-4 text-right">視聴数</th>
                <th className="px-6 py-4 text-right">コメント</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 aspect-video bg-gray-100 rounded-md relative overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">【社員インタビュー】プロダクトマネージャーの1日</p>
                        <p className="text-xs text-gray-400 mt-0.5">08:42 • 1080p</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StudioBadge variant="success">公開中</StudioBadge>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">2026/01/20</td>
                  <td className="px-6 py-4 text-right font-black">
                    <div className="flex items-center justify-end gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      1,245
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black">
                    <div className="flex items-center justify-end gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      12
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
