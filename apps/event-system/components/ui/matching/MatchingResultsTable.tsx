"use client";

import Table from "@/components/ui/table/Table";
import { MatchingResultRow } from "@/types/matching.types";

type MatchingResultsTableProps = {
  data: MatchingResultRow[];
};

// テーブルヘッダー定義
const tableHeaders = [
  {
    label: "特別面談",
    key: "isSpecialInterview" as const,
    renderCell: (value: unknown) => {
      if (value) {
        return <span className="text-red-600 font-semibold">【特】</span>;
      }
      return <span className="font-semibold">-</span>;
    },
  },
  {
    label: "席番号",
    key: "seatNumber" as const,
    renderCell: (value: unknown) => {
      return <span className="font-semibold">{String(value)}</span>;
    },
  },
  {
    label: "学生名",
    key: "candidateName" as const,
    renderCell: (value: unknown) => {
      return <span className="font-semibold">{String(value)}</span>;
    },
  },
  {
    label: "企業名",
    key: "companyName" as const,
    renderCell: (value: unknown) => {
      return <span className="font-semibold">{String(value)}</span>;
    },
  },
];

export default function MatchingResultsTable({
  data,
}: MatchingResultsTableProps) {
  return (
    <Table
      headers={tableHeaders}
      data={data.map((row) => ({
        isSpecialInterview: row.isSpecialInterview,
        seatNumber: row.seatNumber,
        candidateName: row.candidateName,
        companyName: row.companyName,
        candidateId: row.candidateId,
        companyId: row.companyId,
        candidateKana: row.candidateKana,
        matchScore: row.matchScore,
      }))}
      getRowClassName={(row: { isSpecialInterview: boolean }) => {
        return row.isSpecialInterview ? "bg-red-100" : "";
      }}
    />
  );
}
