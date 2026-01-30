import { useMemo } from "react";
import {
  CandidateResult,
  MatchingResultRow,
  MatchingResultData,
} from "@/types/matching.types";

/**
 * マッチング結果のデータ変換とグループ化を行うカスタムフック
 */

export function useMatchingResults(results: MatchingResultData[]) {
  // 結果を学生ごとにグループ化し、席番号順にソート
  const candidateResults = useMemo(() => {
    const candidateMap = new Map<string, CandidateResult>();

    results.forEach((result: MatchingResultData) => {
      const candidateId = result.candidate_id;
      const candidate = result.candidates;
      const company = result.companies;

      if (!candidateMap.has(candidateId)) {
        candidateMap.set(candidateId, {
          id: result.id || candidateId,
          candidateId,
          candidateName: candidate
            ? `${candidate.last_name} ${candidate.first_name}`
            : "",
          candidateKana: candidate
            ? `${candidate.last_name_kana} ${candidate.first_name_kana}`
            : "",
          seatNumber: candidate?.seat_number || null,
          sessions: [],
        });
      }

      const candidateResult = candidateMap.get(candidateId)!;
      candidateResult.sessions.push({
        sessionNumber: result.session_number,
        companyId: result.company_id,
        companyName: company?.name || "",
        matchScore: result.match_score,
        isSpecialInterview: result.is_special_interview,
        candidateRating: result.candidate_rating || null,
        // 企業からの評価
        communicationRating: result.communication_rating || null,
        cooperationRating: result.cooperation_rating || null,
        creativeRating: result.creative_rating || null,
        initiativeRating: result.initiative_rating || null,
        logicRating: result.logic_rating || null,
        overallRating: result.overall_rating || null,
        comment: result.comment || null,
      });
    });

    // 各学生のセッションを座談会回数順にソート
    candidateMap.forEach((candidateResult) => {
      candidateResult.sessions.sort(
        (a, b) => a.sessionNumber - b.sessionNumber
      );
    });

    // 席番号でソート（席番号がない場合はフリガナでソート）
    return Array.from(candidateMap.values()).sort((a, b) => {
      if (a.seatNumber && b.seatNumber) {
        return a.seatNumber.localeCompare(b.seatNumber);
      }
      if (a.seatNumber) return -1;
      if (b.seatNumber) return 1;
      return a.candidateKana.localeCompare(b.candidateKana);
    });
  }, [results]);

  // 最大の座談会回数を取得
  const maxSessionNumber = useMemo(() => {
    return Math.max(
      ...candidateResults.flatMap((c) =>
        c.sessions.map((s) => s.sessionNumber)
      ),
      0
    );
  }, [candidateResults]);

  // 座談会回数ごとにデータをグループ化
  const sessionGroupedData = useMemo(() => {
    const grouped = new Map<number, MatchingResultRow[]>();

    for (let sessionNum = 1; sessionNum <= maxSessionNumber; sessionNum++) {
      grouped.set(sessionNum, []);
    }

    candidateResults.forEach((candidate) => {
      candidate.sessions.forEach((session) => {
        const sessionData = grouped.get(session.sessionNumber);
        if (sessionData) {
          sessionData.push({
            seatNumber: candidate.seatNumber || "-",
            candidateName: candidate.candidateName,
            candidateKana: candidate.candidateKana,
            companyName: session.companyName,
            matchScore: session.matchScore,
            isSpecialInterview: session.isSpecialInterview,
            candidateId: candidate.candidateId,
            companyId: session.companyId,
            candidateRating: session.candidateRating || null,
            // 企業からの評価
            communicationRating: session.communicationRating || null,
            cooperationRating: session.cooperationRating || null,
            creativeRating: session.creativeRating || null,
            initiativeRating: session.initiativeRating || null,
            logicRating: session.logicRating || null,
            overallRating: session.overallRating || null,
            comment: session.comment || null,
          });
        }
      });
    });

    // 各回のデータを席番号順でソート
    grouped.forEach((data) => {
      data.sort((a, b) => {
        // 席番号でソート（アルファベット順）
        if (a.seatNumber && b.seatNumber) {
          return a.seatNumber.localeCompare(b.seatNumber);
        }
        if (a.seatNumber) return -1;
        if (b.seatNumber) return 1;
        // 席番号がない場合はフリガナでソート
        return a.candidateKana.localeCompare(b.candidateKana);
      });
    });

    return grouped;
  }, [candidateResults, maxSessionNumber]);

  return {
    candidateResults,
    maxSessionNumber,
    sessionGroupedData,
  };
}
