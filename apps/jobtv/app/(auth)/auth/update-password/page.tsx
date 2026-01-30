"use client";

import { useState } from "react";
import { updatePassword } from "@/lib/actions/auth-actions";
import { primaryButtonClass } from "@/constants/navigation";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await updatePassword(formData);
    setLoading(false);

    if (result && result.error) {
      setError(result.error);
    } else if (result && result.success) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">パスワードを更新しました</h1>
          <p className="text-gray-600 mb-8">新しいパスワードでログインしてください。</p>
          <Link href="/auth/login" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
            ログイン画面へ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-20 bg-white">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">パスワードの更新</h1>
          <p className="text-gray-600">新しいパスワードを設定してください</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                新しいパスワード
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
              {loading ? "更新中..." : "パスワードを更新"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
