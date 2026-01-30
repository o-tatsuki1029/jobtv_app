"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { CompanyForm } from "@/components/company-form";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CompanyData } from "@/lib/actions/company-actions";

type Company = CompanyData & { id: string; name: string };

interface CompaniesListProps {
  companies: Company[];
}

export function CompaniesList({ companies }: CompaniesListProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  // 検索フィルタリング
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) {
      return companies;
    }
    const query = searchQuery.toLowerCase();
    return companies.filter((company) =>
      company.name.toLowerCase().includes(query)
    );
  }, [companies, searchQuery]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規登録
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新規企業登録</DialogTitle>
              <DialogDescription>新しい企業を登録します</DialogDescription>
            </DialogHeader>
            <CompanyForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="企業名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>企業一覧</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length > 0 ? (
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{company.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/companies/${company.id}`}>詳細</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                「{searchQuery}」に一致する企業が見つかりません
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                登録されている企業がありません
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    最初の企業を登録
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>新規企業登録</DialogTitle>
                    <DialogDescription>
                      新しい企業を登録します
                    </DialogDescription>
                  </DialogHeader>
                  <CompanyForm onSuccess={handleSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
