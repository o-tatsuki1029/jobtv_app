"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types";

type MasterArea = Database["public"]["Tables"]["master_areas"]["Row"];
type MasterGraduationYear = Database["public"]["Tables"]["master_graduation_years"]["Row"];
type MasterEventType = Database["public"]["Tables"]["master_event_types"]["Row"];

type UseMasterDataReturn = {
  areas: MasterArea[];
  graduationYears: MasterGraduationYear[];
  eventTypes: MasterEventType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * マスタデータを取得するカスタムフック
 */
export function useMasterData(): UseMasterDataReturn {
  const [areas, setAreas] = useState<MasterArea[]>([]);
  const [graduationYears, setGraduationYears] = useState<MasterGraduationYear[]>([]);
  const [eventTypes, setEventTypes] = useState<MasterEventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMasterData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // エリアマスタを取得（すべて取得、is_activeに関係なく）
      const { data: areasData, error: areasError } = await supabase
        .from("master_areas")
        .select("*")
        .order("name", { ascending: true });

      if (areasError) {
        throw new Error("エリアマスタの取得に失敗しました");
      }

      // 卒年度マスタを取得（すべて取得、is_activeに関係なく）
      const { data: yearsData, error: yearsError } = await supabase
        .from("master_graduation_years")
        .select("*")
        .order("year", { ascending: true });

      if (yearsError) {
        throw new Error("卒年度マスタの取得に失敗しました");
      }

      // イベントタイプマスタを取得（すべて取得、is_activeに関係なく）
      const { data: eventTypesData, error: eventTypesError } = await supabase
        .from("master_event_types")
        .select("*")
        .order("name", { ascending: true });

      if (eventTypesError) {
        throw new Error("イベントタイプマスタの取得に失敗しました");
      }

      setAreas(areasData || []);
      setGraduationYears(yearsData || []);
      setEventTypes(eventTypesData || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "マスタデータの取得に失敗しました";
      setError(errorMessage);
      console.error("マスタデータ取得エラー:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  return {
    areas,
    graduationYears,
    eventTypes,
    isLoading,
    error,
    refetch: fetchMasterData,
  };
}

