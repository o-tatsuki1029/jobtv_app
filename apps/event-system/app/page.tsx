import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            イベント運営システム
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            管理者、企業担当者、学生のための総合イベント管理プラットフォーム
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 管理者カード */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full transition-transform hover:scale-105">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">管理者</h2>
            <p className="text-gray-500 mb-6 flex-grow">
              イベントの作成、企業・学生の管理、マッチングの実行などを行います。
            </p>
            <Link href="/admin">
              <Button variant="primary" className="w-full">管理者ログイン</Button>
            </Link>
          </div>

          {/* 企業担当者カード */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full transition-transform hover:scale-105">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">企業担当者</h2>
            <p className="text-gray-500 mb-6 flex-grow">
              学生の評価や、学生からのフィードバック閲覧を行います。
            </p>
            <Link href="/recruiter/rating">
              <Button variant="success" className="w-full">企業ログイン</Button>
            </Link>
          </div>

          {/* 学生カード */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full transition-transform hover:scale-105">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">学生</h2>
            <p className="text-gray-500 mb-6 flex-grow">
              イベント参加後の企業評価を行います。
            </p>
            <Link href="/candidate/login">
              <Button variant="danger" className="w-full">学生ログイン</Button>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            &copy; 2026 イベント運営システム All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

