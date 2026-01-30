"use client";

import { useState } from "react";
import { signUp } from "@/lib/actions/auth-actions";
import { primaryButtonClass } from "@/constants/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signUp(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center px-4 py-20 bg-white">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">確認メールを送信しました</h1>
          <p className="text-gray-600 mb-8">
            入力いただいたメールアドレスに確認用メールを送信しました。メール内のリンクをクリックして登録を完了してください。
          </p>
          <Link href="/" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-20 bg-white">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JOBTVに無料登録</h1>
          <p className="text-gray-600">動画で始める、新しい就活スタイル</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                placeholder="example@jobtv.jp"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                placeholder="8文字以上で入力"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${primaryButtonClass} py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? "送信中..." : "同意して無料で始める"}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
            「同意して無料で始める」をクリックすることで、当社の
            <a href="#" className="text-gray-900 hover:underline">
              利用規約
            </a>
            および
            <a href="#" className="text-gray-900 hover:underline">
              プライバシーポリシー
            </a>
            に同意したものとみなされます。
          </p>
        </div>

        <p className="mt-8 text-center text-gray-600 text-sm">
          すでにアカウントをお持ちですか？{" "}
          <Link href="/auth/login" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
