"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/form/FormField";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/auth-actions";

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("origin", window.location.origin);
    
    const result = await resetPasswordAction(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.message) {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">パスワード再発行</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="メールアドレス">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email@example.com"
              required
              autoComplete="email"
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
          </FormField>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "送信中..." : "パスワードリセットメールを送信"}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              ログイン画面に戻る
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
