import { useState, useEffect, useCallback } from "react";

/**
 * セッションストレージを管理するカスタムフック
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T | null = null
) {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        // 既にJSON形式で保存されている場合はパース、そうでない場合はそのまま使用
        try {
          return JSON.parse(item) as T;
        } catch (parseError) {
          // JSON形式でない場合は、古い形式の可能性があるので削除
          console.warn(
            `SessionStorage key "${key}" contains invalid JSON, clearing it.`,
            parseError
          );
          window.sessionStorage.removeItem(key);
          return initialValue;
        }
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | null) => {
      try {
        if (typeof window !== "undefined") {
          if (value === null) {
            window.sessionStorage.removeItem(key);
          } else {
            window.sessionStorage.setItem(key, JSON.stringify(value));
          }
          setStoredValue(value);
          // 同じウィンドウ内での変更を通知するカスタムイベントを発火
          window.dispatchEvent(new Event("sessionStorageChange"));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadValue = () => {
      try {
        const item = window.sessionStorage.getItem(key);
        if (item) {
          // 既にJSON形式で保存されている場合はパース、そうでない場合はそのまま使用
          try {
            const parsed = JSON.parse(item);
            setStoredValue(parsed as T);
          } catch (parseError) {
            // JSON形式でない場合は、古い形式の可能性があるので削除
            console.warn(
              `SessionStorage key "${key}" contains invalid JSON, clearing it.`,
              parseError
            );
            window.sessionStorage.removeItem(key);
            setStoredValue(initialValue);
          }
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(`Error reading sessionStorage key "${key}":`, error);
        setStoredValue(initialValue);
      }
    };

    // 初回読み込み
    loadValue();

    // ストレージ変更を監視（他のタブやページでの変更を検知）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        loadValue();
      }
    };

    // 同じウィンドウ内での変更を監視（カスタムイベント）
    const handleCustomStorageChange = () => {
      loadValue();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("sessionStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "sessionStorageChange",
        handleCustomStorageChange
      );
    };
  }, [key, initialValue]);

  return [storedValue, setValue] as const;
}

