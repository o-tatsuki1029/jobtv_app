import {
  MatchingWeights,
  MatchScore,
  SpecialInterviewInput,
} from "@/types/matching.types";
import { RATING_GRADE_MAP } from "@/types/rating.types";

/**
 * 企業評価を数値に変換
 */
function convertCompanyRating(rating: string | null): number {
  if (!rating) return 0;
  return RATING_GRADE_MAP[rating as keyof typeof RATING_GRADE_MAP] || 0;
}

/**
 * マッチングスコアを計算
 * 計算式: (companyRating * companyWeight + candidateRating * candidateWeight) * companyRating * candidateRating
 * 企業評価を優先する重み付けを適用
 */
export function calculateMatchScore(
  companyRating: string | null,
  candidateRating: number | null,
  weights: MatchingWeights
): number {
  const companyRatingNum = convertCompanyRating(companyRating);
  const candidateRatingNum = candidateRating || 0;

  // どちらかの評価がない場合は0を返す
  if (companyRatingNum === 0 || candidateRatingNum === 0) {
    return 0;
  }

  // 重み付き平均 × 積
  const weightedAverage =
    companyRatingNum * weights.companyWeight +
    candidateRatingNum * weights.candidateWeight;
  const product = companyRatingNum * candidateRatingNum;

  return weightedAverage * product;
}

/**
 * マッチングスコアのリストを生成
 */
export function generateMatchScores(
  companyRatings: Array<{
    companyId: string;
    candidateId: string;
    rating: string | null;
  }>,
  candidateRatings: Array<{
    companyId: string;
    candidateId: string;
    rating: number | null;
  }>,
  weights: MatchingWeights
): MatchScore[] {
  // 企業評価をマップ化
  const companyRatingMap = new Map<string, string | null>();
  companyRatings.forEach((r) => {
    const key = `${r.companyId}_${r.candidateId}`;
    companyRatingMap.set(key, r.rating);
  });

  // 学生評価をマップ化
  const candidateRatingMap = new Map<string, number | null>();
  candidateRatings.forEach((r) => {
    const key = `${r.companyId}_${r.candidateId}`;
    candidateRatingMap.set(key, r.rating);
  });

  // すべての組み合わせでスコアを計算
  const scores: MatchScore[] = [];
  const companyIds = new Set([
    ...companyRatings.map((r) => r.companyId),
    ...candidateRatings.map((r) => r.companyId),
  ]);
  const candidateIds = new Set([
    ...companyRatings.map((r) => r.candidateId),
    ...candidateRatings.map((r) => r.candidateId),
  ]);

  companyIds.forEach((companyId) => {
    candidateIds.forEach((candidateId) => {
      const key = `${companyId}_${candidateId}`;
      const companyRating = companyRatingMap.get(key) || null;
      const candidateRating = candidateRatingMap.get(key) || null;

      // 両方の評価が存在する場合のみスコアを計算
      if (companyRating && candidateRating) {
        const score = calculateMatchScore(
          companyRating,
          candidateRating,
          weights
        );

        if (score > 0) {
          scores.push({
            companyId,
            candidateId,
            score,
            companyRating: convertCompanyRating(companyRating),
            candidateRating: candidateRating,
          });
        }
      }
    });
  });

  // スコア降順でソート
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * マッチング結果を生成
 *
 * 絶対条件:
 * ①特別面談を必ず割り当てる
 * ②各回で全ての企業に均等に学生がマッチングする
 * ③各回で、全ての学生がマッチングする
 * ④各回で、全ての企業がマッチングする
 * ⑤各回で、同じ企業と学生の組み合わせのマッチングはさせない（かぶりなし）
 *
 * 最適化条件:
 * 回数が若いほどマッチ度の高い組み合わせになる
 * セッションごとに指名順を変えることで公平性を担保する
 */
export function generateMatching(
  companyIds: string[],
  candidateIds: string[],
  sessionCount: number,
  matchScores: MatchScore[],
  specialInterviews: SpecialInterviewInput[]
): Array<{
  sessionNumber: number;
  companyId: string;
  candidateIds: string[];
  scores: Map<string, number>;
  specialInterviewIds: Set<string>;
}> {
  const matchingHistory = new Set<string>(); // "companyId_candidateId"

  // 1. 各企業の1回あたりの定員（席数）を計算 (条件②④)
  const baseCount = Math.floor(candidateIds.length / companyIds.length);
  const extraCount = candidateIds.length % companyIds.length;

  // 各企業の席数設定
  const companyQuotas = companyIds.map((id, idx) => ({
    id,
    max: baseCount + (idx < extraCount ? 1 : 0),
  }));

  // セッションごとのデータ構造を初期化
  const sessionData = Array.from({ length: sessionCount }, (_, i) => {
    const sMap = new Map<string, any>();
    companyQuotas.forEach((q) => {
      sMap.set(q.id, {
        sessionNumber: i + 1,
        companyId: q.id,
        candidateIds: [],
        scores: new Map<string, number>(),
        specialInterviewIds: new Set<string>(),
        maxQuota: q.max,
      });
    });
    return sMap;
  });

  // 2. 【条件①】特別面談を最優先で予約
  specialInterviews.forEach((si) => {
    const sessionRes = sessionData[si.sessionNumber - 1]?.get(si.companyId);
    if (sessionRes) {
      sessionRes.candidateIds.push(si.candidateId);
      sessionRes.specialInterviewIds.add(si.candidateId);
      matchingHistory.add(`${si.companyId}_${si.candidateId}`);

      const ms = matchScores.find(
        (m) => m.companyId === si.companyId && m.candidateId === si.candidateId
      );
      sessionRes.scores.set(si.candidateId, ms?.score || 0);
    }
  });

  // 3. 各セッションを公平に埋める
  for (let s = 1; s <= sessionCount; s++) {
    const currentSessionMap = sessionData[s - 1];
    const assignedThisSession = new Set<string>();

    // 特別面談ですでに割り当てられた学生を登録
    currentSessionMap.forEach((res) => {
      res.candidateIds.forEach((id: string) => assignedThisSession.add(id));
    });

    // まだこの回で席がない学生 (条件③)
    let freeAgents = candidateIds.filter((id) => !assignedThisSession.has(id));

    // 【公平性】セッションごとに指名順位をずらす（ドラフト順の交代）
    const draftingOrder = [...companyIds].sort((a, b) => {
      const indexA = (companyIds.indexOf(a) + s) % companyIds.length;
      const indexB = (companyIds.indexOf(b) + s) % companyIds.length;
      return indexA - indexB;
    });

    // 全ての枠が埋まるまでドラフト指名
    let filledAny = true;
    while (freeAgents.length > 0 && filledAny) {
      filledAny = false;
      for (const cId of draftingOrder) {
        const res = currentSessionMap.get(cId);
        if (res.candidateIds.length >= res.maxQuota) continue;
        if (freeAgents.length === 0) break;

        // 【条件⑤ & スコア】過去に対面していない学生を優先し、その中で最高スコアを選択
        const candidatesWithMeta = freeAgents.map((stId, idx) => {
          const score =
            matchScores.find(
              (m) => m.companyId === cId && m.candidateId === stId
            )?.score || 0;
          const isDuplicate = matchingHistory.has(`${cId}_${stId}`);
          return { stId, idx, score, isDuplicate };
        });

        // ソート: 1. 未対面(isDuplicate: false)優先, 2. スコア降順
        candidatesWithMeta.sort((a, b) => {
          if (a.isDuplicate !== b.isDuplicate) return a.isDuplicate ? 1 : -1;
          return b.score - a.score;
        });

        const bestMatch = candidatesWithMeta[0];
        // 元のfreeAgents配列から該当する学生を削除して取得
        const studentIndex = freeAgents.indexOf(bestMatch.stId);
        const studentId = freeAgents.splice(studentIndex, 1)[0];

        res.candidateIds.push(studentId);
        matchingHistory.add(`${cId}_${studentId}`);
        res.scores.set(studentId, bestMatch.score);
        filledAny = true;
      }
    }
  }

  // 結果をフラットな配列に変換して返却
  const finalResults: Array<{
    sessionNumber: number;
    companyId: string;
    candidateIds: string[];
    scores: Map<string, number>;
    specialInterviewIds: Set<string>;
  }> = [];

  sessionData.forEach((sMap) => {
    sMap.forEach((res) => {
      // 内部計算用のプロパティを除いて追加
      const { maxQuota, ...cleanRes } = res;
      finalResults.push(cleanRes);
    });
  });

  return finalResults;
}
