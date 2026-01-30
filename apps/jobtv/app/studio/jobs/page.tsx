"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  MoreVertical,
  MapPin,
  JapaneseYen,
  ExternalLink,
  ArrowLeft,
  Save,
  Trash2,
  Eye
} from "lucide-react";
import StudioButton from "@/components/studio/atoms/StudioButton";
import StudioBadge from "@/components/studio/atoms/StudioBadge";
import StudioFormField from "@/components/studio/molecules/StudioFormField";
import StudioLabel from "@/components/studio/atoms/StudioLabel";
import StudioPreviewModal from "@/components/studio/organisms/StudioPreviewModal";

// 型定義
interface Job {
  id: string;
  title: string;
  type: string;
  salary: string;
  location: string;
  status: "published" | "private";
  description: string;
  requirements: string;
  benefits: string;
  selectionProcess: string;
  entryCount: number;
}

// モックデータ
// ... (mockJobs の定義)
const mockJobs: Job[] = [
  {
    id: "1",
    title: "機械学習エンジニア (LLM)",
    type: "正社員",
    salary: "800万円〜1,500万円",
    location: "東京都港区（リモート可）",
    status: "published",
    description:
      "サンプル株式会社では、次世代のLLM（大規模言語モデル）のフロントエンドおよびバックエンドの開発、並びにファインチューニングを担当していただく機械学習エンジニアを募集しています。\n\n具体的には、最新の論文に基づいたアルゴリズムの実装や、商用レベルでのスケーラビリティを考慮したインフラ構築まで、幅広く携わっていただきます。",
    requirements:
      "・Pythonによる開発経験3年以上\n・PyTorchまたはTensorFlowを用いた機械学習モデルの実装経験\n・自然言語処理（NLP）に関する専門知識\n・Gitを用いたチーム開発経験",
    benefits:
      "・フルリモート・フルフレックス制度\n・最新MacBook Pro支給\n・外部ディスプレイ貸与\n・技術書籍購入補助（上限なし）\n・カンファレンス参加費補助",
    selectionProcess:
      "1. カジュアル面談（オンライン）\n2. 書類選考\n3. 技術テスト・1次面接\n4. 最終面接（オフィスまたはオンライン）",
    entryCount: 24
  },
  {
    id: "2",
    title: "シニアプロダクトマネージャー",
    type: "正社員",
    salary: "1,000万円〜1,800万円",
    location: "東京都港区（ハイブリッド）",
    status: "published",
    description: "自社プロダクトのロードマップ策定、KPI管理、エンジニア・デザイナーとの連携をリードしていただきます。",
    requirements: "・WebサービスのPM経験5年以上\n・データ分析に基づいた意思決定能力\n・アジャイル開発の理解",
    benefits: "・フレックスタイム制\n・ストックオプション制度あり",
    selectionProcess: "1. 書類選考\n2. 面接（3回）",
    entryCount: 12
  }
];

export default function JobsPage() {
  const [view, setView] = useState<"list" | "edit">("list");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setView("edit");
  };

  const handleCreate = () => {
    setSelectedJob({
      id: "",
      title: "",
      type: "正社員",
      salary: "",
      location: "",
      status: "private",
      description: "",
      requirements: "",
      benefits: "",
      selectionProcess: "",
      entryCount: 0
    });
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedJob(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedJob) {
      setSelectedJob({ ...selectedJob, [name]: value });
    }
  };

  if (view === "edit" && selectedJob) {
    const previewData = {
      ...selectedJob,
      companyName: "サンプル株式会社",
      companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop"
    };

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* プレビューモーダル */}
        <StudioPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          device={previewDevice}
          setDevice={setPreviewDevice}
          companyData={previewData}
          previewUrl="/studio/jobs/preview-content"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">
                {selectedJob.id ? "求人を編集" : "新規求人作成"}
              </h1>
              <p className="text-gray-500 font-medium">求人の詳細情報を入力してください。</p>
            </div>
          </div>
          <div className="flex gap-2">
            <StudioButton variant="outline" icon={<Eye className="w-4 h-4" />} onClick={() => setIsPreviewOpen(true)}>
              プレビュー
            </StudioButton>
            <StudioButton icon={<Save className="w-4 h-4" />}>保存する</StudioButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 基本情報 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <h2 className="font-bold text-lg text-gray-900">基本情報</h2>
              </div>
              <div className="p-8 space-y-6">
                <StudioFormField
                  label="求人タイトル"
                  name="title"
                  value={selectedJob.title}
                  onChange={handleChange}
                  placeholder="例：機械学習エンジニア"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <StudioLabel>雇用形態</StudioLabel>
                    <select
                      name="type"
                      value={selectedJob.type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm font-medium"
                    >
                      <option>正社員</option>
                      <option>契約社員</option>
                      <option>業務委託</option>
                      <option>インターン</option>
                    </select>
                  </div>
                  <StudioFormField
                    label="勤務地"
                    name="location"
                    value={selectedJob.location}
                    onChange={handleChange}
                    placeholder="例：東京都港区（リモート可）"
                  />
                  <StudioFormField
                    label="給与"
                    name="salary"
                    value={selectedJob.salary}
                    onChange={handleChange}
                    placeholder="例：800万円〜1,500万円"
                  />
                  <div className="space-y-2">
                    <StudioLabel>公開ステータス</StudioLabel>
                    <select
                      name="status"
                      value={selectedJob.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm font-medium"
                    >
                      <option value="published">公開中</option>
                      <option value="private">下書き</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 詳細内容 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-900">詳細内容</h2>
              </div>
              <div className="p-8 space-y-6">
                <StudioFormField
                  label="職務内容"
                  name="description"
                  type="textarea"
                  value={selectedJob.description}
                  onChange={handleChange}
                  rows={6}
                />
                <StudioFormField
                  label="応募資格"
                  name="requirements"
                  type="textarea"
                  value={selectedJob.requirements}
                  onChange={handleChange}
                  rows={6}
                />
                <StudioFormField
                  label="福利厚生・制度"
                  name="benefits"
                  type="textarea"
                  value={selectedJob.benefits}
                  onChange={handleChange}
                  rows={4}
                />
                <StudioFormField
                  label="選考フロー"
                  name="selectionProcess"
                  type="textarea"
                  value={selectedJob.selectionProcess}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* 設定・統計 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-900">統計・アクション</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">現在のエントリー数</p>
                  <p className="text-3xl font-black text-gray-900">
                    {selectedJob.entryCount}
                    <span className="text-sm font-bold text-gray-400 ml-1">名</span>
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-100 space-y-3">
                  <StudioButton variant="outline" fullWidth>
                    候補者リストを見る
                  </StudioButton>
                  {selectedJob.id && (
                    <StudioButton
                      variant="ghost"
                      fullWidth
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      求人を削除
                    </StudioButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">求人管理</h1>
          <p className="text-gray-500 font-medium">現在募集中の求人の編集や新規作成が行えます。</p>
        </div>
        <StudioButton icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          新規求人を作成
        </StudioButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:border-black transition-colors group p-6 space-y-6 flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="flex-1">
              <h3 className="font-black text-lg leading-tight text-gray-900 group-hover:text-black">{job.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                  {job.type}
                </span>
                <StudioBadge variant={job.status === "published" ? "success" : "neutral"}>
                  {job.status === "published" ? "公開中" : "下書き"}
                </StudioBadge>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <JapaneseYen className="w-4 h-4" />
                {job.salary}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-bold">
                エントリー数: <span className="text-black">{job.entryCount}</span>
              </p>
              <button
                onClick={() => handleEdit(job)}
                className="flex items-center gap-1 text-xs font-black hover:underline transition-all"
              >
                詳細・編集
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
