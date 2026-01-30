"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">新規登録</h2>
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            アカウントの種類を選択してください
          </p>

          <div className="space-y-3">
            <Link href="/signup/recruiter" className="block">
              <Button variant="primary" className="w-full">
                企業担当者として登録
              </Button>
            </Link>

            <Link href="/signup/admin" className="block">
              <Button variant="secondary" className="w-full">
                管理者として登録
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方は{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              ログイン
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
