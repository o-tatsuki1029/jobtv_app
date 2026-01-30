"use client";

import { cn } from "@/utils";
import { getCompanies } from "@/lib/actions/company-actions";
import { createJob, updateJob } from "@/lib/actions/job-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobFormProps {
  className?: string;
  initialData?: {
    id?: string;
    company_id?: string;
    title?: string;
    description?: string;
    requirements?: string;
    employment_type?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    status?: "active" | "closed";
  };
  onSuccess?: () => void;
}

export function JobForm({
  className,
  initialData,
  onSuccess,
  ...props
}: JobFormProps & React.ComponentPropsWithoutRef<"form">) {
  const [companyId, setCompanyId] = useState(initialData?.company_id || "");

  // 企業IDが既に設定されている場合は変更不可
  useEffect(() => {
    if (initialData?.company_id) {
      setCompanyId(initialData.company_id);
    }
  }, [initialData?.company_id]);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [requirements, setRequirements] = useState(
    initialData?.requirements || ""
  );
  const [employmentType, setEmploymentType] = useState(
    initialData?.employment_type || ""
  );
  const [location, setLocation] = useState(initialData?.location || "");
  const [salaryMin, setSalaryMin] = useState(
    initialData?.salary_min?.toString() || ""
  );
  const [salaryMax, setSalaryMax] = useState(
    initialData?.salary_max?.toString() || ""
  );
  const [status, setStatus] = useState<"active" | "closed">(
    initialData?.status || "active"
  );
  const [companies, setCompanies] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData?.id;

  // 企業一覧を取得
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await getCompanies();
      if (error) {
        console.error("企業取得エラー:", error);
        return;
      }
      if (data) {
        setCompanies(data as Array<{ id: string; name: string }>);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const jobData = {
        company_id: companyId,
        title,
        description: description || null,
        requirements: requirements || null,
        employment_type: employmentType,
        location: location || null,
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        status,
      };

      let result;
      if (isEditMode && initialData?.id) {
        // 更新
        result = await updateJob(initialData.id, jobData);
      } else {
        // 新規作成
        result = await createJob(jobData);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Form error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("エラーが発生しました: " + String(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 企業IDが既に設定されている場合は企業選択を非表示
  const isCompanyPreselected = !!initialData?.company_id;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        {!isCompanyPreselected && (
          <div className="grid gap-2">
            <Label htmlFor="company_id">
              企業 <span className="text-red-500">*</span>
            </Label>
            <Select value={companyId} onValueChange={setCompanyId} required>
              <SelectTrigger>
                <SelectValue placeholder="企業を選択" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="title">
            求人タイトル <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="例: フロントエンドエンジニア"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">求人詳細</Label>
          <textarea
            id="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="求人の詳細を入力"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="requirements">要件</Label>
          <textarea
            id="requirements"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="必要なスキルや経験を入力"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="employment_type">
            雇用形態 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="employment_type"
            type="text"
            placeholder="例: 正社員、契約社員"
            required
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">勤務地</Label>
          <Input
            id="location"
            type="text"
            placeholder="例: 東京都渋谷区"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="salary_min">最低給与（万円）</Label>
            <Input
              id="salary_min"
              type="number"
              placeholder="300"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary_max">最高給与（万円）</Label>
            <Input
              id="salary_max"
              type="number"
              placeholder="500"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">ステータス</Label>
          <Select
            value={status}
            onValueChange={(value: "active" | "closed") => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">募集中</SelectItem>
              <SelectItem value="closed">募集終了</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading
              ? isEditMode
                ? "更新中..."
                : "登録中..."
              : isEditMode
              ? "更新"
              : "登録"}
          </Button>
        </div>
      </div>
    </form>
  );
}
