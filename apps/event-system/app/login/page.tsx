"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/form/FormField";
import { loginAction } from "@/lib/actions/auth-actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("message");
    if (msg) {
      setMessage(msg);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">ログイン</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          autoComplete="on"
        >
          <input 
            type="hidden" 
            name="redirect" 
            value={typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("redirect") || "" : ""} 
          />
          <FormField label="メールアドレス">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email@example.com"
              required
              autoComplete="username email"
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
          </FormField>
          <FormField label="パスワード">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="パスワード"
              required
              autoComplete="current-password"
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
          </FormField>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "ログイン中..." : "ログイン"}
          </Button>

          <div className="text-center text-sm">
            <a
              href="/login/reset-password"
              className="text-blue-600 hover:underline"
            >
              パスワードを忘れた場合
            </a>
          </div>

          <div className="text-center text-sm text-gray-600">
            アカウントをお持ちでない方は{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              新規登録
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
