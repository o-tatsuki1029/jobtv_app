"use client";

import React from "react";
import SessionDetailView, { SessionData } from "@/components/SessionDetailView";

// モックデータ
const mockSession: SessionData = {
  id: "1",
  title: "AIスタートアップの技術スタック公開勉強会",
  type: "勉強会",
  date: "2026年2月20日 (金)",
  time: "19:30 〜 21:00",
  location: "オンライン (Zoom) / 六本木オフィス",
  status: "受付中",
  description:
    "サンプル株式会社のエンジニアチームが、現在開発中のプロダクトで使用している技術スタックを余すことなく公開します。\n\nLLMのファインチューニングから、スケーラブルなインフラ構成、フロントエンドの最新プラクティスまで、現場の生の声をお届けします。後半にはカジュアルな座談会も予定しています。",
  target: "エンジニア、PM、技術に興味のある学生・社会人の方",
  capacity: "オンライン: 無制限 / オフライン: 20名",
  companyName: "サンプル株式会社",
  companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop"
};

interface SessionDetailPageProps {
  params: {
    id: string;
  };
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  // 実際の実装では params.id を使用してデータを取得
  return <SessionDetailView session={mockSession} />;
}
