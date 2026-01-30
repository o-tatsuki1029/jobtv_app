"use client";

import HeroSection from "@/components/HeroSection";
import ProgramSection from "@/components/ProgramSection";
import ShortVideoSection from "@/components/ShortVideoSection";
import BannerList from "@/components/BannerList";
import AccountList from "@/components/AccountList";

// サンプルデータ
const banners = [
  {
    id: "e1",
    title: "2027年向け 採用イベント",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop"
  },
  {
    id: "e2",
    title: "企業密1日着動画特集",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"
  },
  {
    id: "b1",
    title: "2025年新卒採用エントリー受付中！",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop"
  },
  {
    id: "b2",
    title: "中途採用・キャリア採用 積極募集中",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop"
  },
  {
    id: "b3",
    title: "オンライン企業説明会 毎週開催中",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop"
  },
  {
    id: "b4",
    title: "インターンシッププログラム 参加者募集",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=450&fit=crop"
  },
  {
    id: "b5",
    title: "エンジニア職 大募集！未経験者も歓迎",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"
  }
];

const heroProgram = {
  title: "動画就活で理想の企業と出会う",
  description:
    "テキストだけではわからない採用企業の姿を、動画コンテンツでお届け。企業密着、社員インタビュー、職場見学など、リアルな情報を無料で視聴できます。",
  thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
  videoUrl: "https://contents.jobtv.jp/movie/f45f4fe1-55b6-45bb-804b-00d1bdde6b71_h264.mp4",
  channel: "JOBTV",
  viewers: 12543
};

const documentaryPrograms = [
  {
    id: "1",
    title: "就活生の1年間 - 内定までの道のり",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "45分"
  },
  {
    id: "2",
    title: "新卒採用のリアル - 企業と学生の本音",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "38分"
  },
  {
    id: "3",
    title: "内定者座談会 - 選考を突破した理由",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "52分"
  },
  {
    id: "4",
    title: "就活のリアル - 失敗から学ぶ",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "42分"
  },
  {
    id: "5",
    title: "エントリーシートの書き方 完全解説",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "35分"
  },
  {
    id: "6",
    title: "面接対策 - 先輩たちの体験談",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "48分"
  },
  {
    id: "7",
    title: "グループディスカッション 実践編",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "40分"
  },
  {
    id: "8",
    title: "内定獲得までのストーリー - 複数社から内定",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=225&fit=crop",
    channel: "就活ドキュメンタリー",
    time: "55分"
  }
];

const companyPrograms = [
  {
    id: "7",
    title: "企業紹介動画 - 私たちの働き方",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 125000
  },
  {
    id: "8",
    title: "2025年新卒採用説明会",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 89000
  },
  {
    id: "9",
    title: "職場見学ツアー - オフィス紹介",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 156000
  },
  {
    id: "10",
    title: "職種紹介 - 営業職の1日",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 234000
  },
  {
    id: "11",
    title: "福利厚生・制度のご紹介",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 178000
  },
  {
    id: "12",
    title: "採用プロセス完全解説",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 98000
  },
  {
    id: "13",
    title: "社員インタビュー - 新入社員の声",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 145000
  },
  {
    id: "14",
    title: "キャリアパス 成長ストーリー",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 167000
  },
  {
    id: "15",
    title: "企業理念・ビジョン",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 198000
  },
  {
    id: "16",
    title: "インターンシップ体験談",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 112000
  },
  {
    id: "17",
    title: "リモートワークの様子",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 223000
  },
  {
    id: "18",
    title: "チームワークの魅力",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=711&fit=crop",
    channel: "企業説明",
    likes: 189000
  }
];

const shortVideos = [
  {
    id: "s1",
    title: "社員の1日 - エンジニア編",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=711&fit=crop",
    channel: "社員インタビュー",
    likes: 125000,
    duration: "0:30"
  },
  {
    id: "s2",
    title: "オフィスツアー 30秒",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=711&fit=crop",
    channel: "職場紹介",
    likes: 89000,
    duration: "0:45"
  },
  {
    id: "s3",
    title: "先輩社員のメッセージ",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=711&fit=crop",
    channel: "社員インタビュー",
    likes: 156000,
    duration: "1:00"
  },
  {
    id: "s4",
    title: "チームワークの魅力",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=711&fit=crop",
    channel: "企業文化",
    likes: 234000,
    duration: "0:30"
  },
  {
    id: "s5",
    title: "新入社員の声",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=711&fit=crop",
    channel: "新入社員",
    likes: 178000,
    duration: "0:40"
  },
  {
    id: "s6",
    title: "採用担当者からのメッセージ",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=711&fit=crop",
    channel: "採用情報",
    likes: 98000,
    duration: "0:25"
  },
  {
    id: "s7",
    title: "リモートワークの様子",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=711&fit=crop",
    channel: "働き方",
    likes: 267000,
    duration: "0:35"
  },
  {
    id: "s8",
    title: "職種紹介 - 営業職",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=711&fit=crop",
    channel: "職種紹介",
    likes: 145000,
    duration: "0:50"
  },
  {
    id: "s9",
    title: "インターン体験談",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=711&fit=crop",
    channel: "インターン",
    likes: 112000,
    duration: "1:15"
  },
  {
    id: "s10",
    title: "福利厚生のご紹介",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=711&fit=crop",
    channel: "福利厚生",
    likes: 198000,
    duration: "0:30"
  },
  {
    id: "s11",
    title: "キャリアパス 成長ストーリー",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=711&fit=crop",
    channel: "キャリア",
    likes: 223000,
    duration: "0:45"
  },
  {
    id: "s12",
    title: "企業理念・ビジョン",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=711&fit=crop",
    channel: "企業紹介",
    likes: 167000,
    duration: "0:40"
  }
];

const accounts = [
  {
    id: "a1",
    name: "JOB NEWS",
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&h=100&fit=crop"
  },
  {
    id: "a2",
    name: "JOB TIMES",
    avatar: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=100&h=100&fit=crop"
  },
  {
    id: "a3",
    name: "JOB PICKS",
    avatar: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=100&h=100&fit=crop"
  },
  {
    id: "a4",
    name: "JOB PRESS",
    avatar: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=100&h=100&fit=crop"
  },
  {
    id: "a5",
    name: "JOB JOURNAL",
    avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop"
  },
  {
    id: "a6",
    name: "JOB VOICE",
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&h=100&fit=crop"
  },
  {
    id: "a7",
    name: "JOB TV",
    avatar: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=100&h=100&fit=crop"
  },
  {
    id: "a8",
    name: "JOB TALK",
    avatar: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=100&h=100&fit=crop"
  },
  {
    id: "a9",
    name: "JOB CHANNEL",
    avatar: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=100&h=100&fit=crop"
  },
  {
    id: "a10",
    name: "JOB HUNT",
    avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop"
  },
  {
    id: "a11",
    name: "CAREER NEWS",
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&h=100&fit=crop"
  },
  {
    id: "a12",
    name: "RECRUIT JOURNAL",
    avatar: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=100&h=100&fit=crop"
  },
  {
    id: "a13",
    name: "WORK STYLE PRESS",
    avatar: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=100&h=100&fit=crop"
  },
  {
    id: "a14",
    name: "JOB PICKS",
    avatar: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=100&h=100&fit=crop"
  },
  {
    id: "a15",
    name: "NEXT CAREER TIMES",
    avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop"
  },
  {
    id: "a16",
    name: "HR TALK",
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&h=100&fit=crop"
  },
  {
    id: "a17",
    name: "BIZREACH VOICE",
    avatar: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=100&h=100&fit=crop"
  },
  {
    id: "a18",
    name: "CAREER HACK CHANNEL",
    avatar: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=100&h=100&fit=crop"
  },
  {
    id: "a19",
    name: "RECRUIT TV",
    avatar: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=100&h=100&fit=crop"
  },
  {
    id: "a20",
    name: "JOB HUNT JOURNAL",
    avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop"
  }
];

export default function Home() {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // モバイルとデスクトップでヘッダーの高さが異なる
      const isMobile = window.innerWidth < 768;
      const headerHeight = isMobile ? 64 : 72; // モバイル: h-16 = 64px, デスクトップ: h-18 = 72px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const sections = [
    { id: "short", label: "⚡ 就活Shorts" },
    { id: "documentary", label: "📹 就活ドキュメンタリー" },
    { id: "company", label: "🏢 企業説明" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-16 md:pt-18">
        <HeroSection
          title={heroProgram.title}
          description={heroProgram.description}
          thumbnail={heroProgram.thumbnail}
          videoUrl={heroProgram.videoUrl}
          channel={heroProgram.channel}
          viewers={heroProgram.viewers}
        />
        <div className="bg-gray-900">
          <div className="pt-2 pb-0">
            <BannerList banners={banners} />
          </div>

          {/* Section Navigation */}
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleScrollToSection(section.id)}
                  className="px-4 py-2 md:px-6 md:py-3 font-semibold text-xs md:text-sm lg:text-base transition-all text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 shadow-sm hover:shadow-md"
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Content */}
          <div id="short" className="scroll-mt-20 py-8">
            <ShortVideoSection title="⚡ 就活Shorts" videos={shortVideos} />
          </div>
          <AccountList accounts={accounts} />
          <div id="documentary" className="bg-gray-800/70 py-8 scroll-mt-20 border-y border-gray-700/50">
            <ProgramSection title="📹 就活ドキュメンタリー" programs={documentaryPrograms} largeCards={true} />
          </div>
          <div id="company" className="scroll-mt-20 py-4">
            <ProgramSection title="🏢 企業説明A" programs={companyPrograms} vertical={true} />
          </div>
          <div id="company2" className="scroll-mt-20 py-4">
            <ProgramSection title="🏢 企業説明B" programs={companyPrograms} vertical={true} />
          </div>
          <div id="company3" className="scroll-mt-20 py-4">
            <ProgramSection title="🏢 企業説明C" programs={companyPrograms} vertical={true} />
          </div>
          <div id="company4" className="scroll-mt-20 py-4">
            <ProgramSection title="🏢 企業説明D" programs={companyPrograms} vertical={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
