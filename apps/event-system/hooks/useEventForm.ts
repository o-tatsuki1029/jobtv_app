import { useState, useEffect } from "react";
import { supabaseInsert, supabaseUpdate } from "@/lib/actions/supabase-actions";
import { Event, EventFormData } from "@/types/event.types";

type UseEventFormProps = {
  initialData?: Event;
  onSuccess?: () => void;
};

const initialFormState: EventFormData = {
  event_type_id: "" as unknown as string | null, // 未選択状態
  event_date: "",
  start_time: "",
  end_time: "",
};

export function useEventForm({ initialData, onSuccess }: UseEventFormProps) {
  const [form, setForm] = useState<EventFormData>(initialFormState);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData?.id;

  // フォーム初期化
  useEffect(() => {
    if (initialData) {
      setForm({
        event_type_id: (initialData as Event & { event_type_id?: string | null }).event_type_id || ("" as unknown as string | null),
        event_date: initialData.event_date || "",
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "event_type_id"
          ? (value || null)
          : (value as string),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("送信中...");

    try {
      if (isEditMode && initialData?.id) {
        const updateData = {
          ...form,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabaseUpdate("events", updateData, {
          id: initialData.id,
        });

        if (error) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "エラーが発生しました";
          setStatus("エラー: " + errorMessage);
        } else {
          setStatus("更新しました！");
          onSuccess?.();
        }
      } else {
        const { data, error } = await supabaseInsert("events", form);

        if (error) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "エラーが発生しました";
          setStatus("エラー: " + errorMessage);
        } else {
          setStatus("登録しました！ID: " + data?.id);
          setForm(initialFormState);
          onSuccess?.();
        }
      }
    } catch {
      setStatus("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    status,
    isSubmitting,
    isEditMode,
    handleChange,
    handleSubmit,
  };
}

