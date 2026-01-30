import { CompanyForm } from "@/components/company-form";

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">新規企業登録</h1>
        <p className="text-muted-foreground">新しい企業を登録します</p>
      </div>
      <CompanyForm />
    </div>
  );
}
