"use client";

import { cn } from "@/lib/utils";
import { getCompanyActiveJobs } from "@/lib/actions/job-actions";
import { getCompanies } from "@/lib/actions/company-actions";
import { createApplication } from "@/lib/actions/candidate-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ApplicationFormProps {
  className?: string;
  candidateId: string;
  onSuccess?: () => void;
}

export function ApplicationForm({
  className,
  candidateId,
  onSuccess,
  ...props
}: ApplicationFormProps & React.ComponentPropsWithoutRef<"form">) {
  const [companyId, setCompanyId] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [jobPostingId, setJobPostingId] = useState("");
  const [companies, setCompanies] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [jobs, setJobs] = useState<
    Array<{ id: string; title: string; company_id: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompanyResults, setShowCompanyResults] = useState(false);

  // 企業一覧を取得
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await getCompanies();
      if (!error && data) {
        setCompanies(
          data
            .filter((c): c is typeof c & { id: string; name: string } => !!c.id && !!c.name)
            .map((c) => ({ id: c.id, name: c.name }))
        );
      }
    };
    fetchCompanies();
  }, []);

  // 企業検索結果をフィルタリング
  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) {
      return [];
    }
    const query = companySearch.toLowerCase();
    return companies
      .filter((company) => company.name.toLowerCase().includes(query))
      .slice(0, 10); // 最大10件まで表示
  }, [companies, companySearch]);

  // 企業を選択
  const handleCompanySelect = (company: { id: string; name: string }) => {
    setSelectedCompany(company);
    setCompanyId(company.id);
    setCompanySearch(company.name);
    setShowCompanyResults(false);
  };

  // 企業が選択されたら、その企業の求人を取得
  useEffect(() => {
    if (companyId) {
      const fetchJobs = async () => {
        const { data, error } = await getCompanyActiveJobs(companyId);
        if (!error && data) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      };
      fetchJobs();
      setJobPostingId(""); // 企業が変わったら求人選択をリセット
    } else {
      setJobs([]);
      setJobPostingId("");
    }
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!jobPostingId) {
        throw new Error("求人を選択してください");
      }

      // 応募を作成
      const { data: applicationData, error: insertError } =
        await createApplication(candidateId, jobPostingId);

      if (insertError || !applicationData) {
        throw new Error(insertError || "応募の作成に失敗しました");
      }

      // フォームをリセット
      setCompanyId("");
      setCompanySearch("");
      setSelectedCompany(null);
      setJobPostingId("");

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

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="company_search">
            企業 <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="company_search"
              type="text"
              placeholder="企業名で検索..."
              value={companySearch}
              onChange={(e) => {
                setCompanySearch(e.target.value);
                setShowCompanyResults(true);
                if (!e.target.value) {
                  setSelectedCompany(null);
                  setCompanyId("");
                }
              }}
              onFocus={() => {
                if (companySearch) {
                  setShowCompanyResults(true);
                }
              }}
              className="pl-9"
              required
            />
            {showCompanyResults && filteredCompanies.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => handleCompanySelect(company)}
                    className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            )}
            {showCompanyResults &&
              companySearch &&
              filteredCompanies.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-4 text-sm text-muted-foreground">
                  該当する企業が見つかりません
                </div>
              )}
          </div>
          {selectedCompany && (
            <p className="text-sm text-muted-foreground">
              選択中: {selectedCompany.name}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="job_posting_id">
            求人 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={jobPostingId}
            onValueChange={setJobPostingId}
            required
            disabled={!companyId || jobs.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !companyId
                    ? "まず企業を選択してください"
                    : jobs.length === 0
                    ? "この企業に公開中の求人がありません"
                    : "求人を選択"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "応募中..." : "応募する"}
          </Button>
        </div>
      </div>
    </form>
  );
}
