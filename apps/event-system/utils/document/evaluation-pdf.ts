import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ScoreSheetData } from "@/lib/actions/score-sheet-actions";
import {
  RATING_GRADE_MAP,
  RATING_NUMBER_MAP,
  RatingGrade,
} from "@/types/rating.types";

/**
 * フォントファイルをバイナリとして取得し、Base64に変換する
 */
async function fetchFontAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * 評価グレードに応じた色の設定
 */
const getGradeColors = (grade: string | undefined) => {
  if (!grade || grade === "-")
    return {
      text: [148, 163, 184],
      bg: [248, 250, 252],
      border: [226, 232, 240],
    };
  switch (grade.toUpperCase()) {
    case "S":
      return {
        text: [185, 28, 28],
        bg: [254, 242, 242],
        border: [254, 202, 202],
      }; // 赤系 (Red-700, Red-50, Red-200)
    case "A":
      return {
        text: [37, 99, 235],
        bg: [239, 246, 255],
        border: [191, 219, 254],
      }; // 青系 (Blue-600, Blue-50, Blue-200)
    case "B":
      return {
        text: [59, 130, 246],
        bg: [240, 249, 255],
        border: [219, 234, 254],
      }; // 薄い青 (Blue-500, Blue-50/50, Blue-100)
    case "C":
      return {
        text: [96, 165, 250],
        bg: [248, 250, 252],
        border: [226, 232, 240],
      }; // さらに薄い青 (Blue-400, Gray-50, Gray-200)
    default:
      return {
        text: [37, 99, 235],
        bg: [239, 246, 255],
        border: [191, 219, 254],
      };
  }
};

/**
 * 学生評価詳細をA4 PDFとして出力
 */
export async function generateEvaluationPDF(
  data: ScoreSheetData
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // フォントの読み込みと登録
  try {
    const [regularBase64, boldBase64] = await Promise.all([
      fetchFontAsBase64("/fonts/NotoSansJP-Regular.ttf"),
      fetchFontAsBase64("/fonts/NotoSansJP-Bold.ttf"),
    ]);

    doc.addFileToVFS("NotoSansJP-Regular.ttf", regularBase64);
    doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
    doc.addFileToVFS("NotoSansJP-Bold.ttf", boldBase64);
    doc.addFont("NotoSansJP-Bold.ttf", "NotoSansJP", "bold");
    doc.setFont("NotoSansJP", "normal");
  } catch (error) {
    console.error("Failed to load fonts:", error);
    doc.setFont("helvetica");
  }

  const fontName = doc.getFont().fontName;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // 全体平均の総合評価を算出
  let sumOverall = 0;
  let countOverall = 0;
  data.companies.forEach((company) => {
    const rating = company.overallRating as RatingGrade | null;
    if (rating && RATING_GRADE_MAP[rating]) {
      sumOverall += RATING_GRADE_MAP[rating];
      countOverall++;
    }
  });
  const averageOverallRating =
    countOverall > 0
      ? RATING_NUMBER_MAP[Math.round(sumOverall / countOverall)] || "-"
      : "-";

  // --- スタイリッシュなヘッダー帯 ---
  // タイトルの左に青い縦線を入れる
  doc.setDrawColor(37, 99, 235); // Blue-600
  doc.setLineWidth(1);
  doc.line(margin - 3, 9, margin - 3, 17);

  doc.setFontSize(18);
  doc.setFont(fontName, "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("学生評価フィードバックレポート", margin, 15);
  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(
    `${data.eventName} (${new Date(data.eventDate).toLocaleDateString(
      "ja-JP"
    )})`,
    pageWidth - margin,
    15,
    { align: "right" }
  );

  yPosition = 25;

  // --- 学生情報セクション ---
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont(fontName, "normal");
  doc.text(data.candidateKana, margin + 5, yPosition);

  yPosition += 7;
  doc.setFontSize(20);
  doc.setFont(fontName, "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(data.candidateName, margin + 5, yPosition);

  yPosition += 8;
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);
  doc.setFont(fontName, "bold");
  doc.text(`席番号: ${data.seatNumber || "-"}`, margin + 5, yPosition);

  // --- 総合スコア ＆ 個別項目（縦並び） ---
  yPosition += 7;
  const avgBadgeX = margin;
  const avgBadgeY = yPosition;
  const avgBadgeWidth = 28;
  const avgBadgeHeight = 16;

  const overallColors = getGradeColors(averageOverallRating);
  doc.setFillColor(
    overallColors.bg[0],
    overallColors.bg[1],
    overallColors.bg[2]
  );
  doc.setDrawColor(
    overallColors.border[0],
    overallColors.border[1],
    overallColors.border[2]
  );
  doc.roundedRect(
    avgBadgeX,
    avgBadgeY,
    avgBadgeWidth,
    avgBadgeHeight,
    1.5,
    1.5,
    "FD"
  );

  doc.setTextColor(
    overallColors.text[0],
    overallColors.text[1],
    overallColors.text[2]
  );
  doc.setFontSize(7);
  doc.setFont(fontName, "bold");
  doc.text("総合スコア", avgBadgeX + avgBadgeWidth / 2, avgBadgeY + 5, {
    align: "center",
  });
  doc.setFontSize(20);
  doc.text(
    averageOverallRating,
    avgBadgeX + avgBadgeWidth / 2,
    avgBadgeY + 13,
    { align: "center" }
  );

  // 総合個別項目をバッジの右側に縦並びで配置
  let overallMetricsX = avgBadgeX + avgBadgeWidth + 10;
  let overallMetricsY = avgBadgeY + 2;
  const metricsOverall = [
    {
      label: "ロジカル",
      key: "logicRating",
      desc: "課題を構造的に理解・整理する能力",
    },
    {
      label: "アクティブ",
      key: "initiativeRating",
      desc: "主体的に課題に取り組む能力",
    },
    {
      label: "クリエイティブ",
      key: "creativeRating",
      desc: "自ら考えて価値を生み出す能力",
    },
    {
      label: "コミュニケーション",
      key: "communicationRating",
      desc: "他者の立場に立って議論を展開する能力",
    },
    {
      label: "サポート",
      key: "cooperationRating",
      desc: "全体を俯瞰してチームを支える能力",
    },
  ];

  doc.setFontSize(6);
  metricsOverall.forEach((m) => {
    let sum = 0;
    let count = 0;
    data.companies.forEach((company) => {
      const r = company[m.key as keyof typeof company] as RatingGrade | null;
      if (r && RATING_GRADE_MAP[r]) {
        sum += RATING_GRADE_MAP[r];
        count++;
      }
    });
    const grade =
      count > 0 ? RATING_NUMBER_MAP[Math.round(sum / count)] || "-" : "-";

    const metricColors = getGradeColors(grade);

    doc.setFont(fontName, "normal");
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6);
    doc.text(m.label, overallMetricsX, overallMetricsY);
    const labelWidth = doc.getTextWidth(m.label);

    // 項目説明（ラベルの直後に配置）
    doc.setFont(fontName, "normal");
    doc.setTextColor(160, 174, 192);
    doc.setFontSize(5);
    const descText = ` : ${m.desc}`;
    doc.text(descText, overallMetricsX + labelWidth, overallMetricsY);
    const descWidth = doc.getTextWidth(descText);

    // 補助線（説明と評価値を繋ぐ）
    const lineStartX = overallMetricsX + labelWidth + descWidth + 2;
    const lineEndX = overallMetricsX + 58; // グレードの直前
    if (lineEndX > lineStartX) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.1);
      doc.line(
        lineStartX,
        overallMetricsY - 0.8,
        lineEndX,
        overallMetricsY - 0.8
      );
    }

    // 評価値（アルファベット）
    doc.setFont(fontName, "bold");
    doc.setTextColor(
      metricColors.text[0],
      metricColors.text[1],
      metricColors.text[2]
    );
    doc.setFontSize(6);
    doc.text(grade, overallMetricsX + 60, overallMetricsY);

    overallMetricsY += 3.5;
  });

  // 全体平均チャートのキャプチャと挿入（右上に配置）
  const averageChart = document
    .getElementById("average-radar-chart")
    ?.querySelector(".recharts-wrapper") as HTMLElement;
  if (averageChart) {
    try {
      const canvas = await html2canvas(averageChart, {
        scale: 2,
        windowWidth: 1200,
        backgroundColor: "#ffffff",
      });
      const chartImg = canvas.toDataURL("image/png");
      const chartHeight = 55; // mm
      const chartWidth = (chartHeight * canvas.width) / canvas.height;
      doc.addImage(
        chartImg,
        "PNG",
        pageWidth - margin - chartWidth,
        20,
        chartWidth,
        chartHeight
      );
    } catch (error) {
      console.error("Average chart capture failed:", error);
    }
  }

  yPosition = 75;
  // セクション区切り線
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 7;

  // --- 企業別フィードバック詳細 ---
  doc.setFontSize(11);
  doc.setFont(fontName, "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("企業別フィードバック詳細", margin, yPosition);
  yPosition += 5;

  for (const company of data.companies) {
    const rowHeight = 30;
    // 改ページ判定 (フッター10mm + 余白を考慮)
    if (yPosition + rowHeight > pageHeight - 20) {
      doc.addPage();
      yPosition = margin + 5;
    }

    // カード風の背景
    doc.setFillColor(252, 253, 255);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(margin, yPosition, contentWidth, rowHeight, 1.5, 1.5, "FD");

    // 総合評価バッジ
    const badgeX = margin + 5;
    const badgeY = yPosition + 3;
    const badgeWidth = 14;
    const badgeHeight = 10;

    const companyOverallColors = getGradeColors(
      company.overallRating || undefined
    );
    doc.setFillColor(
      companyOverallColors.bg[0],
      companyOverallColors.bg[1],
      companyOverallColors.bg[2]
    );
    doc.setDrawColor(
      companyOverallColors.border[0],
      companyOverallColors.border[1],
      companyOverallColors.border[2]
    );
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1, 1, "FD");

    doc.setTextColor(
      companyOverallColors.text[0],
      companyOverallColors.text[1],
      companyOverallColors.text[2]
    );
    doc.setFontSize(14);
    doc.setFont(fontName, "bold");
    doc.text(
      company.overallRating || "-",
      badgeX + badgeWidth / 2,
      badgeY + 7,
      { align: "center" }
    );

    // 企業名
    doc.setFont(fontName, "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(company.companyName, badgeX + badgeWidth + 4, yPosition + 10);

    // コメント
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont(fontName, "normal");
    const commentWidth = contentWidth - 110; // 再調整：個別評価を左に戻した分、コメント幅も微調整
    const splitComment = doc.splitTextToSize(
      company.comment || "",
      commentWidth
    );
    doc.text(splitComment, badgeX + badgeWidth + 4, yPosition + 18);

    // --- 個別評価の表示（チャートの左側） ---
    const ratingsX = margin + contentWidth - 75; // 再調整：少し左に戻してバランスを整える
    let ratingsY = yPosition + 6;
    const ratingMetrics = [
      { key: "logicRating", label: "ロジカル" },
      { key: "initiativeRating", label: "アクティブ" },
      { key: "creativeRating", label: "クリエイティブ" },
      { key: "communicationRating", label: "コミュニケーション" },
      { key: "cooperationRating", label: "サポート" },
    ];

    doc.setFontSize(6);
    for (const metric of ratingMetrics) {
      const grade =
        (company[metric.key as keyof typeof company] as string) || undefined;
      const metricColors = getGradeColors(grade);

      doc.setFont(fontName, "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(metric.label, ratingsX, ratingsY);

      // 点線風の補助線（ラベルと値を繋ぐ）
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.1);
      const labelWidth = doc.getTextWidth(metric.label);
      doc.line(
        ratingsX + labelWidth + 2,
        ratingsY - 0.8,
        ratingsX + 25, // 評価グレード（ratingsX + 27）の直前で止める
        ratingsY - 0.8
      );

      doc.setFont(fontName, "bold");
      doc.setTextColor(
        metricColors.text[0],
        metricColors.text[1],
        metricColors.text[2]
      );
      doc.text(
        grade || "-",
        ratingsX + 27, // アルファベットの位置は維持
        ratingsY
      );
      ratingsY += 4.5;
    }

    // 個別チャートのキャプチャと挿入
    const companyChartElement = document
      .getElementById(`chart-${company.companyId}`)
      ?.querySelector(".recharts-wrapper") as HTMLElement;
    if (companyChartElement) {
      try {
        const canvas = await html2canvas(companyChartElement, {
          scale: 2,
          windowWidth: 1200,
          backgroundColor: "#ffffff",
        });
        const chartImg = canvas.toDataURL("image/png");
        const chartHeight = 28;
        const chartWidth = (canvas.width * chartHeight) / canvas.height;
        doc.addImage(
          chartImg,
          "PNG",
          margin + contentWidth - chartWidth - 2,
          yPosition + (rowHeight - chartHeight) / 2,
          chartWidth,
          chartHeight
        );
      } catch (error) {
        console.error(
          `Chart capture failed for ${company.companyName}:`,
          error
        );
      }
    }

    yPosition += rowHeight + 2;
  }

  // --- 全ページにフッターを適用 ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerHeight = 15;
    doc.setFillColor(0, 0, 0);
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont(fontName, "normal");
    doc.text(
      "Copyright © 2026 VECTOR Inc. All Rights Reserved.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // 保存
  const fileName = `${data.eventDate}_${data.candidateName}_Feedback.pdf`;
  doc.save(fileName);
}
