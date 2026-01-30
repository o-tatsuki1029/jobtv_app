"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createEventEntry, getSessions, type Session } from "@/lib/actions/session-entry-actions";
import { EventSelection } from "@/components/session/EventSelection";
import { EventEntryForm, type EventEntryFormData } from "@/components/session/EventEntryForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

function SessionEntryContent() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("sessionId") || "";
  const [selectedSessionId, setSelectedSessionId] = useState(urlSessionId);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const [formData, setFormData] = useState<EventEntryFormData>({
    last_name: "",
    first_name: "",
    last_name_kana: "",
    first_name_kana: "",
    phone: "",
    email: "",
    school_name: "",
    gender: "",
    graduation_year: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // 説明会一覧を取得
  useEffect(() => {
    async function fetchSessions() {
      setIsLoadingSessions(true);
      const data = await getSessions();
      setSessions(data);
      setIsLoadingSessions(false);
    }
    fetchSessions();
  }, []);

  // URLパラメータの変更を監視
  useEffect(() => {
    if (urlSessionId) {
      setSelectedSessionId(urlSessionId);
    }
  }, [urlSessionId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSessionId) {
      setError("説明会を選択してください");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // セッションからイベントIDを取得
      const selectedSession = sessions.find((s) => s.id === selectedSessionId);
      if (!selectedSession) {
        setError("セッションが見つかりません");
        return;
      }

      await createEventEntry({
        eventId: selectedSession.event_id,
        candidate: {
          last_name: formData.last_name,
          first_name: formData.first_name,
          last_name_kana: formData.last_name_kana,
          first_name_kana: formData.first_name_kana,
          phone: formData.phone,
          email: formData.email,
          school_name: formData.school_name || undefined,
          gender: formData.gender || undefined,
          graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : undefined
        }
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "予約の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">予約が完了しました</h1>
          <p className="text-gray-600 mb-8">ご予約ありがとうございます</p>
          <Link href="/" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center px-4 py-8 sm:py-20 bg-white">
      <div className="max-w-200 w-full">
        {/* 全体を包むカードスタイル */}
        <div className="bg-white sm:p-8 sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">説明会予約</h1>
            <p className="text-sm sm:text-base text-gray-600">内容を確認して予約を確定してください</p>
          </div>

          <EventSelection
            events={sessions.map((s) => ({
              id: s.id,
              event_date: s.events.event_date,
              start_time: s.start_time,
              end_time: s.end_time,
              master_event_types: s.events.master_event_types
            }))}
            isLoading={isLoadingSessions}
            selectedEventId={selectedSessionId}
            onSelect={setSelectedSessionId}
          />

          <EventEntryForm
            formData={formData}
            setFormData={setFormData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            setError={setError}
            selectedEventId={selectedSessionId}
          />
        </div>

        <p className="mt-8 text-center text-gray-600 text-sm">
          <Link href="/" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
            トップページに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SessionEntryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">読み込み中...</div>}>
      <SessionEntryContent />
    </Suspense>
  );
}
