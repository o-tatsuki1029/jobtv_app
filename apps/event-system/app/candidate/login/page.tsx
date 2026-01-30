"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { FormField, SelectInput } from "@/components/ui/form/FormField";
import { formatEventDisplay } from "@/utils/data/event";
import type { Event } from "@/types/event.types";

export default function CandidateLoginPage() {
  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [seatNumbers, setSeatNumbers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingSeatNumbers, setIsLoadingSeatNumbers] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // CSRFトークンを取得
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch("/api/csrf-token");
        const data = await response.json();
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error("CSRFトークン取得エラー:", error);
      }
    };
    fetchCSRFToken();
  }, []);

  // イベント一覧を取得
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const response = await fetch("/api/candidate/events");
        const data = await response.json();

        if (!response.ok) {
          console.error("イベント取得エラー:", data.error);
        } else {
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("予期しないエラー:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // イベントが選択されたら、そのイベントの席番号一覧を取得
  useEffect(() => {
    const fetchSeatNumbers = async () => {
      if (!eventId) {
        setSeatNumbers([]);
        setSeatNumber("");
        return;
      }

      setIsLoadingSeatNumbers(true);
      try {
        const response = await fetch(
          `/api/candidate/seat-numbers?eventId=${eventId}`
        );
        const data = await response.json();

        if (!response.ok) {
          console.error("席番号取得エラー:", data.error);
          setSeatNumbers([]);
        } else {
          setSeatNumbers(data.seatNumbers || []);
        }
      } catch (error) {
        console.error("予期しないエラー:", error);
        setSeatNumbers([]);
      } finally {
        setIsLoadingSeatNumbers(false);
      }
    };

    fetchSeatNumbers();
  }, [eventId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!eventId || !seatNumber || !phoneNumber) {
      setError("すべての項目を入力してください");
      setIsLoading(false);
      return;
    }

    try {
      // CSRFトークンの確認
      if (!csrfToken) {
        setError("CSRFトークンが取得できませんでした。ページを再読み込みしてください。");
        setIsLoading(false);
        return;
      }
      
      // APIルートで検証
      const response = await fetch("/api/candidate/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          eventId,
          seatNumber,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "ログインに失敗しました");
        setIsLoading(false);
        return;
      }

      // ログイン成功: 学生ページにリダイレクト
      router.push("/candidate/rating");
      router.refresh();
    } catch (err) {
      console.error("ログインエラー:", err);
      setError("ログインに失敗しました");
      setIsLoading(false);
    }
  };

  const eventOptions = events.map((event) => ({
    value: event.id,
    label: formatEventDisplay(event),
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">学生ログイン</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <FormField label="イベント">
            <SelectInput
              name="event"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              options={eventOptions}
              placeholder="イベントを選択"
              disabled={isLoadingEvents}
            />
          </FormField>
          <FormField label="席番号">
            <SelectInput
              name="seatNumber"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              options={seatNumbers.map((seat) => ({
                value: seat,
                label: seat,
              }))}
              placeholder={
                isLoadingSeatNumbers
                  ? "読み込み中..."
                  : eventId
                  ? "席番号を選択"
                  : "まずイベントを選択してください"
              }
              disabled={!eventId || isLoadingSeatNumbers}
            />
          </FormField>
          <FormField label="電話番号">
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="電話番号を入力"
              required
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px] touch-manipulation"
            />
          </FormField>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || isLoadingEvents}
            className="w-full"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
      </div>
    </div>
  );
}

