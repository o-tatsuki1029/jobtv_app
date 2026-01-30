"use client";

import CompanyProfileView from "@/components/CompanyProfileView";

// モックデータ
const mockCompany = {
  id: "uid",
  name: "サンプル株式会社",
  description:
    "サンプル株式会社は、『テクノロジーで未来の当たり前を創る』をミッションに掲げる、AIスタートアップ企業です。最先端の機械学習技術を活用した予測分析プラットフォームの開発や、企業のデジタルトランスフォーメーション（DX）を支援するコンサルティングを提供しています。\n\n私たちは、単なるツールの提供ではなく、クライアントのビジネスモデルそのものを進化させるパートナーであることを大切にしています。平均年齢29歳、多国籍なメンバーが集まる環境で、自由な発想と圧倒的なスピード感を持って挑戦を続けています。個人の裁量が大きく、エンジニアからビジネス職まで、全員がプロダクトの成長に責任を持つ文化が根付いています。",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=400&fit=crop",
  mainVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  industry: "AI・DXコンサルティング",
  employees: "120名（2025年12月時点）",
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
    },
    {
      id: "3",
      title: "【新卒・中途】オフィスツアー & メンバー紹介",
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=711&fit=crop",
      channel: "Inside Sample",
      likes: 15600
    },
    {
      id: "4",
      title: "私たちの1日：PM・デザイナー・エンジニアの連携",
      thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=711&fit=crop",
      channel: "Work Style",
      likes: 23400
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
    },
    {
      id: "s3",
      title: "フリードリンク・スナックコーナーが充実しすぎ！？",
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=711&fit=crop",
      channel: "Inside Sample",
      likes: 4200,
      duration: "0:20"
    },
    {
      id: "s4",
      title: "社員に聞いた！入社して一番驚いたことは？",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=711&fit=crop",
      channel: "Work Style",
      likes: 1900,
      duration: "0:55"
    }
  ],
  benefits: [
    "フルリモート・フルフレックス制度",
    "最新スペックのPC・周辺機器貸与",
    "書籍購入・カンファレンス参加支援（全額）",
    "資格取得お祝い金制度",
    "シャッフルランチ・懇親会補助",
    "住宅手当（オフィスから3km圏内）"
  ],
  jobs: [
    {
      id: "j1",
      title: "機械学習エンジニア（LLM研究開発）",
      salary: "900万円〜1,500万円",
      location: "東京都港区（リモート可）",
      type: "正社員"
    },
    {
      id: "j2",
      title: "シニアプロダクトマネージャー",
      salary: "800万円〜1,300万円",
      location: "東京都港区（ハイブリッド）",
      type: "正社員"
    },
    {
      id: "j3",
      title: "フロントエンドエンジニア (React/Next.js)",
      salary: "600万円〜1,000万円",
      location: "フルリモート可",
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
    },
    {
      id: "e2",
      title: "カジュアル面談・オフィス見学会（毎週水曜日）",
      date: "2026年2月25日 (水) 18:00〜",
      location: "六本木オフィス",
      type: "見学会",
      status: "受付中"
    }
  ],
  message: {
    title: "未来の仲間たちへ：技術で世界を動かす実感を共に",
    content:
      "私たちは、AIが単なるツールではなく、人間の可能性を拡張するパートナーになると信じています。サンプル株式会社では、個々の技術的好奇心と、社会にインパクトを与えたいという情熱を何よりも大切にしています。\n\n「こんなことができたら面白い」という純粋な想いから、世界を変えるイノベーションは生まれます。失敗を恐れず、常に一歩先を目指すチームの中で、あなたの才能を最大限に発揮してみませんか？私たちと一緒に、新しい時代の『当たり前』を創り上げましょう。",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
    author: "代表取締役 佐々木 俊介"
  }
};

interface CompanyDetailPageProps {
  params: {
    id: string;
  };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const company = mockCompany; // 実際の実装では、params.idに基づいてデータを取得

  return <CompanyProfileView company={company} />;
}
