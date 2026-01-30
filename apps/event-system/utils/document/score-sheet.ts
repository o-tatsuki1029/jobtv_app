import jsPDF from "jspdf";

export type ScoreSheetData = {
  candidateId: string;
  candidateName: string;
  candidateKana: string;
  seatNumber: string | null;
  eventName: string;
  eventDate: string;
  companies: Array<{
    companyId: string;
    companyName: string;
    overallRating: string | null;
    logicRating: string | null;
    initiativeRating: string | null;
    cooperationRating: string | null;
    creativeRating: string | null;
    communicationRating: string | null;
    comment: string | null;
    evaluatorName: string | null;
  }>;
};

/**
 * 1つの学生のスコアシートをPDFに追加
 */
function addScoreSheetPage(
  doc: jsPDF,
  data: ScoreSheetData,
  isFirstPage: boolean = false
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // 最初のページでない場合は改ページ
  if (!isFirstPage) {
    doc.addPage();
  }

  // タイトル
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("評価スコアシート", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 10;

  // イベント情報
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`イベント名: ${data.eventName}`, margin, yPosition);
  yPosition += 6;
  const eventDate = new Date(data.eventDate);
  const formattedDate = eventDate.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`開催日: ${formattedDate}`, margin, yPosition);
  yPosition += 10;

  // 学生情報
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("学生情報", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`氏名: ${data.candidateName}`, margin, yPosition);
  yPosition += 6;
  doc.text(`フリガナ: ${data.candidateKana}`, margin, yPosition);
  yPosition += 6;
  if (data.seatNumber) {
    doc.text(`席番号: ${data.seatNumber}`, margin, yPosition);
    yPosition += 6;
  }
  yPosition += 5;

  // 評価一覧
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("企業からの評価", margin, yPosition);
  yPosition += 8;

  // テーブルレイアウト
  const companyNameWidth = 50;
  const ratingWidth = 10;
  const evaluatorWidth = 25;
  const startX = margin;
  const ratingStartX = startX + companyNameWidth + 5;

  // テーブルヘッダー
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const headerY = yPosition;
  doc.text("企業名", startX, headerY);
  doc.text("総合", ratingStartX, headerY);
  doc.text("ロジカル", ratingStartX + ratingWidth, headerY);
  doc.text("アクティブ", ratingStartX + ratingWidth * 2, headerY);
  doc.text("サポート", ratingStartX + ratingWidth * 3, headerY);
  doc.text("クリエイ", ratingStartX + ratingWidth * 4, headerY);
  doc.text("コミュ", ratingStartX + ratingWidth * 5, headerY);
  doc.text("評価者", ratingStartX + ratingWidth * 6, headerY);
  yPosition += 6;

  // ヘッダー下線
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;

  // 企業評価データ
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const baseRowHeight = 8;

  data.companies.forEach((company, index) => {
    let currentRowHeight = baseRowHeight;

    // ページを超える場合は改ページ
    if (yPosition + currentRowHeight > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }

    // 企業名（長い場合は折り返し）
    const companyNameLines = doc.splitTextToSize(
      company.companyName,
      companyNameWidth - 2
    );
    let companyNameY = yPosition;
    companyNameLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, startX, companyNameY);
      if (lineIndex < companyNameLines.length - 1) {
        companyNameY += 4;
        currentRowHeight = Math.max(currentRowHeight, (lineIndex + 2) * 4);
      }
    });

    // 評価（中央揃え）
    const ratingY = yPosition;
    if (company.overallRating) {
      doc.text(company.overallRating, ratingStartX + ratingWidth / 2, ratingY, {
        align: "center",
      });
    } else {
      doc.text("-", ratingStartX + ratingWidth / 2, ratingY, {
        align: "center",
      });
    }

    if (company.logicRating) {
      doc.text(
        company.logicRating,
        ratingStartX + ratingWidth + ratingWidth / 2,
        ratingY,
        { align: "center" }
      );
    } else {
      doc.text("-", ratingStartX + ratingWidth + ratingWidth / 2, ratingY, {
        align: "center",
      });
    }

    if (company.initiativeRating) {
      doc.text(
        company.initiativeRating,
        ratingStartX + ratingWidth * 2 + ratingWidth / 2,
        ratingY,
        { align: "center" }
      );
    } else {
      doc.text("-", ratingStartX + ratingWidth * 2 + ratingWidth / 2, ratingY, {
        align: "center",
      });
    }

    if (company.cooperationRating) {
      doc.text(
        company.cooperationRating,
        ratingStartX + ratingWidth * 3 + ratingWidth / 2,
        ratingY,
        { align: "center" }
      );
    } else {
      doc.text("-", ratingStartX + ratingWidth * 3 + ratingWidth / 2, ratingY, {
        align: "center",
      });
    }

    if (company.creativeRating) {
      doc.text(
        company.creativeRating,
        ratingStartX + ratingWidth * 4 + ratingWidth / 2,
        ratingY,
        { align: "center" }
      );
    } else {
      doc.text("-", ratingStartX + ratingWidth * 4 + ratingWidth / 2, ratingY, {
        align: "center",
      });
    }

    if (company.communicationRating) {
      doc.text(
        company.communicationRating,
        ratingStartX + ratingWidth * 5 + ratingWidth / 2,
        ratingY,
        { align: "center" }
      );
    } else {
      doc.text("-", ratingStartX + ratingWidth * 5 + ratingWidth / 2, ratingY, {
        align: "center",
      });
    }

    // 評価者名
    const evaluatorX = ratingStartX + ratingWidth * 6;
    if (company.evaluatorName) {
      const evaluatorLines = doc.splitTextToSize(
        company.evaluatorName,
        evaluatorWidth - 2
      );
      let evaluatorY = yPosition;
      evaluatorLines.forEach((line: string, lineIndex: number) => {
        doc.text(line, evaluatorX, evaluatorY);
        if (lineIndex < evaluatorLines.length - 1) {
          evaluatorY += 4;
          currentRowHeight = Math.max(currentRowHeight, (lineIndex + 2) * 4);
        }
      });
    } else {
      doc.text("-", evaluatorX, yPosition);
    }

    yPosition += currentRowHeight;

    // コメントがある場合は次の行に表示
    if (company.comment) {
      if (yPosition + 10 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      const commentLines = doc.splitTextToSize(
        `【${company.companyName}】コメント: ${company.comment}`,
        contentWidth - 10
      );
      commentLines.forEach((line: string) => {
        if (yPosition + 4 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin + 5, yPosition);
        yPosition += 4;
      });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      yPosition += 2;
    }

    // 行の区切り線
    if (index < data.companies.length - 1) {
      doc.setLineWidth(0.1);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 2;
    }
  });
}

/**
 * 複数の学生のスコアシートを1つのPDFにまとめて生成
 */
export function generateAllScoreSheetsPDF(
  allScoreSheetData: ScoreSheetData[]
): void {
  if (allScoreSheetData.length === 0) {
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // 各学生のスコアシートを追加
  allScoreSheetData.forEach((data, index) => {
    addScoreSheetPage(doc, data, index === 0);
  });

  // ファイル名を生成（最初の学生のイベント情報を使用）
  const firstStudent = allScoreSheetData[0];
  const eventName = firstStudent.eventName
    .replace(/[^\w\s-]/g, "")
    .substring(0, 20);
  const fileName = `スコアシート_${eventName}_全${allScoreSheetData.length}名.pdf`;

  // PDFをダウンロード
  doc.save(fileName);
}

/**
 * 単一の学生のスコアシートをPDFで生成（後方互換性のため残す）
 */
export function generateScoreSheetPDF(data: ScoreSheetData): void {
  generateAllScoreSheetsPDF([data]);
}
