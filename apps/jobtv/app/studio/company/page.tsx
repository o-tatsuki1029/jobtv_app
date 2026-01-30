"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Building, Image as ImageIcon, Save, Eye, Globe, MessageSquare, Plus } from "lucide-react";
import { CompanyData } from "@/components/CompanyProfileView";
import StudioButton from "@/components/studio/atoms/StudioButton";
import StudioFormField from "@/components/studio/molecules/StudioFormField";
import StudioPreviewModal from "@/components/studio/organisms/StudioPreviewModal";
import StudioLabel from "@/components/studio/atoms/StudioLabel";

// 初期データ（モック）
const initialData: CompanyData = {
  id: "uid",
  name: "サンプル株式会社",
  description:
    "サンプル株式会社は、『テクノロジーで未来の当たり前を創る』をミッションに掲げる、AIスタートアップ企業です。最先端の機械学習技術を活用した予測分析プラットフォームの開発や、企業のデジタルトランスフォーメーション（DX）を支援するコンサルティングを提供しています。",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=400&fit=crop",
  mainVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  industry: "AI・DXコンサルティング",
  employees: "120名",
  location: "東京都港区",
  address: "東京都港区六本木 6-10-1 六本木ヒルズ森タワー 25F",
  representative: "佐々木 俊介",
  capital: "1億5,000万円",
  established: "2018年11月",
  website: "https://example.com/sample",
  programs: [
    {
      id: "1",
      title: "【CEO登壇】サンプル株式会社が描く2030年のAI社会",
      thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=711&fit=crop",
      channel: "サンプル株式会社公式",
      likes: 12500
    },
    {
      id: "2",
      title: "エンジニア座談会：モダンな技術スタックでの挑戦",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=711&fit=crop",
      channel: "Tech Talk",
      likes: 8900
    }
  ],
  shortVideos: [
    {
      id: "s1",
      title: "六本木オフィスの絶景ラウンジをご紹介！",
      thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=711&fit=crop",
      channel: "サンプル株式会社公式",
      likes: 2500,
      duration: "0:30"
    },
    {
      id: "s2",
      title: "【30秒】最新AIモデルのデモ動画",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=711&fit=crop",
      channel: "Tech Snap",
      likes: 3800,
      duration: "0:45"
    }
  ],
  benefits: [
    "フルリモート・フルフレックス制度",
    "最新スペックのPC・周辺機器貸与",
    "書籍購入・カンファレンス参加支援（全額）"
  ],
  jobs: [
    {
      id: "j1",
      title: "機械学習エンジニア（LLM研究開発）",
      salary: "900万円〜1,500万円",
      location: "東京都港区（リモート可）",
      type: "正社員"
    }
  ],
  events: [
    {
      id: "e1",
      title: "【2/20開催】AIスタートアップの技術スタック公開勉強会",
      date: "2026年2月20日 (金) 19:30〜",
      location: "オンライン / 六本木オフィス",
      type: "勉強会",
      status: "受付中"
    }
  ],
  message: {
    title: "未来の仲間たちへ：技術で世界を動かす実感を共に",
    content: "私たちは、AIが単なるツールではなく、人間の可能性を拡張するパートナーになると信じています。",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
    author: "代表取締役 佐々木 俊介"
  }
};

export default function CompanyPageManagement() {
  const [company, setCompany] = useState<CompanyData>(initialData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCompany((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CompanyData] as any),
          [child]: value
        }
      }));
    } else {
      setCompany((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-10">
      {/* プレビューモーダル */}
      <StudioPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        device={previewDevice}
        setDevice={setPreviewDevice}
        companyData={company}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">企業ページ管理</h1>
          <p className="text-gray-500 font-medium">求職者に表示される企業プロフィールの編集と公開設定を行います。</p>
        </div>
        <div className="flex gap-2">
          <StudioButton variant="outline" icon={<Eye className="w-4 h-4" />} onClick={() => setIsPreviewOpen(true)}>
            プレビュー
          </StudioButton>
          <StudioButton icon={<Save className="w-4 h-4" />}>変更を保存</StudioButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 基本情報 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-lg">基本情報</h2>
            </div>
            <div className="p-8 space-y-6">
              <StudioFormField label="会社名" name="name" value={company.name} onChange={handleChange} required />
              <StudioFormField
                label="会社紹介文"
                name="description"
                type="textarea"
                value={company.description}
                onChange={handleChange}
                helperText={`${company.description.length} / 1000 文字`}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StudioFormField
                  label="代表者名"
                  name="representative"
                  value={company.representative}
                  onChange={handleChange}
                />
                <StudioFormField
                  label="設立年月"
                  name="established"
                  value={company.established}
                  onChange={handleChange}
                />
                <StudioFormField label="資本金" name="capital" value={company.capital} onChange={handleChange} />
                <StudioFormField label="従業員数" name="employees" value={company.employees} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* 採用メッセージ */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-lg">採用メッセージ</h2>
            </div>
            <div className="p-8 space-y-6">
              <StudioFormField
                label="メッセージタイトル"
                name="message.title"
                value={company.message.title}
                onChange={handleChange}
              />
              <StudioFormField
                label="メッセージ本文"
                name="message.content"
                type="textarea"
                value={company.message.content}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* ビジュアル管理 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-lg">ビジュアル</h2>
            </div>
            <div className="p-6 space-y-8">
              <div className="space-y-3">
                <StudioLabel>企業ロゴ</StudioLabel>
                <div className="relative group w-max">
                  <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 relative flex items-center justify-center transition-transform hover:scale-105">
                    <Image src={company.logo} alt="Logo" fill className="object-cover" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">400x400px 以上の正方形を推奨</p>
              </div>

              <div className="space-y-3">
                <StudioLabel>カバー画像</StudioLabel>
                <div className="relative aspect-[3/1] rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center group cursor-pointer">
                  <Image
                    src={company.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full">
                      画像を変更
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">1200x400px 以上を推奨</p>
              </div>
            </div>
          </div>

          {/* 外部リンク */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-lg">外部リンク</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Globe className="w-4 h-4" />
                  <StudioLabel>公式サイト</StudioLabel>
                </div>
                <StudioFormField label="" name="website" value={company.website} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
