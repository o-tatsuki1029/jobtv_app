"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Company } from "@/types/company.types";

type CompanyTableActionsProps = {
  company: Company;
  onEdit: (company: Company) => void;
};

export default function CompanyTableActions({
  company,
  onEdit,
}: CompanyTableActionsProps) {
  const router = useRouter();

  return (
    <div className="px-3 py-2 flex justify-end gap-2 font-semibold">
      <Button
        onClick={() => router.push(`/admin/recruiters/${company.id}`)}
        variant="primary"
      >
        担当者管理
      </Button>
      <Button onClick={() => onEdit(company)} variant="light">
        編集
      </Button>
    </div>
  );
}
