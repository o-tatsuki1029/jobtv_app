import { useState, useEffect, useCallback, useRef } from "react";
import { useModal } from "@/hooks/useModal";

/**
 * 外部トリガーでモーダルを開くための共通フック
 * データが渡されたときに自動的にモーダルを開き、閉じたときに状態をリセット
 */
export function useTriggeredModal<T>(trigger: T | null, onOpen?: () => void) {
  const modal = useModal();
  const [currentData, setCurrentData] = useState<T | null>(null);
  const previousTriggerIdRef = useRef<string | null>(null);

  // triggerからIDを取得するヘルパー関数
  const getTriggerId = useCallback((t: T | null): string | null => {
    if (t === null) return null;
    // オブジェクトにidプロパティがある場合
    if (typeof t === "object" && t !== null && "id" in t) {
      return String((t as { id: unknown }).id);
    }
    // プリミティブ型の場合は文字列化
    return String(t);
  }, []);

  // 外部からデータが渡されたときにモーダルを開く
  useEffect(() => {
    const currentTriggerId = getTriggerId(trigger);
    const previousTriggerId = previousTriggerIdRef.current;

    if (trigger) {
      // triggerがnullから非nullに変わったとき、またはIDが変わったときのみ開く
      if (currentTriggerId !== previousTriggerId) {
        setCurrentData(trigger);
        modal.open();
        onOpen?.();
        previousTriggerIdRef.current = currentTriggerId;
      }
    } else {
      // triggerがnullになったときはIDをリセット（モーダルは閉じない）
      previousTriggerIdRef.current = null;
    }
  }, [trigger, modal, onOpen, getTriggerId]);

  // モーダルが閉じられたときに状態をリセット
  useEffect(() => {
    if (!modal.isOpen) {
      setCurrentData(null);
      previousTriggerIdRef.current = null;
    }
  }, [modal.isOpen]);

  const handleClose = useCallback(() => {
    modal.close();
  }, [modal]);

  return {
    modal,
    currentData,
    handleClose,
  };
}

