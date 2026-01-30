"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseInsert } from "@/lib/actions/supabase-actions";
import Button from "@/components/ui/Button";
import {
  FormField,
  TextInput,
  SelectInput,
} from "@/components/ui/form/FormField";
import { isKatakana } from "@/utils/validation/index";
import { translateAuthError } from "@/utils/auth/errors";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from "@/utils/auth/validation";

type Company = {
  id: string;
  name: string;
};

export default function RecruiterSignupPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    company_id: "",
    last_name: "",
    first_name: "",
    last_name_kana: "",
    first_name_kana: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("企業取得エラー:", error);
      return;
    }

    setCompanies(data || []);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_id) {
      newErrors.company_id = "企業を選択してください";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "姓を入力してください";
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "名を入力してください";
    }

    if (!formData.last_name_kana.trim()) {
      newErrors.last_name_kana = "姓（カナ）を入力してください";
    } else if (!isKatakana(formData.last_name_kana)) {
      newErrors.last_name_kana = "姓（カナ）はカタカナで入力してください";
    }

    if (!formData.first_name_kana.trim()) {
      newErrors.first_name_kana = "名（カナ）を入力してください";
    } else if (!isKatakana(formData.first_name_kana)) {
      newErrors.first_name_kana = "名（カナ）はカタカナで入力してください";
    }

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const passwordConfirmError = validatePasswordConfirm(
      formData.password,
      formData.confirmPassword
    );
    if (passwordConfirmError) newErrors.confirmPassword = passwordConfirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: { role: "recruiter" },
          },
        }
      );

      if (signUpError) {
        setError(translateAuthError(signUpError));
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        if (authData.session === null) {
          router.push(
            "/login?message=登録が完了しました。メールアドレスを確認してからログインしてください。"
          );
          return;
        }
        setError("ユーザー作成に失敗しました");
        setIsLoading(false);
        return;
      }

      // usersテーブルに登録（トリガーで自動登録されるはずだが、念のため手動で登録）
      const { error: userInsertError } = await supabaseInsert("profiles", {
        id: authData.user.id,
        email: formData.email,
        role: "recruiter",
      });

      if (userInsertError) {
        // 既に存在する場合は無視（トリガーで既に作成されている可能性がある）
        const errorCode =
          userInsertError &&
          typeof userInsertError === "object" &&
          "code" in userInsertError
            ? String((userInsertError as { code: string }).code)
            : "";
        if (errorCode !== "23505") {
          console.error("usersテーブル登録エラー:", userInsertError);
        }
      }

      const { error: insertError } = await supabaseInsert("profiles", {
        id: authData.user.id,
        company_id: formData.company_id,
        email: formData.email,
        last_name: formData.last_name,
        first_name: formData.first_name,
        last_name_kana: formData.last_name_kana,
        first_name_kana: formData.first_name_kana,
      });

      if (insertError) {
        const errorMessage =
          insertError &&
          typeof insertError === "object" &&
          "message" in insertError
            ? String((insertError as { message: string }).message)
            : "ユーザーは作成されましたが、担当者情報の登録に失敗しました。管理者に連絡してください。";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      router.push(
        authData.session === null
          ? "/login?message=登録が完了しました。メールアドレスを確認してからログインしてください。"
          : "/login?message=登録が完了しました。ログインしてください。"
      );
    } catch (error: unknown) {
      console.error("登録エラー:", error);
      setError(error instanceof Error ? error.message : "登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">企業担当者新規登録</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="企業">
            <SelectInput
              name="company_id"
              value={formData.company_id}
              onChange={(e) =>
                setFormData({ ...formData, company_id: e.target.value })
              }
              options={companyOptions}
              placeholder="企業を選択"
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
            {errors.company_id && (
              <div className="text-red-600 text-sm mt-1">
                {errors.company_id}
              </div>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="姓">
              <TextInput
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="山田"
                required
                className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
              />
              {errors.last_name && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.last_name}
                </div>
              )}
            </FormField>

            <FormField label="名">
              <TextInput
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                placeholder="太郎"
                required
                className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
              />
              {errors.first_name && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.first_name}
                </div>
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="姓（カナ）">
              <TextInput
                type="text"
                name="last_name_kana"
                value={formData.last_name_kana}
                onChange={(e) =>
                  setFormData({ ...formData, last_name_kana: e.target.value })
                }
                placeholder="ヤマダ"
                required
                className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
              />
              {errors.last_name_kana && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.last_name_kana}
                </div>
              )}
            </FormField>

            <FormField label="名（カナ）">
              <TextInput
                type="text"
                name="first_name_kana"
                value={formData.first_name_kana}
                onChange={(e) =>
                  setFormData({ ...formData, first_name_kana: e.target.value })
                }
                placeholder="タロウ"
                required
                className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
              />
              {errors.first_name_kana && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.first_name_kana}
                </div>
              )}
            </FormField>
          </div>

          <FormField label="メールアドレス">
            <TextInput
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
              required
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
            {errors.email && (
              <div className="text-red-600 text-sm mt-1">{errors.email}</div>
            )}
          </FormField>

          <FormField label="パスワード">
            <TextInput
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="6文字以上"
              required
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
            {errors.password && (
              <div className="text-red-600 text-sm mt-1">{errors.password}</div>
            )}
          </FormField>

          <FormField label="パスワード（確認）">
            <TextInput
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="パスワードを再入力"
              required
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
            {errors.confirmPassword && (
              <div className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </FormField>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "登録中..." : "登録"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方は{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              ログイン
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
