"use client";

import { useMemo, useRef } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ScoreSheetData } from "@/lib/actions/score-sheet-actions";
import {
  RATING_GRADE_MAP,
  RATING_NUMBER_MAP,
  RatingGrade,
} from "@/types/rating.types";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { generateEvaluationPDF } from "../../../utils/document/evaluation-pdf";

type CandidateEvaluationDetailProps = {
  data: ScoreSheetData;
};

const RATING_LABELS = {
  logicRating: {
    label: "ロジカル",
    desc: "課題を構造的に理解・整理する能力",
  },
  initiativeRating: {
    label: "アクティブ",
    desc: "主体的に課題に取り組む能力",
  },
  creativeRating: {
    label: "クリエイティブ",
    desc: "自ら考えて価値を生み出す能力",
  },
  communicationRating: {
    label: "コミュニケーション",
    desc: "他者の立場に立って議論を展開する能力",
  },
  cooperationRating: {
    label: "サポート",
    desc: "全体を俯瞰してチームを支える能力",
  },
};

const getGradeColorClass = (grade: string | undefined) => {
  if (!grade || grade === "-") return "text-gray-400";
  switch (grade.toUpperCase()) {
    case "S":
      return "text-red-500";
    case "A":
      return "text-blue-600";
    case "B":
      return "text-blue-400";
    case "C":
      return "text-blue-300";
    default:
      return "text-blue-600";
  }
};

const getGradeBgClass = (grade: string | undefined) => {
  if (!grade || grade === "-") return "bg-gray-50 border-gray-100";
  switch (grade.toUpperCase()) {
    case "S":
      return "bg-red-50 border-red-100";
    case "A":
      return "bg-blue-50 border-blue-100";
    case "B":
      return "bg-blue-50/50 border-blue-50";
    case "C":
      return "bg-blue-50/30 border-blue-50/50";
    default:
      return "bg-blue-50 border-blue-100";
  }
};

const getGradeTextClass = (grade: string | undefined) => {
  if (!grade || grade === "-") return "text-gray-400";
  switch (grade.toUpperCase()) {
    case "S":
      return "text-red-600";
    case "A":
      return "text-blue-700";
    case "B":
      return "text-blue-500";
    case "C":
      return "text-blue-400";
    default:
      return "text-blue-700";
  }
};

export default function CandidateEvaluationDetail({
  data,
}: CandidateEvaluationDetailProps) {
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  // 全体平均用のデータ整形
  const averageRadarData = useMemo(() => {
    const metrics = [
      { key: "logicRating", label: "ロジカル" },
      { key: "initiativeRating", label: "アクティブ" },
      { key: "creativeRating", label: "クリエイティブ" },
      { key: "communicationRating", label: "コミュニケーション" },
      { key: "cooperationRating", label: "サポート" },
    ];

    return metrics.map((m) => {
      const row: any = { subject: m.label, fullMark: 4 };
      let sum = 0;
      let count = 0;
      data.companies.forEach((company) => {
        const rating = company[m.key as keyof typeof company] as string | null;
        if (rating) {
          sum += RATING_GRADE_MAP[rating as keyof typeof RATING_GRADE_MAP];
          count++;
        }
      });
      row["平均"] = count > 0 ? sum / count : 0;
      // 平均のアルファベットグレードも保持
      row["grade"] =
        count > 0 ? RATING_NUMBER_MAP[Math.round(sum / count)] : "-";
      return row;
    });
  }, [data]);

  // 全体平均の総合評価を算出
  const averageOverallRating = useMemo(() => {
    let sum = 0;
    let count = 0;
    data.companies.forEach((company) => {
      const rating = company.overallRating as RatingGrade | null;
      if (rating && RATING_GRADE_MAP[rating]) {
        sum += RATING_GRADE_MAP[rating];
        count++;
      }
    });
    if (count === 0) return "-";
    const avg = Math.round(sum / count);
    return RATING_NUMBER_MAP[avg] || "-";
  }, [data]);

  // 各企業個別のデータ整形関数
  const getCompanyRadarData = (company: any) => {
    const metrics = [
      { key: "logicRating", label: "ロジカル" },
      { key: "initiativeRating", label: "アクティブ" },
      { key: "creativeRating", label: "クリエイティブ" },
      { key: "communicationRating", label: "コミュニケーション" },
      { key: "cooperationRating", label: "サポート" },
    ];

    return metrics.map((m) => {
      const rating = company[m.key] as string | null;
      return {
        subject: m.label,
        value: rating
          ? RATING_GRADE_MAP[rating as keyof typeof RATING_GRADE_MAP]
          : 0,
        fullMark: 4,
      };
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleDownloadPDF = async () => {
    await generateEvaluationPDF(data);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学生評価詳細</h1>
          <p className="text-gray-500">
            {data.eventName} (
            {new Date(data.eventDate).toLocaleDateString("ja-JP")})
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={handleBack}>
            戻る
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            PDFダウンロード
          </Button>
        </div>
      </div>

      <div
        id="evaluation-report"
        className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
      >
        {/* 学生情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-500 uppercase">
              氏名
            </label>
            <p className="text-xl font-bold text-gray-900">
              {data.candidateName}
            </p>
            <p className="text-sm text-gray-500">{data.candidateKana}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 uppercase">
              席番号
            </label>
            <p className="text-xl font-bold text-gray-900">
              {data.seatNumber || "-"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 uppercase">
              評価社数
            </label>
            <p className="text-xl font-bold text-gray-900">
              {data.companies.length}社
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center border rounded-xl p-4 shadow-sm ${getGradeBgClass(
              averageOverallRating
            )}`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-wider mb-1 ${getGradeTextClass(
                averageOverallRating
              )}`}
            >
              総合スコア
            </span>
            <span
              className={`text-4xl font-black leading-none ${getGradeTextClass(
                averageOverallRating
              )}`}
            >
              {averageOverallRating}
            </span>
          </div>
        </div>

        {/* レーダーチャート（総合） */}
        <div className="py-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            評価レーダーチャート（総合）
          </h2>
          <div className="overflow-x-auto pb-4">
            <div
              className="h-[350px] w-[400px] mx-auto"
              ref={chartRef}
              id="average-radar-chart"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  responsive={true}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={averageRadarData}
                  margin={{ top: 10, right: 40, bottom: 10, left: 40 }}
                >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="subject"
                    fontSize={10}
                    fontWeight="bold" // 太字に設定
                  />
                  {/* <PolarRadiusAxis angle={30} domain={[0, 4]} tickCount={5} /> */}
                  <Radar
                    name="全体平均"
                    dataKey="平均"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 全体平均の個別評価タイルを追加 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {averageRadarData.map((item: any) => (
              <div
                key={item.subject}
                className={`flex flex-col items-center justify-between border rounded-xl py-3 px-3 min-h-[80px] shadow-sm ${getGradeBgClass(
                  item.grade
                )}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`text-[10px] font-bold text-center leading-tight ${getGradeTextClass(
                      item.grade
                    )}`}
                  >
                    {item.subject}
                  </span>
                  <span className="text-[9px] text-gray-400 font-normal text-center leading-tight">
                    {
                      Object.values(RATING_LABELS).find(
                        (l) => l.label === item.subject
                      )?.desc
                    }
                  </span>
                </div>
                <span
                  className={`text-xl font-black leading-none mt-2 ${getGradeTextClass(
                    item.grade
                  )}`}
                >
                  {item.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 各企業からの評価と個別チャート */}
        <div className="pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            企業別評価詳細
          </h2>
          <div className="space-y-8">
            {data.companies.map((company) => (
              <div
                key={company.companyId}
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col md:flex-row gap-6"
              >
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={`flex flex-col items-center justify-center border rounded-lg w-[64px] h-[48px] shrink-0 shadow-sm ${getGradeBgClass(
                          company.overallRating || undefined
                        )}`}
                      >
                        <span
                          className={`text-[9px] font-bold leading-none mb-1 opacity-80 ${getGradeTextClass(
                            company.overallRating || undefined
                          )}`}
                        >
                          総合評価
                        </span>
                        <span
                          className={`text-xl font-black leading-none ${getGradeTextClass(
                            company.overallRating || undefined
                          )}`}
                        >
                          {company.overallRating || "-"}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-xl leading-tight">
                        {company.companyName}
                      </h3>
                    </div>

                    {/* 個別評価の表示 */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                      {Object.entries(RATING_LABELS).map(([key, info]) => {
                        const grade =
                          (company[key as keyof typeof company] as string) ||
                          undefined;
                        return (
                          <div
                            key={key}
                            className={`flex flex-col items-center justify-between border rounded py-2 px-1 min-h-[60px] ${getGradeBgClass(
                              grade
                            )}`}
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <span
                                className={`text-[9px] font-bold text-center leading-tight ${getGradeTextClass(
                                  grade
                                )}`}
                              >
                                {info.label}
                              </span>
                            </div>
                            <span
                              className={`text-base font-black leading-none mt-1 ${getGradeTextClass(
                                grade
                              )}`}
                            >
                              {grade || "-"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-100 min-h-[60px]">
                      {company.comment || (
                        <span className="text-gray-400 italic">
                          コメントなし
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 個別レーダーチャート */}
                <div className="flex-shrink-0 overflow-x-auto bg-white p-2 rounded-lg border border-gray-100">
                  <div
                    className="w-[300px] h-[200px] mx-auto"
                    id={`chart-${company.companyId}`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={getCompanyRadarData(company)}
                        margin={{ top: 5, right: 30, bottom: 5, left: 30 }}
                      >
                        <PolarGrid />
                        <PolarAngleAxis
                          dataKey="subject"
                          fontSize={10}
                          fontWeight="bold" // 太字に設定
                        />
                        {/* <PolarRadiusAxis
                          angle={30}
                          domain={[0, 4]}
                          tickCount={5}
                          tick={false}
                        /> */}
                        <Radar
                          name={company.companyName}
                          dataKey="value"
                          stroke="#2563eb"
                          fill="#3b82f6"
                          fillOpacity={0.5}
                          isAnimationActive={false}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
