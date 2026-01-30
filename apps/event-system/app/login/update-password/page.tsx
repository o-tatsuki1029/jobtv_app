"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/form/FormField";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      setIsChecking(true);
      const supabase = createClient();

      // URLパラメータからエラーを確認
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      const errorCode = urlParams.get("error_code");
      const errorDescription = urlParams.get("error_description");

      // ハッシュパラメータからエラーを確認
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.substring(1));
      const hashError = hashParams.get("error");
      const hashErrorCode = hashParams.get("error_code");
      const hashErrorDescription = hashParams.get("error_description");

      // エラーがある場合は処理
      const finalError = error || hashError;
      const finalErrorCode = errorCode || hashErrorCode;
      const finalErrorDescription = errorDescription || hashErrorDescription;

      if (finalError) {
        console.log(
          "Error detected:",
          finalError,
          finalErrorCode,
          finalErrorDescription
        );
        setIsChecking(false);
        setIsValidToken(false);

        if (finalErrorCode === "otp_expired") {
          setError(
            "パスワードリセットリンクの有効期限が切れています。新しいパスワードリセットメールを送信してください。"
          );
        } else if (finalErrorCode === "access_denied") {
          setError(
            "パスワードリセットリンクが無効です。新しいパスワードリセットメールを送信してください。"
          );
        } else {
          setError(
            finalErrorDescription ||
              "パスワードリセットリンクに問題があります。新しいパスワードリセットメールを送信してください。"
          );
        }
        return;
      }

      // ハッシュパラメータを確認
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");

      console.log("Full URL:", window.location.href);
      console.log("Hash:", hash);
      console.log("Type:", type);
      console.log("Access token:", !!accessToken);
      console.log("Search params:", window.location.search);

      // ハッシュパラメータがない場合でも、セッションを確認（既に処理されている可能性がある）
      if (!hash || hash.length <= 1) {
        console.log("No hash parameters, checking existing session...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Found existing session");
          setIsValidToken(true);
          setError("");
          setIsChecking(false);
          return;
        }
      }

      if (type === "recovery" && accessToken) {
        let subscription: { unsubscribe: () => void } | null = null;
        let resolved = false;

        // onAuthStateChangeでPASSWORD_RECOVERYまたはSIGNED_INイベントを監視
        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log(
            "Auth state change:",
            event,
            session ? "has session" : "no session"
          );

          if (
            (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") &&
            session
          ) {
            if (!resolved) {
              resolved = true;
              setIsValidToken(true);
              setError("");
              setIsChecking(false);
              if (subscription) {
                subscription.unsubscribe();
              }
            }
          }
        });

        subscription = sub;

        // セッションを定期的に確認
        const checkSession = async (): Promise<boolean> => {
          try {
            const {
              data: { session },
              error: sessionError,
            } = await supabase.auth.getSession();

            console.log(
              "Session check:",
              session ? "has session" : "no session",
              sessionError
            );

            if (session && !resolved) {
              resolved = true;
              setIsValidToken(true);
              setError("");
              setIsChecking(false);
              if (subscription) {
                subscription.unsubscribe();
              }
              return true;
            }
            return false;
          } catch (err) {
            console.error("Session check error:", err);
            return false;
          }
        };

        // 即座にチェック
        const hasSession = await checkSession();
        if (hasSession) {
          return;
        }

        // 500ms後に再チェック
        setTimeout(async () => {
          if (!resolved) {
            await checkSession();
          }
        }, 500);

        // 1秒後に再チェック
        setTimeout(async () => {
          if (!resolved) {
            await checkSession();
          }
        }, 1000);

        // 2秒後に再チェック
        setTimeout(async () => {
          if (!resolved) {
            await checkSession();
          }
        }, 2000);

        // 3秒後に最終チェック
        setTimeout(async () => {
          if (!resolved) {
            const finalCheck = await checkSession();
            if (!finalCheck) {
              resolved = true;
              setError(
                "無効なリンクです。パスワードリセットメールから再度アクセスしてください。リンクが期限切れの可能性があります。"
              );
              setIsValidToken(false);
              setIsChecking(false);
            }
            if (subscription) {
              subscription.unsubscribe();
            }
          }
        }, 3000);

        // クリーンアップ
        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      } else {
        // ハッシュパラメータがない場合
        console.log("No valid recovery token in hash");
        setError(
          "無効なリンクです。パスワードリセットメールから再度アクセスしてください。"
        );
        setIsValidToken(false);
        setIsChecking(false);
      }
    };

    checkToken();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!isValidToken) {
      setError(
        "無効なリンクです。パスワードリセットメールから再度アクセスしてください。"
      );
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("パスワードを入力してください");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // パスワードを更新
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || "パスワードの更新に失敗しました");
        setIsLoading(false);
        return;
      }

      setMessage(
        "パスワードを更新しました。ログイン画面からログインしてください。"
      );

      // 3秒後にログイン画面にリダイレクト
      setTimeout(() => {
        router.push(
          "/login?message=パスワードを更新しました。ログインしてください。"
        );
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">パスワード更新</h2>
        {isChecking && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm text-center">
            リンクを確認中...
          </div>
        )}
        {!isChecking && !isValidToken && error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <FormField label="新しいパスワード">
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              required
              autoComplete="new-password"
              disabled={!isValidToken || isLoading || isChecking}
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </FormField>
          <FormField label="パスワード（確認）">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワードを再入力"
              required
              autoComplete="new-password"
              disabled={!isValidToken || isLoading || isChecking}
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </FormField>
          {error && isValidToken && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {message && <div className="text-green-600 text-sm">{message}</div>}
          <Button
            type="submit"
            variant="primary"
            disabled={!isValidToken || isLoading || isChecking}
            className="w-full"
          >
            {isLoading ? "更新中..." : "パスワードを更新"}
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
