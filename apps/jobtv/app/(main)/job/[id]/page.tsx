"use client";

import React from "react";
import JobDetailView, { JobData } from "@/components/JobDetailView";

// モックデータ
const mockJob: JobData = {
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
  companyName: "サンプル株式会社",
  companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop"
};

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  // 実際の実装では params.id を使用してデータを取得
  return <JobDetailView job={mockJob} />;
}
